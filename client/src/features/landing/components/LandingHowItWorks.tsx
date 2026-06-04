import { LandingSection } from "@/features/landing/components/LandingSection";

const STEPS = [
  { n: 1, title: "Upload Knowledge", text: "Batch upload SOPs, regulatory documents, and site manuals in any format." },
  { n: 2, title: "Capture Expert Knowledge", text: "SMEs record quick voice notes or site observations that AI converts to facts." },
  { n: 3, title: "Add Incidents & Near Misses", text: "Connect your safety reporting system to ingest lessons from past events." },
  { n: 4, title: "AI Organizes Knowledge", text: "Our engine maps connections between tasks, risks, and required controls." },
  { n: 5, title: "SME Review & Approval", text: "Safety leaders vet AI-generated knowledge objects before field deployment." },
  { n: 6, title: "Field Teams Ask Before Work", text: "Workers get instant, trusted guidance on mobile or tablets at the point of risk.", highlight: true },
] as const;

export const LandingHowItWorks = () => (
  <LandingSection variant="soft" id="how-it-works">
    <div className="mb-12 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-blue-200">
        How it works
      </p>
      <h2 className="mt-2 text-3xl font-semibold md:text-4xl">
        6-Step Safety Intelligence Pipeline
      </h2>
      <p className="mt-3 text-slate-300">
        The path from raw documentation to field-ready protection.
      </p>
    </div>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {STEPS.map((step) => (
        <div
          key={step.n}
          className="glass-panel relative rounded-xl p-6 pt-8 transition-colors hover:bg-white/10"
        >
          <div
            className={`absolute -left-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full font-bold text-white ${
              "highlight" in step && step.highlight
                ? "bg-safety-brand shadow-lg shadow-blue-900/40"
                : "bg-safety-deep ring-2 ring-white/20"
            }`}
          >
            {step.n}
          </div>
          <h4 className="mb-2 font-bold">{step.title}</h4>
          <p className="text-sm text-slate-300">{step.text}</p>
        </div>
      ))}
    </div>
  </LandingSection>
);
