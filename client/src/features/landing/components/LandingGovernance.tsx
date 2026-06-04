import { MaterialIcon } from "@/components/brand/MaterialIcon";
import { LandingSection } from "@/features/landing/components/LandingSection";

const ITEMS = [
  { icon: "hub", title: "Multi-tenant isolation", text: "Zero data leakage between business units." },
  { icon: "location_city", title: "Site-level access", text: "Control knowledge by physical site location." },
  { icon: "badge", title: "Role-based permissions", text: "SMEs, Admins, and Workers have clear lanes." },
  { icon: "fact_check", title: "Approved knowledge only", text: "No hallucinations. Only vetted facts." },
  { icon: "history_edu", title: "Source citations", text: "Every answer points to a source document." },
  { icon: "verified", title: "SME approval", text: "Human oversight is built into the workflow." },
] as const;

export const LandingGovernance = () => (
  <LandingSection variant="dark" id="governance">
      <div className="mb-12 text-center">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
          Enterprise Security & Governance
        </h2>
        <h3 className="text-3xl font-semibold md:text-4xl">
          Trusted by Safety Leaders
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item) => (
          <div
            key={item.title}
            className="glass-panel rounded-xl p-6 transition-colors hover:bg-white/10"
          >
            <MaterialIcon name={item.icon} className="mb-3 text-3xl text-blue-300" />
            <h4 className="mb-1 font-bold">{item.title}</h4>
            <p className="text-sm text-slate-300">{item.text}</p>
          </div>
        ))}
      </div>
  </LandingSection>
);
