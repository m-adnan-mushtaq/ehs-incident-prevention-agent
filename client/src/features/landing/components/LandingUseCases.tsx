import { MaterialIcon } from "@/components/brand/MaterialIcon";
import { LandingSection } from "@/features/landing/components/LandingSection";

const USE_CASES = [
  { icon: "lock", label: "LOTO" },
  { icon: "settings_input_component", label: "Conveyor cleaning" },
  { icon: "science", label: "Chemical spill" },
  { icon: "height", label: "Work at height" },
  { icon: "gas_meter", label: "Confined space" },
  { icon: "build", label: "Equipment maintenance" },
  { icon: "construction", label: "Hazard checks" },
  { icon: "warning", label: "Near-miss prevention" },
] as const;

export const LandingUseCases = () => (
  <LandingSection variant="spotlight" id="use-cases">
    <div className="mb-12 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-safety-brand">
        Field applications
      </p>
      <h2 className="mt-2 text-3xl font-semibold text-safety-ink md:text-4xl">
        Industrial critical applications
      </h2>
    </div>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {USE_CASES.map((item) => (
        <div
          key={item.label}
          className="group flex flex-col items-center gap-3 rounded-xl border border-safety-outline bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-safety-brand/30 hover:shadow-md"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-safety-brand/10 transition-colors group-hover:bg-safety-brand">
            <MaterialIcon
              name={item.icon}
              className="text-3xl text-safety-brand transition-colors group-hover:text-white"
            />
          </div>
          <span className="text-center font-bold text-safety-ink">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  </LandingSection>
);
