import type { Env } from "../../types/bindings.js";

export function createMockEnv(overrides?: Partial<Env>): Env {
  return {
    DB: {} as unknown as D1Database,
    AI: {} as unknown as Ai,
    BACKTEST: {} as unknown as Fetcher,
    ENVIRONMENT: "test",
    PLATFORM_REVENUE_SHARE_BPS: "1000",
    X402_PAY_TO: "0xTEST_TREASURY",
    OKX_ONCHAINOS_BASE_URL: "https://mock-okx.test",
    OKX_PROJECT_ID: "test-project",
    OKX_API_KEY: "test-key",
    OKX_SECRET_KEY: "test-secret",
    OKX_PASSPHRASE: "test-passphrase",
    ...overrides,
  };
}
