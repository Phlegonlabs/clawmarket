import {
  type AgentResponse,
  err,
  ok,
  type Result,
  type StrategyPackage,
  type StrategyTeaser,
} from "@clawmarket/contracts";
import { publishers, strategyPackages } from "@clawmarket/db";
import { eq } from "drizzle-orm";
import type { Database } from "../lib/db.js";
import { generateId } from "../lib/id.js";

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

function formatFull(row: typeof strategyPackages.$inferSelect): StrategyPackage {
  return {
    ...formatTeaser(row),
    naturalLanguageSpec: JSON.parse(row.naturalLanguageSpec),
    ruleSpec: JSON.parse(row.ruleSpec),
  };
}

function teaserMarkdown(t: StrategyTeaser): string {
  return `**${t.title}** (${t.family} / ${t.executionMode})\n$${t.priceUsd} · ${t.tags.join(", ")}`;
}

export async function listStrategies(db: Database): Promise<AgentResponse<StrategyTeaser[]>> {
  const rows = await db.select().from(strategyPackages).all();
  const teasers = rows.map(formatTeaser);
  return {
    data: teasers,
    display: {
      markdown: teasers.length
        ? teasers.map((t, i) => `${i + 1}. ${teaserMarkdown(t)}`).join("\n")
        : "No strategies available yet.",
    },
  };
}

export async function getStrategyBySlug(
  db: Database,
  slug: string,
): Promise<Result<AgentResponse<StrategyTeaser>, "NOT_FOUND">> {
  const rows = await db
    .select()
    .from(strategyPackages)
    .where(eq(strategyPackages.slug, slug))
    .limit(1);
  const row = rows[0];
  if (!row) return err("NOT_FOUND", `Strategy '${slug}' not found`);

  const teaser = formatTeaser(row);
  const ruleSpec = JSON.parse(row.ruleSpec) as { rules: Array<{ description: string }> };
  const ruleOutline = ruleSpec.rules.map((r, i) => `${i + 1}. ${r.description}`).join("\n");

  return ok({
    data: teaser,
    display: {
      markdown: `${teaserMarkdown(teaser)}\n\n**Rules outline:**\n${ruleOutline}`,
    },
  });
}

export async function getUnlockedStrategy(
  db: Database,
  slug: string,
): Promise<Result<AgentResponse<StrategyPackage>, "NOT_FOUND">> {
  const rows = await db
    .select()
    .from(strategyPackages)
    .where(eq(strategyPackages.slug, slug))
    .limit(1);
  const row = rows[0];
  if (!row) return err("NOT_FOUND", `Strategy '${slug}' not found`);

  const full = formatFull(row);
  return ok({
    data: full,
    display: {
      markdown: `**${full.title}** — Full Strategy Package\n\n**Overview:** ${full.naturalLanguageSpec.overview}\n\n**Entry:** ${full.naturalLanguageSpec.entryConditions.join("; ")}\n**Exit:** ${full.naturalLanguageSpec.exitConditions.join("; ")}\n**Risk:** ${full.naturalLanguageSpec.riskManagement}`,
    },
  });
}

interface PublishInput {
  slug: string;
  title: string;
  description: string;
  family: string;
  executionMode: string;
  tags?: string[];
  priceUsd: number;
  publisherId: string;
  supportedChainIds?: number[];
  naturalLanguageSpec: Record<string, unknown>;
  ruleSpec: Record<string, unknown>;
}

export async function publishStrategy(
  db: Database,
  input: PublishInput,
): Promise<Result<AgentResponse<StrategyTeaser>, "PUBLISHER_NOT_FOUND" | "SLUG_CONFLICT">> {
  const pub = await db
    .select()
    .from(publishers)
    .where(eq(publishers.id, input.publisherId))
    .limit(1);
  if (!pub[0]) return err("PUBLISHER_NOT_FOUND", `Publisher '${input.publisherId}' not found`);

  const existing = await db
    .select({ id: strategyPackages.id })
    .from(strategyPackages)
    .where(eq(strategyPackages.slug, input.slug))
    .limit(1);
  if (existing[0]) return err("SLUG_CONFLICT", `Slug '${input.slug}' already exists`);

  const now = new Date().toISOString();
  const id = generateId("strat");
  const row = {
    id,
    slug: input.slug,
    title: input.title,
    description: input.description,
    family: input.family,
    executionMode: input.executionMode,
    tags: JSON.stringify(input.tags ?? []),
    priceUsd: input.priceUsd,
    publisherId: input.publisherId,
    supportedChainIds: JSON.stringify(input.supportedChainIds ?? [196]),
    naturalLanguageSpec: JSON.stringify(input.naturalLanguageSpec),
    ruleSpec: JSON.stringify(input.ruleSpec),
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(strategyPackages).values(row);

  const teaser = formatTeaser({ ...row, priceUsd: input.priceUsd });
  return ok({
    data: teaser,
    display: {
      markdown: `Strategy published: ${teaserMarkdown(teaser)}`,
    },
  });
}
