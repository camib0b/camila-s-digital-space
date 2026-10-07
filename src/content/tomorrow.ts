import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-10-08";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-10-07T20:23:00-03:00";

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
  kicker: { es: "jueves 8 de octubre", en: "thursday 8 october" } satisfies LocalizedText,
  title: { es: "Mañana", en: "Morning" } satisfies LocalizedText,
  subtitle: {
    es: "Sin gimnasio. Alarma 06:40, salir 07:20. Clases 08:20 (arqui + web). ACFIN 15:00. Partido UC B vs COGS 21:00.",
    en: "No gym. Alarm 06:40, leave 07:20. Classes 08:20 (arqui + web). ACFIN 15:00. UC B vs COGS match 21:00.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Ancla: clase 08:20 — salir de Casa 07:20. Sin gimnasio: el partido de la noche es el entrenamiento. Tarde en Casa para la T2 bdd, antes y después de ACFIN. Chaqueta abrigada + impermeable (~9 °C temprano, máx ~16 °C, lluvia desde ~14:00 y fuerte durante el partido).",
    en: "Anchor: class 08:20 — leave Home 07:20. No gym: tonight's match is the workout. Afternoon at Home for T2 bdd, before and after ACFIN. Warm jacket plus a rain jacket (~9 °C early, high ~16 °C, rain from ~14:00 and heavy during the match).",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Clases 08:20–11:00 (arqui + web). Vuelta a Casa, almuerzo y T2 bdd. Seguimiento ACFIN 15:00–16:00. T2 bdd lista a las 18:00, comida pre-partido y salir con tiempo para calentar. UC B vs COGS 21:00. Después: proteína + carbohidratos, hidratar, luces ~00:00 — el viernes no hay clase temprano.",
    en: "Classes 08:20–11:00 (arqui + web). Back Home, lunch, T2 bdd. ACFIN follow-up 15:00–16:00. T2 bdd done by 18:00, pre-match meal, leave with time to warm up. UC B vs COGS 21:00. After: protein + carbs, hydrate, lights ~00:00 — no early class Friday.",
  } satisfies LocalizedText,
  upcoming: { es: "Próximo", en: "Upcoming" } satisfies LocalizedText,
  upcomingBody: {
    es: "Lo que pide preparación en los próximos días.",
    en: "What needs prep in the next several days.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 7 oct 2026, 20:23",
    en: "From Google Calendar · 7 Oct 2026, 20:23",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Luces ~22:40 — 8 h hasta la alarma 06:40.",
    en: "Lights ~22:40 — 8 h before the 06:40 alarm.",
  },
  {
    es: "Alarma 06:40, backup 06:50. Salir de Casa 07:20 (clase 08:20).",
    en: "Alarm 06:40, backup 06:50. Leave Home 07:20 (class 08:20).",
  },
  {
    es: "Mochila de clase y botella; bolso de hockey listo esta noche.",
    en: "Class bag and bottle; hockey bag ready tonight.",
  },
  {
    es: "Chaqueta abrigada + impermeable (lluvia desde la tarde, fuerte en la noche).",
    en: "Warm jacket plus a rain jacket (rain from the afternoon, heavy at night).",
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
      es: "400–500 ml de agua al despertar; hidratar hasta ~600–800 ml. Desayuno real.",
      en: "400–500 ml water on waking; sip to ~600–800 ml. Real breakfast.",
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
      es: "Mochila, botella, impermeable. Salir a las 07:20 en punto.",
      en: "Bag, bottle, rain jacket. Leave at 07:20 sharp.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "transit-uni",
    kind: "transit",
    start: "07:20",
    end: "08:15",
    title: { es: "Transporte a Universidad", en: "Transit to University" },
    detail: {
      es: "Una hora, puerta a sala. Clase 08:20.",
      en: "One hour, door to classroom. Class at 08:20.",
    },
    location: { es: "Hacia Universidad", en: "To University" },
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
      es: "08:20 arqui · 09:40 web.",
      en: "08:20 arqui · 09:40 web.",
    },
    location: { es: "Universidad", en: "University" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "home",
    kind: "plan",
    start: "11:00",
    end: "12:00",
    title: { es: "Vuelta a Casa", en: "Back Home" },
    detail: {
      es: "Una hora.",
      en: "One hour.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "lunch",
    kind: "plan",
    start: "12:00",
    end: "12:45",
    title: { es: "Almuerzo", en: "Lunch" },
    detail: {
      es: "Almuerzo real.",
      en: "Real lunch.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "t2a",
    kind: "plan",
    start: "12:45",
    end: "14:45",
    title: { es: "T2 bdd", en: "T2 bdd" },
    detail: {
      es: "Informe + SQL.",
      en: "Report + SQL.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "acfin",
    kind: "event",
    start: "15:00",
    end: "16:00",
    title: { es: "Seguimiento ACFIN", en: "Seguimiento ACFIN" },
    detail: {
      es: "Remoto.",
      en: "Remote.",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "t2b",
    kind: "plan",
    start: "16:00",
    end: "18:00",
    title: { es: "T2 bdd · cierre y entrega", en: "T2 bdd · finish and submit" },
    detail: {
      es: "Lista a las 18:00.",
      en: "Done by 18:00.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "meal",
    kind: "plan",
    start: "18:00",
    end: "18:30",
    title: { es: "Comida pre-partido", en: "Pre-match meal" },
    detail: {
      es: "Comida real.",
      en: "Real meal.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "match",
    kind: "event",
    start: "21:00",
    end: "22:30",
    title: { es: "UC B vs COGS", en: "UC B vs COGS" },
    detail: {
      es: "Juegas.",
      en: "You play.",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "recover",
    kind: "plan",
    start: "22:30",
    end: "23:59",
    title: { es: "Recuperación · cierre", en: "Recovery · wind-down" },
    detail: {
      es: "Proteína + carbohidratos, hidratar. Luces ~00:00.",
      en: "Protein + carbs, hydrate. Lights ~00:00.",
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
    detail: { es: "Bases de Datos (IIC2413): informe + SQL. Bloques en la tarde.", en: "Bases de Datos (IIC2413): report + SQL. Afternoon blocks." },
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
    id: "web-e0",
    when: { es: "vie 9 oct · 22:00", en: "Fri 9 Oct · 22:00" },
    title: { es: "Entrega 0 · proyecto web", en: "Entrega 0 · web project" },
    detail: { es: "IIC2513, grupal.", en: "IIC2513, group." },
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
  committed: "4",
  transit: "55 min",
  first: "06:40",
};
