import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "../types/bindings.js";
import { analyticsRoute } from "./routes/analytics.js";
import { backtestRoute } from "./routes/backtest.js";
import { bundlesRoute } from "./routes/bundles.js";
import { comparisonRoute } from "./routes/comparison.js";
import { creditsRoute } from "./routes/credits.js";
import { executionRoute } from "./routes/execution.js";
import { healthRoute } from "./routes/health.js";
import { identityRoute } from "./routes/identity.js";
import { leaderboardRoute } from "./routes/leaderboard.js";
import { llmIndexRoute } from "./routes/llm-index.js";
import { openclawRoute } from "./routes/openclaw.js";
import { publishRoute } from "./routes/publish.js";
import { purchasesRoute } from "./routes/purchases.js";
import { recommendRoute } from "./routes/recommend.js";
import { strategiesRoute } from "./routes/strategies.js";

const app = new Hono<{ Bindings: Env }>();

app.use("/*", cors());

// Mount all route groups under /api
app.route("/api", healthRoute);
app.route("/api", strategiesRoute);
app.route("/api", openclawRoute);
app.route("/api", analyticsRoute);
app.route("/api", identityRoute);
app.route("/api", publishRoute);
app.route("/api", purchasesRoute);
app.route("/api", recommendRoute);
app.route("/api", backtestRoute);
app.route("/api", bundlesRoute);
app.route("/api", comparisonRoute);
app.route("/api", creditsRoute);
app.route("/api", leaderboardRoute);
app.route("/api", executionRoute);

// Root-level LLM index files
app.route("/", llmIndexRoute);

export default app;
