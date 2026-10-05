import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-10-06";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-10-05T20:25:00-03:00";

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
  kicker: { es: "martes 6 de octubre", en: "tuesday 6 october" } satisfies LocalizedText,
  title: { es: "Mañana", en: "Morning" } satisfies LocalizedText,
  subtitle: {
    es: "Sin gimnasio. Alarma 06:40, salir 07:20. Clases 08:20 (arqui + web). A4 arqui 14:50. Hockey 19:30.",
    en: "No gym. Alarm 06:40, leave 07:20. Classes 08:20 (arqui + web). A4 arqui 14:50. Hockey 19:30.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Ancla: clase 08:20 — salir de Casa 07:20. Sin gimnasio: el entrenamiento de hockey 19:30 es la sesión del día (el lunes fue gimnasio completo). Entregar A4 arqui antes de 14:50. Chaqueta abrigada + cortaviento (~11 °C temprano, máx ~14 °C; lluvia intermitente todo el día).",
    en: "Anchor: class 08:20 — leave Home 07:20. No gym: hockey training at 19:30 is the day's session (Monday was a full gym day). Submit A4 arqui before 14:50. Warm jacket plus a rain shell (~11 °C early, high ~14 °C; on-and-off rain all day).",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Clases 08:20–11:00 (arqui + web). Almuerzo y entrega de A4 arqui antes de 14:50. Tarde: repaso de la Tarea 1 bdd para la oral del miércoles. Entrenamiento de hockey 19:30–21:00; proteína + carbos al terminar. Luces ~23:00 — el miércoles sales a las 10:00.",
    en: "Classes 08:20–11:00 (arqui + web). Lunch and submit A4 arqui before 14:50. Afternoon: review Tarea 1 bdd for Wednesday's oral. Hockey training 19:30–21:00; protein + carbs right after. Lights ~23:00 — Wednesday you leave at 10:00.",
  } satisfies LocalizedText,
  upcoming: { es: "Próximo", en: "Upcoming" } satisfies LocalizedText,
  upcomingBody: {
    es: "Lo que pide preparación en los próximos días.",
    en: "What needs prep in the next several days.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 5 oct 2026, 20:25",
    en: "From Google Calendar · 5 Oct 2026, 20:25",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Luces apagadas ~22:40 — 8 h hasta la alarma 06:40.",
    en: "Lights out ~22:40 — 8 h before the 06:40 alarm.",
  },
  {
    es: "Alarma 06:40, backup 06:50. Salir de Casa 07:20 (clase 08:20).",
    en: "Alarm 06:40, backup 06:50. Leave Home 07:20 (class 08:20).",
  },
  {
    es: "Mochila de clase y botella listas. El bolso de hockey se arma en la tarde.",
    en: "Class bag and bottle ready. Pack the hockey bag in the afternoon.",
  },
  {
    es: "Chaqueta abrigada + cortaviento (~11 °C temprano, máx ~14 °C, lluvia intermitente).",
    en: "Warm jacket plus a rain shell (~11 °C early, high ~14 °C, on-and-off rain).",
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
      es: "Mochila, botella, cortaviento. Salir a las 07:20 en punto.",
      en: "Bag, bottle, rain shell. Leave at 07:20 sharp.",
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
      es: "08:20 arqui · 09:40 web. Agua a mano.",
      en: "08:20 arqui · 09:40 web. Water on hand.",
    },
    location: { es: "Universidad", en: "University" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "a4",
    kind: "plan",
    start: "12:00",
    end: "14:50",
    title: { es: "Almuerzo · entregar A4 arqui", en: "Lunch · submit A4 arqui" },
    detail: {
      es: "De vuelta en Casa ~12:00. Comida real, revisión final y entrega antes de 14:50.",
      en: "Home ~12:00. Real meal, final check, and submit before 14:50.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "oral-prep",
    kind: "plan",
    start: "15:00",
    end: "17:30",
    title: { es: "Repaso oral T1 bdd", en: "T1 bdd oral prep" },
    detail: {
      es: "Repasa tus respuestas de la Tarea 1 para el miércoles 13:30.",
      en: "Review your own Tarea 1 answers for Wednesday 13:30.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "pre-training",
    kind: "plan",
    start: "17:30",
    end: "18:55",
    title: { es: "Colación · bolso de hockey", en: "Snack · hockey bag" },
    detail: {
      es: "Colación ~17:45 (carbos + algo de proteína). Bolso de hockey y botella. Salir 18:55.",
      en: "Snack ~17:45 (carbs + a little protein). Hockey bag and bottle. Leave 18:55.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "training",
    kind: "event",
    start: "19:30",
    end: "21:00",
    title: { es: "Entrenamiento de hockey", en: "Hockey training" },
    detail: {
      es: "25 min en auto. Proteína + carbos al terminar.",
      en: "25 min drive. Protein + carbs right after.",
    },
    location: { es: "Club", en: "Club" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "wind-down",
    kind: "plan",
    start: "21:30",
    end: "23:00",
    title: { es: "Cena · cierre", en: "Dinner · wind-down" },
    detail: {
      es: "Cena real. Luces ~23:00 — el miércoles sales a las 10:00.",
      en: "Real dinner. Lights ~23:00 — Wednesday you leave at 10:00.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
];

export const upcomingItems: UpcomingItem[] = [
  {
    id: "oral-t1-bdd",
    when: { es: "mié 7 oct · 13:30", en: "Wed 7 Oct · 13:30" },
    title: { es: "Revisión oral T1 bdd", en: "T1 bdd oral review" },
    detail: { es: "Calificada. Repasa tus respuestas de la Tarea 1 — martes en la tarde.", en: "Graded. Review your own Tarea 1 answers — Tuesday afternoon." },
  },
  {
    id: "acfin",
    when: { es: "jue 8 oct · 15:00", en: "Thu 8 Oct · 15:00" },
    title: { es: "Seguimiento ACFIN", en: "Seguimiento ACFIN" },
    detail: { es: "Remoto. Llevar avance para mostrar.", en: "Remote. Bring progress to show." },
  },
  {
    id: "ucb-cogs",
    when: { es: "jue 8 oct · 21:00", en: "Thu 8 Oct · 21:00" },
    title: { es: "UC B vs COGS", en: "UC B vs COGS" },
    detail: { es: "Juegas.", en: "You play." },
  },
  {
    id: "t2-bdd",
    when: { es: "jue 8 oct · 23:59", en: "Thu 8 Oct · 23:59" },
    title: { es: "T2 bdd · entrega", en: "T2 bdd · deadline" },
    detail: { es: "Entrega Bases de Datos (IIC2413). Miércoles en la noche + jueves; cerrarla antes del partido.", en: "Bases de Datos (IIC2413) deadline. Wednesday night + Thursday; close it before the match." },
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
  first: "06:40",
};
