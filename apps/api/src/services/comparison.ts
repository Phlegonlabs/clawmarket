import {
  type AgentResponse,
  err,
  ok,
  type Result,
  type StrategyTeaser,
} from "@clawmarket/contracts";
import { strategyPackages } from "@clawmarket/db";
import { inArray } from "drizzle-orm";
import type { Database } from "../lib/db.js";
import { getModelForUseCase, runTextGeneration } from "../lib/workers-ai.js";
import { getStrategyBadges } from "./badges.js";

interface ComparisonResult {
  strategies: Array<StrategyTeaser & { badges: string[] }>;
  aiSummary: string;
}

function formatTeaser(row: typeof strategyPackages.$inferSelect): StrategyTeaser {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    family: row.family as StrategyTeaser["family"],
    executionMode: row.executionMode as StrategyTeaser["executionMode"],
    tags: JSON.parse(row.tags) as string[],
    priceUsd: row.priceUsd,
    publisherId: row.publisherId,
    supportedChainIds: JSON.parse(row.supportedChainIds) as number[],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function compareStrategies(
  db: Database,
  ai: Ai,
  slugs: string[],
): Promise<Result<AgentResponse<ComparisonResult>, "INVALID_COUNT" | "NOT_FOUND">> {
  if (slugs.length < 2 || slugs.length > 4) {
    return err("INVALID_COUNT", "Provide 2-4 strategy slugs to compare");
  }

  const rows = await db
    .select()
    .from(strategyPackages)
    .where(inArray(strategyPackages.slug, slugs))
    .all();

  if (rows.length !== slugs.length) {
    const found = rows.map((r) => r.slug);
    const missing = slugs.filter((s) => !found.includes(s));
    return err("NOT_FOUND", `Strategies not found: ${missing.join(", ")}`);
  }

  const strategiesWithBadges = await Promise.all(
    rows.map(async (row) => {
      const teaser = formatTeaser(row);
      const badges = await getStrategyBadges(db, row.id);
      return { ...teaser, badges: badges.map((b) => b.badge) };
    }),
  );

  // AI comparison summary
  const context = strategiesWithBadges
    .map(
      (s) =>
        `"${s.title}" (${s.family}, ${s.executionMode}, $${s.priceUsd}, badges: ${s.badges.join(",") || "none"})`,
    )
    .join(" vs ");

  const model = getModelForUseCase("comparison");
  const aiResult = await runTextGeneration(
    ai,
    [
      {
        role: "system",
        content:
          "You are a trading strategy analyst. Compare the given strategies in 3-4 sentences. Highlight key differences, strengths, and which scenarios each is best suited for. Be concise and objective.",
      },
      { role: "user", content: `Compare these strategies: ${context}` },
    ],
    model,
  );

  const aiSummary = aiResult.ok ? aiResult.value : "Comparison analysis unavailable.";

  const table = strategiesWithBadges
    .map(
      (s) =>
        `| ${s.title} | ${s.family} | ${s.executionMode} | $${s.priceUsd} | ${s.badges.join(", ") || "—"} |`,
    )
    .join("\n");

  return ok({
    data: { strategies: strategiesWithBadges, aiSummary },
    display: {
      markdown: `**Strategy Comparison**\n\n| Strategy | Family | Mode | Price | Badges |\n|----------|--------|------|-------|--------|\n${table}\n\n**AI Analysis:** ${aiSummary}`,
    },
  });
}
