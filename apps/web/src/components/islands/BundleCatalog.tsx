import { useApi } from "@/hooks/useApi";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface BundleTeaser {
  slug: string;
  name: string;
  description: string;
  strategyCount: number;
  priceUsd: number;
  tags: string[];
}

export default function BundleCatalog() {
  const { data, loading, error } = useApi<BundleTeaser[]>({ url: "/bundles" });

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-[var(--radius-lg)] bg-[var(--color-muted)]" />
        ))}
      </div>
    );
  }

  if (error) return <p className="text-[var(--color-destructive)]">{error}</p>;

  if (!data?.length) {
    return <p className="py-12 text-center text-[var(--color-muted-foreground)]">No bundles available yet.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((b) => (
        <a key={b.slug} href={`/bundles/view?slug=${b.slug}`} className="no-underline">
          <Card className="h-full transition-colors hover:border-[var(--color-accent)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge>{b.strategyCount} strategies</Badge>
                <span className="text-lg font-bold text-[var(--color-accent)]">${b.priceUsd}</span>
              </div>
              <CardTitle className="mt-2">{b.name}</CardTitle>
              <CardDescription className="line-clamp-2">{b.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {b.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
}
