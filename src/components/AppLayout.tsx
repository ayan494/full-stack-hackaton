import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useStore } from "@/lib/useStore";
import { useMemo } from "react";

const allLinks = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/ai-center", label: "AI Center" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/create", label: "Create Request" },
  { to: "/messages", label: "Messages" },
  { to: "/notifications", label: "Notifications" },
  { to: "/profile", label: "Profile" },
];

export default function AppLayout() {
  const { currentUser, store } = useStore();
  const location = useLocation();

  // Show different nav items per page to mirror the reference UI
  const links = useMemo(() => {
    const path = location.pathname;
    if (path === "/") return allLinks.filter((l) => ["/", "/explore", "/leaderboard", "/ai-center"].includes(l.to));
    if (path.startsWith("/explore") || path.startsWith("/request")) return allLinks.filter((l) => ["/dashboard", "/explore", "/leaderboard", "/notifications"].includes(l.to));
    if (path === "/messages") return allLinks.filter((l) => ["/dashboard", "/explore", "/messages"].includes(l.to));
    if (path === "/leaderboard") return allLinks.filter((l) => ["/dashboard", "/explore", "/leaderboard"].includes(l.to));
    if (path === "/notifications") return allLinks.filter((l) => ["/dashboard", "/explore", "/notifications"].includes(l.to));
    if (path === "/profile") return allLinks.filter((l) => ["/dashboard", "/onboarding", "/profile"].includes(l.to) || l.to === "/profile" || l.to === "/dashboard");
    if (path === "/ai-center") return allLinks.filter((l) => ["/dashboard", "/create", "/ai-center"].includes(l.to));
    if (path === "/create") return allLinks.filter((l) => ["/dashboard", "/explore", "/create"].includes(l.to));
    if (path === "/dashboard") return allLinks.filter((l) => ["/dashboard", "/explore", "/leaderboard", "/ai-center"].includes(l.to));
    return allLinks.slice(0, 4);
  }, [location.pathname]);

  const unread = store.notifications.filter((n) => !n.read).length;
  const isHome = location.pathname === "/";
  const isAuth = location.pathname === "/auth";

  if (isAuth) return <Outlet />;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container flex items-center justify-between py-4">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-primary-foreground font-display text-lg shadow-[var(--shadow-soft)]">
              H
            </div>
            <span className="font-display text-lg">HelpHub AI</span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm transition-all ${
                    isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {l.label}
                {l.to === "/notifications" && unread > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center text-[10px] h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground">{unread}</span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isHome ? (
              <>
                <span className="hidden md:inline-flex chip-outline">Live community signals</span>
                <NavLink to="/auth" className="inline-flex items-center px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-glow transition-colors">
                  Join the platform
                </NavLink>
              </>
            ) : (
              <NavLink to="/profile" className="flex items-center gap-2 pr-1 pl-1 py-1 rounded-full border border-border bg-card hover:bg-accent transition-colors">
                <span className={`h-8 w-8 rounded-full bg-gradient-to-br ${currentUser.color} grid place-items-center text-white text-xs font-semibold`}>
                  {currentUser.initials}
                </span>
                <span className="hidden sm:inline text-sm pr-3">{currentUser.name.split(" ")[0]}</span>
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="container py-10">
        <Outlet />
      </main>

      <footer className="container py-12 text-sm text-muted-foreground text-center">
        HelpHub AI is built as a premium-feel, multi-page community support product using HTML, CSS, JavaScript, and LocalStorage.
      </footer>
    </div>
  );
}
