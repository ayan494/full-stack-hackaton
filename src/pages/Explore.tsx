import { useMemo, useState } from "react";
import PageHero from "@/components/PageHero";
import RequestCard from "@/components/RequestCard";
import { useStore } from "@/lib/useStore";

export default function Explore() {
  const { store } = useStore();
  const [category, setCategory] = useState("All");
  const [urgency, setUrgency] = useState("All");
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");

  const categories = ["All", ...Array.from(new Set(store.requests.map((r) => r.category)))];

  const filtered = useMemo(() => {
    return store.requests.filter((r) => {
      const author = store.users.find((u) => u.id === r.authorId);
      if (category !== "All" && r.category !== category) return false;
      if (urgency !== "All" && r.urgency !== urgency) return false;
      if (skill && !r.tags.some((t) => t.toLowerCase().includes(skill.toLowerCase()))) return false;
      if (location && !author?.location.toLowerCase().includes(location.toLowerCase())) return false;
      return true;
    });
  }, [store, category, urgency, skill, location]);

  return (
    <>
      <PageHero
        eyebrow="Explore / Feed"
        title="Browse help requests with filterable community context."
        description="Filter by category, urgency, skills, and location to surface the best matches."
      />

      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <aside className="surface-card p-7 h-fit sticky top-24">
          <p className="eyebrow mb-3">Filters</p>
          <h3 className="font-display text-2xl mb-6">Refine the feed</h3>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium block mb-2">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-border bg-background">
                {categories.map((c) => <option key={c}>{c === "All" ? "All categories" : c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Urgency</label>
              <select value={urgency} onChange={(e) => setUrgency(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-border bg-background">
                <option>All</option><option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Skills</label>
              <input value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="React, Figma, Git/GitHub" className="w-full px-4 py-3 rounded-2xl border border-border bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Karachi, Lahore, Remote" className="w-full px-4 py-3 rounded-2xl border border-border bg-background" />
            </div>
          </div>
        </aside>

        <div className="space-y-5">
          {filtered.length === 0 && (
            <div className="surface-card p-10 text-center text-muted-foreground">No requests match your filters.</div>
          )}
          {filtered.map((r) => (
            <RequestCard key={r.id} request={r} author={store.users.find((u) => u.id === r.authorId)} />
          ))}
        </div>
      </div>
    </>
  );
}
