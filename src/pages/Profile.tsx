import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function Profile() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setCurrentUser(data);
        setName(data.name);
        setLocation(data.location || "");
        setSkills(data.skills?.join(", ") || "");
        setInterests(data.interests?.join(", ") || "");
      } catch (error) {
        console.error("Profile fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        location,
        skills: skills.split(",").map((x) => x.trim()).filter(Boolean),
        interests: interests.split(",").map((x) => x.trim()).filter(Boolean),
      };
      const { data } = await api.post("/auth/profile", payload);
      setCurrentUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      toast.success("Profile updated.");
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  if (loading || !currentUser) return <div className="p-20 text-center">Loading profile...</div>;

  return (
    <>
      <section className="surface-ink p-8 md:p-12 mb-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-primary/30 blur-3xl" />
        <p className="eyebrow-light mb-3">Profile</p>
        <h1 className="font-display text-5xl md:text-6xl">{currentUser.name}</h1>
        <p className="text-primary-foreground/70 mt-3">{currentUser.role} • {currentUser.location || "Location not set"}</p>
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="surface-card p-7 md:p-10">
          <p className="eyebrow mb-3">Public profile</p>
          <h2 className="font-display text-3xl mb-6">Skills and reputation</h2>
          <div className="flex items-baseline justify-between border-b border-border pb-4 mb-4">
            <span className="text-sm">Trust score</span>
            <span className="font-display text-2xl">{currentUser.trustScore || 0}%</span>
          </div>
          <div className="flex items-baseline justify-between border-b border-border pb-4 mb-6">
            <span className="text-sm">Contributions</span>
            <span className="font-display text-2xl">{currentUser.contributions || 0}</span>
          </div>
          <p className="text-sm font-medium mb-3">Skills</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {currentUser.skills?.map((s: string) => <span key={s} className="chip">{s}</span>) || <span className="text-muted-foreground text-xs italic">No skills listed</span>}
          </div>
          <p className="text-sm font-medium mb-3">Badges</p>
          <div className="flex flex-wrap gap-2">
            {currentUser.badges?.map((b: string) => <span key={b} className="chip">{b}</span>) || <span className="text-muted-foreground text-xs italic">No badges earned yet</span>}
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
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/";
              }}
              className="w-full py-4 rounded-full bg-rose-500/10 text-rose-500 font-semibold hover:bg-rose-500/20 transition-colors mt-2"
            >
              Sign out
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
