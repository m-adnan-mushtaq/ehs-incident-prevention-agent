import { MaterialIcon } from "@/components/brand/MaterialIcon";

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
  <section className="bg-safety-panel py-16" id="use-cases">
    <div className="mx-auto max-w-[1440px] px-6">
      <h2 className="mb-12 text-center text-3xl font-semibold text-safety-ink md:text-4xl">
        Industrial Critical Applications
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {USE_CASES.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-2 rounded-xl border border-safety-outline bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <MaterialIcon
              name={item.icon}
              className="text-3xl text-safety-brand"
            />
            <span className="text-center font-bold text-safety-ink">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);
