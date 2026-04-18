import { useState } from "react";
import { useStore } from "@/lib/useStore";
import { toast } from "sonner";

export default function Profile() {
  const { currentUser, setStore } = useStore();
  const [name, setName] = useState(currentUser.name);
  const [location, setLocation] = useState(currentUser.location);
  const [skills, setSkills] = useState(currentUser.skills.join(", "));
  const [interests, setInterests] = useState(currentUser.interests.join(", "));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setStore((s) => ({
      ...s,
      users: s.users.map((u) => u.id === currentUser.id ? {
        ...u, name, location,
        skills: skills.split(",").map((x) => x.trim()).filter(Boolean),
        interests: interests.split(",").map((x) => x.trim()).filter(Boolean),
      } : u),
    }));
    toast.success("Profile updated.");
  };

  return (
    <>
      <section className="surface-ink p-8 md:p-12 mb-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-primary/30 blur-3xl" />
        <p className="eyebrow-light mb-3">Profile</p>
        <h1 className="font-display text-5xl md:text-6xl">{currentUser.name}</h1>
        <p className="text-primary-foreground/70 mt-3">Both • {currentUser.location}</p>
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="surface-card p-7 md:p-10">
          <p className="eyebrow mb-3">Public profile</p>
          <h2 className="font-display text-3xl mb-6">Skills and reputation</h2>
          <div className="flex items-baseline justify-between border-b border-border pb-4 mb-4">
            <span className="text-sm">Trust score</span>
            <span className="font-display text-2xl">{currentUser.trust}%</span>
          </div>
          <div className="flex items-baseline justify-between border-b border-border pb-4 mb-6">
            <span className="text-sm">Contributions</span>
            <span className="font-display text-2xl">{currentUser.contributions}</span>
          </div>
          <p className="text-sm font-medium mb-3">Skills</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {currentUser.skills.map((s) => <span key={s} className="chip">{s}</span>)}
          </div>
          <p className="text-sm font-medium mb-3">Badges</p>
          <div className="flex flex-wrap gap-2">
            {currentUser.badges.map((b) => <span key={b} className="chip">{b}</span>)}
          </div>
        </section>

        <form onSubmit={save} className="surface-card p-7 md:p-10">
          <p className="eyebrow mb-3">Edit profile</p>
          <h2 className="font-display text-3xl mb-6">Update your identity</h2>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-border bg-background" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Location</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-border bg-background" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Skills</label>
              <input value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-border bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Interests</label>
              <input value={interests} onChange={(e) => setInterests(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-border bg-background" />
            </div>
            <button type="submit" className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary-glow transition-colors">Save profile</button>
          </div>
        </form>
      </div>
    </>
  );
}
