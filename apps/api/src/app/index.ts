import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "../types/bindings.js";
import { backtestRoute } from "./routes/backtest.js";
import { executionRoute } from "./routes/execution.js";
import { healthRoute } from "./routes/health.js";
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
app.route("/api", publishRoute);
app.route("/api", purchasesRoute);
app.route("/api", recommendRoute);
app.route("/api", backtestRoute);
app.route("/api", executionRoute);

// Root-level LLM index files
app.route("/", llmIndexRoute);

export default app;
