import PageHero from "@/components/PageHero";
import { useStore } from "@/lib/useStore";

export default function Notifications() {
  const { store, setStore } = useStore();

  const toggle = (id: string) => {
    setStore((s) => ({
      ...s,
      notifications: s.notifications.map((n) => n.id === id ? { ...n, read: !n.read } : n),
    }));
  };

  const markAllRead = () => {
    setStore((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
  };

  return (
    <>
      <PageHero
        eyebrow="Notifications"
        title="Stay updated on requests, helpers, and trust signals."
        description="Real-time-style updates keep momentum visible across your support journey."
      />

      <section className="surface-card p-7 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="eyebrow mb-2">Live updates</p>
            <h2 className="font-display text-3xl">Notification feed</h2>
          </div>
          <button onClick={markAllRead} className="px-5 py-2.5 rounded-full bg-background border border-border text-sm font-medium hover:bg-accent">Mark all read</button>
        </div>
        <div className="space-y-3">
          {store.notifications.map((n) => (
            <div key={n.id} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/60 p-5">
              <div>
                <p className="font-semibold">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.type} • {n.when}</p>
              </div>
              <button onClick={() => toggle(n.id)} className={`px-4 py-1.5 rounded-full text-xs font-medium border ${n.read ? "border-border bg-background text-muted-foreground" : "border-primary/30 bg-primary/10 text-primary"}`}>
                {n.read ? "Read" : "Unread"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
