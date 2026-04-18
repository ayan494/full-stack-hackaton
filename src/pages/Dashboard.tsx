import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import RequestCard from "@/components/RequestCard";
import api from "@/lib/api";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<any>(JSON.parse(localStorage.getItem("user") || "{}"));
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [helpingOn, setHelpingOn] = useState<any[]>([]);
  const [stats, setStats] = useState({ trust: 0, contributions: 0, unsolved: 0, communitySolved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, myReqRes, allReqRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/requests/me"),
          api.get("/requests")
        ]);
        
        setCurrentUser(userRes.data);
        setMyRequests(myReqRes.data);
        
        // Stats calculation
        const communitySolved = allReqRes.data.filter((r: any) => r.status === "Solved").length;
        setStats({
          trust: userRes.data.trustScore || 0,
          contributions: userRes.data.contributions || 0,
          unsolved: myReqRes.data.filter((r: any) => r.status === "Open").length,
          communitySolved
        });

        // "Helping on" filter
        setHelpingOn(allReqRes.data.filter((r: any) => r.helpersInterested.includes(userRes.data._id)));

      } catch (error) {
        console.error("Dashboard fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-20 text-center">Loading dashboard...</div>;

  return (
    <>
      <PageHero
        eyebrow={`Welcome back, ${currentUser.name?.split(" ")[0] || "User"}`}
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
          { k: "Trust score", v: `${stats.trust}%` },
          { k: "Contributions", v: stats.contributions },
          { k: "My requests", v: myRequests.length },
          { k: "Solved community-wide", v: stats.communitySolved },
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
            {myRequests.map((r) => <RequestCard key={r._id} request={r} author={currentUser} />)}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-3xl mb-5">Where I'm helping</h2>
        {helpingOn.length === 0 ? (
          <div className="surface-card p-8 text-center text-muted-foreground">No active help offers yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {helpingOn.map((r) => <RequestCard key={r._id} request={r} author={r.createdBy} />)}
          </div>
        )}
      </section>
    </>
  );
}
