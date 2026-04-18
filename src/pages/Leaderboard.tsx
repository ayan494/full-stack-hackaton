import { useState, useEffect } from "react";
import PageHero from "@/components/PageHero";
import api from "@/lib/api";

export default function Leaderboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/auth/users");
        setUsers(data);
      } catch (error) {
        console.error("Leaderboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="p-20 text-center">Loading rankings...</div>;

  return (
    <>
      <PageHero
        eyebrow="Leaderboard"
        title="Recognize the people who keep the community moving."
        description="Trust score, contribution count, and badges create visible momentum for reliable helpers."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="surface-card p-7 md:p-10">
          <p className="eyebrow mb-3">Top helpers</p>
          <h2 className="font-display text-3xl mb-6">Rankings</h2>
          <div className="space-y-3">
            {users.map((u, i) => (
              <div key={u._id} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background/60">
                <span className={`h-12 w-12 rounded-full bg-gradient-to-br ${u.color || "from-blue-500 to-indigo-500"} grid place-items-center text-white font-semibold`}>{u.initials}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">#{i + 1} {u.name}</p>
                    <p className="font-display text-lg">{u.trustScore || 0}%</p>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="text-xs text-muted-foreground truncate">{u.skills?.join(", ") || "No skills listed"}</p>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{u.contributions || 0} contributions</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card p-7 md:p-10">
          <p className="eyebrow mb-3">Badge system</p>
          <h2 className="font-display text-3xl mb-6">Trust and achievement</h2>
          <div className="space-y-4">
            {users.map((u) => (
              <div key={u._id} className="rounded-2xl border border-border p-5 bg-background/60">
                <p className="font-semibold mb-1">{u.name}</p>
                <p className="text-xs text-muted-foreground mb-3">{u.badges?.join(" • ") || "New helper"}</p>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-primary" style={{ width: `${u.trustScore || 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
