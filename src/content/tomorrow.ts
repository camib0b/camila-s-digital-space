import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-09-22";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-09-21T20:16:00-03:00";

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
  kicker: { es: "martes 22 de septiembre", en: "tuesday 22 september" } satisfies LocalizedText,
  title: { es: "Mañana", en: "Morning" } satisfies LocalizedText,
  subtitle: {
    es: "Sin gimnasio. Clases 08:20. Salir de Casa a las 07:20. Tarde: A3 arqui.",
    en: "No gym. Class 08:20. Leave Home at 07:20. Afternoon: A3 arqui.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Ancla: clases 08:20 (arqui) y 09:40 (web) — salir de Casa a las 07:20. Sin gimnasio esta mañana (clase temprana; proteger sueño). Mañana ~18–19 °C con lluvia posible temprano / máx ~28 °C soleado — capas livianas; impermeable liviano opcional al salir.",
    en: "Anchor: class 08:20 (arqui) and 09:40 (web) — leave Home at 07:20. No gym this morning (early class; protect sleep). Morning ~18–19 °C with possible early rain / high ~28 °C sunny — light layers; optional light rain shell when you leave.",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Después de clases, almuerzo real. A3 arqui 14:50–17:00. Cierre sin presión — el día empezó temprano por la clase.",
    en: "After classes, a real lunch. A3 arqui 14:50–17:00. Easy wind-down — the day started early for class.",
  } satisfies LocalizedText,
  upcoming: { es: "Próximo", en: "Upcoming" } satisfies LocalizedText,
  upcomingBody: {
    es: "Lo que pide preparación en los próximos días.",
    en: "What needs prep in the next several days.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 21 sep 2026, 20:16",
    en: "From Google Calendar · 21 Sep 2026, 20:16",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Luces apagadas ~22:00–22:30. Alarma 06:35 pide ~8 h en cama. El primer despertar cuesta.",
    en: "Lights out ~22:00–22:30. A 06:35 alarm wants ~8 h in bed. First alarm is hard.",
  },
  {
    es: "Alarma 06:35, backup 06:45. Salir de Casa a Universidad a las 07:20. Mochila lista. Botella, teléfono, llaves.",
    en: "Alarm 06:35, backup 06:45. Leave Home for University at 07:20. University bag ready. Bottle, phone, keys.",
  },
  {
    es: "Capas para ~18–19 °C / máx ~28 °C: capas livianas; impermeable liviano opcional si sale temprano con lluvia posible.",
    en: "Layers for ~18–19 °C / high ~28 °C: light layers; optional light rain shell if you leave early with possible rain.",
  },
  {
    es: "Ancla: salir a las 07:20 (clases 08:20). Sin gimnasio mañana. Tarde: A3 arqui 14:50.",
    en: "Anchor: leave at 07:20 (class 08:20). No gym tomorrow. Afternoon: A3 arqui 14:50.",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "06:35",
    end: "07:20",
    title: { es: "Despertar · salir", en: "Wake · leave" },
    detail: {
      es: "400–500 ml de agua al despertar; hidratar hasta ~600–800 ml. Desayuno breve si hace falta. Sales a las 07:20 — no a las 07:30.",
      en: "400–500 ml water on waking; sip to ~600–800 ml. Brief breakfast if needed. Leave at 07:20 — not 07:30.",
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
      es: "55–60 min puerta a sala. Posible lluvia temprana.",
      en: "55–60 min door to classroom. Possible early rain.",
    },
    location: { es: "Hacia Universidad", en: "To University" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "clases",
    kind: "event",
    start: "08:20",
    end: "11:00",
    title: { es: "Clases", en: "Classes" },
    detail: {
      es: "08:20 arqui · 09:40 web. Agua a mano.",
      en: "08:20 arqui · 09:40 web. Water on hand.",
    },
    location: { es: "Universidad", en: "University" },
    tag: { es: "Calendario", en: "Calendar" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "lunch",
    kind: "plan",
    start: "11:00",
    end: "14:30",
    title: { es: "Almuerzo · respiro", en: "Lunch · reset" },
    detail: {
      es: "Comida real. Margen antes de A3 arqui a las 14:50.",
      en: "Real meal. Buffer before A3 arqui at 14:50.",
    },
    location: { es: "Casa o Universidad", en: "Home or University" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "a3",
    kind: "event",
    start: "14:50",
    end: "17:00",
    title: { es: "A3 arqui", en: "A3 arqui" },
    detail: {
      es: "14:50–17:00. Bloque de trabajo / estudio en calendario.",
      en: "14:50–17:00. Study / work block on the calendar.",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "evening",
    kind: "plan",
    start: "17:00",
    end: undefined,
    title: { es: "Cena · cierre", en: "Dinner · wind-down" },
    detail: {
      es: "Cena real. Luces hacia abajo — mañana también empieza temprano si hay clase.",
      en: "Real dinner. Lights down — mornings stay early when class is early.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
];

export const upcomingItems: UpcomingItem[] = [
  {
    id: "debate",
    when: { es: "mié 23", en: "Wed 23" },
    title: { es: "Debate Innovación", en: "Innovación debate" },
    detail: { es: "En clase 12:20 — preparar argumentos.", en: "In class 12:20 — prep talking points." },
  },
  {
    id: "acfin",
    when: { es: "jue 24", en: "Thu 24" },
    title: { es: "Seguimiento ACFIN", en: "ACFIN follow-up" },
    detail: { es: "1:1 — tener pendientes de dashboards listos.", en: "1:1 — have dashboard follow-ups ready." },
  },
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
    id: "i1-inn",
    when: { es: "lun 28", en: "Mon 28" },
    title: { es: "I1 Innovación", en: "I1 Innovación" },
    detail: { es: "Prueba — requiere estudio sostenido.", en: "University test — needs sustained study." },
  },
  {
    id: "i1-web",
    when: { es: "mié 1 oct", en: "Wed 1 Oct" },
    title: { es: "I1 web", en: "I1 web" },
    detail: { es: "Prueba — estudio sostenido.", en: "University test — sustained study." },
  },
  {
    id: "ucb-manq",
    when: { es: "mié 1 oct", en: "Wed 1 Oct" },
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
  committed: "2",
  transit: "55m",
  first: "06:35",
};
