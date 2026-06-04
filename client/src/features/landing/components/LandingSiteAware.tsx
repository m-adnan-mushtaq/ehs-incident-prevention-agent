import { MaterialIcon } from "@/components/brand/MaterialIcon";

const KNOWLEDGE_LAYERS = [
  { icon: "public", title: "Global Guidance", text: "Industry standard regulations (OSHA, ISO) integrated as your baseline safety foundation." },
  { icon: "corporate_fare", title: "Company Policies", text: "Standardized safety protocols that apply to every facility in your enterprise." },
  { icon: "factory", title: "Site-Specific SOPs", text: "Precise operating procedures unique to specific equipment or local plant environments." },
  { icon: "history", iconTone: "text-safety-error", title: "Incident Lessons", text: "Automated integration of post-incident reports to ensure mistakes aren't repeated." },
  { icon: "voice_chat", iconTone: "text-safety-amber", title: "Expert Knowledge", text: "Captured tips from SMEs via voice notes and observations converted into intelligence." },
  { icon: "verified", iconTone: "text-safety-success", title: "Approved Knowledge Objects", text: "Every fact is a vetted knowledge object verified by your safety leadership team." },
] as const;

const TRUST_PILLARS = [
  "Tenant Isolation",
  "Site-aware Retrieval",
  "Approved Knowledge",
  "Role-based Access",
  "Source Citations",
] as const;

export const LandingSiteAware = () => (
  <section className="border-y border-safety-outline bg-white py-16">
    <div className="mx-auto max-w-[1440px] px-6">
      <h2 className="mb-12 text-center text-3xl font-semibold text-safety-ink md:text-4xl">
        Global guidance, company knowledge, and site-specific rules in one
        assistant
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {KNOWLEDGE_LAYERS.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-safety-outline bg-safety-surface p-6 transition-all hover:border-safety-brand"
          >
            <MaterialIcon
              name={item.icon}
              className={
                "iconTone" in item && item.iconTone
                  ? `mb-4 ${item.iconTone}`
                  : "mb-4 text-safety-brand"
              }
            />
            <h4 className="mb-2 font-bold text-safety-ink">{item.title}</h4>
            <p className="text-sm text-safety-muted">{item.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-safety-outline bg-safety-panel p-8">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-safety-muted">
              Global Intelligence Example
            </span>
            <span className="rounded border border-safety-outline bg-white px-2 py-1 text-[10px] font-bold">
              Standard
            </span>
          </div>
          <div className="space-y-4">
            <div className="max-w-[90%] rounded-lg border border-safety-outline/50 bg-white p-4 shadow-sm">
              <p className="text-sm text-safety-ink">
                &quot;What are the general rules for working at height?&quot;
              </p>
            </div>
            <div className="ml-auto max-w-[90%] rounded-lg border border-safety-brand/20 bg-safety-brand/5 p-4">
              <p className="text-sm text-safety-ink">
                &quot;According to OSHA 1910.28, fall protection is required at 4
                feet in general industry...&quot;
              </p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-safety-brand/20 bg-white p-8 shadow-lg">
          <MaterialIcon
            name="location_searching"
            className="absolute right-2 top-2 text-6xl text-safety-brand opacity-20"
          />
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-safety-brand">
              Site-Aware Example
            </span>
            <span className="rounded bg-safety-brand px-2 py-1 text-[10px] font-bold text-white">
              Plant A: Line 4
            </span>
          </div>
          <div className="space-y-4">
            <div className="max-w-[90%] rounded-lg border border-safety-outline bg-safety-surface p-4">
              <p className="text-sm text-safety-ink">
                &quot;What are the checks for the Line 4 conveyor?&quot;
              </p>
            </div>
            <div className="ml-auto max-w-[90%] rounded-lg border-l-4 border-safety-brand bg-white p-4 shadow-md">
              <p className="text-sm font-medium text-safety-ink">
                &quot;Risk Level: High. Plant A requires LOTO Procedure 104-B...&quot;
              </p>
              <div className="mt-1 flex gap-2 text-[10px] font-bold text-safety-brand">
                <span>Source: SOP-104-B</span>
                <span>Source: Incident Report #442</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-5">
        {TRUST_PILLARS.map((title) => (
          <div key={title} className="p-4 text-center">
            <div className="mb-1 font-bold text-safety-ink">{title}</div>
            <p className="text-[10px] text-safety-muted">Enterprise ready</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
