import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "@/components/PageHero";
import { useStore } from "@/lib/useStore";
import type { Urgency } from "@/lib/store";
import { toast } from "sonner";

function detectUrgency(text: string): Urgency {
  const t = text.toLowerCase();
  if (/(today|tonight|asap|urgent|tomorrow|deadline|before)/.test(t)) return "High";
  if (/(this week|soon|by friday)/.test(t)) return "Medium";
  return "Low";
}

function detectCategory(text: string): string {
  const t = text.toLowerCase();
  if (/(react|html|css|portfolio|web|frontend|javascript)/.test(t)) return "Web Development";
  if (/(figma|design|poster|ui|ux)/.test(t)) return "Design";
  if (/(interview|career|internship|resume)/.test(t)) return "Career";
  if (/(python|data|ml|ai)/.test(t)) return "Data";
  return "Community";
}

function suggestTags(text: string): string[] {
  const t = text.toLowerCase();
  const tags: string[] = [];
  ["react","figma","html","css","python","portfolio","interview","career","frontend","poster","responsive"].forEach((k) => {
    if (t.includes(k)) tags.push(k.charAt(0).toUpperCase() + k.slice(1));
  });
  return tags.slice(0, 4);
}

export default function CreateRequest() {
  const { setStore, currentUser } = useStore();
  const navigate = useNavigate();
  const [title, setTitle] = useState("Need review on my JavaScript quiz app before submission");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("JavaScript, Debugging, Review");
  const [category, setCategory] = useState("Web Development");
  const [urgency, setUrgency] = useState<Urgency>("High");

  const aiCat = detectCategory(title + " " + desc);
  const aiUrg = detectUrgency(title + " " + desc);
  const aiTags = suggestTags(title + " " + desc);

  const apply = () => {
    setCategory(aiCat);
    setUrgency(aiUrg);
    if (aiTags.length) setTags(aiTags.join(", "));
    toast.success("AI suggestions applied.");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `r${Date.now()}`;
    setStore((s) => ({
      ...s,
      requests: [{
        id, title, description: desc || "No description provided.",
        category, urgency, status: "Open",
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        authorId: currentUser.id, helpersInterested: [], createdAt: Date.now(),
      }, ...s.requests],
      notifications: [{ id: `n${Date.now()}`, title: `Your request "${title}" is now live in the community feed`, type: "Request", when: "Just now", read: false }, ...s.notifications],
    }));
    toast.success("Request published.");
    navigate(`/request/${id}`);
  };

  return (
    <>
      <PageHero
        eyebrow="Create request"
        title="Turn a rough problem into a clear help request."
        description="Use built-in AI suggestions for category, urgency, tags, and a stronger description rewrite."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={submit} className="surface-card p-7 md:p-10">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium block mb-2">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-border bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Description</label>
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Explain the challenge, your current progress, deadline, and what kind of help would be useful." rows={6} className="w-full px-4 py-3 rounded-2xl border border-border bg-background resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Tags</label>
                <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-border bg-background" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-border bg-background">
                  <option>Web Development</option><option>Design</option><option>Career</option><option>Data</option><option>Community</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Urgency</label>
              <select value={urgency} onChange={(e) => setUrgency(e.target.value as Urgency)} className="w-full px-4 py-3 rounded-2xl border border-border bg-background">
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={apply} className="px-6 py-3 rounded-full bg-background border border-border font-medium hover:bg-accent transition-colors">Apply AI suggestions</button>
              <button type="submit" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary-glow transition-colors">Publish request</button>
            </div>
          </div>
        </form>

        <aside className="surface-card p-7 md:p-10">
          <p className="eyebrow mb-3">AI assistant</p>
          <h3 className="font-display text-3xl mb-8">Smart request guidance</h3>
          <div className="space-y-5">
            <Row k="Suggested category" v={aiCat} />
            <Row k="Detected urgency" v={aiUrg} />
            <Row k="Suggested tags" v={aiTags.length ? aiTags.join(", ") : "Add more detail for smarter tags"} />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Rewrite suggestion</p>
              <p className="font-medium">{desc.length > 20 ? `Try: "${title}. Context: ${desc.slice(0, 80)}…"` : "Start describing the challenge to generate a stronger version."}</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border pb-4">
      <span className="text-sm text-muted-foreground">{k}</span>
      <span className="font-semibold text-right">{v}</span>
    </div>
  );
}
