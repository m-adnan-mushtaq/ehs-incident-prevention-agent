import { MaterialIcon } from "@/components/brand/MaterialIcon";
import { LandingSection } from "@/features/landing/components/LandingSection";

const FEATURES = [
  { icon: "forum", title: "AI Safety Assistant", text: "Natural language chat with cited safety guidance." },
  { icon: "assignment_late", title: "Incident Prevention Briefs", text: "Dynamic shift briefings based on tasks and risks." },
  { icon: "camera", title: "Field Image Analysis", text: "Check PPE or equipment conditions from photos." },
  { icon: "mic", title: "Voice Knowledge Notes", text: "Hands-free knowledge capture for field workers." },
  { icon: "verified_user", title: "SME Review Workflow", text: "Human validation for all AI safety outputs." },
  { icon: "warning", title: "Conflict Detection", text: "Flags contradictions between SOPs and regulations." },
] as const;

export const LandingFeatures = () => (
  <LandingSection variant="white" id="features">
    <div className="mb-12 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-safety-brand">
        Platform capabilities
      </p>
      <h2 className="mt-2 text-3xl font-semibold text-safety-ink md:text-4xl">
        Built for high-stakes field teams
      </h2>
    </div>
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map((feature) => (
        <div
          key={feature.title}
          className="group rounded-xl border border-safety-outline bg-gradient-to-b from-white to-safety-surface/50 p-6 shadow-soft transition-all hover:border-safety-brand/30 hover:shadow-md"
        >
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-safety-brand/10 text-safety-brand transition-colors group-hover:bg-safety-brand group-hover:text-white">
            <MaterialIcon name={feature.icon} />
          </div>
          <h4 className="font-bold text-safety-ink">{feature.title}</h4>
          <p className="mt-2 text-sm text-safety-muted">{feature.text}</p>
        </div>
      ))}
    </div>
  </LandingSection>
);
