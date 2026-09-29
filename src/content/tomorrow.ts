import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-09-30";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-09-29T20:20:00-03:00";

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
  kicker: { es: "miércoles 30 de septiembre", en: "wednesday 30 september" } satisfies LocalizedText,
  title: { es: "Mañana", en: "Morning" } satisfies LocalizedText,
  subtitle: {
    es: "Sin gimnasio. Alarma 07:20, salir 08:00. Michel 09:00. Clases 11:00–17:20 (bdd + innovación + eti). Tarde: estudio I1 web.",
    en: "No gym. Alarm 07:20, leave 08:00. Michel 09:00. Classes 11:00–17:20 (bdd + innovación + eti). Evening: I1 web study.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Ancla: Michel 09:00 — salir de Casa 08:00. Sin gimnasio (hockey anoche; proteger sueño). Clases 11:00 bdd / 12:20 innovación / 14:50 eti. Tarde: estudio I1 web (prueba jueves). ~10–11 °C temprano, máx ~18 °C, llovizna posible; chaqueta ligera.",
    en: "Anchor: Michel 09:00 — leave Home 08:00. No gym (hockey last night; protect sleep). Classes 11:00 bdd / 12:20 innovación / 14:50 eti. Evening: I1 web study (test Thursday). ~10–11 °C early, high ~18 °C, light drizzle possible; light jacket.",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Michel 09:00–10:10. Clases 11:00–17:20 (bdd, innovación, eti). Luego bloque de estudio I1 web. Cena real, prep ligera ACFIN, luces apagadas ~22:45 (jueves cargado: ACFIN, I1 web y partido).",
    en: "Michel 09:00–10:10. Classes 11:00–17:20 (bdd, innovación, eti). Then an I1 web study block. Real dinner, light ACFIN prep, lights out ~22:45 (Thursday is packed: ACFIN, I1 web, and a match).",
  } satisfies LocalizedText,
  upcoming: { es: "Próximo", en: "Upcoming" } satisfies LocalizedText,
  upcomingBody: {
    es: "Lo que pide preparación en los próximos días.",
    en: "What needs prep in the next several days.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 29 sep 2026, 20:20",
    en: "From Google Calendar · 29 Sep 2026, 20:20",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Luces apagadas ~23:30 — ~8 h hacia la alarma 07:20 (después del hockey).",
    en: "Lights out ~23:30 — ~8 h before the 07:20 alarm (after hockey).",
  },
  {
    es: "Alarma 07:20, backup 07:30. Salir de Casa 08:00 (Michel 09:00).",
    en: "Alarm 07:20, backup 07:30. Leave Home 08:00 (Michel 09:00).",
  },
  {
    es: "Mochila para clase + material de estudio I1 web para la tarde. Botella.",
    en: "Class bag + I1 web study materials for the evening. Bottle.",
  },
  {
    es: "Capa: chaqueta ligera (~10–11 °C temprano, máx ~18 °C, llovizna posible).",
    en: "Layer: light jacket (~10–11 °C early, high ~18 °C, light drizzle possible).",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "07:20",
    end: "07:45",
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
    start: "07:45",
    end: "08:00",
    title: { es: "Margen · salir", en: "Buffer · leave" },
    detail: {
      es: "Mochila, botella, capa. Salir a las 08:00 en punto.",
      en: "Bag, bottle, layer. Leave at 08:00 sharp.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "leave-michel",
    kind: "transit",
    start: "08:00",
    end: "08:55",
    title: { es: "Salir a Michel", en: "Leave for Michel" },
    detail: {
      es: "Salir a las 08:00 — no más tarde. Michel 09:00.",
      en: "Leave at 08:00 — not later. Michel at 09:00.",
    },
    location: { es: "Hacia Michel", en: "To Michel" },
    tag: { es: "Traslados", en: "Transit" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "michel",
    kind: "event",
    start: "09:00",
    end: "10:10",
    title: { es: "Michel", en: "Michel" },
    detail: {
      es: "Bloque en calendario.",
      en: "On the calendar.",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "classes",
    kind: "event",
    start: "11:00",
    end: "17:20",
    title: { es: "Clases · bdd + innovación + eti", en: "Classes · bdd + innovación + eti" },
    detail: {
      es: "11:00 bdd / 12:20 innovación / 14:50 eti. Agua a mano.",
      en: "11:00 bdd / 12:20 innovación / 14:50 eti. Water on hand.",
    },
    location: { es: "Universidad", en: "University" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "study-i1",
    kind: "plan",
    start: "17:30",
    end: "20:30",
    title: { es: "Estudio · I1 web", en: "Study · I1 web" },
    detail: {
      es: "Prueba mañana 17:30 — temario clase 0 a 11. Bloques con pausas cortas.",
      en: "Test tomorrow 17:30 — syllabus classes 0–11. Blocks with short breaks.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "wind-down",
    kind: "plan",
    start: "20:30",
    end: "22:45",
    title: { es: "Cena · cierre", en: "Dinner · wind-down" },
    detail: {
      es: "Cena real. Prep ligera ACFIN si sobra energía. Luces apagadas ~22:45.",
      en: "Real dinner. Light ACFIN prep if energy left. Lights out ~22:45.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
];

export const upcomingItems: UpcomingItem[] = [
  {
    id: "i1-web",
    when: { es: "jue 1 oct · 17:30", en: "Thu 1 Oct · 17:30" },
    title: { es: "I1 web", en: "I1 web" },
    detail: {
      es: "Prueba — clase 0 a 11; temario amplio. Estudio esta noche.",
      en: "University test — classes 0–11; wide syllabus. Study tonight.",
    },
  },
  {
    id: "t2-bdd",
    when: { es: "jue 8 oct · 23:59", en: "Thu 8 Oct · 23:59" },
    title: { es: "T2 bdd · entrega", en: "T2 bdd · deadline" },
    detail: {
      es: "Entrega Bases de Datos (IIC2413). Arrancar después de I1 web.",
      en: "Bases de Datos (IIC2413) deadline. Start after I1 web.",
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
    when: { es: "jue 1 oct · 19:30", en: "Thu 1 Oct · 19:30" },
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
    id: "ucb-cogs",
    when: { es: "jue 8 oct · 21:00", en: "Thu 8 Oct · 21:00" },
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
  first: "07:20",
};
