import { useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";

const steps = [
  { title: "Tell us your role", desc: "Are you here to ask, to help, or both? Your role unlocks the right surfaces immediately." },
  { title: "Share your skills", desc: "Add tools and topics you're confident with so the matching engine can route work to you." },
  { title: "Set your community goals", desc: "Pick interests and contribution targets — leaderboard momentum starts from day one." },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);

  return (
    <>
      <PageHero
        eyebrow="Onboarding AI"
        title="Get matched faster with a guided start."
        description="A short three-step flow tunes your profile so the platform knows exactly how to support you."
      />

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
        <aside className="surface-card p-7 md:p-10">
          <p className="eyebrow mb-3">Progress</p>
          <h3 className="font-display text-2xl mb-6">Step {step + 1} of {steps.length}</h3>
          <div className="space-y-3">
            {steps.map((s, i) => (
              <button key={s.title} onClick={() => setStep(i)} className={`w-full text-left p-4 rounded-2xl border transition-colors ${i === step ? "border-primary bg-accent" : "border-border bg-background/60 hover:bg-accent"}`}>
                <p className="font-semibold text-sm">{i + 1}. {s.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
              </button>
            ))}
          </div>
        </aside>

        <section className="surface-card p-7 md:p-12">
          <p className="eyebrow mb-3">Step {step + 1}</p>
          <h2 className="font-display text-4xl mb-4">{steps[step].title}</h2>
          <p className="text-muted-foreground mb-8">{steps[step].desc}</p>

          {step === 0 && (
            <div className="grid sm:grid-cols-3 gap-3">
              {["Need Help", "Can Help", "Both"].map((r) => (
                <button key={r} className="p-5 rounded-2xl border border-border bg-background/60 hover:bg-accent text-left">
                  <p className="font-semibold">{r}</p>
                  <p className="text-xs text-muted-foreground mt-1">{r === "Both" ? "Best for active members" : r === "Can Help" ? "Mentor / contributor" : "Learner / requester"}</p>
                </button>
              ))}
            </div>
          )}
          {step === 1 && (
            <div className="flex flex-wrap gap-2">
              {["React","Figma","HTML/CSS","Python","Git/GitHub","UI/UX","Career Guidance","Data"].map((s) => (
                <button key={s} className="chip-outline hover:bg-accent">{s}</button>
              ))}
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              {["Hackathons","Open Source","Career growth","Community building","Research"].map((g) => (
                <label key={g} className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-background/60 cursor-pointer hover:bg-accent">
                  <input type="checkbox" className="accent-primary" />
                  <span className="font-medium">{g}</span>
                </label>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-10">
            <button onClick={() => setStep(Math.max(0, step - 1))} className="px-5 py-2.5 rounded-full bg-background border border-border text-sm font-medium hover:bg-accent" disabled={step === 0}>Back</button>
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(step + 1)} className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary-glow">Continue</button>
            ) : (
              <Link to="/dashboard" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary-glow">Finish onboarding</Link>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
