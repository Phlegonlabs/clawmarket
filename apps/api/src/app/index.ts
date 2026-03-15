import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "../types/bindings.js";
import { healthRoute } from "./routes/health.js";

const app = new Hono<{ Bindings: Env }>();

app.use("/*", cors());

app.route("/api", healthRoute);

export default app;
