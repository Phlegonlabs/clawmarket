import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BacktestMetrics {
  totalReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
  totalTrades: number;
  profitFactor: number;
  averageHoldingPeriod: string;
}

interface BacktestResult {
  metrics: BacktestMetrics;
  analysis: string;
}

const API_BASE = import.meta.env.PUBLIC_API_URL ?? "/api";
const PERIODS = ["7d", "30d", "90d", "180d", "365d"];

export default function BacktestPanel({ slug }: { slug: string }) {
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("30d");

  const runBacktest = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/strategies/${slug}/backtest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period, initialCapital: 10000 }),
      });
      if (!res.ok) throw new Error(`Backtest failed: ${res.status}`);
      const json = (await res.json()) as { data: BacktestResult };
      setResult(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [slug, period]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Backtest</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--color-muted-foreground)]">Period:</span>
          {PERIODS.map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(p)}
            >
              {p}
            </Button>
          ))}
          <Button onClick={runBacktest} disabled={loading} className="ml-auto">
            {loading ? "Running..." : "Run Backtest"}
          </Button>
        </div>

        {error && <p className="text-sm text-[var(--color-destructive)]">{error}</p>}

        {result && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MetricBox label="Return" value={`${result.metrics.totalReturn}%`} />
              <MetricBox label="Max DD" value={`${result.metrics.maxDrawdown}%`} />
              <MetricBox label="Sharpe" value={result.metrics.sharpeRatio.toFixed(2)} />
              <MetricBox label="Win Rate" value={`${result.metrics.winRate}%`} />
              <MetricBox label="Trades" value={String(result.metrics.totalTrades)} />
              <MetricBox label="Profit Factor" value={result.metrics.profitFactor.toFixed(2)} />
              <MetricBox label="Avg Hold" value={result.metrics.averageHoldingPeriod} />
            </div>
            <div className="rounded-[var(--radius-default)] bg-[var(--color-muted)] p-4">
              <p className="text-sm font-medium">AI Analysis</p>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{result.analysis}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] p-3 text-center">
      <p className="text-xs text-[var(--color-muted-foreground)]">{label}</p>
      <p className="mt-1 text-lg font-bold font-mono">{value}</p>
    </div>
  );
}
