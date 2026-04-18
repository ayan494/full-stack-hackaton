import PageHero from "@/components/PageHero";
import { useStore } from "@/lib/useStore";

export default function Leaderboard() {
  const { store } = useStore();
  const ranked = [...store.users].sort((a, b) => b.trust - a.trust);

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
            {ranked.map((u, i) => (
              <div key={u.id} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background/60">
                <span className={`h-12 w-12 rounded-full bg-gradient-to-br ${u.color} grid place-items-center text-white font-semibold`}>{u.initials}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">#{i + 1} {u.name}</p>
                    <p className="font-display text-lg">{u.trust}%</p>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="text-xs text-muted-foreground truncate">{u.skills.join(", ")}</p>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{u.contributions} contributions</p>
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
            {ranked.map((u) => (
              <div key={u.id} className="rounded-2xl border border-border p-5 bg-background/60">
                <p className="font-semibold mb-1">{u.name}</p>
                <p className="text-xs text-muted-foreground mb-3">{u.badges.join(" • ")}</p>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-primary" style={{ width: `${u.trust}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
