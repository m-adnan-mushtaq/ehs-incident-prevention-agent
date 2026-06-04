import { BrandLogo } from "@/components/brand/BrandLogo";
import { MaterialIcon } from "@/components/brand/MaterialIcon";

const FOOTER_LINKS = {
  Platform: ["How it Works", "Security", "Case Studies", "API Reference"],
  Resources: ["Blog", "Help Center", "Contact Support", "Community"],
  Legal: ["Privacy Policy", "Terms of Service", "Compliance", "SLA"],
} as const;

export const LandingFooter = () => (
  <footer className="border-t border-safety-outline bg-white px-6 py-12">
    <div className="mx-auto max-w-[1440px]">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="space-y-4">
          <BrandLogo size="lg" showTagline={false} />
          <p className="max-w-xs text-sm text-safety-muted">
            Empowering high-stakes industries with intelligent, reliable, and
            compliant safety assistants.
          </p>
        </div>
        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div key={title}>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-safety-ink">
              {title}
            </h4>
            <ul className="space-y-4 text-sm text-safety-muted">
              {links.map((link) => (
                <li key={link}>
                  <span className="cursor-default">{link}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-safety-outline pt-6 md:flex-row">
        <p className="text-xs text-safety-outline-strong">
          © 2024 Safety Operations AI. Industrial Grade Reliability.
        </p>
        <div className="flex gap-6">
          {["language", "shield", "support_agent"].map((icon) => (
            <MaterialIcon
              key={icon}
              name={icon}
              className="cursor-pointer text-safety-outline-strong transition-colors hover:text-safety-brand"
            />
          ))}
        </div>
      </div>
    </div>
  </footer>
);
