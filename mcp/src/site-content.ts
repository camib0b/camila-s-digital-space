/**
 * Public site snapshot for MCP tools.
 * Keep in sync with src/content/* and src/i18n/en.ts on the website.
 */

export const SITE_URL = "https://camilaescudero.cl";
export const MCP_URL = "https://mcp.camilaescudero.cl/mcp";

export const profile = {
  name: "Camila Escudero",
  location: "Santiago, Chile",
  tagline: "Engineering in Santiago. Hockey on the side. Ideas end up here.",
  summary:
    "BI Developer at ACFIN. Studying Ingeniería Civil Industrial at Pontificia Universidad Católica de Chile, with a diploma in information technology. Graduating 2026. Also a field hockey player, coach, and video analyst.",
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
    title: "BI Developer",
    company: "ACFIN",
    period: "Feb 2026 – Present",
    description:
      "Ship investor-facing Looker dashboards for structured credit portfolios; SQL-heavy reporting and investor analytics.",
  },
  {
    id: "finapsys",
    title: "Software Engineering Intern",
    company: "Finapsys (health tech B2B SaaS)",
    period: "Summer 2024",
    description: "Shipped reactive views with reusable components in TypeScript + Vue.js.",
  },
  {
    id: "a3",
    title: "Hotel Asset Management Intern",
    company: "A3 Property Investments",
    period: "Summer 2023",
    description: "KPI reporting for board of directors.",
  },
  {
    id: "visionary",
    title: "Retail & E-commerce Intern",
    company: "Visionary",
    period: "Sabbatical 2021",
    description:
      "Owned e-commerce/PDV/distributor operations across Shopify + BSale; built sales & inventory forecasts and tracked core KPIs (conversion rate, avg. ticket, margin) to coordinate pricing, promos, and replenishment.",
  },
] as const;

export const projects = [
  {
    id: "video-analysis",
    name: "AVA",
    category: "personal-project",
    description:
      "Video analysis app written in C++. AVA is a field-hockey video analysis tool: load a match recording, tag key moments with one keystroke, and share highlight clips.",
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
    name: "Agentic routine planner",
    category: "learning-lab",
    description:
      "Agentic routine planner that uses MCP to fetch Google Calendar events and reusable skills to plan the day. Built as a first agentic development exercise, it runs automatically every day at 9:30 AM.",
    url: `${SITE_URL}/tomorrow`,
  },
  {
    id: "capital",
    name: "Capital",
    category: "learning-lab",
    description:
      "Live portfolio exercise built to learn how to connect market pricing data with an LLM for on-demand text generation.",
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
