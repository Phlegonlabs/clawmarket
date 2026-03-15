import {
  type AgentResponse,
  err,
  ok,
  type Result,
} from "@clawmarket/contracts";
import { bundles, publishers, strategyPackages } from "@clawmarket/db";
import { eq, inArray } from "drizzle-orm";
import type { Database } from "../lib/db.js";
import { generateId } from "../lib/id.js";

interface BundleTeaser {
  id: string;
  slug: string;
  name: string;
  description: string;
  strategyCount: number;
  priceUsd: number;
  publisherId: string;
  tags: string[];
  createdAt: string;
}

interface BundleDetail extends BundleTeaser {
  strategies: Array<{ slug: string; title: string; family: string; priceUsd: number }>;
  totalIndividualPrice: number;
  discountPercent: number;
}

function formatTeaser(row: typeof bundles.$inferSelect): BundleTeaser {
  const strategyIds = JSON.parse(row.strategyIds) as string[];
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    strategyCount: strategyIds.length,
    priceUsd: row.priceUsd,
    publisherId: row.publisherId,
    tags: JSON.parse(row.tags) as string[],
    createdAt: row.createdAt,
  };
}

export async function listBundles(db: Database): Promise<AgentResponse<BundleTeaser[]>> {
  const rows = await db.select().from(bundles).all();
  const teasers = rows.map(formatTeaser);

  return {
    data: teasers,
    display: {
      markdown: teasers.length
        ? teasers.map((b, i) => `${i + 1}. **${b.name}** — ${b.strategyCount} strategies, $${b.priceUsd}`).join("\n")
        : "No bundles available yet.",
    },
  };
}

export async function getBundleBySlug(
  db: Database,
  slug: string,
): Promise<Result<AgentResponse<BundleDetail>, "NOT_FOUND">> {
  const rows = await db.select().from(bundles).where(eq(bundles.slug, slug)).limit(1);
  if (!rows[0]) return err("NOT_FOUND", `Bundle '${slug}' not found`);

  const row = rows[0];
  const strategyIds = JSON.parse(row.strategyIds) as string[];
  const strategies = await db
    .select()
    .from(strategyPackages)
    .where(inArray(strategyPackages.id, strategyIds))
    .all();

  const totalIndividualPrice = strategies.reduce((sum, s) => sum + s.priceUsd, 0);
  const discountPercent = totalIndividualPrice > 0
    ? Math.round((1 - row.priceUsd / totalIndividualPrice) * 100)
    : 0;

  const detail: BundleDetail = {
    ...formatTeaser(row),
    strategies: strategies.map((s) => ({
      slug: s.slug,
      title: s.title,
      family: s.family,
      priceUsd: s.priceUsd,
    })),
    totalIndividualPrice,
    discountPercent,
  };

  return ok({
    data: detail,
    display: {
      markdown: `**${detail.name}** — $${detail.priceUsd} (${detail.discountPercent}% off)\n\nIncludes:\n${detail.strategies.map((s) => `- ${s.title} ($${s.priceUsd})`).join("\n")}`,
    },
  });
}

interface PublishBundleInput {
  slug: string;
  name: string;
  description: string;
  strategySlugs: string[];
  priceUsd: number;
  publisherId: string;
  tags?: string[];
}

export async function publishBundle(
  db: Database,
  input: PublishBundleInput,
): Promise<Result<AgentResponse<BundleTeaser>, "PUBLISHER_NOT_FOUND" | "SLUG_CONFLICT" | "INVALID_DISCOUNT" | "STRATEGY_NOT_FOUND">> {
  const pub = await db.select().from(publishers).where(eq(publishers.id, input.publisherId)).limit(1);
  if (!pub[0]) return err("PUBLISHER_NOT_FOUND", "Publisher not found");

  const existing = await db.select().from(bundles).where(eq(bundles.slug, input.slug)).limit(1);
  if (existing[0]) return err("SLUG_CONFLICT", "Bundle slug already exists");

  const strategies = await db
    .select()
    .from(strategyPackages)
    .where(inArray(strategyPackages.slug, input.strategySlugs))
    .all();

  if (strategies.length !== input.strategySlugs.length) {
    return err("STRATEGY_NOT_FOUND", "One or more strategies not found");
  }

  const totalIndividual = strategies.reduce((sum, s) => sum + s.priceUsd, 0);
  if (input.priceUsd > totalIndividual * 0.8) {
    return err("INVALID_DISCOUNT", "Bundle price must be <= 80% of individual total");
  }

  const now = new Date().toISOString();
  const id = generateId("bndl");

  await db.insert(bundles).values({
    id,
    slug: input.slug,
    name: input.name,
    description: input.description,
    strategyIds: JSON.stringify(strategies.map((s) => s.id)),
    priceUsd: input.priceUsd,
    publisherId: input.publisherId,
    tags: JSON.stringify(input.tags ?? []),
    createdAt: now,
    updatedAt: now,
  });

  const teaser = formatTeaser({
    id,
    slug: input.slug,
    name: input.name,
    description: input.description,
    strategyIds: JSON.stringify(strategies.map((s) => s.id)),
    priceUsd: input.priceUsd,
    publisherId: input.publisherId,
    tags: JSON.stringify(input.tags ?? []),
    createdAt: now,
    updatedAt: now,
  });

  return ok({
    data: teaser,
    display: { markdown: `Bundle published: **${teaser.name}** ($${teaser.priceUsd})` },
  });
}
