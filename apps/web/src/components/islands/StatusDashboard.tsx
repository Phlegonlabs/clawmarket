import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "down";
  responseMs: number | null;
}

const API_BASE = import.meta.env.PUBLIC_API_URL ?? "/api";
const POLL_INTERVAL = 30_000;

const SERVICES = [
  { name: "Main API", url: `${API_BASE}/health` },
];

export default function StatusDashboard() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [lastChecked, setLastChecked] = useState<string>("");

  const checkServices = useCallback(async () => {
    const results: ServiceStatus[] = [];

    for (const svc of SERVICES) {
      const start = performance.now();
      try {
        const res = await fetch(svc.url);
        const ms = Math.round(performance.now() - start);
        results.push({
          name: svc.name,
          status: res.ok ? "operational" : "degraded",
          responseMs: ms,
        });
      } catch {
        results.push({ name: svc.name, status: "down", responseMs: null });
      }
    }

    // Inferred services (based on API health response)
    const apiResult = results.find((r) => r.name === "Main API");
    if (apiResult?.status === "operational") {
      try {
        const res = await fetch(`${API_BASE}/health`);
        const json = (await res.json()) as { data?: { d1?: string } };
        results.push({
          name: "D1 Database",
          status: json.data?.d1 === "connected" ? "operational" : "degraded",
          responseMs: apiResult.responseMs,
        });
      } catch {
        results.push({ name: "D1 Database", status: "down", responseMs: null });
      }
    }

    results.push(
      { name: "Workers AI", status: apiResult?.status === "operational" ? "operational" : "down", responseMs: null },
      { name: "Backtest Worker", status: apiResult?.status === "operational" ? "operational" : "down", responseMs: null },
      { name: "X Layer (196)", status: "operational", responseMs: null },
    );

    setServices(results);
    setLastChecked(new Date().toLocaleTimeString());
  }, []);

  useEffect(() => {
    checkServices();
    const interval = setInterval(checkServices, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [checkServices]);

  const overall = services.length === 0
    ? "checking"
    : services.every((s) => s.status === "operational")
      ? "operational"
      : services.some((s) => s.status === "down")
        ? "down"
        : "degraded";

  return (
    <div className="space-y-6">
      {/* Overall status */}
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${
              overall === "operational" ? "bg-green-500" :
              overall === "degraded" ? "bg-yellow-500" :
              overall === "down" ? "bg-red-500" : "bg-gray-500 animate-pulse"
            }`} />
            <span className="text-lg font-semibold">
              {overall === "operational" ? "All Systems Operational" :
               overall === "degraded" ? "Degraded Performance" :
               overall === "down" ? "Service Disruption" : "Checking..."}
            </span>
          </div>
          {lastChecked && (
            <span className="text-sm text-[var(--color-muted-foreground)]">
              Last checked: {lastChecked}
            </span>
          )}
        </CardContent>
      </Card>

      {/* Service table */}
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-sm text-[var(--color-muted-foreground)]">
                <th className="pb-3 text-left font-medium">Service</th>
                <th className="pb-3 text-left font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Response</th>
              </tr>
            </thead>
            <tbody>
              {services.map((svc) => (
                <tr key={svc.name} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="py-3 font-medium">{svc.name}</td>
                  <td className="py-3">
                    <Badge variant={svc.status === "operational" ? "default" : "outline"}>
                      {svc.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-right font-mono text-sm text-[var(--color-muted-foreground)]">
                    {svc.responseMs !== null ? `${svc.responseMs}ms` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
