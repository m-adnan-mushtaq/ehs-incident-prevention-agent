const STATS = [
  { label: "Total Docs", value: "1,428" },
  { label: "Knowledge", value: "98.2%", tone: "text-safety-success" },
  { label: "Conflicts", value: "3", tone: "text-safety-error" },
  { label: "Pending", value: "14", tone: "text-safety-amber" },
  { label: "Incidents", value: "0" },
  { label: "Questions", value: "452" },
  { label: "Objects", value: "4.5k" },
  { label: "Health", value: "Good", tone: "text-safety-success" },
] as const;

const ACTIVITY = [
  { tone: "text-safety-brand", label: "Plant A:", text: "LOTO query resolved" },
  { tone: "text-safety-amber", label: "Review:", text: "3 New SOP objects" },
  { tone: "text-safety-ink", label: "System:", text: "Sync complete" },
  { tone: "text-safety-brand", label: "Plant B:", text: "Incident report added" },
] as const;

export const LandingDashboard = () => (
  <section
    className="border-y border-safety-outline bg-safety-surface py-16"
    id="dashboard"
  >
    <div className="mx-auto max-w-[1440px] px-6">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-semibold text-safety-ink md:text-4xl">
          See your safety knowledge and risks in one place
        </h2>
        <p className="mt-2 text-safety-muted">
          Comprehensive monitoring of your enterprise safety posture.
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-safety-outline bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-safety-outline bg-safety-surface px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="h-3 w-3 rounded-full bg-safety-error" />
            <div className="h-3 w-3 rounded-full bg-safety-amber" />
            <div className="h-3 w-3 rounded-full bg-safety-success" />
          </div>
          <div className="rounded border border-safety-outline bg-white px-8 py-1 text-[10px] text-safety-outline-strong">
            safety-ops-ai.com/dashboard
          </div>
          <div className="w-12" />
        </div>
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-4">
          <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4 lg:col-span-4 lg:grid-cols-8">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-safety-outline bg-safety-surface p-4"
              >
                <p className="text-[10px] font-bold uppercase text-safety-outline-strong">
                  {stat.label}
                </p>
                <p
                  className={`text-xl font-bold text-safety-ink ${"tone" in stat ? stat.tone : ""}`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-6 lg:col-span-3">
            <div className="rounded-xl border border-safety-outline bg-safety-surface p-6">
              <h4 className="mb-4 font-bold text-safety-ink">
                Safety Knowledge Baseline
              </h4>
              <div className="flex h-48 items-end gap-2 px-4">
                {[60, 75, 65, 90, 100].map((h, i) => (
                  <div
                    key={i}
                    className="w-full rounded-t-sm bg-safety-brand"
                    style={{ height: `${h}%`, opacity: 0.2 + i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="h-full rounded-xl border border-safety-outline bg-safety-surface p-4">
              <h4 className="mb-4 text-sm font-bold text-safety-ink">
                Recent Activity
              </h4>
              <div className="space-y-2">
                {ACTIVITY.map((item) => (
                  <div
                    key={item.text}
                    className="rounded border border-safety-outline bg-white p-2 text-[11px]"
                  >
                    <span className={`font-bold ${item.tone}`}>{item.label}</span>{" "}
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
