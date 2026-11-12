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
    "I build systems that turn messy operations into faster decisions and more revenue. Analytics automation at a structured-credit firm. carpeta.cl is a paid clip service for field-hockey teams.",
  summary:
    "I build systems that turn messy operations into faster decisions and more revenue. Analytics automation at a structured-credit firm. carpeta.cl is a paid clip service for field-hockey teams. Ingeniería Civil Industrial at Pontificia Universidad Católica de Chile, with a diploma in information technology; graduating July 2027.",
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
    description: "Client analytics for structured credit.",
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
    title: "Hotel portfolio",
    company: "A3 Property Investments",
    period: "Summer Internship 2023",
    description: "Automated board KPIs, P&L, and the forecast for an 11-hotel portfolio.",
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
    id: "clip-library",
    name: "carpeta.cl",
    category: "personal-project",
    description:
      "Founded and run by Camila. Teams needed match clips they could open by concept. She built storage, delivery, and folders filtered by concept. Serves 2 teams, both with her since April 2026.",
    url: "https://carpeta.cl/",
  },
  {
    id: "publishing-pipeline",
    name: "One pipeline",
    category: "personal-project",
    description: "AVA processes the match. carpeta.cl delivers the clips.",
  },
  {
    id: "video-analysis",
    name: "AVA",
    category: "personal-project",
    description:
      "Tagging-to-clips step in the same pipeline. Processing went from 30 minutes to 5 per match, across 23 matches and 175 clips. Waitlist open.",
    url: `${SITE_URL}/ava`,
  },
  {
    id: "acfin",
    name: "ACFIN",
    category: "personal-project",
    description:
      "Built and automated the analytics layer for 8 factoring clients, with reconciled multi-currency books.",
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
  {
    id: "concat",
    name: "Join footage",
    category: "small-tool",
    description: "Match video split across files, joined in the browser. Nothing is uploaded.",
    url: `${SITE_URL}/concat`,
  },
  {
    id: "raycast",
    name: "Raycast extension",
    category: "personal-project",
    description: "Raycast extension published as camib0b/zodme.",
    url: "https://www.raycast.com/camib0b/zodme",
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
