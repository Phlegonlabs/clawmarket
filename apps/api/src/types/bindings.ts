/** Cloudflare Workers environment bindings */
export interface Env {
  DB: D1Database;
  AI: Ai;
  BACKTEST: Fetcher;

  // Environment variables
  ENVIRONMENT: string;
  PLATFORM_REVENUE_SHARE_BPS: string;
  X402_PAY_TO?: string;
  X402_FACILITATOR_ADDRESS?: string;
  OKX_ONCHAINOS_BASE_URL?: string;
  OKX_PROJECT_ID?: string;
  OKX_API_KEY?: string;
  OKX_SECRET_KEY?: string;
  OKX_PASSPHRASE?: string;
}
