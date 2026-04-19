import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "sonner";

import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.isLogin ?? true);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Both");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin ? { email, password } : { name, email, password, role };
      
      const { data } = await api.post(endpoint, payload);
      
      if (!isLogin) {
        toast.success("Account created successfully! Please login.");
        setIsLogin(true);
        setPassword(""); // Clear password for security
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      window.dispatchEvent(new Event("storage"));
      
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-background">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-6 relative">
        <section className="surface-ink p-10 md:p-14 relative overflow-hidden flex flex-col justify-center">
          <Link to="/" className="absolute top-8 left-10 inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors font-medium">
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <div className="mt-8">
            <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
            <p className="eyebrow-light mb-5">Community access</p>
            <h1 className="font-display text-4xl md:text-5xl leading-tight mb-5">Enter the support network.</h1>
          <p className="text-primary-foreground/70 mb-8">Join a multi-page product flow designed for asking, offering, and tracking help with a premium interface.</p>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li>• JWT-based secure authentication</li>
            <li>• Role-based entry for Need Help, Can Help, or Both</li>
            <li>• Real-time community updates and messaging</li>
          </ul>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="surface-card p-10 md:p-12">
          <p className="eyebrow mb-5">{isLogin ? "Login" : "Signup"}</p>
          <h2 className="font-display text-3xl md:text-4xl leading-tight mb-8">
            {isLogin ? "Welcome back" : "Create your profile"}
          </h2>
          <div className="space-y-5">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium block mb-2">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ayesha Khan" className="w-full px-4 py-3 rounded-2xl border border-border bg-background" required />
              </div>
            )}
            <div>
              <label className="text-sm font-medium block mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-3 rounded-2xl border border-border bg-background" required />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-background pr-12" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {!isLogin && (
              <div>
                <label className="text-sm font-medium block mb-2">Role selection</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-border bg-background">
                  <option>Need Help</option><option>Can Help</option><option>Both</option>
                </select>
              </div>
            )}
            <button type="submit" className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary-glow transition-colors">
              {isLogin ? "Continue to dashboard" : "Create account"}
            </button>
            <p className="text-center text-sm mt-4">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary font-semibold">
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
