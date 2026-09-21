import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-09-21";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-09-20T21:40:00-03:00";

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
  kicker: { es: "lunes 21 de septiembre", en: "monday 21 september" } satisfies LocalizedText,
  title: { es: "Mañana", en: "Morning" } satisfies LocalizedText,
  subtitle: {
    es: "Gimnasio temprano (lavado de pelo), clases 11:00. Tarde: Mila y Sub-16 coaching.",
    en: "Early gym (hair wash), class 11:00. Afternoon: Mila and Sub-16 coaching.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Ancla: clases 11:00 (bdd) y 12:20 (innovación) — salir de Casa a las 10:00. Gimnasio ~90 min de trabajo + ducha con lavado de pelo; el bloque 07:00–09:00 del calendario es estimado. Proteína + carbos en el gym tras la última serie. Mañana ~8 °C / máx ~19 °C, nublado y lluvia probable — base + capa + impermeable liviano.",
    en: "Anchor: class 11:00 (bdd) and 12:20 (innovación) — leave Home at 10:00. Gym ~90 min of work + hair-wash shower; the 07:00–09:00 calendar block is an estimate. Protein + carbs at the gym after the last set. Morning ~8 °C / high ~19 °C, overcast with likely rain — base + mid layer + light waterproof.",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Después de innovación, almuerzo real. Mila 16:00–17:30, luego Sub-16 coaching 17:30–20:00. Cierre deliberado — el día empezó temprano.",
    en: "After innovación, a real lunch. Mila 16:00–17:30, then Sub-16 coaching 17:30–20:00. Deliberate wind-down — the day started early.",
  } satisfies LocalizedText,
  upcoming: { es: "Próximo", en: "Upcoming" } satisfies LocalizedText,
  upcomingBody: {
    es: "Lo que pide preparación en los próximos días.",
    en: "What needs prep in the next several days.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 20 sep 2026, 21:40",
    en: "From Google Calendar · 20 Sep 2026, 21:40",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Luces apagadas ~21:50–22:15. Alarma 05:50 pide ~8 h en cama. El primer despertar cuesta.",
    en: "Lights out ~21:50–22:15. A 05:50 alarm wants ~8 h in bed. First alarm is hard.",
  },
  {
    es: "Empacar toalla de gimnasio. Dejar lista proteína + carbos para el gym. Bolso de gym y mochila de Universidad listos.",
    en: "Pack the gym towel. Set out protein + carbs for the gym. Gym bag and University bag ready.",
  },
  {
    es: "Alarma 05:50, backup 06:00. Salir de Casa al gimnasio a las 06:35. Botella, teléfono, llaves.",
    en: "Alarm 05:50, backup 06:00. Leave Home for the gym at 06:35. Bottle, phone, keys.",
  },
  {
    es: "Capas para ~8 °C / máx ~19 °C, lluvia probable: base + capa + impermeable liviano.",
    en: "Layers for ~8 °C / high ~19 °C, likely rain: base + mid layer + light waterproof.",
  },
  {
    es: "Ancla de la mañana: salir a Universidad a las 10:00 (clases 11:00). Tarde: Mila 16:00, Sub-16 coaching 17:30.",
    en: "Morning anchor: leave for University at 10:00 (class 11:00). Afternoon: Mila 16:00, Sub-16 coaching 17:30.",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "05:50",
    end: "06:35",
    title: { es: "Despertar · salir", en: "Wake · leave" },
    detail: {
      es: "400–500 ml de agua al despertar; hidratar hasta ~600–800 ml. Pre-entreno: agua o un bocado mínimo. Sales a las 06:35.",
      en: "400–500 ml water on waking; sip to ~600–800 ml. Pre-workout: water or a tiny bite. Leave at 06:35.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "drive-gym",
    kind: "transit",
    start: "06:35",
    end: "07:00",
    title: { es: "Auto al gimnasio", en: "Drive to gym" },
    detail: {
      es: "25 min. Calle fresca; posible lluvia.",
      en: "25 min. Cool street; possible rain.",
    },
    location: { es: "Hacia el gimnasio", en: "To the gym" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "gym",
    kind: "event",
    start: "07:00",
    end: "08:30",
    title: { es: "Gimnasio", en: "Gym" },
    detail: {
      es: "~90 min de trabajo. Última serie ~08:30. Proteína + carbos en el gym en los 5–15 min siguientes.",
      en: "~90 min of work. Last set ~08:30. Protein + carbs at the gym in the next 5–15 min.",
    },
    location: { es: "Gimnasio", en: "Gym" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "shower",
    kind: "plan",
    start: "08:30",
    end: "09:00",
    title: { es: "Ducha · lavado de pelo", en: "Shower · hair wash" },
    detail: {
      es: "~30 min. Salir del gym ~09:00 para llegar a Casa con margen antes de Universidad.",
      en: "~30 min. Leave the gym ~09:00 to reach Home with buffer before University.",
    },
    location: { es: "Gimnasio", en: "Gym" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "drive-home",
    kind: "transit",
    start: "09:00",
    end: "09:25",
    title: { es: "Auto a Casa", en: "Drive to Home" },
    detail: {
      es: "25 min. Llegas ~09:25.",
      en: "25 min. Home ~09:25.",
    },
    location: { es: "Hacia Casa", en: "To Home" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "home-buffer",
    kind: "plan",
    start: "09:25",
    end: "10:00",
    title: { es: "Casa · reset", en: "Home · reset" },
    detail: {
      es: "Secado corto. Mochila de Universidad. Algo fácil de comer si hace falta. Sales a las 10:00 — no a las 10:10.",
      en: "Short hair-dry. University bag. Easy food if needed. Leave at 10:00 — not 10:10.",
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
      es: "11:00 bdd · 12:20 innovación. Agua a mano.",
      en: "11:00 bdd · 12:20 innovación. Water on hand.",
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
    end: "15:30",
    title: { es: "Almuerzo · respiro", en: "Lunch · reset" },
    detail: {
      es: "Comida real. Margen para Mila a las 16:00.",
      en: "Real meal. Buffer for Mila at 16:00.",
    },
    location: { es: "Casa o Universidad", en: "Home or University" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "mila",
    kind: "event",
    start: "16:00",
    end: "17:30",
    title: { es: "Mila Dittborn", en: "Mila Dittborn" },
    detail: {
      es: "16:00–17:30. Salir con margen.",
      en: "16:00–17:30. Leave with buffer.",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "amistoso",
    kind: "event",
    start: "17:30",
    end: "20:00",
    title: { es: "Sub-16 coaching", en: "Sub-16 coaching" },
    detail: {
      es: "17:30–20:00. Luego cierre y sueño.",
      en: "17:30–20:00. Then wind-down and sleep.",
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
      es: "Cena real si hace falta. Luces hacia abajo.",
      en: "Real dinner if needed. Lights down.",
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
  transit: "25+25+55m",
  first: "05:50",
};
