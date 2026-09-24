import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-09-25";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-09-24T20:22:00-03:00";

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
  kicker: { es: "viernes 25 de septiembre", en: "friday 25 september" } satisfies LocalizedText,
  title: { es: "Mañana", en: "Morning" } satisfies LocalizedText,
  subtitle: {
    es: "Sin gimnasio. Estudio I1 ETI. Salir a las 15:45. Sub-14 → Sub-16 coaching.",
    en: "No gym. I1 ETI study. Leave at 15:45. Sub-14 → Sub-16 coaching.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Ancla: Sub-14 16:30 → Sub-16 18:30 — salir de Casa a las 15:45. Sin gimnasio (partido sábado; proteger piernas). Mañana ~11–13 °C / máx ~21 °C, nublado — capas; chaqueta liviana al salir.",
    en: "Anchor: Sub-14 16:30 → Sub-16 18:30 — leave Home at 15:45. No gym (Saturday match; protect legs). Morning ~11–13 °C / high ~21 °C, cloudy — layers; light jacket when you leave.",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Sub-14 16:30–18:30, luego Sub-16 18:30–20:30. Después: cena real y cierre temprano — sábado hay I1 ETI y partido UC B.",
    en: "Sub-14 16:30–18:30, then Sub-16 18:30–20:30. After: real dinner and an early wind-down — Saturday has I1 ETI and a UC B match.",
  } satisfies LocalizedText,
  upcoming: { es: "Próximo", en: "Upcoming" } satisfies LocalizedText,
  upcomingBody: {
    es: "Lo que pide preparación en los próximos días.",
    en: "What needs prep in the next several days.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 24 sep 2026, 20:22",
    en: "From Google Calendar · 24 Sep 2026, 20:22",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Antes de dormir: material de I1 ETI a mano para la mañana. Equipo de coaching listo. Luces apagadas ~22:30–23:00 — sábado es largo.",
    en: "Before sleep: I1 ETI materials ready for the morning. Coaching kit ready. Lights out ~22:30–23:00 — Saturday is a long day.",
  },
  {
    es: "Alarma 09:00, backup 09:10. Salir de Casa a las 15:45 (Sub-14 16:30). Botella, teléfono, llaves.",
    en: "Alarm 09:00, backup 09:10. Leave Home at 15:45 (Sub-14 16:30). Bottle, phone, keys.",
  },
  {
    es: "Capas para ~11–13 °C / máx ~21 °C, nublado: capas + chaqueta liviana a la mañana.",
    en: "Layers for ~11–13 °C / high ~21 °C, cloudy: layers + light jacket in the morning.",
  },
  {
    es: "Ancla: salir a las 15:45. Sin gimnasio. Mañana: estudio I1 ETI. Tarde: Sub-14 → Sub-16 coaching.",
    en: "Anchor: leave at 15:45. No gym. Morning: I1 ETI study. Afternoon: Sub-14 → Sub-16 coaching.",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "09:00",
    end: "10:00",
    title: { es: "Despertar · desayuno", en: "Wake · breakfast" },
    detail: {
      es: "400–500 ml de agua al despertar; hidratar hasta ~600–800 ml. Desayuno real. Sin prisa — no hay clase matinal.",
      en: "400–500 ml water on waking; sip to ~600–800 ml. Real breakfast. No rush — no morning class.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "study-eti",
    kind: "plan",
    start: "10:00",
    end: "13:30",
    title: { es: "Estudio I1 ETI", en: "I1 ETI study" },
    detail: {
      es: "Bloque profundo para la prueba de sábado. Pausas cortas; agua a mano.",
      en: "Deep block for Saturday’s test. Short breaks; water on hand.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "lunch",
    kind: "plan",
    start: "13:30",
    end: "15:00",
    title: { es: "Almuerzo · margen", en: "Lunch · buffer" },
    detail: {
      es: "Comida real. Último repaso liviano si sobra energía; no forzar.",
      en: "Real meal. Light final review only if energy remains; don’t force it.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "leave-coach",
    kind: "transit",
    start: "15:45",
    end: "16:25",
    title: { es: "Salir a coaching", en: "Leave for coaching" },
    detail: {
      es: "Salir a las 15:45 — no a las 16:00. Sub-14 empieza 16:30.",
      en: "Leave at 15:45 — not 16:00. Sub-14 starts 16:30.",
    },
    location: { es: "Hacia cancha", en: "To the field" },
    tag: { es: "Traslados", en: "Transit" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "sub14",
    kind: "event",
    start: "16:30",
    end: "18:30",
    title: { es: "Sub-14 coaching", en: "Sub-14 coaching" },
    detail: {
      es: "Bloque de coaching. Agua a mano.",
      en: "Coaching block. Water on hand.",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "sub16",
    kind: "event",
    start: "18:30",
    end: "20:30",
    title: { es: "Sub-16 coaching", en: "Sub-16 coaching" },
    detail: {
      es: "Segundo bloque. Luego a Casa.",
      en: "Second block. Then Home.",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "evening",
    kind: "plan",
    start: "21:00",
    end: undefined,
    title: { es: "Cena · cierre", en: "Dinner · wind-down" },
    detail: {
      es: "Cena real. Luces abajo — sábado: I1 ETI + UC B vs Old Reds.",
      en: "Real dinner. Lights down — Saturday: I1 ETI + UC B vs Old Reds.",
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
    detail: { es: "Prueba — estudiar mañana con foco.", en: "University test — focused study tomorrow." },
  },
  {
    id: "ucb",
    when: { es: "sáb 26", en: "Sat 26" },
    title: { es: "UC B vs Old Reds", en: "UC B vs Old Reds" },
    detail: { es: "Juegas — equipo y recuperación previos.", en: "You play — kit and recovery beforehand." },
  },
  {
    id: "i1-inn",
    when: { es: "lun 28", en: "Mon 28" },
    title: { es: "I1 Innovación", en: "I1 Innovación" },
    detail: { es: "Prueba — estudio este fin de semana.", en: "University test — study this weekend." },
  },
  {
    id: "i1-web",
    when: { es: "jue 1 oct", en: "Thu 1 Oct" },
    title: { es: "I1 web", en: "I1 web" },
    detail: { es: "Prueba — planificar estudio.", en: "University test — plan study." },
  },
  {
    id: "ucb-manq",
    when: { es: "jue 1 oct", en: "Thu 1 Oct" },
    title: { es: "UC B vs Manquehue", en: "UC B vs Manquehue" },
    detail: { es: "Juegas.", en: "You play." },
  },
  {
    id: "acfin",
    when: { es: "jue 1 oct", en: "Thu 1 Oct" },
    title: { es: "Seguimiento ACFIN", en: "ACFIN follow-up" },
    detail: { es: "Pendientes de dashboards.", en: "Dashboard follow-ups." },
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
  transit: "40m",
  first: "09:00",
};
