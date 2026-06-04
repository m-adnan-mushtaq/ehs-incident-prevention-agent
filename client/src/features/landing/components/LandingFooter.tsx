import { BrandLogo } from "@/components/brand/BrandLogo";
import { BrandPanel } from "@/components/brand/BrandPanel";
import { MaterialIcon } from "@/components/brand/MaterialIcon";

const FOOTER_LINKS = {
  Platform: ["How it Works", "Security", "Case Studies"],
  Resources: ["Help Center", "Contact Support", "Community"],
  Legal: ["Privacy Policy", "Terms of Service", "Compliance"],
} as const;

export const LandingFooter = () => (
  <BrandPanel as="footer" className="border-t border-white/10 px-6 py-12">
    <div className="mx-auto max-w-[1440px]">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="space-y-4">
          <BrandLogo size="lg" showTagline={false} variant="inverse" />
          <p className="max-w-xs text-sm text-slate-400">
            Intelligent, reliable safety guidance for high-stakes field
            operations.
          </p>
        </div>
        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div key={title}>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-200">
              {title}
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              {links.map((link) => (
                <li key={link}>
                  <span className="cursor-default">{link}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
        <p className="text-xs text-slate-500">
          © 2024 Safety Operations AI. Industrial Grade Reliability.
        </p>
        <div className="flex gap-6">
          {["language", "shield", "support_agent"].map((icon) => (
            <MaterialIcon
              key={icon}
              name={icon}
              className="cursor-pointer text-slate-500 transition-colors hover:text-blue-300"
            />
          ))}
        </div>
      </div>
    </div>
  </BrandPanel>
);
