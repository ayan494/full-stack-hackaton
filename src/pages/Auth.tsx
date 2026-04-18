import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/lib/useStore";
import type { Role } from "@/lib/store";

export default function Auth() {
  const { store, setStore } = useStore();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(store.users[0].id);
  const [role, setRole] = useState<Role>("Both");
  const [email, setEmail] = useState("community@helphub.ai");
  const [pw, setPw] = useState("password");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStore((s) => ({ ...s, session: { userId, role } }));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-6">
        <section className="surface-ink p-10 md:p-14 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-primary/30 blur-3xl" />
          <p className="eyebrow-light mb-5">Community access</p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight mb-5">Enter the support network.</h1>
          <p className="text-primary-foreground/70 mb-8">Choose a demo identity, set your role, and jump into a multi-page product flow designed for asking, offering, and tracking help with a premium interface.</p>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li>• Role-based entry for Need Help, Can Help, or Both</li>
            <li>• Direct path into dashboard, requests, AI Center, and community feed</li>
            <li>• Persistent demo session powered by LocalStorage</li>
          </ul>
        </section>

        <form onSubmit={submit} className="surface-card p-10 md:p-12">
          <p className="eyebrow mb-5">Login / Signup</p>
          <h2 className="font-display text-3xl md:text-4xl leading-tight mb-8">Authenticate your community profile</h2>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium block mb-2">Select demo user</label>
              <select value={userId} onChange={(e) => setUserId(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-border bg-background">
                {store.users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Role selection</label>
              <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="w-full px-4 py-3 rounded-2xl border border-border bg-background">
                <option>Need Help</option><option>Can Help</option><option>Both</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-border bg-background" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Password</label>
                <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-border bg-background" />
              </div>
            </div>
            <button type="submit" className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary-glow transition-colors">
              Continue to dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
