const STEPS = [
  { n: 1, title: "Upload Knowledge", text: "Batch upload SOPs, regulatory documents, and site manuals in any format." },
  { n: 2, title: "Capture Expert Knowledge", text: "SMEs record quick voice notes or site observations that AI converts to facts." },
  { n: 3, title: "Add Incidents & Near Misses", text: "Connect your safety reporting system to ingest lessons from past events." },
  { n: 4, title: "AI Organizes Knowledge", text: "Our engine maps connections between tasks, risks, and required controls." },
  { n: 5, title: "SME Review & Approval", text: "Safety leaders vet AI-generated knowledge objects before field deployment." },
  { n: 6, title: "Field Teams Ask Before Work", text: "Workers get instant, trusted guidance on mobile or tablets at the point of risk.", highlight: true },
] as const;

export const LandingHowItWorks = () => (
  <section className="industrial-grid bg-safety-surface py-16" id="how-it-works">
    <div className="mx-auto max-w-[1440px] px-6">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-semibold text-safety-ink md:text-4xl">
          6-Step Safety Intelligence Pipeline
        </h2>
        <p className="text-safety-muted">
          The path from raw documentation to field-ready protection.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step) => (
          <div
            key={step.n}
            className="relative rounded-xl border border-safety-outline bg-white p-6 shadow-soft"
          >
            <div
              className={`absolute -left-4 -top-4 flex h-10 w-10 items-center justify-center rounded-full font-bold text-white ${
                "highlight" in step && step.highlight
                  ? "bg-safety-brand shadow-lg shadow-safety-brand/30"
                  : "bg-safety-ink"
              }`}
            >
              {step.n}
            </div>
            <h4 className="mb-2 font-bold text-safety-ink">{step.title}</h4>
            <p className="text-sm text-safety-muted">{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
