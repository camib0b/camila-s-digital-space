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
    "Analytics products at ACFIN: live structured-credit books into metrics that have to match. AVA, a native field-hockey video product. Clips the same night.",
  summary:
    "Live structured-credit books at ACFIN — dirty dates, partitions, FX — modeled into metrics and reconciliations that have to match. AVA is a field-hockey video analysis product for macOS: clips the same night. Ingeniería Civil Industrial at Pontificia Universidad Católica de Chile, with a diploma in information technology; graduating 2026.",
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
      "Live structured-credit books — dirty dates, partitions, FX. A metrics layer and reconciliations that have to match the books. Embed, download, session — how people consume the numbers.",
  },
  {
    id: "finapsys",
    title: "Frontend",
    company: "Finapsys (health tech B2B SaaS)",
    period: "Summer 2024",
    description: "Shipped production UI for a health-tech product.",
  },
  {
    id: "a3",
    title: "Hotel asset reporting",
    company: "A3 Property Investments",
    period: "Summer 2023",
    description: "Board KPI reporting for a portfolio of eleven hotels.",
  },
  {
    id: "visionary",
    title: "E-commerce & operations",
    company: "Visionary",
    period: "2021 – 2022",
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
      "Field-hockey video analysis for macOS, built because the market lacked a technical analyst. Tag the match as you watch; clips go out the same night.",
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
    id: "raycast",
    name: "Raycast extension",
    category: "personal-project",
    description: "Raycast extension published as camib0b/zodme.",
    url: "https://www.raycast.com/camib0b/zodme",
  },
  {
    id: "tomorrow",
    name: "Daily planner",
    category: "small-tool",
    description:
      "Daily planner. Reads a Google Calendar and writes the day. Runs at 9:30 AM.",
    url: `${SITE_URL}/tomorrow`,
  },
  {
    id: "capital",
    name: "Capital",
    category: "small-tool",
    description:
      "Small live dashboard. Market prices in; on-demand text out.",
    url: `${SITE_URL}/capital`,
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
