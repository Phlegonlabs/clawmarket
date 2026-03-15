import { Hono } from "hono";

interface Env {
  AI: Ai;
  ENVIRONMENT: string;
}

const app = new Hono<{ Bindings: Env }>();

app.get("/health", (c) => {
  return c.json({
    data: {
      status: "operational",
      service: "backtest",
      timestamp: new Date().toISOString(),
    },
    display: {
      markdown: "**Backtest Worker** — Operational",
    },
  });
});

export default app;
