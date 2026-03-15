import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LeaderboardEntry {
  rank: number;
  slug: string;
  title: string;
  family: string;
  score: number;
  purchaseCount: number;
  badgeCount: number;
  sharpeRatio: number | null;
  winRate: number | null;
}

const TABS = [
  { key: "overall", label: "Overall" },
  { key: "trending", label: "Trending" },
];

export default function LeaderboardTable() {
  const [tab, setTab] = useState("overall");

  const url = tab === "trending" ? "/leaderboard/trending" : "/leaderboard?category=overall&limit=20";
  const { data, loading, error } = useApi<LeaderboardEntry[]>({ url });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Strategy Rankings</CardTitle>
          <div className="flex gap-2">
            {TABS.map((t) => (
              <Button
                key={t.key}
                variant={tab === t.key ? "default" : "outline"}
                size="sm"
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-[var(--color-muted)]" />
            ))}
          </div>
        ) : error ? (
          <p className="text-[var(--color-destructive)]">{error}</p>
        ) : !data?.length ? (
          <p className="py-8 text-center text-[var(--color-muted-foreground)]">No leaderboard data yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[var(--color-muted-foreground)]">
                  <th className="py-2 text-left font-medium w-16">#</th>
                  <th className="py-2 text-left font-medium">Strategy</th>
                  <th className="py-2 text-left font-medium">Family</th>
                  <th className="py-2 text-right font-medium">Score</th>
                  <th className="py-2 text-right font-medium">Sharpe</th>
                  <th className="py-2 text-right font-medium">Win Rate</th>
                  <th className="py-2 text-right font-medium">Sales</th>
                </tr>
              </thead>
              <tbody>
                {data.map((e) => (
                  <tr key={e.slug} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-muted)]">
                    <td className="py-3 font-bold">{e.rank}</td>
                    <td className="py-3">
                      <a href={`/strategies/view?slug=${e.slug}`} className="font-medium hover:text-[var(--color-accent)]">
                        {e.title}
                      </a>
                      {e.badgeCount > 0 && (
                        <Badge variant="default" className="ml-2">{e.badgeCount} badges</Badge>
                      )}
                    </td>
                    <td className="py-3"><Badge variant="outline">{e.family}</Badge></td>
                    <td className="py-3 text-right font-mono">{e.score}</td>
                    <td className="py-3 text-right font-mono">{e.sharpeRatio?.toFixed(2) ?? "—"}</td>
                    <td className="py-3 text-right font-mono">{e.winRate != null ? `${e.winRate}%` : "—"}</td>
                    <td className="py-3 text-right font-mono">{e.purchaseCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
