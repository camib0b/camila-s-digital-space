import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-09-23";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-09-22T20:30:00-03:00";

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
  kicker: { es: "miércoles 23 de septiembre", en: "wednesday 23 september" } satisfies LocalizedText,
  title: { es: "Mañana", en: "Morning" } satisfies LocalizedText,
  subtitle: {
    es: "Sin gimnasio. Clases 11:00 (Debate Innovación 12:20). Salir de Casa a las 10:00. Tarde: Sub-16 coaching.",
    en: "No gym. Class 11:00 (Innovación debate 12:20). Leave Home at 10:00. Afternoon: Sub-16 coaching.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Ancla: clases 11:00 (bdd), 12:20 (innovación · Debate), 14:50 (eti) — salir de Casa a las 10:00. Sin gimnasio (noche larga de coaching; proteger sueño). Mañana ~14 °C / máx ~23 °C, nublado, lluvia improbable — capas livianas.",
    en: "Anchor: class 11:00 (bdd), 12:20 (innovación · debate), 14:50 (eti) — leave Home at 10:00. No gym (long coaching evening; protect sleep). Morning ~14 °C / high ~23 °C, overcast, rain unlikely — light layers.",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Después de innovación, almuerzo real antes de eti 14:50. Sub-16 coaching 17:30–20:00. Cierre deliberado.",
    en: "After innovación, a real lunch before eti at 14:50. Sub-16 coaching 17:30–20:00. Deliberate wind-down.",
  } satisfies LocalizedText,
  upcoming: { es: "Próximo", en: "Upcoming" } satisfies LocalizedText,
  upcomingBody: {
    es: "Lo que pide preparación en los próximos días.",
    en: "What needs prep in the next several days.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 22 sep 2026, 20:30",
    en: "From Google Calendar · 22 Sep 2026, 20:30",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Antes de dormir: argumentos listos para Debate Innovación (12:20). Luego luces apagadas ~23:00–23:30.",
    en: "Before sleep: talking points ready for the Innovación debate (12:20). Then lights out ~23:00–23:30.",
  },
  {
    es: "Alarma 09:15, backup 09:25. Salir de Casa a Universidad a las 10:00. Mochila lista. Botella, teléfono, llaves.",
    en: "Alarm 09:15, backup 09:25. Leave Home for University at 10:00. University bag ready. Bottle, phone, keys.",
  },
  {
    es: "Capas para ~14 °C / máx ~23 °C, nublado: capas livianas.",
    en: "Layers for ~14 °C / high ~23 °C, overcast: light layers.",
  },
  {
    es: "Ancla: salir a las 10:00 (clases 11:00). Sin gimnasio. Tarde: Sub-16 coaching 17:30.",
    en: "Anchor: leave at 10:00 (class 11:00). No gym. Afternoon: Sub-16 coaching 17:30.",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "09:15",
    end: "10:00",
    title: { es: "Despertar · salir", en: "Wake · leave" },
    detail: {
      es: "400–500 ml de agua al despertar; hidratar hasta ~600–800 ml. Desayuno breve. Sales a las 10:00 — no a las 10:10.",
      en: "400–500 ml water on waking; sip to ~600–800 ml. Brief breakfast. Leave at 10:00 — not 10:10.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "transit-uni",
    kind: "transit",
    start: "10:00",
    end: "10:55",
    title: { es: "Transporte a Universidad", en: "Transit to University" },
    detail: {
      es: "55–60 min puerta a sala.",
      en: "55–60 min door to classroom.",
    },
    location: { es: "Hacia Universidad", en: "To University" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "clases",
    kind: "event",
    start: "11:00",
    end: "13:30",
    title: { es: "Clases", en: "Classes" },
    detail: {
      es: "11:00 bdd · 12:20 innovación (Debate). Agua a mano.",
      en: "11:00 bdd · 12:20 innovación (debate). Water on hand.",
    },
    location: { es: "Universidad", en: "University" },
    tag: { es: "Calendario", en: "Calendar" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "lunch",
    kind: "plan",
    start: "13:30",
    end: "14:50",
    title: { es: "Almuerzo · respiro", en: "Lunch · reset" },
    detail: {
      es: "Comida real. Margen antes de eti a las 14:50.",
      en: "Real meal. Buffer before eti at 14:50.",
    },
    location: { es: "Casa o Universidad", en: "Home or University" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "eti",
    kind: "event",
    start: "14:50",
    end: "17:20",
    title: { es: "ETI", en: "ETI" },
    detail: {
      es: "14:50–17:20. Clase en calendario.",
      en: "14:50–17:20. Class on the calendar.",
    },
    location: { es: "Universidad", en: "University" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "amistoso",
    kind: "event",
    start: "17:30",
    end: "20:00",
    title: { es: "Sub-16 coaching", en: "Sub-16 coaching" },
    detail: {
      es: "17:30–20:00. Luego cena y sueño.",
      en: "17:30–20:00. Then dinner and sleep.",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "evening",
    kind: "plan",
    start: "20:00",
    end: undefined,
    title: { es: "Cena · cierre", en: "Dinner · wind-down" },
    detail: {
      es: "Cena real. Luces hacia abajo — el día terminó tarde por coaching.",
      en: "Real dinner. Lights down — the day ended late for coaching.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
];

export const upcomingItems: UpcomingItem[] = [
  {
    id: "i1-eti",
    when: { es: "sáb 26", en: "Sat 26" },
    title: { es: "I1 ETI", en: "I1 ETI" },
    detail: { es: "Prueba — estudiar esta semana.", en: "University test — study this week." },
  },
  {
    id: "ucb",
    when: { es: "sáb 26", en: "Sat 26" },
    title: { es: "UC B vs Old Reds", en: "UC B vs Old Reds" },
    detail: { es: "Juegas — equipo y recuperación previos.", en: "You play — kit and recovery beforehand." },
  },
  {
    id: "acfin",
    when: { es: "jue 24", en: "Thu 24" },
    title: { es: "Seguimiento ACFIN", en: "ACFIN follow-up" },
    detail: { es: "1:1 — tener pendientes de dashboards listos.", en: "1:1 — have dashboard follow-ups ready." },
  },
  {
    id: "i1-inn",
    when: { es: "lun 28", en: "Mon 28" },
    title: { es: "I1 Innovación", en: "I1 Innovación" },
    detail: { es: "Prueba — requiere estudio sostenido.", en: "University test — needs sustained study." },
  },
  {
    id: "i1-web",
    when: { es: "jue 1 oct", en: "Thu 1 Oct" },
    title: { es: "I1 web", en: "I1 web" },
    detail: { es: "Prueba — estudio sostenido.", en: "University test — sustained study." },
  },
  {
    id: "ucb-manq",
    when: { es: "jue 1 oct", en: "Thu 1 Oct" },
    title: { es: "UC B vs Manquehue", en: "UC B vs Manquehue" },
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
  committed: "3",
  transit: "55m",
  first: "09:15",
};
