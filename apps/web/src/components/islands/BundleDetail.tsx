import { useMemo } from "react";
import { useApi } from "@/hooks/useApi";
import { Badge } from "@/components/ui/badge";

interface BundleData {
  name: string;
  description: string;
  priceUsd: number;
  strategyCount: number;
  discountPercent: number;
  totalIndividualPrice: number;
  strategies: Array<{ slug: string; title: string; family: string; priceUsd: number }>;
  tags: string[];
}

export default function BundleDetail() {
  const slug = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("slug") ?? "";
  }, []);

  const { data, loading, error } = useApi<BundleData>({
    url: `/bundles/${slug}`,
    immediate: !!slug,
  });

  if (!slug) return <p className="py-12 text-center text-[var(--color-muted-foreground)]">No bundle specified.</p>;
  if (loading) return <div className="h-40 animate-pulse rounded-[var(--radius-lg)] bg-[var(--color-muted)]" />;
  if (error || !data) return <p className="py-12 text-center text-[var(--color-destructive)]">Bundle not found.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold">{data.name}</h1>
      <p className="mt-2 text-[var(--color-muted-foreground)]">{data.description}</p>

      <div className="mt-6 flex items-center gap-4">
        <span className="text-3xl font-bold text-[var(--color-accent)]">${data.priceUsd}</span>
        <span className="text-lg text-[var(--color-muted-foreground)] line-through">${data.totalIndividualPrice}</span>
        <Badge>{data.discountPercent}% off</Badge>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Included Strategies ({data.strategies.length})</h2>
        <div className="space-y-3">
          {data.strategies.map((s) => (
            <a
              key={s.slug}
              href={`/strategies/view?slug=${s.slug}`}
              className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] p-4 no-underline hover:border-[var(--color-accent)]"
            >
              <div>
                <p className="font-medium">{s.title}</p>
                <p className="text-sm text-[var(--color-muted-foreground)]">{s.family}</p>
              </div>
              <span className="text-[var(--color-muted-foreground)]">${s.priceUsd}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-card)] p-6">
        <h2 className="mb-2 text-lg font-semibold">How to Purchase</h2>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Use the <a href="/docs/openclaw">OpenClaw skill</a> to purchase this bundle.
          All strategies are unlocked in a single transaction.
        </p>
      </div>
    </div>
  );
}
