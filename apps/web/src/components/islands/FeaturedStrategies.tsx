import { useApi } from "@/hooks/useApi";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StrategyTeaser {
  slug: string;
  title: string;
  description: string;
  family: string;
  executionMode: string;
  tags: string[];
  priceUsd: number;
}

export default function FeaturedStrategies() {
  const { data, loading, error } = useApi<StrategyTeaser[]>({ url: "/strategies" });

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-[var(--radius-lg)] bg-[var(--color-muted)]" />
        ))}
      </div>
    );
  }

  if (error || !data?.length) {
    return (
      <p className="text-center text-[var(--color-muted-foreground)]">
        No strategies available yet. Be the first to publish!
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.slice(0, 6).map((s) => (
        <Card key={s.slug} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline">{s.family}</Badge>
              <span className="text-lg font-bold text-[var(--color-accent)]">${s.priceUsd}</span>
            </div>
            <CardTitle className="mt-2">{s.title}</CardTitle>
            <CardDescription className="line-clamp-2">{s.description}</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto flex items-center justify-between">
            <div className="flex gap-1">
              {s.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={`/strategies/${s.slug}`}>View</a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
