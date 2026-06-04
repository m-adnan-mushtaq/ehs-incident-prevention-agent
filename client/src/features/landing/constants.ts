export const LANDING_NAV = [
  { label: "Problem", href: "#problem" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Governance", href: "#governance" },
  { label: "Use Cases", href: "#use-cases" },
] as const;

export const HERO_TRUST_BADGES = [
  { icon: "check_circle", label: "Site-aware answers" },
  { icon: "verified", label: "SME-reviewed knowledge" },
  { icon: "menu_book", label: "Cited guidance" },
  { icon: "hub", label: "Multi-tenant isolation" },
  { icon: "photo_camera", label: "Field image checks" },
] as const;

export const PROBLEM_SOURCES = [
  {
    icon: "description",
    tone: "text-safety-brand",
    title: "SOPs & Manuals",
    description: "Static PDFs buried in the intranet.",
  },
  {
    icon: "report_problem",
    tone: "text-safety-error",
    title: "Incident & Near-Miss Reports",
    description: "Lessons learned but often forgotten.",
  },
  {
    icon: "psychology",
    tone: "text-safety-amber",
    title: "Senior Worker Experience",
    description: "Knowledge that leaves when people retire.",
  },
  {
    icon: "location_on",
    tone: "text-safety-ink",
    title: "Site-Specific Rules",
    description: "Local constraints that global tools miss.",
  },
] as const;
