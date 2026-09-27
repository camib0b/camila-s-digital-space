import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-09-28";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-09-27T20:22:00-03:00";

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
  kicker: { es: "lunes 28 de septiembre", en: "monday 28 september" } satisfies LocalizedText,
  title: { es: "Mañana", en: "Morning" } satisfies LocalizedText,
  subtitle: {
    es: "Sin gimnasio. Repaso I1 Innovación. Salir a las 10:00. Clase de mates 16:00.",
    en: "No gym. I1 Innovación review. Leave at 10:00. Math class at 16:00.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Ancla: clase 11:00 — salir de Casa a las 10:00. Sin gimnasio (recuperación del partido del sábado + I1 Innovación). Mañana ~19–22 °C / máx ~29 °C, nublado; posible lluvia liviana a la tarde — capas livianas; capa de lluvia compacta en la mochila.",
    en: "Anchor: class 11:00 — leave Home at 10:00. No gym (Saturday match recovery + I1 Innovación). Morning ~19–22 °C / high ~29 °C, cloudy; light rain possible later — light layers; compact rain layer in the bag.",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Clases 11:00–13:30 (bdd + I1 Innovación). Almuerzo en Casa. Salir ~15:20 a clase de mates 16:00–17:30. Después: cena real; si sobra energía, arrancar I1 web con calma.",
    en: "Classes 11:00–13:30 (bdd + I1 Innovación). Lunch at Home. Leave ~15:20 for math class 16:00–17:30. After: real dinner; if energy remains, ease into I1 web.",
  } satisfies LocalizedText,
  upcoming: { es: "Próximo", en: "Upcoming" } satisfies LocalizedText,
  upcomingBody: {
    es: "Lo que pide preparación en los próximos días.",
    en: "What needs prep in the next several days.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 27 sep 2026, 20:22",
    en: "From Google Calendar · 27 Sep 2026, 20:22",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Antes de dormir: material de I1 Innovación a mano. Luces apagadas ~23:00–23:30 — 8 h hacia la alarma 08:00.",
    en: "Before sleep: I1 Innovación materials ready. Lights out ~23:00–23:30 — about 8 h to the 08:00 alarm.",
  },
  {
    es: "Alarma 08:00, backup 08:10. Salir de Casa a las 10:00 (clase 11:00). Botella, teléfono, llaves. Mochila lista también para la tarde (clase de mates).",
    en: "Alarm 08:00, backup 08:10. Leave Home at 10:00 (class 11:00). Bottle, phone, keys. Bag ready for the afternoon too (math class).",
  },
  {
    es: "Capas para ~19–22 °C / máx ~29 °C, nublado; posible lluvia liviana a la tarde: capas livianas + capa de lluvia compacta en la mochila.",
    en: "Layers for ~19–22 °C / high ~29 °C, cloudy; light rain possible later: light layers + compact rain layer in the bag.",
  },
  {
    es: "Ancla: salir a las 10:00. Sin gimnasio. Mañana: repaso I1 Innovación. Tarde: clase de mates 16:00.",
    en: "Anchor: leave at 10:00. No gym. Morning: I1 Innovación review. Afternoon: math class at 16:00.",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "08:00",
    end: "08:45",
    title: { es: "Despertar · desayuno", en: "Wake · breakfast" },
    detail: {
      es: "400–500 ml de agua al despertar; hidratar hasta ~600–800 ml. Desayuno real. Sin prisa — el ancla es las 10:00.",
      en: "400–500 ml water on waking; sip to ~600–800 ml. Real breakfast. No rush — the anchor is 10:00.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "study-inn",
    kind: "plan",
    start: "08:45",
    end: "09:45",
    title: { es: "Repaso I1 Innovación", en: "I1 Innovación review" },
    detail: {
      es: "Bloque enfocado para la prueba de las 12:20. Pausas cortas; agua a mano.",
      en: "Focused block for the 12:20 test. Short breaks; water on hand.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "buffer",
    kind: "plan",
    start: "09:45",
    end: "10:00",
    title: { es: "Margen · salir", en: "Buffer · leave" },
    detail: {
      es: "Cierre del repaso. Mochila, botella, capa de lluvia. Salir a las 10:00 en punto.",
      en: "Close the review. Bag, bottle, rain layer. Leave at 10:00 sharp.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "leave-uni",
    kind: "transit",
    start: "10:00",
    end: "10:55",
    title: { es: "Salir a la universidad", en: "Leave for university" },
    detail: {
      es: "Salir a las 10:00 — no más tarde. Clase 11:00.",
      en: "Leave at 10:00 — not later. Class at 11:00.",
    },
    location: { es: "Hacia universidad", en: "To university" },
    tag: { es: "Traslados", en: "Transit" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "classes",
    kind: "event",
    start: "11:00",
    end: "13:30",
    title: { es: "Clases · I1 Innovación", en: "Classes · I1 Innovación" },
    detail: {
      es: "bdd 11:00; I1 Innovación 12:20. Agua a mano.",
      en: "bdd 11:00; I1 Innovación 12:20. Water on hand.",
    },
    location: { es: "Universidad", en: "University" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "lunch",
    kind: "plan",
    start: "13:30",
    end: "15:15",
    title: { es: "Almuerzo · margen", en: "Lunch · buffer" },
    detail: {
      es: "Comida real en Casa. Sin forzar más estudio si la prueba ya pasó.",
      en: "Real meal at Home. Don’t force more study if the test is already done.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "leave-math",
    kind: "transit",
    start: "15:20",
    end: "15:55",
    title: { es: "Salir a clase de mates", en: "Leave for math class" },
    detail: {
      es: "Salir ~15:20. Clase de mates 16:00.",
      en: "Leave ~15:20. Math class at 16:00.",
    },
    location: { es: "Hacia clase", en: "To class" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "math",
    kind: "event",
    start: "16:00",
    end: "17:30",
    title: { es: "Clase de mates", en: "Math class" },
    detail: {
      es: "Bloque en calendario. Luego a Casa.",
      en: "Calendar block. Then Home.",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "evening",
    kind: "plan",
    start: "18:00",
    end: undefined,
    title: { es: "Cena · cierre", en: "Dinner · wind-down" },
    detail: {
      es: "Cena real. Si sobra energía: arranque liviano de I1 web (jueves). Si no, descanso.",
      en: "Real dinner. If energy remains: light start on I1 web (Thursday). Otherwise rest.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
];

export const upcomingItems: UpcomingItem[] = [
  {
    id: "i1-web",
    when: { es: "jue 1 oct", en: "Thu 1 Oct" },
    title: { es: "I1 web", en: "I1 web" },
    detail: {
      es: "Prueba — temario amplio; planificar estudio esta semana.",
      en: "University test — wide syllabus; plan study this week.",
    },
  },
  {
    id: "ucb-manq",
    when: { es: "jue 1 oct", en: "Thu 1 Oct" },
    title: { es: "UC B vs Manquehue", en: "UC B vs Manquehue" },
    detail: { es: "Juegas.", en: "You play." },
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
  first: "08:00",
};
