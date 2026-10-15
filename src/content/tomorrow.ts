import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-10-16";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-10-15T20:25:00-03:00";

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
  kicker: { es: "viernes 16 de octubre", en: "friday 16 october" } satisfies LocalizedText,
  title: { es: "Mañana", en: "Morning" } satisfies LocalizedText,
  subtitle: {
    es: "Sin clases ni coaching. Alarma 07:30. I2 bdd en la mañana. Seguimiento ACFIN 10:00 online. Reunión online 15:00. Luces ~23:30.",
    en: "No classes or coaching. Alarm 07:30. I2 bdd in the morning. Seguimiento ACFIN 10:00 online. Online meeting 15:00. Lights ~23:30.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Ancla: Seguimiento ACFIN 10:00 online desde Casa. Día sin traslados: sin clases y sin coaching hoy. Sin gimnasio (no está en el calendario; partido el domingo). Mañana para I2 bdd, que es el lunes.",
    en: "Anchor: Seguimiento ACFIN 10:00 online from Home. No commute today: no classes and no coaching. No gym (not on the calendar; match on Sunday). Morning goes to I2 bdd, which is Monday.",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Seguimiento ACFIN 10:00–11:00 online; después, avanzar lo que salga de la reunión mientras está fresco (~11:00–13:00). Almuerzo en Casa. Pausa corta, caminar o descansar. Reunión online 15:00–17:30. Repaso liviano de I2 bdd en la tarde. Luces ~23:30: el sábado no hay nada temprano.",
    en: "Seguimiento ACFIN 10:00–11:00 online; then act on what comes out of the meeting while it's fresh (~11:00–13:00). Lunch at Home. Short break, walk or rest. Online meeting 15:00–17:30. Light I2 bdd review in the evening. Lights ~23:30: nothing early on Saturday.",
  } satisfies LocalizedText,
  upcoming: { es: "Próximo", en: "Upcoming" } satisfies LocalizedText,
  upcomingBody: {
    es: "Lo que pide preparación en los próximos días.",
    en: "What needs prep in the next several days.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 15 oct 2026, 20:25",
    en: "From Google Calendar · 15 Oct 2026, 20:25",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Luces ~23:00 — ~8.5 h hasta la alarma 07:30.",
    en: "Lights ~23:00 — ~8.5 h before the 07:30 alarm.",
  },
  {
    es: "Alarma 07:30, backup 07:45. Seguimiento ACFIN 10:00 online.",
    en: "Alarm 07:30, backup 07:45. Seguimiento ACFIN 10:00 online.",
  },
  {
    es: "Notas para ACFIN y material de I2 bdd listos; laptop cargado.",
    en: "ACFIN notes and I2 bdd material ready; laptop charged.",
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
      es: "400–500 ml de agua al despertar; hidratar hasta ~600–800 ml. Desayuno tranquilo.",
      en: "400–500 ml water on waking; sip to ~600–800 ml. Unhurried breakfast.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "study",
    kind: "plan",
    start: "08:00",
    end: "09:40",
    title: { es: "Estudio · I2 bdd", en: "Study · I2 bdd" },
    detail: {
      es: "Bloque enfocado para la interrogación del lunes. Agua a mano.",
      en: "Focused block for Monday's midterm. Water on hand.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "prep",
    kind: "plan",
    start: "09:40",
    end: "10:00",
    title: { es: "Preparar ACFIN", en: "ACFIN prep" },
    detail: {
      es: "Repasar notas y avance antes de las 10:00.",
      en: "Review notes and progress before 10:00.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "acfin",
    kind: "event",
    start: "10:00",
    end: "11:00",
    title: { es: "Seguimiento ACFIN", en: "Seguimiento ACFIN" },
    detail: {
      es: "Online. Llevar avance y propuesta.",
      en: "Online. Bring progress and the proposal.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "followup",
    kind: "plan",
    start: "11:00",
    end: "13:00",
    title: { es: "Avance ACFIN", en: "ACFIN follow-ups" },
    detail: {
      es: "Avanzar lo que salga de la reunión.",
      en: "Act on what comes out of the meeting.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "lunch",
    kind: "plan",
    start: "13:00",
    end: "14:00",
    title: { es: "Almuerzo", en: "Lunch" },
    detail: {
      es: "Comida real.",
      en: "Real meal.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "break",
    kind: "plan",
    start: "14:00",
    end: "14:45",
    title: { es: "Pausa", en: "Break" },
    detail: {
      es: "Caminar o descansar.",
      en: "Walk or rest.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "meeting",
    kind: "event",
    start: "15:00",
    end: "17:30",
    title: { es: "Reunión online", en: "Online meeting" },
    detail: {
      es: "Online.",
      en: "Online.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "review",
    kind: "plan",
    start: "18:00",
    end: "19:30",
    title: { es: "Repaso · I2 bdd", en: "Review · I2 bdd" },
    detail: {
      es: "Repaso liviano.",
      en: "Light review.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "wind",
    kind: "plan",
    start: "21:30",
    end: "23:30",
    title: { es: "Cena · cierre", en: "Dinner · wind-down" },
    detail: {
      es: "Cena real. Luces ~23:30.",
      en: "Real dinner. Lights ~23:30.",
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
    detail: { es: "Interrogación de Bases de Datos. Prioridad del fin de semana.", en: "Bases de Datos midterm. Weekend priority." },
  },
  {
    id: "i2-arqui",
    when: { es: "jue 22 oct · 17:30", en: "Thu 22 Oct · 17:30" },
    title: { es: "I2 arqui", en: "I2 arqui" },
    detail: { es: "Interrogación de Arquitectura.", en: "Arquitectura midterm." },
  },
  {
    id: "arqui-20",
    when: { es: "mar 20 oct", en: "Tue 20 Oct" },
    title: { es: "Ap arqui + A5 arqui", en: "Ap arqui + A5 arqui" },
    detail: { es: "Actividades evaluadas en clase, 08:20 y 14:50.", en: "Graded in-class activities, 08:20 and 14:50." },
  },
  {
    id: "ucb-alumni",
    when: { es: "dom 18 oct · 18:00", en: "Sun 18 Oct · 18:00" },
    title: { es: "UC B vs Alumni", en: "UC B vs Alumni" },
    detail: { es: "Juegas.", en: "You play." },
  },
  {
    id: "acfin-22",
    when: { es: "jue 22 oct · 15:00", en: "Thu 22 Oct · 15:00" },
    title: { es: "Seguimiento ACFIN", en: "Seguimiento ACFIN" },
    detail: { es: "Remoto.", en: "Remote." },
  },
  {
    id: "mila",
    when: { es: "lun 19 oct · 16:00", en: "Mon 19 Oct · 16:00" },
    title: { es: "Tutoría Mila Dittborn", en: "Mila Dittborn tutoring" },
    detail: { es: "16:00–17:30.", en: "16:00–17:30." },
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
  transit: "—",
  first: "07:30",
};
