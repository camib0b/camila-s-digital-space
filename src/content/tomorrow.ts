import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-10-15";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-10-14T20:25:00-03:00";

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
  kicker: { es: "jueves 15 de octubre", en: "thursday 15 october" } satisfies LocalizedText,
  title: { es: "Mañana", en: "Morning" } satisfies LocalizedText,
  subtitle: {
    es: "Sin gimnasio. Alarma 06:45, salir 07:20. Clases 08:20 (arqui + web). Seguimiento ACFIN 15:00. Luces ~23:00.",
    en: "No gym. Alarm 06:45, leave 07:20. Classes 08:20 (arqui + web). Seguimiento ACFIN 15:00. Lights ~23:00.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Ancla: clase 08:20 — salir de Casa 07:20. Sin gimnasio (no está en el calendario; partido anoche). Chaqueta ligera: mañana fresca con niebla, ~11 °C a las 08:00, máx ~20 °C. Tarde: avance para Seguimiento ACFIN 15:00 remoto.",
    en: "Anchor: class 08:20 — leave Home 07:20. No gym (not on the calendar; match last night). Light jacket: cool foggy morning, ~11 °C at 08:00, high ~20 °C. Afternoon: progress for Seguimiento ACFIN 15:00 remote.",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Clases 08:20–11:00 (arqui + web). Almuerzo en Casa. Tarde: estudiar I2 bdd y/o avanzar ACFIN (~13:00–15:00), luego Seguimiento ACFIN 15:00 remoto. Noche liviana; luces ~23:00 — el viernes no hay clase temprana.",
    en: "Classes 08:20–11:00 (arqui + web). Lunch at Home. Afternoon: I2 bdd study and/or ACFIN progress (~13:00–15:00), then Seguimiento ACFIN 15:00 remote. Light evening; lights ~23:00 — Friday has no early class.",
  } satisfies LocalizedText,
  upcoming: { es: "Próximo", en: "Upcoming" } satisfies LocalizedText,
  upcomingBody: {
    es: "Lo que pide preparación en los próximos días.",
    en: "What needs prep in the next several days.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 14 oct 2026, 20:25",
    en: "From Google Calendar · 14 Oct 2026, 20:25",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Luces ~23:00 — ~7.75 h hasta la alarma 06:45 (recuperación tras el partido).",
    en: "Lights ~23:00 — ~7.75 h before the 06:45 alarm (recovery after the match).",
  },
  {
    es: "Alarma 06:45, backup 06:55. Salir de Casa 07:20 (clase 08:20).",
    en: "Alarm 06:45, backup 06:55. Leave Home 07:20 (class 08:20).",
  },
  {
    es: "Mochila de clase y botella listas.",
    en: "Class bag and bottle ready.",
  },
  {
    es: "Chaqueta ligera (mañana fresca con niebla, ~11 °C a las 08:00).",
    en: "Light jacket (cool foggy morning, ~11 °C at 08:00).",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "06:45",
    end: "07:05",
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
    start: "07:05",
    end: "07:20",
    title: { es: "Margen · salir", en: "Buffer · leave" },
    detail: {
      es: "Mochila, botella, chaqueta ligera. Salir a las 07:20 en punto.",
      en: "Bag, bottle, light jacket. Leave at 07:20 sharp.",
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
    id: "lunch",
    kind: "plan",
    start: "12:00",
    end: "13:00",
    title: { es: "Almuerzo", en: "Lunch" },
    detail: {
      es: "De vuelta en Casa ~12:00. Comida real.",
      en: "Home ~12:00. Real meal.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "prep",
    kind: "plan",
    start: "13:00",
    end: "15:00",
    title: { es: "I2 bdd · avance ACFIN", en: "I2 bdd · ACFIN progress" },
    detail: {
      es: "Estudiar I2 bdd y/o preparar avance para las 15:00.",
      en: "Study I2 bdd and/or prep progress for 15:00.",
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
      es: "Remoto. Llevar avance para mostrar.",
      en: "Remote. Bring progress to show.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "wind",
    kind: "plan",
    start: "21:30",
    end: "23:00",
    title: { es: "Cena · cierre", en: "Dinner · wind-down" },
    detail: {
      es: "Cena real. Luces ~23:00 — el viernes no hay clase temprana.",
      en: "Real dinner. Lights ~23:00 — Friday has no early class.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
];

export const upcomingItems: UpcomingItem[] = [
  {
    id: "i2-bdd",
    when: { es: "lun 19 oct · 17:30", en: "Mon 19 Oct · 17:30" },
    title: { es: "I2 bdd", en: "I2 bdd" },
    detail: { es: "Interrogación de Bases de Datos. Seguir estudiando esta semana.", en: "Bases de Datos midterm. Keep studying this week." },
  },
  {
    id: "arqui-20",
    when: { es: "mar 20 oct", en: "Tue 20 Oct" },
    title: { es: "Ap arqui + A5 arqui", en: "Ap arqui + A5 arqui" },
    detail: { es: "Actividades evaluadas en clase, 08:20 y 14:50.", en: "Graded in-class activities, 08:20 and 14:50." },
  },
  {
    id: "i2-arqui",
    when: { es: "jue 22 oct · 17:30", en: "Thu 22 Oct · 17:30" },
    title: { es: "I2 arqui", en: "I2 arqui" },
    detail: { es: "Interrogación de Arquitectura.", en: "Arquitectura midterm." },
  },
  {
    id: "ucb-alumni",
    when: { es: "dom 18 oct · 18:00", en: "Sun 18 Oct · 18:00" },
    title: { es: "UC B vs Alumni", en: "UC B vs Alumni" },
    detail: { es: "Juegas.", en: "You play." },
  },
  {
    id: "mila",
    when: { es: "lun 19 oct · 16:00", en: "Mon 19 Oct · 16:00" },
    title: { es: "Tutoría Mila Dittborn", en: "Mila Dittborn tutoring" },
    detail: { es: "16:00–17:30.", en: "16:00–17:30." },
  },
  {
    id: "acfin-22",
    when: { es: "jue 22 oct · 15:00", en: "Thu 22 Oct · 15:00" },
    title: { es: "Seguimiento ACFIN", en: "Seguimiento ACFIN" },
    detail: { es: "Remoto.", en: "Remote." },
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
  transit: "55 min",
  first: "06:45",
};
