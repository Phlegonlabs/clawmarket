import { useCallback, useMemo, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface StrategyTeaser {
  slug: string;
  title: string;
  description: string;
  family: string;
  executionMode: string;
  tags: string[];
  priceUsd: number;
  supportedChainIds: number[];
  createdAt: string;
}

const FAMILIES = ["all", "momentum", "mean-reversion", "arbitrage", "market-making", "trend-following", "volatility"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

export default function StrategyCatalog() {
  const { data, loading, error } = useApi<StrategyTeaser[]>({ url: "/strategies" });
  const [family, setFamily] = useState("all");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!data) return [];
    let result = [...data];

    if (family !== "all") {
      result = result.filter((s) => s.family === family);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (sort === "price-asc") result.sort((a, b) => a.priceUsd - b.priceUsd);
    else if (sort === "price-desc") result.sort((a, b) => b.priceUsd - a.priceUsd);
    else result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return result;
  }, [data, family, sort, search]);

  const updateUrl = useCallback((key: string, value: string) => {
    const url = new URL(window.location.href);
    if (value && value !== "all" && value !== "newest") {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    window.history.replaceState({}, "", url.toString());
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-[var(--radius-lg)] bg-[var(--color-muted)]" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-[var(--color-destructive)]">Failed to load strategies: {error}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FAMILIES.map((f) => (
            <Button
              key={f}
              variant={family === f ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setFamily(f);
                updateUrl("family", f);
              }}
            >
              {f === "all" ? "All" : f}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48"
          />
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              updateUrl("sort", e.target.value);
            }}
            className="h-10 rounded-[var(--radius-default)] border border-[var(--color-border)] bg-transparent px-3 text-sm text-[var(--color-foreground)]"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-[var(--color-muted-foreground)]">No strategies match your filters.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <a key={s.slug} href={`/strategies/${s.slug}`} className="no-underline">
              <Card className="h-full transition-colors hover:border-[var(--color-accent)]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{s.family}</Badge>
                    <span className="font-bold text-[var(--color-accent)]">${s.priceUsd}</span>
                  </div>
                  <CardTitle className="mt-2">{s.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{s.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {s.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                    <Badge variant="secondary">{s.executionMode}</Badge>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
