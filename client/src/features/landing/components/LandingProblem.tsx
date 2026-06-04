import { MaterialIcon } from "@/components/brand/MaterialIcon";
import { PROBLEM_SOURCES } from "@/features/landing/constants";
import { LandingSection } from "@/features/landing/components/LandingSection";

export const LandingProblem = () => (
  <LandingSection variant="white" id="problem">
    <div className="flex flex-col items-center gap-12 lg:flex-row">
      <div className="space-y-6 lg:w-1/2">
        <p className="text-sm font-bold uppercase tracking-widest text-safety-brand">
          The challenge
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-safety-ink md:text-4xl">
          Safety knowledge is everywhere. Field teams need one trusted answer.
        </h2>
        <p className="text-lg text-safety-muted">
          Most organizations already have the knowledge needed to prevent
          incidents, but it is scattered across silos, making it inaccessible
          when workers need it most.
        </p>
        <div className="relative space-y-4">
          <div className="absolute bottom-6 left-6 top-6 -z-10 w-0.5 bg-safety-brand/20" />
          {PROBLEM_SOURCES.map((source) => (
            <div
              key={source.title}
              className="flex items-center gap-4 rounded-xl border border-safety-outline bg-safety-surface/80 p-4 shadow-soft backdrop-blur-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
                <MaterialIcon name={source.icon} className={source.tone} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-safety-ink">{source.title}</h4>
                <p className="text-sm text-safety-muted">{source.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center lg:w-1/2">
        <div className="relative flex flex-col items-center rounded-3xl border border-safety-brand/15 bg-gradient-to-b from-white to-safety-panel p-8 text-center shadow-panel">
          <div className="absolute -top-6 rounded-full bg-safety-brand px-4 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
            Unified Safety Knowledge Layer
          </div>
          <MaterialIcon
            name="blur_circular"
            className="mb-4 text-6xl text-safety-brand"
          />
          <h3 className="mb-2 text-2xl font-semibold text-safety-ink">
            The Safety Operations AI Engine
          </h3>
          <p className="text-safety-muted">
            Ingests all sources to provide one source of truth.
          </p>
          <div className="mt-8 grid w-full grid-cols-2 gap-2">
            {["Global Regs", "Local SOPs", "Voice Notes", "Site Photos"].map(
              (label) => (
                <div
                  key={label}
                  className="rounded-lg border border-safety-outline bg-white p-2 text-[10px] font-bold uppercase text-safety-muted"
                >
                  {label}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  </LandingSection>
);
