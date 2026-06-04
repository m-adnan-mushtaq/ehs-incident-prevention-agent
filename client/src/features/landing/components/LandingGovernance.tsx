import { MaterialIcon } from "@/components/brand/MaterialIcon";

const ITEMS = [
  { icon: "hub", title: "Multi-tenant isolation", text: "Zero data leakage between business units." },
  { icon: "location_city", title: "Site-level access", text: "Control knowledge by physical site location." },
  { icon: "badge", title: "Role-based permissions", text: "SMEs, Admins, and Workers have clear lanes." },
  { icon: "fact_check", title: "Approved knowledge only", text: "No hallucinations. Only vetted facts." },
  { icon: "history_edu", title: "Source citations", text: "Every answer points to a source document." },
  { icon: "list_alt", title: "Audit logs", text: "Full record of all safety queries and responses." },
  { icon: "rule", title: "Conflict review", text: "Automated identification of rule contradictions." },
  { icon: "verified", title: "SME approval", text: "Human oversight is built into the workflow." },
] as const;

export const LandingGovernance = () => (
  <section className="bg-white py-16" id="governance">
    <div className="mx-auto max-w-[1440px] px-6">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-xl font-bold uppercase tracking-[0.2em] text-safety-brand">
          Enterprise Security & Governance
        </h2>
        <h3 className="text-3xl font-semibold text-safety-ink md:text-4xl">
          Trusted by Safety Leaders
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {ITEMS.map((item) => (
          <div key={item.title} className="group flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-safety-surface text-safety-ink transition-all duration-300 group-hover:bg-safety-brand group-hover:text-white">
              <MaterialIcon name={item.icon} className="text-3xl" />
            </div>
            <h4 className="mb-1 font-bold text-safety-ink">{item.title}</h4>
            <p className="text-xs text-safety-muted">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
