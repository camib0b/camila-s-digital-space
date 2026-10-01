import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-10-02";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-10-01T20:22:00-03:00";

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
  kicker: { es: "viernes 2 de octubre", en: "friday 2 october" } satisfies LocalizedText,
  title: { es: "Mañana", en: "Morning" } satisfies LocalizedText,
  subtitle: {
    es: "Sin gimnasio. Alarma 09:00, salir 15:45. Sub-14 → Sub-16 coaching. T2 bdd en la mañana.",
    en: "No gym. Alarm 09:00, leave 15:45. Sub-14 → Sub-16 coaching. T2 bdd morning.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Ancla: salir 15:45 para Sub-14 16:30. Sin gimnasio (recuperación tras el partido del jueves). Mañana: T2 bdd + descanso. Capa impermeable (~11–20 °C, llovizna).",
    en: "Anchor: leave 15:45 for Sub-14 16:30. No gym (recovery after Thursday's match). Morning: T2 bdd + rest. Rain layer (~11–20 °C, drizzle).",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Salir 15:45. Sub-14 coaching 16:30–18:30 → Sub-16 18:30–20:30. Después: cena y a dormir.",
    en: "Leave 15:45. Sub-14 coaching 16:30–18:30 → Sub-16 18:30–20:30. After: dinner and wind-down.",
  } satisfies LocalizedText,
  upcoming: { es: "Próximo", en: "Upcoming" } satisfies LocalizedText,
  upcomingBody: {
    es: "Lo que pide preparación en los próximos días.",
    en: "What needs prep in the next several days.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 1 oct 2026, 20:22",
    en: "From Google Calendar · 1 Oct 2026, 20:22",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Luces apagadas ~00:30 — ~8 h hacia la alarma 09:00.",
    en: "Lights out ~00:30 — ~8 h before the 09:00 alarm.",
  },
  {
    es: "Alarma 09:00, backup 09:15. Salir de Casa 15:45 (Sub-14 16:30).",
    en: "Alarm 09:00, backup 09:15. Leave Home 15:45 (Sub-14 16:30).",
  },
  {
    es: "Bolso de coaching + botella listos.",
    en: "Coaching bag + bottle ready.",
  },
  {
    es: "Capa impermeable (~11–20 °C, llovizna).",
    en: "Rain layer (~11–20 °C, drizzle).",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "09:00",
    end: "10:00",
    title: { es: "Despertar · hidratar", en: "Wake · hydrate" },
    detail: {
      es: "400–500 ml de agua al despertar; hidratar hasta ~600–800 ml. Desayuno simple.",
      en: "400–500 ml water on waking; sip to ~600–800 ml. Simple breakfast.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "t2-work",
    kind: "plan",
    start: "10:00",
    end: "13:00",
    title: { es: "T2 bdd · trabajo profundo", en: "T2 bdd · deep work" },
    detail: {
      es: "Bloques de foco con pausas. Empujar entrega Bases de Datos.",
      en: "Focus blocks with breaks. Push the Bases de Datos deadline.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "buffer-rest",
    kind: "plan",
    start: "13:00",
    end: "15:45",
    title: { es: "Almuerzo · descanso · salir", en: "Lunch · rest · leave" },
    detail: {
      es: "Almuerzo, recuperación real, armar bolso de coaching. Salir a las 15:45.",
      en: "Lunch, real recovery, pack coaching bag. Leave at 15:45.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "leave-coaching",
    kind: "transit",
    start: "15:45",
    end: "16:25",
    title: { es: "Salir al coaching", en: "Leave for coaching" },
    detail: {
      es: "Salir a las 15:45 — Sub-14 16:30. Capa impermeable.",
      en: "Leave at 15:45 — Sub-14 16:30. Rain layer.",
    },
    location: { es: "Hacia el coaching", en: "To coaching" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "sub14",
    kind: "event",
    start: "16:30",
    end: "18:30",
    title: { es: "Sub-14 coaching", en: "Sub-14 coaching" },
    detail: {
      es: "Coaching. Luego Sub-16.",
      en: "Coaching. Then Sub-16.",
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
      es: "Coaching. Después: cena y a dormir.",
      en: "Coaching. After: dinner and wind-down.",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "dinner",
    kind: "plan",
    start: "20:30",
    end: "22:00",
    title: { es: "Cena · cierre", en: "Dinner · wind-down" },
    detail: {
      es: "Comida y dormir. Fin de semana por delante.",
      en: "Meal and sleep. Weekend ahead.",
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
    detail: {
      es: "Entrega Bases de Datos (IIC2413). Arrancar el viernes / seguir empujando.",
      en: "Bases de Datos (IIC2413) deadline. Start Friday / keep pushing.",
    },
  },
  {
    id: "a4-arqui",
    when: { es: "mar 6 oct · 14:50", en: "Tue 6 Oct · 14:50" },
    title: { es: "A4 arqui", en: "A4 arqui" },
    detail: { es: "Tarea.", en: "Assignment." },
  },
  {
    id: "arbitraje",
    when: { es: "dom 4 oct · 10:00", en: "Sun 4 Oct · 10:00" },
    title: { es: "Arbitraje", en: "Arbitraje" },
    detail: { es: "Solo nota.", en: "Note only." },
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
  transit: "40m",
  first: "09:00",
};
