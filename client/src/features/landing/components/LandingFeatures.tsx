import { MaterialIcon } from "@/components/brand/MaterialIcon";

const FEATURES = [
  { icon: "forum", title: "AI Safety Assistant", text: "Natural language chat providing immediate, cited safety guidance." },
  { icon: "assignment_late", title: "Incident Prevention Briefs", text: "Dynamic shift briefings based on the day's tasks and known risks." },
  { icon: "camera", title: "Field Image Analysis", text: "Computer vision to check PPE or equipment conditions from photos." },
  { icon: "mic", title: "Voice Knowledge Notes", text: "Hands-free knowledge capture for workers in the field." },
  { icon: "analytics", title: "Incident Capture", text: "Streamlined reporting that feeds directly into the safety knowledge base." },
  { icon: "verified_user", title: "SME Review Workflow", text: "Human-in-the-loop validation for all AI safety outputs." },
  { icon: "warning", title: "Conflict Detection", text: "AI flags contradictions between older SOPs and new regulations." },
  { icon: "domain", title: "Staff & Site Management", text: "Granular control over which sites and teams access specific knowledge." },
] as const;

export const LandingFeatures = () => (
  <section className="bg-white py-16" id="features">
    <div className="mx-auto max-w-[1440px] px-6">
      <h2 className="mb-12 text-center text-3xl font-semibold text-safety-ink md:text-4xl">
        Enterprise Features for High-Stakes Teams
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-safety-surface text-safety-brand">
              <MaterialIcon name={feature.icon} />
            </div>
            <h4 className="font-bold text-safety-ink">{feature.title}</h4>
            <p className="text-sm text-safety-muted">{feature.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
