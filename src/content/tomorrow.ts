import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-10-07";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-10-06T20:25:00-03:00";

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
  kicker: { es: "miércoles 7 de octubre", en: "wednesday 7 october" } satisfies LocalizedText,
  title: { es: "Mañana", en: "Morning" } satisfies LocalizedText,
  subtitle: {
    es: "Sin gimnasio. Alarma 07:30, salir 10:00. Clases 11:00 (bdd + innovación + eti). Oral T1 bdd 13:30. Sub-12 coaching 17:00.",
    en: "No gym. Alarm 07:30, leave 10:00. Classes 11:00 (bdd + innovación + eti). T1 bdd oral 13:30. Sub-12 coaching 17:00.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Ancla: clase 11:00 — salir de Casa 10:00. Sin gimnasio: hockey anoche y partido el jueves. Mañana tranquila para un último repaso de la T1. Solo 20 min entre la oral y eti: lleva almuerzo. En calendario, clases hasta 17:20 se cruzan con Sub-12 a las 17:00. Chaqueta + cortaviento (~11 °C con lluvia temprano, máx ~18 °C, chubascos de nuevo al final de la tarde).",
    en: "Anchor: class 11:00 — leave Home 10:00. No gym: hockey last night and a match Thursday. Calm morning for a last pass over T1. Only 20 min between the oral and eti: bring lunch. On the calendar, classes until 17:20 overlap Sub-12 at 17:00. Jacket plus a rain shell (~11 °C with rain early, high ~18 °C, showers again late afternoon).",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Clases desde 11:00 (bdd, innovación). Oral T1 bdd 13:30–14:30, almuerzo rápido y eti 14:50. Sub-12 coaching 17:00–19:00. Cena, ~1 h de T2 bdd y luces ~22:40 — el jueves sales a las 07:20.",
    en: "Classes from 11:00 (bdd, innovación). T1 bdd oral 13:30–14:30, quick lunch, then eti 14:50. Sub-12 coaching 17:00–19:00. Dinner, ~1 h of T2 bdd, lights ~22:40 — Thursday you leave at 07:20.",
  } satisfies LocalizedText,
  upcoming: { es: "Próximo", en: "Upcoming" } satisfies LocalizedText,
  upcomingBody: {
    es: "Lo que pide preparación en los próximos días.",
    en: "What needs prep in the next several days.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 6 oct 2026, 20:25",
    en: "From Google Calendar · 6 Oct 2026, 20:25",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Luces ~23:00 después del hockey — 8.5 h hasta la alarma 07:30.",
    en: "Lights ~23:00 after hockey — 8.5 h before the 07:30 alarm.",
  },
  {
    es: "Alarma 07:30, backup 07:45. Salir de Casa 10:00 (clase 11:00).",
    en: "Alarm 07:30, backup 07:45. Leave Home 10:00 (class 11:00).",
  },
  {
    es: "Mochila de clase, botella y tus respuestas de la T1 a mano. Almuerzo listo para llevar.",
    en: "Class bag, bottle, and your T1 answers at hand. Lunch ready to take.",
  },
  {
    es: "Chaqueta + cortaviento (lluvia temprano y chubascos al final de la tarde).",
    en: "Jacket plus a rain shell (rain early and showers late afternoon).",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "07:30",
    end: "08:00",
    title: { es: "Despertar · hidratar", en: "Wake · hydrate" },
    detail: {
      es: "400–500 ml de agua al despertar; hidratar hasta ~600–800 ml. Desayuno real.",
      en: "400–500 ml water on waking; sip to ~600–800 ml. Real breakfast.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "oral-pass",
    kind: "plan",
    start: "08:00",
    end: "09:30",
    title: { es: "Último repaso · T1 bdd", en: "Last pass · T1 bdd" },
    detail: {
      es: "Tus propias respuestas, con calma. Nada nuevo.",
      en: "Your own answers, calmly. Nothing new.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "buffer",
    kind: "plan",
    start: "09:30",
    end: "10:00",
    title: { es: "Almuerzo para llevar · salir", en: "Pack lunch · leave" },
    detail: {
      es: "Almuerzo, botella, cortaviento. Salir a las 10:00 en punto.",
      en: "Lunch, bottle, rain shell. Leave at 10:00 sharp.",
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
      es: "Una hora, puerta a sala. Clase 11:00.",
      en: "One hour, door to classroom. Class at 11:00.",
    },
    location: { es: "Hacia Universidad", en: "To University" },
    tag: { es: "Traslados", en: "Transit" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "classes-am",
    kind: "event",
    start: "11:00",
    end: "13:30",
    title: { es: "Clases · bdd + innovación", en: "Classes · bdd + innovación" },
    detail: {
      es: "11:00 bdd · 12:20 innovación.",
      en: "11:00 bdd · 12:20 innovación.",
    },
    location: { es: "Universidad", en: "University" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "oral",
    kind: "event",
    start: "13:30",
    end: "14:30",
    title: { es: "Revisión oral T1 bdd", en: "T1 bdd oral review" },
    detail: {
      es: "En calendario.",
      en: "On the calendar.",
    },
    location: { es: "Universidad", en: "University" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "lunch",
    kind: "plan",
    start: "14:30",
    end: "14:50",
    title: { es: "Almuerzo rápido", en: "Quick lunch" },
    detail: {
      es: "Lo que llevaste.",
      en: "What you packed.",
    },
    location: { es: "Universidad", en: "University" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "eti",
    kind: "event",
    start: "14:50",
    end: "17:20",
    title: { es: "Clase · eti", en: "Class · eti" },
    detail: {
      es: "Bloque de clases hasta 17:20 en calendario.",
      en: "Class block to 17:20 on the calendar.",
    },
    location: { es: "Universidad", en: "University" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "sub12",
    kind: "event",
    start: "17:00",
    end: "19:00",
    title: { es: "Sub-12 coaching", en: "Sub-12 coaching" },
    detail: {
      es: "En calendario.",
      en: "On the calendar.",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "evening",
    kind: "plan",
    start: "20:00",
    end: "22:40",
    title: { es: "Cena · T2 bdd · cierre", en: "Dinner · T2 bdd · wind-down" },
    detail: {
      es: "Cena real, ~1 h de T2 bdd. Luces ~22:40 — el jueves sales a las 07:20.",
      en: "Real dinner, ~1 h of T2 bdd. Lights ~22:40 — Thursday you leave at 07:20.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
];

export const upcomingItems: UpcomingItem[] = [
  {
    id: "t2-bdd",
    when: { es: "jue 8 oct · 23:59", en: "Thu 8 Oct · 23:59" },
    title: { es: "T2 bdd · entrega", en: "T2 bdd · deadline" },
    detail: { es: "Entrega Bases de Datos (IIC2413): informe + SQL. Miércoles en la noche + jueves; cerrarla antes del partido.", en: "Bases de Datos (IIC2413) deadline: report + SQL. Wednesday night + Thursday; close it before the match." },
  },
  {
    id: "ucb-cogs",
    when: { es: "jue 8 oct · 21:00", en: "Thu 8 Oct · 21:00" },
    title: { es: "UC B vs COGS", en: "UC B vs COGS" },
    detail: { es: "Juegas.", en: "You play." },
  },
  {
    id: "acfin",
    when: { es: "jue 8 oct · 15:00", en: "Thu 8 Oct · 15:00" },
    title: { es: "Seguimiento ACFIN", en: "Seguimiento ACFIN" },
    detail: { es: "Remoto. Llevar avance para mostrar.", en: "Remote. Bring progress to show." },
  },
  {
    id: "ucb-alumni",
    when: { es: "sáb 17 oct", en: "Sat 17 Oct" },
    title: { es: "UC B vs Alumni", en: "UC B vs Alumni" },
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
  transit: "55 min",
  first: "07:30",
};
