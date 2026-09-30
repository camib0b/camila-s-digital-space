import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-10-01";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-09-30T20:20:00-03:00";

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
  kicker: { es: "jueves 1 de octubre", en: "thursday 1 october" } satisfies LocalizedText,
  title: { es: "Mañana", en: "Morning" } satisfies LocalizedText,
  subtitle: {
    es: "Sin gimnasio. Alarma 06:40, salir 07:20. Clases 08:20 (arqui + web). ACFIN 12:30. I1 web 17:30 → partido 19:30.",
    en: "No gym. Alarm 06:40, leave 07:20. Classes 08:20 (arqui + web). ACFIN 12:30. I1 web 17:30 → match 19:30.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Ancla: clase 08:20 — salir de Casa 07:20. Sin gimnasio (día cargado: ACFIN, I1 web y partido). I1 web 17:30; luego al partido UC B vs Manquehue 19:30 (calendario se solapa — salir tras la prueba). ~12 °C temprano, máx ~28 °C, seco; capa ligera en la mañana.",
    en: "Anchor: class 08:20 — leave Home 07:20. No gym (packed day: ACFIN, I1 web, and a match). I1 web 17:30; then UC B vs Manquehue 19:30 (calendar overlaps — leave after the test). ~12 °C early, high ~28 °C, dry; light morning layer.",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Clases 08:20–11:00 (arqui + web). Seguimiento ACFIN 12:30–13:30. Tarde: I1 web 17:30, luego partido 19:30. Después: comida de recuperación y a dormir (viernes sin clase temprana).",
    en: "Classes 08:20–11:00 (arqui + web). Seguimiento ACFIN 12:30–13:30. Afternoon: I1 web 17:30, then match 19:30. After: recovery meal and sleep (no early Friday class).",
  } satisfies LocalizedText,
  upcoming: { es: "Próximo", en: "Upcoming" } satisfies LocalizedText,
  upcomingBody: {
    es: "Lo que pide preparación en los próximos días.",
    en: "What needs prep in the next several days.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 30 sep 2026, 20:20",
    en: "From Google Calendar · 30 Sep 2026, 20:20",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Luces apagadas ~22:20 — ~8 h hacia la alarma 06:40.",
    en: "Lights out ~22:20 — ~8 h before the 06:40 alarm.",
  },
  {
    es: "Alarma 06:40, backup 06:50. Salir de Casa 07:20 (clase 08:20).",
    en: "Alarm 06:40, backup 06:50. Leave Home 07:20 (class 08:20).",
  },
  {
    es: "Bolso de hockey listo para Manquehue + mochila de clase + material I1. Botella.",
    en: "Hockey bag ready for Manquehue + class bag + I1 materials. Bottle.",
  },
  {
    es: "Capa: ligera en la mañana (~12 °C temprano, máx ~28 °C, seco).",
    en: "Layer: light in the morning (~12 °C early, high ~28 °C, dry).",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "06:40",
    end: "07:00",
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
    start: "07:00",
    end: "07:20",
    title: { es: "Margen · salir", en: "Buffer · leave" },
    detail: {
      es: "Mochila, botella, capa. Salir a las 07:20 en punto.",
      en: "Bag, bottle, layer. Leave at 07:20 sharp.",
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
    location: { es: "Hacia la universidad", en: "To university" },
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
      es: "08:20 arqui / 09:40 web. Agua a mano.",
      en: "08:20 arqui / 09:40 web. Water on hand.",
    },
    location: { es: "Universidad", en: "University" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "acfin",
    kind: "event",
    start: "12:30",
    end: "13:30",
    title: { es: "Seguimiento ACFIN", en: "Seguimiento ACFIN" },
    detail: {
      es: "Docs y pruebas pendientes listos.",
      en: "Pending docs and tests ready.",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "i1-web",
    kind: "event",
    start: "17:30",
    end: "19:00",
    title: { es: "I1 web", en: "I1 web" },
    detail: {
      es: "Prueba — temario clase 0 a 11. Después, salir al partido.",
      en: "Test — syllabus classes 0–11. Then leave for the match.",
    },
    location: { es: "Universidad", en: "University" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "match",
    kind: "event",
    start: "19:30",
    end: "21:00",
    title: { es: "UC B vs Manquehue", en: "UC B vs Manquehue" },
    detail: {
      es: "Juegas. Traslado tras I1; comida de recuperación después.",
      en: "You play. Transit after I1; recovery meal after.",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
];

export const upcomingItems: UpcomingItem[] = [
  {
    id: "t2-bdd",
    when: { es: "jue 8 oct · 23:59", en: "Thu 8 Oct · 23:59" },
    title: { es: "T2 bdd · entrega", en: "T2 bdd · deadline" },
    detail: {
      es: "Entrega Bases de Datos (IIC2413). Arrancar mañana o el viernes.",
      en: "Bases de Datos (IIC2413) deadline. Start tomorrow or Friday.",
    },
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
  {
    id: "fri-coaching",
    when: { es: "vie 2 oct · 16:30", en: "Fri 2 Oct · 16:30" },
    title: { es: "Sub-14 · Sub-16 coaching", en: "Sub-14 · Sub-16 coaching" },
    detail: {
      es: "16:30 Sub-14 → 18:30 Sub-16.",
      en: "16:30 Sub-14 → 18:30 Sub-16.",
    },
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
  committed: "4",
  transit: "55m",
  first: "06:40",
};
