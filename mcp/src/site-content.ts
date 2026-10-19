/**
 * Public site snapshot for MCP tools.
 * Keep in sync with src/content/* and src/i18n/en.ts on the website.
 */

export const SITE_URL = "https://camilaescudero.cl";
export const MCP_URL = "https://mcp.camilaescudero.cl/mcp";

export const profile = {
  name: "Camila Escudero",
  location: "Santiago, Chile",
  tagline:
    "Analytics products at ACFIN: the platform that presents structured-credit metrics and reports to clients. AVA, a native field-hockey video product. Import through export in one program.",
  summary:
    "Analytics products at ACFIN: the platform that presents structured-credit metrics and reports to clients. AVA is a shipped macOS product to import, tag, analyze, present, and export in one program. Ingeniería Civil Industrial at Pontificia Universidad Católica de Chile, with a diploma in information technology; graduating July 2027.",
  siteUrl: SITE_URL,
  social: {
    github: "https://github.com/camib0b",
    linkedin: "https://www.linkedin.com/in/camilaescudero/",
    x: "https://x.com/camib0b",
  },
} as const;

export const contact = {
  email: "camilaescuderob@gmail.com",
  location: profile.location,
  social: profile.social,
  siteUrl: SITE_URL,
} as const;

export const experience = [
  {
    id: "acfin",
    title: "Analytics products",
    company: "ACFIN",
    period: "Feb 2026 – Present",
    description:
      "Investor-facing analytics for structured-credit portfolios: reconciled credit metrics, multi-currency books, self-serve data export, and automated rollout across 8 factoring clients.",
  },
  {
    id: "finapsys",
    title: "Frontend",
    company: "Finapsys (health tech B2B SaaS)",
    period: "Summer Internship 2024",
    description: "Shipped production UI for a health-tech product.",
  },
  {
    id: "a3",
    title: "Hotel asset reporting",
    company: "A3 Property Investments",
    period: "Summer Internship 2023",
    description: "Board KPI reporting for a portfolio of eleven hotels.",
  },
  {
    id: "visionary",
    title: "E-commerce & operations",
    company: "Visionary",
    period: "Gap year 2021 – 2022",
    description:
      "Day-to-day e-commerce and POS: orders, inventory, wholesale, and in-store coverage.",
  },
] as const;

export const projects = [
  {
    id: "video-analysis",
    name: "AVA",
    category: "personal-project",
    description:
      "Field-hockey video analysis for macOS. Import and join camera files, then tag, analyze, present, and export in one program.",
    url: `${SITE_URL}/ava`,
  },
  {
    id: "clip-library",
    name: "Clip library",
    category: "personal-project",
    description:
      "Browsable library of field-hockey match clips for coaching and game analysis. Clips are generated using AVA.",
    url: "https://carpeta.cl/",
  },
  {
    id: "publishing-pipeline",
    name: "Agentic publishing pipeline",
    category: "personal-project",
    description:
      "Publishing a match used to take about 50 minutes of manual work: exporting clips one by one, uploading to YouTube, wiring up the library. Now AVA batch-exports the clips and a separate agent re-encodes them, hosts them natively on carpeta.cl, writes the database, uploads the scouting XML, keeps a YouTube backup, and verifies each step. About 5 minutes of my time per match. 23 matches, 175 clips, 3 team libraries so far, roughly 17 hours saved. Time figures are my own estimates.",
  },
  {
    id: "raycast",
    name: "Raycast extension",
    category: "personal-project",
    description: "Raycast extension published as camib0b/zodme.",
    url: "https://www.raycast.com/camib0b/zodme",
  },
  {
    id: "capital",
    name: "Capital",
    category: "small-tool",
    description:
      "Portfolio analytics: returns versus a VOO benchmark, risk, and look-through exposure. Live market data with automated daily closes. AI commentary on request.",
    url: `${SITE_URL}/capital`,
  },
  {
    id: "xml-viz",
    name: "XML Viz",
    category: "small-tool",
    description:
      "Analysis XML in; tag counts, label groups, and a match timeline out. The file stays in the browser.",
    url: `${SITE_URL}/xml`,
  },
] as const;

export const readingList = {
  goodreads: "https://www.goodreads.com/user/show/54238676-camila-escudero",
  books: [
    { title: "The Republic", author: "Plato", category: "philosophy" },
    { title: "El Mundo de Sofía", author: "Jostein Gaarder", category: "philosophy" },
    {
      title: "Ensayo sobre el entendimiento humano",
      author: "John Locke",
      category: "philosophy",
    },
    {
      title: "Filosofía en 11 frases",
      author: "Darío Sztajnszrajber",
      category: "philosophy",
    },
    {
      title: "Expulsión de la bestia triunfante / Los heroicos furores",
      author: "Giordano Bruno",
      category: "philosophy",
    },
    { title: "Ética a Nicómaco", author: "Aristotle", category: "philosophy" },
    { title: "Chuquicamata", author: "Pascale Bonnefoy", category: "history" },
    { title: "The Lessons of History", author: "Will Durant", category: "history" },
    { title: "The Name of the Rose", author: "Umberto Eco", category: "literature" },
    {
      title: "El coronel no tiene quien le escriba",
      author: "Gabriel García Márquez",
      category: "literature",
    },
    { title: "Casa de campo", author: "José Donoso", category: "literature" },
    {
      title: "Fundamentos del Derecho laboral",
      author: "Sergio Gamonal",
      category: "law",
    },
    {
      title: "The History of Management Thought",
      author: "Daniel Wren",
      category: "management",
    },
    {
      title: "Stay Sane in an Insane World: How to Control the Controllables and Thrive",
      author: "Greg Harden",
      category: "psychology",
    },
    {
      title: "Prophet of Innovation: Joseph Schumpeter and Creative Destruction",
      author: "Thomas McCraw",
      category: "biography",
    },
  ],
} as const;
