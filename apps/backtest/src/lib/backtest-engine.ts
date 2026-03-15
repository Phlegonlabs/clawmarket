/** Simple backtest engine that simulates strategy execution against price data */

export interface BacktestConfig {
  period: string; // "7d" | "30d" | "90d" | "180d" | "365d"
  initialCapital: number;
  tokenSymbol: string;
}

export interface StrategyRules {
  family: string;
  executionMode: string;
  rules: Array<{ id: string; description: string; condition: string; action: string }>;
}

export interface Trade {
  date: string;
  type: "buy" | "sell";
  price: number;
  quantity: number;
  pnl: number | null;
}

export interface EquityPoint {
  date: string;
  value: number;
}

export interface BacktestMetrics {
  totalReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
  totalTrades: number;
  profitFactor: number;
  averageHoldingPeriod: string;
}

export interface BacktestOutput {
  metrics: BacktestMetrics;
  equity: EquityPoint[];
  trades: Trade[];
}

function periodToDays(period: string): number {
  const map: Record<string, number> = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
    "180d": 180,
    "365d": 365,
  };
  return map[period] ?? 30;
}

/** Generate simulated daily prices using geometric Brownian motion */
function generatePrices(days: number, family: string): number[] {
  const basePrice = 100;
  const prices: number[] = [basePrice];

  // Adjust volatility by strategy family
  const volatilityMap: Record<string, number> = {
    momentum: 0.025,
    "mean-reversion": 0.015,
    arbitrage: 0.008,
    "market-making": 0.012,
    "trend-following": 0.03,
    volatility: 0.035,
  };
  const dailyVol = volatilityMap[family] ?? 0.02;
  const drift = 0.0003;

  // Seed-based deterministic random for reproducible backtests
  let seed = family.length * 17 + days;
  function nextRandom(): number {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  }

  for (let i = 1; i < days; i++) {
    const r = nextRandom();
    // Box-Muller approximation
    const z = Math.sqrt(-2 * Math.log(Math.max(r, 0.0001))) * Math.cos(2 * Math.PI * nextRandom());
    const change = drift + dailyVol * z;
    prices.push(prices[i - 1] * (1 + change));
  }

  return prices;
}

/** Simple signal generator based on strategy family */
function generateSignals(prices: number[], family: string): ("buy" | "sell" | "hold")[] {
  const signals: ("buy" | "sell" | "hold")[] = new Array(prices.length).fill("hold");
  const smaWindow = family === "momentum" || family === "trend-following" ? 10 : 5;

  for (let i = smaWindow; i < prices.length; i++) {
    const sma = prices.slice(i - smaWindow, i).reduce((a, b) => a + b, 0) / smaWindow;
    const price = prices[i];

    if (family === "momentum" || family === "trend-following") {
      if (price > sma * 1.01) signals[i] = "buy";
      else if (price < sma * 0.99) signals[i] = "sell";
    } else if (family === "mean-reversion") {
      if (price < sma * 0.98) signals[i] = "buy";
      else if (price > sma * 1.02) signals[i] = "sell";
    } else if (family === "volatility") {
      const recentVol = Math.abs(price - sma) / sma;
      if (recentVol > 0.03) signals[i] = price > sma ? "sell" : "buy";
    } else {
      // arbitrage, market-making: frequent small trades
      if (i % 3 === 0) signals[i] = price > sma ? "sell" : "buy";
    }
  }

  return signals;
}

export function runBacktest(config: BacktestConfig, strategy: StrategyRules): BacktestOutput {
  const days = periodToDays(config.period);
  const prices = generatePrices(days, strategy.family);
  const signals = generateSignals(prices, strategy.family);

  let capital = config.initialCapital;
  let position = 0;
  let entryPrice = 0;
  const trades: Trade[] = [];
  const equity: EquityPoint[] = [];
  let peak = capital;
  let maxDrawdown = 0;
  const dailyReturns: number[] = [];
  let prevEquity = capital;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < prices.length; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    const price = prices[i];

    if (signals[i] === "buy" && position === 0) {
      const quantity = Math.floor(capital / price);
      if (quantity > 0) {
        position = quantity;
        entryPrice = price;
        capital -= quantity * price;
        trades.push({ date: dateStr, type: "buy", price, quantity, pnl: null });
      }
    } else if (signals[i] === "sell" && position > 0) {
      const pnl = (price - entryPrice) * position;
      capital += position * price;
      trades.push({ date: dateStr, type: "sell", price, quantity: position, pnl });
      position = 0;
    }

    const equityValue = capital + position * price;
    equity.push({ date: dateStr, value: Math.round(equityValue * 100) / 100 });

    // Track drawdown
    if (equityValue > peak) peak = equityValue;
    const dd = (peak - equityValue) / peak;
    if (dd > maxDrawdown) maxDrawdown = dd;

    // Track daily returns
    if (i > 0) {
      dailyReturns.push((equityValue - prevEquity) / prevEquity);
    }
    prevEquity = equityValue;
  }

  // Close any open position at end
  if (position > 0) {
    const price = prices[prices.length - 1];
    const pnl = (price - entryPrice) * position;
    capital += position * price;
    const dateStr = equity[equity.length - 1].date;
    trades.push({ date: dateStr, type: "sell", price, quantity: position, pnl });
    position = 0;
  }

  const finalEquity = capital;
  const totalReturn = ((finalEquity - config.initialCapital) / config.initialCapital) * 100;

  const sellTrades = trades.filter((t) => t.type === "sell" && t.pnl !== null);
  const wins = sellTrades.filter((t) => (t.pnl ?? 0) > 0);
  const losses = sellTrades.filter((t) => (t.pnl ?? 0) <= 0);
  const winRate = sellTrades.length > 0 ? (wins.length / sellTrades.length) * 100 : 0;

  const grossProfit = wins.reduce((sum, t) => sum + (t.pnl ?? 0), 0);
  const grossLoss = Math.abs(losses.reduce((sum, t) => sum + (t.pnl ?? 0), 0));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;

  // Sharpe ratio (annualized)
  const avgReturn = dailyReturns.length > 0
    ? dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length
    : 0;
  const stdDev = dailyReturns.length > 1
    ? Math.sqrt(
        dailyReturns.reduce((sum, r) => sum + (r - avgReturn) ** 2, 0) / (dailyReturns.length - 1),
      )
    : 0;
  const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0;

  const avgHoldDays = sellTrades.length > 0 ? Math.round(days / sellTrades.length) : days;

  return {
    metrics: {
      totalReturn: Math.round(totalReturn * 100) / 100,
      maxDrawdown: Math.round(maxDrawdown * 10000) / 100,
      sharpeRatio: Math.round(sharpeRatio * 100) / 100,
      winRate: Math.round(winRate * 100) / 100,
      totalTrades: trades.length,
      profitFactor: profitFactor === Infinity ? 999 : Math.round(profitFactor * 100) / 100,
      averageHoldingPeriod: `${avgHoldDays}d`,
    },
    equity,
    trades,
  };
}
