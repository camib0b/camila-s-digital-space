import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-09-29";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-09-28T20:16:00-03:00";

export type LocalizedText = Record<Language, string>;

export type BlockKind = "plan" | "event" | "transit";

export interface ScheduleBlock {
  id: string;
  kind: BlockKind;
  start: string;
  end?: string;
  title: LocalizedText;
  detail?: LocalizedText;
  location?: LocalizedText;
  mapQuery?: string;
  tag: LocalizedText;
}

export interface UpcomingItem {
  id: string;
  when: LocalizedText;
  title: LocalizedText;
  detail?: LocalizedText;
}

export const tomorrowPageText = {
  back: { es: "Volver", en: "Back" } satisfies LocalizedText,
  kicker: { es: "martes 29 de septiembre", en: "tuesday 29 september" } satisfies LocalizedText,
  title: { es: "Mañana", en: "Morning" } satisfies LocalizedText,
  subtitle: {
    es: "Sin gimnasio. Salir a las 07:20. Clases 08:20 (arqui + web). Web T2 entrega 22:00.",
    en: "No gym. Leave at 07:20. Classes 08:20 (arqui + web). Web T2 due 22:00.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Ancla: clase 08:20 — salir de Casa a las 07:20. Sin gimnasio: hockey el lunes y Web T2 entrega 22:00. ~9–10 °C temprano, máx ~16 °C, nublado; capa liviana / chaqueta ligera.",
    en: "Anchor: class 08:20 — leave Home at 07:20. No gym: Monday hockey and Web T2 due 22:00. ~9–10 °C early, high ~16 °C, cloudy; light jacket / warm layer.",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Clases 08:20–11:00 (arqui + web). Almuerzo real en Casa. Trabajo profundo en Web T2 toda la tarde; último push a main antes de las 22:00. Cena con proteína + carbohidratos y a dormir a buena hora.",
    en: "Classes 08:20–11:00 (arqui + web). Real lunch at Home. Deep work on Web T2 through the afternoon; last push to main before 22:00. Dinner with protein + carbs and a solid night.",
  } satisfies LocalizedText,
  upcoming: { es: "Próximo", en: "Upcoming" } satisfies LocalizedText,
  upcomingBody: {
    es: "Lo que pide preparación en los próximos días.",
    en: "What needs prep in the next several days.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 28 sep 2026, 20:16",
    en: "From Google Calendar · 28 Sep 2026, 20:16",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Luces apagadas ~22:35 — ~8 h hacia la alarma 06:40. Después del hockey ~21:30, viento temprano.",
    en: "Lights out ~22:35 — ~8 h before the 06:40 alarm. After hockey ~21:30, wind down early.",
  },
  {
    es: "Alarma 06:40, backup 06:50. Salir de Casa 07:20 a la universidad (clase 08:20).",
    en: "Alarm 06:40, backup 06:50. Leave Home 07:20 for university (class 08:20).",
  },
  {
    es: "Mochila para clase temprana + laptop para Web T2. Botella. Sin toalla de gimnasio (día sin gym).",
    en: "Bag for early class + laptop for Web T2. Bottle. No gym towel (no-gym day).",
  },
  {
    es: "Capa: chaqueta ligera / capa tibia (~9–10 °C temprano, máx ~16 °C, nublado).",
    en: "Layer: light jacket / warm layer (~9–10 °C early, high ~16 °C, cloudy).",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "06:40",
    end: "07:05",
    title: { es: "Despertar · hidratar", en: "Wake · hydrate" },
    detail: {
      es: "400–500 ml de agua al despertar; hidratar hasta ~600–800 ml. Desayuno simple.",
      en: "400–500 ml water on waking; sip to ~600–800 ml. Simple breakfast.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "buffer",
    kind: "plan",
    start: "07:05",
    end: "07:20",
    title: { es: "Margen · salir", en: "Buffer · leave" },
    detail: {
      es: "Mochila, laptop, botella, capa. Salir a las 07:20 en punto.",
      en: "Bag, laptop, bottle, layer. Leave at 07:20 sharp.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "leave-uni",
    kind: "transit",
    start: "07:20",
    end: "08:15",
    title: { es: "Salir a la universidad", en: "Leave for university" },
    detail: {
      es: "Salir a las 07:20 — no más tarde. Clase 08:20.",
      en: "Leave at 07:20 — not later. Class at 08:20.",
    },
    location: { es: "Hacia universidad", en: "To university" },
    tag: { es: "Traslados", en: "Transit" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "classes",
    kind: "event",
    start: "08:20",
    end: "11:00",
    title: { es: "Clases · arqui + web", en: "Classes · arqui + web" },
    detail: {
      es: "8:20 arqui / 9:40 web. Agua a mano.",
      en: "8:20 arqui / 9:40 web. Water on hand.",
    },
    location: { es: "Universidad", en: "University" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "lunch",
    kind: "plan",
    start: "11:00",
    end: "12:30",
    title: { es: "Almuerzo · Casa", en: "Lunch · Home" },
    detail: {
      es: "Comida real en Casa. Luego foco en Web T2.",
      en: "Real meal at Home. Then focus on Web T2.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "deep-t2",
    kind: "plan",
    start: "12:30",
    end: "21:00",
    title: { es: "Trabajo profundo · Web T2", en: "Deep work · Web T2" },
    detail: {
      es: "Bloques largos en IIC2513 Tarea 2. Pausas cortas; last push a main antes de las 22:00.",
      en: "Long blocks on IIC2513 Tarea 2. Short breaks; last push to main before 22:00.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "entrega-web",
    kind: "event",
    start: "21:00",
    end: "22:00",
    title: { es: "Entrega Web T2", en: "Web T2 deadline" },
    detail: {
      es: "Deadline 22:00 — último push a main del repo individual en IIC2513. Luego cena y a dormir.",
      en: "Deadline 22:00 — last push to main on the individual IIC2513 repo. Then dinner and sleep.",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
];

export const upcomingItems: UpcomingItem[] = [
  {
    id: "i1-web",
    when: { es: "jue 1 oct · 17:30", en: "Thu 1 Oct · 17:30" },
    title: { es: "I1 web", en: "I1 web" },
    detail: {
      es: "Prueba — clase 0 a 11; temario amplio. Bloques de estudio esta semana.",
      en: "University test — classes 0–11; wide syllabus. Study blocks this week.",
    },
  },
  {
    id: "acfin",
    when: { es: "jue 1 oct · 12:30", en: "Thu 1 Oct · 12:30" },
    title: { es: "Seguimiento ACFIN", en: "Seguimiento ACFIN" },
    detail: {
      es: "Llevar docs y pruebas pendientes listos.",
      en: "Have pending docs and tests ready.",
    },
  },
  {
    id: "ucb-manq",
    when: { es: "jue 1 oct", en: "Thu 1 Oct" },
    title: { es: "UC B vs Manquehue", en: "UC B vs Manquehue" },
    detail: { es: "Juegas — mismo día que I1 web.", en: "You play — same day as I1 web." },
  },
  {
    id: "a4-arqui",
    when: { es: "mar 6 oct · 14:50", en: "Tue 6 Oct · 14:50" },
    title: { es: "A4 arqui", en: "A4 arqui" },
    detail: { es: "Tarea.", en: "Assignment." },
  },
  {
    id: "t2-bdd",
    when: { es: "jue 8 oct", en: "Thu 8 Oct" },
    title: { es: "T2 bdd · entrega", en: "T2 bdd · deadline" },
    detail: {
      es: "Tarea + entrega Bases de Datos (IIC2413) hasta 23:59. Arrancar después de I1 web.",
      en: "Assignment + Bases de Datos (IIC2413) deadline by 23:59. Start after I1 web.",
    },
  },
  {
    id: "ucb-cogs",
    when: { es: "jue 8 oct", en: "Thu 8 Oct" },
    title: { es: "UC B vs COGS", en: "UC B vs COGS" },
    detail: { es: "Juegas.", en: "You play." },
  },
];

export function durationLabel(
  start: string,
  end: string | undefined,
  language: Language
): string {
  if (!end) return "";
  if (!/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end)) return "";
  const [startHours, startMinutes] = start.split(":").map(Number);
  const [endHours, endMinutes] = end.split(":").map(Number);
  const minutes = endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
  if (minutes < 0) return "";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (language === "es") {
    if (hours && remainingMinutes) return `${hours}h ${remainingMinutes}m`;
    if (hours) return `${hours}h`;
    return `${remainingMinutes} min`;
  }
  if (hours && remainingMinutes) return `${hours}h ${remainingMinutes}m`;
  if (hours) return `${hours}h`;
  return `${remainingMinutes} min`;
}

export function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export const TOMORROW_SUMMARY_STATS = {
  blocks: String(morningBlocks.length),
  committed: "2",
  transit: "55m",
  first: "06:40",
};
