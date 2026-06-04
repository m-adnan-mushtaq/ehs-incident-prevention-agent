import { LandingCta } from "@/features/landing/components/LandingCta";
import { LandingDashboard } from "@/features/landing/components/LandingDashboard";
import { LandingFeatures } from "@/features/landing/components/LandingFeatures";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { LandingGovernance } from "@/features/landing/components/LandingGovernance";
import { LandingHeader } from "@/features/landing/components/LandingHeader";
import { LandingHero } from "@/features/landing/components/LandingHero";
import { LandingHowItWorks } from "@/features/landing/components/LandingHowItWorks";
import { LandingProblem } from "@/features/landing/components/LandingProblem";
import { LandingSiteAware } from "@/features/landing/components/LandingSiteAware";
import { LandingUseCases } from "@/features/landing/components/LandingUseCases";

const LandingPage = () => (
  <div className="min-h-screen bg-white text-safety-ink selection:bg-safety-brand/20 selection:text-safety-brand">
    <LandingHeader />
    <main className="pt-16">
      <LandingHero />
      <LandingProblem />
      <LandingSiteAware />
      <LandingHowItWorks />
      <LandingFeatures />
      <LandingDashboard />
      <LandingGovernance />
      <LandingUseCases />
      <LandingCta />
    </main>
    <LandingFooter />
  </div>
);

export default LandingPage;
