import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import RequestCard from "@/components/RequestCard";
import { useStore } from "@/lib/useStore";

export default function Home() {
  const { store } = useStore();
  const featured = store.requests.slice(0, 3);

  return (
    <>
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 mb-16">
        <section className="surface-card p-8 md:p-12 animate-fade-up">
          <p className="eyebrow mb-5">SMIT Grand Coding Night 2026</p>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.02] mb-5">
            Find help faster.<br />Become help that matters.
          </h1>
          <p className="text-muted-foreground max-w-xl mb-8">
            HelpHub AI is a community-powered support network for students, mentors, creators, and builders. Ask for help, offer help, track impact, and let AI surface smarter matches across the platform.
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            <Link to="/dashboard" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary-glow transition-colors">
              Open product demo
            </Link>
            <Link to="/create" className="px-6 py-3 rounded-full bg-background border border-border font-medium hover:bg-accent transition-colors">
              Post a request
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { k: "Members", v: "384+", d: "Students, mentors, and helpers in the loop." },
              { k: "Requests", v: "72+", d: "Support posts shared across learning journeys." },
              { k: "Solved", v: "69+", d: "Problems resolved through fast community action." },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl bg-background/60 border border-border p-5">
                <p className="eyebrow mb-2">{s.k}</p>
                <p className="font-display text-3xl mb-2">{s.v}</p>
                <p className="text-xs text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="surface-ink p-8 md:p-10 relative overflow-hidden animate-fade-up">
          <div className="absolute top-8 right-8 h-16 w-16 rounded-full bg-amber-300 animate-float" />
          <p className="eyebrow-light mb-5">Live product feel</p>
          <h2 className="font-display text-3xl md:text-4xl leading-tight mb-4">More than a form. More like an ecosystem.</h2>
          <p className="text-primary-foreground/70 text-sm mb-8">
            A polished multi-page experience inspired by product platforms, with AI summaries, trust scores, contribution signals, notifications, and leaderboard momentum built directly in HTML, CSS, JavaScript, and LocalStorage.
          </p>
          <div className="space-y-3">
            {[
              { t: "AI request intelligence", d: "Auto-categorization, urgency detection, tags, rewrite suggestions, and trend snapshots." },
              { t: "Community trust graph", d: "Badges, helper rankings, trust score boosts, and visible contribution history." },
              { t: "100%", d: "Top trust score currently active across the sample mentor network." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 p-4">
                <p className="font-semibold mb-1">{c.t}</p>
                <p className="text-xs text-primary-foreground/70">{c.d}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <section className="mb-16">
        <p className="eyebrow mb-3">Core flow</p>
        <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
          <h2 className="font-display text-3xl md:text-5xl">From struggling alone to solving together</h2>
          <Link to="/onboarding" className="px-5 py-2.5 rounded-full bg-background border border-border text-sm font-medium hover:bg-accent">Try onboarding AI</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { t: "Ask for help clearly", d: "Create structured requests with category, urgency, AI suggestions, and tags that attract the right people." },
            { t: "Discover the right people", d: "Use the explore feed, helper lists, notifications, and messaging to move quickly once a match happens." },
            { t: "Track real contribution", d: "Trust scores, badges, solved requests, and rankings help the community recognize meaningful support." },
          ].map((c) => (
            <div key={c.t} className="surface-card p-6">
              <p className="font-display text-xl mb-3">{c.t}</p>
              <p className="text-sm text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="eyebrow mb-3">Featured requests</p>
        <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
          <h2 className="font-display text-3xl md:text-5xl">Community problems currently in motion</h2>
          <Link to="/explore" className="px-5 py-2.5 rounded-full bg-background border border-border text-sm font-medium hover:bg-accent">View full feed</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {featured.map((r) => (
            <RequestCard key={r.id} request={r} author={store.users.find((u) => u.id === r.authorId)} />
          ))}
        </div>
      </section>
    </>
  );
}
