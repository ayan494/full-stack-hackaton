import { useParams, Link } from "react-router-dom";
import { useStore } from "@/lib/useStore";
import { toast } from "sonner";

const urgencyClass: Record<string, string> = {
  High: "bg-rose-500/15 text-rose-200",
  Medium: "bg-amber-500/15 text-amber-200",
  Low: "bg-sky-500/15 text-sky-200",
};

export default function RequestDetail() {
  const { id } = useParams();
  const { store, setStore, currentUser } = useStore();
  const request = store.requests.find((r) => r.id === id);

  if (!request) {
    return (
      <div className="surface-card p-10 text-center">
        <p className="text-muted-foreground mb-4">Request not found.</p>
        <Link to="/explore" className="text-primary font-medium">Back to explore</Link>
      </div>
    );
  }

  const author = store.users.find((u) => u.id === request.authorId)!;
  const helpers = store.users.filter((u) => request.helpersInterested.includes(u.id));

  const offerHelp = () => {
    if (request.helpersInterested.includes(currentUser.id)) {
      toast("You've already offered help on this request.");
      return;
    }
    setStore((s) => ({
      ...s,
      requests: s.requests.map((r) => r.id === request.id ? { ...r, helpersInterested: [...r.helpersInterested, currentUser.id] } : r),
      notifications: [{ id: `n${Date.now()}`, title: `${currentUser.name} offered help on "${request.title}"`, type: "Match", when: "Just now", read: false }, ...s.notifications],
    }));
    toast.success("You're now listed as an interested helper.");
  };

  const markSolved = () => {
    setStore((s) => ({
      ...s,
      requests: s.requests.map((r) => r.id === request.id ? { ...r, status: "Solved" } : r),
      notifications: [{ id: `n${Date.now()}`, title: `"${request.title}" was marked as solved`, type: "Status", when: "Just now", read: false }, ...s.notifications],
    }));
    toast.success("Marked as solved.");
  };

  return (
    <>
      <section className="surface-ink p-8 md:p-14 mb-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-300/15 blur-3xl" />
        <p className="eyebrow-light mb-5">Request detail</p>
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="chip bg-primary/20 text-primary-foreground">{request.category}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${urgencyClass[request.urgency]}`}>{request.urgency}</span>
          <span className="chip bg-emerald-500/20 text-emerald-200">{request.status}</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl leading-tight mb-5 max-w-4xl">{request.title}</h1>
        <p className="text-primary-foreground/70 max-w-3xl">{request.description}</p>
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="surface-card p-7">
            <p className="eyebrow mb-4">AI summary</p>
            <div className="rounded-2xl border border-border p-5 bg-background/60">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-primary-foreground text-sm font-display">H</div>
                <span className="font-semibold">HelpHub AI</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {request.category} request with {request.urgency.toLowerCase()} urgency. Best suited for members familiar with {request.tags.slice(0, 2).join(" and ") || "this area"}.
              </p>
              <div className="flex flex-wrap gap-2">
                {request.tags.map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
            </div>
          </div>

          <div className="surface-card p-7">
            <p className="eyebrow mb-4">Actions</p>
            <div className="flex flex-wrap gap-3">
              <button onClick={offerHelp} className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary-glow transition-colors">I can help</button>
              <button onClick={markSolved} className="px-6 py-3 rounded-full bg-background border border-border font-medium hover:bg-accent transition-colors">Mark as solved</button>
              <Link to="/messages" className="px-6 py-3 rounded-full bg-background border border-border font-medium hover:bg-accent transition-colors">Message requester</Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card p-7">
            <p className="eyebrow mb-4">Requester</p>
            <div className="flex items-center gap-4">
              <span className={`h-12 w-12 rounded-full bg-gradient-to-br ${author.color} grid place-items-center text-white font-semibold`}>{author.initials}</span>
              <div>
                <p className="font-semibold">{author.name}</p>
                <p className="text-xs text-muted-foreground">{author.location} • Trust {author.trust}%</p>
              </div>
            </div>
          </div>

          <div className="surface-card p-7">
            <p className="eyebrow mb-4">Helpers</p>
            <h3 className="font-display text-xl mb-4">People ready to support</h3>
            {helpers.length === 0 && <p className="text-sm text-muted-foreground">No helpers yet — be the first.</p>}
            <div className="space-y-3">
              {helpers.map((h) => (
                <div key={h.id} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-background/60">
                  <div className="flex items-center gap-3">
                    <span className={`h-10 w-10 rounded-full bg-gradient-to-br ${h.color} grid place-items-center text-white text-xs font-semibold`}>{h.initials}</span>
                    <div>
                      <p className="font-semibold text-sm">{h.name}</p>
                      <p className="text-xs text-muted-foreground">{h.skills.slice(0, 3).join(", ")}</p>
                    </div>
                  </div>
                  <span className="chip">Trust {h.trust}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
