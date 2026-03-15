import { useApi } from "@/hooks/useApi";
import { Badge } from "@/components/ui/badge";
import BacktestPanel from "./BacktestPanel";
import { useMemo } from "react";

interface Strategy {
  slug: string;
  title: string;
  description: string;
  family: string;
  executionMode: string;
  tags: string[];
  priceUsd: number;
  publisherId: string;
  supportedChainIds: number[];
}

export default function StrategyDetail() {
  const slug = useMemo(() => {
    if (typeof window === "undefined") return "";
    const parts = window.location.pathname.split("/").filter(Boolean);
    // /strategies/view?slug=xxx or /strategies/[slug]
    const params = new URLSearchParams(window.location.search);
    return params.get("slug") ?? parts[parts.length - 1] ?? "";
  }, []);

  const { data, loading, error } = useApi<Strategy>({
    url: `/strategies/${slug}`,
    immediate: !!slug,
  });

  if (!slug) return <p className="py-12 text-center text-[var(--color-muted-foreground)]">No strategy specified.</p>;

  if (loading) {
    return <div className="space-y-4">
      {[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-[var(--radius-lg)] bg-[var(--color-muted)]" />)}
    </div>;
  }

  if (error || !data) {
    return <p className="py-12 text-center text-[var(--color-destructive)]">Strategy not found.</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <Badge variant="outline">{data.family}</Badge>
          <Badge variant="outline">{data.executionMode}</Badge>
        </div>
        <h1 className="text-3xl font-bold">{data.title}</h1>
        <p className="mt-2 text-[var(--color-muted-foreground)]">{data.description}</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <p className="text-xs text-[var(--color-muted-foreground)]">Price</p>
          <p className="mt-1 text-2xl font-bold text-[var(--color-accent)]">${data.priceUsd}</p>
          <p className="text-xs text-[var(--color-muted-foreground)]">one-time, permanent access</p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <p className="text-xs text-[var(--color-muted-foreground)]">Chains</p>
          <p className="mt-1 font-medium">
            {data.supportedChainIds.map((id) => id === 196 ? "X Layer" : `Chain ${id}`).join(", ")}
          </p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <p className="text-xs text-[var(--color-muted-foreground)]">Tags</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {data.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-card)] p-6">
        <h2 className="mb-2 text-lg font-semibold">How to Purchase</h2>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Use the <a href="/docs/openclaw">OpenClaw skill</a> to purchase this strategy via your AI agent.
          Payment is processed via x402 on X Layer with USDT0 or USDC.
        </p>
      </div>

      <BacktestPanel slug={slug} />
    </div>
  );
}
