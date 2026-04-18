import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import RequestCard from "@/components/RequestCard";
import { useStore } from "@/lib/useStore";

export default function Dashboard() {
  const { store, currentUser } = useStore();
  const myRequests = store.requests.filter((r) => r.authorId === currentUser.id);
  const helpingOn = store.requests.filter((r) => r.helpersInterested.includes(currentUser.id));
  const solvedCount = store.requests.filter((r) => r.status === "Solved").length;

  return (
    <>
      <PageHero
        eyebrow={`Welcome back, ${currentUser.name.split(" ")[0]}`}
        title="Your support dashboard at a glance."
        description="Track requests you've posted, conversations you're part of, and the impact you're contributing to the community."
      >
        <div className="flex flex-wrap gap-3">
          <Link to="/create" className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary-glow transition-colors">Post a request</Link>
          <Link to="/explore" className="px-5 py-2.5 rounded-full bg-primary-foreground/10 text-primary-foreground font-medium hover:bg-primary-foreground/20 transition-colors border border-primary-foreground/20">Browse community</Link>
        </div>
      </PageHero>

      <div className="grid md:grid-cols-4 gap-5 mb-10">
        {[
          { k: "Trust score", v: `${currentUser.trust}%` },
          { k: "Contributions", v: currentUser.contributions },
          { k: "My requests", v: myRequests.length },
          { k: "Solved community-wide", v: solvedCount },
        ].map((s) => (
          <div key={s.k} className="surface-card p-6">
            <p className="eyebrow mb-3">{s.k}</p>
            <p className="font-display text-3xl">{s.v}</p>
          </div>
        ))}
      </div>

      <section className="mb-10">
        <h2 className="font-display text-3xl mb-5">My requests</h2>
        {myRequests.length === 0 ? (
          <div className="surface-card p-8 text-center text-muted-foreground">
            You haven't posted a request yet. <Link to="/create" className="text-primary font-medium">Create your first one →</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {myRequests.map((r) => <RequestCard key={r.id} request={r} author={currentUser} />)}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-3xl mb-5">Where I'm helping</h2>
        {helpingOn.length === 0 ? (
          <div className="surface-card p-8 text-center text-muted-foreground">No active help offers yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {helpingOn.map((r) => <RequestCard key={r.id} request={r} author={store.users.find((u) => u.id === r.authorId)} />)}
          </div>
        )}
      </section>
    </>
  );
}
