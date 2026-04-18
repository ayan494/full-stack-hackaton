import { useState, useEffect } from "react";
import PageHero from "@/components/PageHero";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";
import api from "@/lib/api";

export default function Messages() {
  const [currentUser, setCurrentUser] = useState<any>(JSON.parse(localStorage.getItem("user") || "{}"));
  const [toId, setToId] = useState("");
  const [body, setBody] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io(import.meta.env.VITE_SERVER_URL || "http://localhost:5000");
    setSocket(s);

    if (currentUser?._id) {
      s.emit("join", currentUser._id);
    }

    s.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // For demo/hackathon, we'll try to fetch some users to chat with
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/auth/me"); // In real app, get contacts
        // Mocking other users if no real contacts exist yet
        setUsers([
          { _id: "661234567890123456789012", name: "Ayesha Khan" },
          { _id: "661234567890123456789013", name: "Hassan Ali" }
        ].filter(u => u._id !== currentUser?._id));
      } catch (e) {}
    };
    fetchUsers();

    return () => {
      s.disconnect();
    };
  }, [currentUser?._id]);

  useEffect(() => {
    if (toId && currentUser?._id) {
      const fetchHistory = async () => {
        try {
          const { data } = await api.get(`/messages/${toId}`);
          setMessages(data);
        } catch (e) {
          console.error("Failed to fetch history", e);
        }
      };
      fetchHistory();
    }
  }, [toId, currentUser?._id]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || !toId || !socket) return;
    
    socket.emit("sendMessage", {
      sender: currentUser._id,
      receiver: toId,
      message: body
    });
    
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
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {messages.length === 0 && <p className="text-muted-foreground">Select a user and start chatting.</p>}
            {messages.map((m) => (
              <div key={m._id || Math.random()} className={`rounded-2xl border border-border p-5 ${m.sender === currentUser?._id ? "bg-primary/10" : "bg-background/60"}`}>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="font-semibold text-sm">
                    {m.sender === currentUser?._id ? "You" : (users.find(u => u._id === m.sender)?.name || "Them")}
                  </p>
                  <span className="chip whitespace-nowrap">{new Date(m.timestamp || m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <p className="text-sm text-muted-foreground">{m.message}</p>
              </div>
            ))}
          </div>
        </section>

        <form onSubmit={send} className="surface-card p-7 md:p-10">
          <p className="eyebrow mb-3">Send message</p>
          <h2 className="font-display text-3xl mb-6">Start a conversation</h2>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium block mb-2">To</label>
              <select value={toId} onChange={(e) => setToId(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-border bg-background">
                <option value="">Select a user</option>
                {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Message</label>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share support details, ask for files, or suggest next steps." rows={6} className="w-full px-4 py-3 rounded-2xl border border-border bg-background resize-none" />
            </div>
            <button type="submit" disabled={!toId} className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary-glow transition-colors disabled:opacity-50">Send</button>
          </div>
        </form>
      </div>
    </>
  );
}
