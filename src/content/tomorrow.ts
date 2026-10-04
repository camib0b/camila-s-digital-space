import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-10-05";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-10-04T00:33:00-03:00";

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
  kicker: { es: "lunes 5 de octubre", en: "monday 5 october" } satisfies LocalizedText,
  title: { es: "Mañana", en: "Morning" } satisfies LocalizedText,
  subtitle: {
    es: "Gimnasio 07:30. Alarma 06:25, salir de Casa 10:00. Clases 11:00. Mila 16:00.",
    en: "Gym 07:30. Alarm 06:25, leave Home 10:00. Class 11:00. Mila 16:00.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Ancla: clases 11:00 — salir de Casa 10:00. Gimnasio 07:30–09:20 (bloque estimado). Sin lavado de pelo. Si el listado no entra, recorta accesorios: última serie ~09:05, salir del gym 09:20, Casa ~09:45. Proteína + carbos tras la última serie. Chaqueta ligera (~11 °C temprano, máx ~21 °C; llovizna recién a la noche).",
    en: "Anchor: class 11:00 — leave Home 10:00. Gym 07:30–09:20 (estimate). No hair wash. If the list does not fit, cut accessories: last set ~09:05, leave the gym 09:20, Home ~09:45. Protein + carbs after the last set. Light jacket (~11 °C early, high ~21 °C; drizzle only late).",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Clases 11:00–13:30 (bdd + innovación). Almuerzo real. Mila 16:00–17:30. Cena y luces ~22:30 — el martes empieza temprano.",
    en: "Classes 11:00–13:30 (bdd + innovación). Real lunch. Mila 16:00–17:30. Dinner and lights ~22:30 — Tuesday starts early.",
  } satisfies LocalizedText,
  upcoming: { es: "Próximo", en: "Upcoming" } satisfies LocalizedText,
  upcomingBody: {
    es: "Lo que pide preparación en los próximos días.",
    en: "What needs prep in the next several days.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 4 oct 2026, 00:33",
    en: "From Google Calendar · 4 Oct 2026, 00:33",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Luces apagadas ahora (~00:40). Hacia la alarma 06:25 son ~6 h — no alargues la noche.",
    en: "Lights out now (~00:40). That is ~6 h before the 06:25 alarm — do not stretch the night.",
  },
  {
    es: "Alarma 06:25, backup 06:35. Salir de Casa al gimnasio 07:05. Ancla: salir a Universidad 10:00.",
    en: "Alarm 06:25, backup 06:35. Leave Home for the gym 07:05. Anchor: leave for University 10:00.",
  },
  {
    es: "Empacar toalla de gimnasio. Proteína + carbos listas. Bolso de gym y mochila.",
    en: "Pack the gym towel. Protein + carbs ready. Gym bag and backpack.",
  },
  {
    es: "Chaqueta ligera (~11 °C temprano, máx ~21 °C).",
    en: "Light jacket (~11 °C early, high ~21 °C).",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "06:25",
    end: "07:05",
    title: { es: "Despertar · salir", en: "Wake · leave" },
    detail: {
      es: "400–500 ml de agua al despertar; hidratar hasta ~600–800 ml. Pre-entreno: agua o un bocado mínimo. Sales a las 07:05.",
      en: "400–500 ml water on waking; sip to ~600–800 ml. Pre-workout: water or a tiny bite. Leave at 07:05.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "drive-gym",
    kind: "transit",
    start: "07:05",
    end: "07:30",
    title: { es: "Auto al gimnasio", en: "Drive to gym" },
    detail: { es: "25 min.", en: "25 min." },
    location: { es: "Hacia el gimnasio", en: "To the gym" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "gym",
    kind: "event",
    start: "07:30",
    end: "09:05",
    title: { es: "Gimnasio", en: "Gym" },
    detail: {
      es: "Trabajo hasta ~09:05. Si no entra el listado, recorta accesorios — no la salida.",
      en: "Work until ~09:05. If the list does not fit, cut accessories — not the leave time.",
    },
    location: { es: "Gimnasio", en: "Gym" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "shower",
    kind: "plan",
    start: "09:05",
    end: "09:20",
    title: { es: "Ducha · sin lavado de pelo", en: "Shower · no hair wash" },
    detail: {
      es: "~15 min. Proteína + carbos. Salir del gym 09:20.",
      en: "~15 min. Protein + carbs. Leave the gym 09:20.",
    },
    location: { es: "Gimnasio", en: "Gym" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "drive-home",
    kind: "transit",
    start: "09:20",
    end: "09:45",
    title: { es: "Auto a Casa", en: "Drive to Home" },
    detail: { es: "25 min. Llegas ~09:45.", en: "25 min. Home ~09:45." },
    location: { es: "Hacia Casa", en: "To Home" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "home-buffer",
    kind: "plan",
    start: "09:45",
    end: "10:00",
    title: { es: "Casa · salir", en: "Home · leave" },
    detail: {
      es: "Mochila. Sales a las 10:00 — no a las 10:10.",
      en: "Backpack. Leave at 10:00 — not 10:10.",
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
    detail: { es: "Una hora, puerta a sala.", en: "One hour, door to classroom." },
    location: { es: "Hacia Universidad", en: "To University" },
    tag: { es: "Traslados", en: "Transit" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "clases",
    kind: "event",
    start: "11:00",
    end: "13:30",
    title: { es: "Clases · bdd + innovación", en: "Classes · bdd + innovación" },
    detail: { es: "11:00 bdd · 12:20 innovación. Agua a mano.", en: "11:00 bdd · 12:20 innovación. Water on hand." },
    location: { es: "Universidad", en: "University" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "lunch",
    kind: "plan",
    start: "13:30",
    end: "15:30",
    title: { es: "Almuerzo · margen", en: "Lunch · buffer" },
    detail: { es: "Comida real. Margen para Mila a las 16:00.", en: "Real meal. Buffer for Mila at 16:00." },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "mila",
    kind: "event",
    start: "16:00",
    end: "17:30",
    title: { es: "Mila Dittborn", en: "Mila Dittborn" },
    detail: { es: "Clase de mates 16:00–17:30.", en: "Math class 16:00–17:30." },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "wind-down",
    kind: "plan",
    start: "17:30",
    end: "22:30",
    title: { es: "Cena · cierre", en: "Dinner · wind-down" },
    detail: {
      es: "Cena real. Luces ~22:30 — el martes empieza temprano.",
      en: "Real dinner. Lights ~22:30 — Tuesday starts early.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
];

export const upcomingItems: UpcomingItem[] = [
  {
    id: "a4-arqui",
    when: { es: "mar 6 oct · 14:50", en: "Tue 6 Oct · 14:50" },
    title: { es: "A4 arqui", en: "A4 arqui" },
    detail: { es: "Tarea. Antes del bloque del martes.", en: "Assignment. Before Tuesday's block." },
  },
  {
    id: "t2-bdd",
    when: { es: "jue 8 oct · 23:59", en: "Thu 8 Oct · 23:59" },
    title: { es: "T2 bdd · entrega", en: "T2 bdd · deadline" },
    detail: {
      es: "Entrega Bases de Datos (IIC2413). Empujar entre martes y jueves.",
      en: "Bases de Datos (IIC2413) deadline. Push it Tuesday through Thursday.",
    },
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
  committed: "3",
  transit: "1h 45m",
  first: "06:25",
};
