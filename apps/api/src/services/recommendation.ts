import {
  type AgentResponse,
  err,
  ok,
  type Result,
  type StrategyTeaser,
} from "@clawmarket/contracts";
import { strategyPackages } from "@clawmarket/db";
import type { Database } from "../lib/db.js";
import { runTextGeneration } from "../lib/workers-ai.js";

interface RecommendInput {
  agentId: string;
  preferences: string;
  maxResults?: number;
}

interface Recommendation {
  strategy: StrategyTeaser;
  matchScore: number;
  reason: string;
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

function buildCatalogContext(teasers: StrategyTeaser[]): string {
  return teasers
    .map(
      (t, i) =>
        `[${i}] "${t.title}" (slug: ${t.slug}) — ${t.family}/${t.executionMode}, $${t.priceUsd}, tags: ${t.tags.join(",") || "none"}. ${t.description}`,
    )
    .join("\n");
}

function parseRecommendations(
  aiText: string,
  teasers: StrategyTeaser[],
  maxResults: number,
): Recommendation[] {
  const results: Recommendation[] = [];
  const lines = aiText.split("\n").filter((l) => l.trim());

  for (const line of lines) {
    if (results.length >= maxResults) break;
    // Expect format: [index] score reason
    const match = line.match(/\[(\d+)]\s*(\d+)\s+(.*)/);
    if (match) {
      const idx = Number.parseInt(match[1], 10);
      const score = Math.min(100, Math.max(0, Number.parseInt(match[2], 10)));
      const reason = match[3].trim();
      if (idx >= 0 && idx < teasers.length) {
        results.push({ strategy: teasers[idx], matchScore: score, reason });
      }
    }
  }

  // Fallback: if AI didn't return parseable output, return top strategies
  if (results.length === 0 && teasers.length > 0) {
    for (let i = 0; i < Math.min(maxResults, teasers.length); i++) {
      results.push({
        strategy: teasers[i],
        matchScore: 50,
        reason: `Matches your interest in ${teasers[i].family} strategies.`,
      });
    }
  }

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

export async function recommendStrategies(
  db: Database,
  ai: Ai,
  input: RecommendInput,
): Promise<Result<AgentResponse<Recommendation[]>, "NO_STRATEGIES">> {
  const rows = await db.select().from(strategyPackages).all();
  if (rows.length === 0) {
    return err("NO_STRATEGIES", "No strategies available for recommendation");
  }

  const teasers = rows.map(formatTeaser);
  const maxResults = input.maxResults ?? 3;
  const catalog = buildCatalogContext(teasers);

  const systemPrompt = `You are a trading strategy recommendation engine for ClawMarket marketplace.
Given a catalog of strategies and an agent's preferences, recommend the best matches.
For each recommendation, output exactly one line in this format:
[index] score reason
Where index is the strategy number from the catalog, score is 0-100 match quality, and reason is a one-sentence explanation.
Output only the recommendation lines, nothing else. Recommend up to ${maxResults} strategies.`;

  const userPrompt = `Agent preferences: ${input.preferences}

Available strategies:
${catalog}`;

  const aiResult = await runTextGeneration(ai, [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]);

  const aiText = aiResult.ok ? aiResult.value : "";
  const recommendations = parseRecommendations(aiText, teasers, maxResults);

  const markdown = recommendations.length
    ? recommendations
        .map(
          (r, i) =>
            `${i + 1}. **${r.strategy.title}** (${r.matchScore}% match)\n   ${r.reason}\n   _${r.strategy.family} · $${r.strategy.priceUsd}_`,
        )
        .join("\n\n")
    : "No matching strategies found.";

  return ok({
    data: recommendations,
    display: { markdown: `**Strategy Recommendations**\n\n${markdown}` },
  });
}
