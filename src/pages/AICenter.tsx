import { useState, useEffect } from "react";
import PageHero from "@/components/PageHero";
import api from "@/lib/api";
import type { Request } from "@/lib/store";

export default function AICenter() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await api.get("/requests");
        setRequests(data);
      } catch (error) {
        console.error("AI Center fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const trendCategory = (() => {
    const counts: Record<string, number> = {};
    requests.forEach((r) => (counts[r.category] = (counts[r.category] ?? 0) + 1));
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Web Development";
  })();
  
  const highUrgency = requests.filter((r) => r.urgency === "High").length;
  // Simplified mentor logic for demo
  const mentorsCount = 12; // In real app, fetch from users with high trust

  if (loading) return <div className="p-20 text-center">Loading AI insights...</div>;

  return (
    <>
      <PageHero
        eyebrow="AI Center"
        title="See what the platform intelligence is noticing."
        description="AI-like insights summarize demand trends, helper readiness, urgency signals, and request recommendations."
      />

      <div className="grid md:grid-cols-3 gap-5 mb-10">
        <Stat eyebrow="Trend pulse" value={trendCategory} caption="Most common support area based on active community requests." />
        <Stat eyebrow="Urgency watch" value={String(highUrgency)} caption="Requests currently flagged high priority by the urgency detector." />
        <Stat eyebrow="Mentor pool" value={String(mentorsCount)} caption="Trusted helpers with strong response history and contribution signals." />
      </div>

      <section className="surface-card p-7 md:p-10">
        <p className="eyebrow mb-3">AI recommendations</p>
        <h2 className="font-display text-3xl md:text-4xl mb-6">Requests needing attention</h2>
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r._id} className="rounded-2xl bg-background/60 border border-border p-5">
              <p className="font-semibold mb-2">{r.title}</p>
              <p className="text-sm text-muted-foreground mb-3">
                {r.aiSummary || (r.urgency === "High"
                  ? `${r.category} request with high urgency. Best suited for members with relevant expertise.`
                  : `A ${r.category.toLowerCase()} request where focused feedback would create the most value.`)}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="chip">{r.category}</span>
                <span className="chip">{r.urgency}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Stat({ eyebrow, value, caption }: { eyebrow: string; value: string; caption: string }) {
  return (
    <div className="surface-card p-7">
      <p className="eyebrow mb-4">{eyebrow}</p>
      <p className="font-display text-3xl md:text-4xl mb-3 leading-tight text-primary">{value}</p>
      <p className="text-sm text-muted-foreground">{caption}</p>
    </div>
  );
}
