import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<any>(JSON.parse(localStorage.getItem("user") || "{}"));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Listen for storage changes to update UI on login/profile update
    const handleStorage = () => {
      setCurrentUser(JSON.parse(localStorage.getItem("user") || "{}"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const links = useMemo(() => {
    const path = location.pathname;
    if (path === "/") return allLinks.filter((l) => ["/", "/explore", "/leaderboard", "/ai-center"].includes(l.to));
    if (path.startsWith("/explore") || path.startsWith("/request")) return allLinks.filter((l) => ["/", "/dashboard", "/explore", "/leaderboard", "/notifications"].includes(l.to));
    if (path === "/messages") return allLinks.filter((l) => ["/", "/dashboard", "/explore", "/messages"].includes(l.to));
    if (path === "/leaderboard") return allLinks.filter((l) => ["/", "/dashboard", "/explore", "/leaderboard"].includes(l.to));
    if (path === "/notifications") return allLinks.filter((l) => ["/", "/dashboard", "/explore", "/notifications"].includes(l.to));
    if (path === "/profile") return allLinks.filter((l) => ["/", "/dashboard", "/onboarding", "/profile"].includes(l.to));
    if (path === "/ai-center") return allLinks.filter((l) => ["/", "/dashboard", "/create", "/ai-center"].includes(l.to));
    if (path === "/create") return allLinks.filter((l) => ["/", "/dashboard", "/explore", "/create"].includes(l.to));
    if (path === "/dashboard") return allLinks.filter((l) => ["/", "/dashboard", "/explore", "/leaderboard", "/ai-center"].includes(l.to));
    return allLinks.filter((l) => ["/", "/explore", "/leaderboard", "/ai-center"].includes(l.to));
  }, [location.pathname]);

  const unread = 0; // Simplified for demo
  const isHome = location.pathname === "/";
  const isAuth = location.pathname === "/auth";

  if (isAuth) return <Outlet />;

  return (
    <div className="min-h-screen relative">
      <header className="sticky top-0 md:top-4 z-50 md:mx-6 lg:mx-8 md:mb-8 transition-all duration-300">
        <div className="bg-white/90 md:bg-white/50 backdrop-blur-2xl border-b md:border border-border/50 md:border-white/60 md:shadow-[0_8px_32px_hsl(165_40%_15%/0.08)] md:rounded-3xl">
        <div className="container px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-accent/50 text-foreground hover:bg-accent transition-colors z-50"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 md:h-11 md:w-11 rounded-2xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-primary-foreground font-display text-lg shadow-[var(--shadow-soft)] group-hover:scale-105 transition-transform">
                H
              </div>
              <span className="font-display text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary">HelpHub AI</span>
            </NavLink>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-white text-foreground shadow-sm font-semibold border border-white/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-black/5"
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
            {currentUser?._id ? (
              <NavLink to="/profile" className="flex items-center gap-2 pr-1.5 pl-1.5 py-1.5 rounded-full bg-white/60 border border-white/60 shadow-sm hover:bg-white transition-all group">
                <span className={`h-8 w-8 rounded-full bg-gradient-to-br ${currentUser.color || "from-blue-500 to-indigo-500"} grid place-items-center text-white text-xs font-semibold shadow-inner group-hover:scale-105 transition-transform`}>
                  {currentUser.initials || "U"}
                </span>
                <span className="hidden sm:inline text-sm font-medium pr-3">{currentUser.name?.split(" ")[0] || "User"}</span>
              </NavLink>
            ) : (
              <>
                <NavLink to="/auth" state={{ isLogin: true }} className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Login
                </NavLink>
                <NavLink to="/auth" state={{ isLogin: false }} className="inline-flex items-center px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-glow transition-colors">
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-x-0 top-[73px] bottom-0 z-40 md:hidden overflow-hidden"
            >
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="absolute inset-0 bg-background/80 backdrop-blur-md"
              />
              
              {/* Menu Content */}
              <div className="relative bg-white border-b border-border p-6 shadow-2xl flex flex-col gap-4 w-full">
                <nav className="flex flex-col gap-2">
                  {links.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      end={l.to === "/"}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-5 py-4 rounded-2xl text-base transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "bg-accent/30 text-muted-foreground hover:bg-accent hover:text-foreground"
                        }`
                      }
                    >
                      {l.label}
                      {l.to === "/notifications" && unread > 0 && (
                        <span className="inline-flex items-center justify-center text-[10px] h-5 min-w-5 px-1.5 rounded-full bg-primary-glow text-white font-bold">{unread}</span>
                      )}
                    </NavLink>
                  ))}
                </nav>
                
                <div className="pt-4 border-t border-border/50">
                  {currentUser?._id ? (
                    <NavLink
                      to="/profile"
                      className="flex items-center gap-3 p-4 rounded-2xl bg-accent/20 border border-border/40"
                    >
                      <span className={`h-10 w-10 rounded-full bg-gradient-to-br ${currentUser.color || "from-blue-500 to-indigo-500"} grid place-items-center text-white text-sm font-semibold`}>
                        {currentUser.initials || "U"}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-medium">{currentUser.name || "User"}</span>
                        <span className="text-xs text-muted-foreground">My Profile</span>
                      </div>
                    </NavLink>
                  ) : (
                    <div className="flex flex-col gap-3 w-full">
                      <NavLink
                        to="/auth"
                        state={{ isLogin: true }}
                        className="flex items-center justify-center w-full px-5 py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/80 transition-colors"
                      >
                        Login
                      </NavLink>
                      <NavLink
                        to="/auth"
                        state={{ isLogin: false }}
                        className="flex items-center justify-center w-full px-5 py-4 rounded-2xl bg-primary text-primary-foreground font-medium hover:bg-primary-glow transition-colors"
                      >
                        Sign up
                      </NavLink>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </header>

      <main className="container px-4 sm:px-6 lg:px-8 py-10">
        <Outlet />
      </main>

      <footer className="container px-4 sm:px-6 lg:px-8 py-12 text-sm text-muted-foreground text-center" />
    </div>
  );
}
