import { useState } from "react";
import PageHero from "@/components/PageHero";
import { useStore } from "@/lib/useStore";
import { toast } from "sonner";

export default function Messages() {
  const { store, setStore, currentUser } = useStore();
  const [toId, setToId] = useState(store.users.find((u) => u.id !== currentUser.id)?.id ?? "");
  const [body, setBody] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setStore((s) => ({
      ...s,
      messages: [...s.messages, { id: `m${Date.now()}`, fromId: currentUser.id, toId, body, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }],
    }));
    setBody("");
    toast.success("Message sent.");
  };

  return (
    <>
      <PageHero
        eyebrow="Interaction / Messaging"
        title="Keep support moving through direct communication."
        description="Basic messaging gives helpers and requesters a clear follow-up path once a match happens."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="surface-card p-7 md:p-10">
          <p className="eyebrow mb-3">Conversation stream</p>
          <h2 className="font-display text-3xl mb-6">Recent messages</h2>
          <div className="space-y-4">
            {store.messages.map((m) => {
              const from = store.users.find((u) => u.id === m.fromId);
              const to = store.users.find((u) => u.id === m.toId);
              return (
                <div key={m.id} className="rounded-2xl border border-border p-5 bg-background/60">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="font-semibold text-sm">{from?.name} → {to?.name}</p>
                    <span className="chip whitespace-nowrap">{m.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{m.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        <form onSubmit={send} className="surface-card p-7 md:p-10">
          <p className="eyebrow mb-3">Send message</p>
          <h2 className="font-display text-3xl mb-6">Start a conversation</h2>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium block mb-2">To</label>
              <select value={toId} onChange={(e) => setToId(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-border bg-background">
                {store.users.filter((u) => u.id !== currentUser.id).map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Message</label>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share support details, ask for files, or suggest next steps." rows={6} className="w-full px-4 py-3 rounded-2xl border border-border bg-background resize-none" />
            </div>
            <button type="submit" className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary-glow transition-colors">Send</button>
          </div>
        </form>
      </div>
    </>
  );
}
