import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-10-12";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-10-11T20:22:00-03:00";

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
  kicker: { es: "lunes 12 de octubre", en: "monday 12 october" } satisfies LocalizedText,
  title: { es: "Mañana", en: "Morning" } satisfies LocalizedText,
  subtitle: {
    es: "Feriado. Sin alarma, despertar ~08:30. Estudio I2 bdd 11:00. Mila 16:00. Luces ~22:40.",
    en: "Holiday. No alarm, wake ~08:30. I2 bdd study 11:00. Mila 16:00. Lights ~22:40.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Feriado: sin clases. Único compromiso, Mila 16:00–17:30. Mañana tranquila y una primera pasada a la I2 bdd (lun 19). Impermeable: lluvia gran parte del día, 10–14 °C.",
    en: "Holiday: no classes. Only commitment is Mila 16:00–17:30. Easy morning and a first pass at I2 bdd (Mon 19). Rain jacket: rain most of the day, 10–14 °C.",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Almuerzo en Casa. Salir con margen para Mila 16:00–17:30. Noche liviana: mochila del martes lista y luces ~22:40 — el martes la alarma es 06:40 (clase 08:20).",
    en: "Lunch at Home. Leave with margin for Mila 16:00–17:30. Light evening: Tuesday bag ready and lights ~22:40 — Tuesday's alarm is 06:40 (class 08:20).",
  } satisfies LocalizedText,
  upcoming: { es: "Próximo", en: "Upcoming" } satisfies LocalizedText,
  upcomingBody: {
    es: "Lo que pide preparación en los próximos días.",
    en: "What needs prep in the next several days.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 11 oct 2026, 20:22",
    en: "From Google Calendar · 11 Oct 2026, 20:22",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Luces ~23:00 — sin alarma el lunes, despertar ~08:30.",
    en: "Lights ~23:00 — no alarm Monday, wake ~08:30.",
  },
  {
    es: "Material de Bases de Datos a mano para la I2 bdd.",
    en: "Bases de Datos material at hand for I2 bdd.",
  },
  {
    es: "Impermeable listo (lluvia gran parte del lunes).",
    en: "Rain jacket ready (rain most of Monday).",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "08:30",
    end: "09:00",
    title: { es: "Despertar · hidratar", en: "Wake · hydrate" },
    detail: {
      es: "400–500 ml de agua al despertar; hidratar hasta ~600–800 ml. Desayuno real.",
      en: "400–500 ml water on waking; sip to ~600–800 ml. Real breakfast.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "free",
    kind: "plan",
    start: "09:00",
    end: "11:00",
    title: { es: "Mañana libre", en: "Free morning" },
    detail: {
      es: "Feriado. Sin calendario hasta las 16:00.",
      en: "Holiday. Nothing on the calendar until 16:00.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "study",
    kind: "plan",
    start: "11:00",
    end: "13:00",
    title: { es: "I2 bdd · primera pasada", en: "I2 bdd · first pass" },
    detail: {
      es: "Repasar materia y anotar dudas. Interrogación el lunes 19.",
      en: "Review the material and note open questions. Midterm on Monday 19.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "lunch",
    kind: "plan",
    start: "13:00",
    end: "14:00",
    title: { es: "Almuerzo", en: "Lunch" },
    detail: {
      es: "Almuerzo real.",
      en: "Real lunch.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "mila",
    kind: "event",
    start: "16:00",
    end: "17:30",
    title: { es: "Mila", en: "Mila" },
    detail: {
      es: "Clase de mates.",
      en: "Math class.",
    },
    location: { es: "Clase de mates", en: "Math class" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "prep",
    kind: "plan",
    start: "20:30",
    end: "21:00",
    title: { es: "Preparar martes", en: "Prep Tuesday" },
    detail: {
      es: "Mochila de clase y botella. Alarma 06:40.",
      en: "Class bag and bottle. Alarm 06:40.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "lights",
    kind: "plan",
    start: "22:40",
    end: "23:00",
    title: { es: "Luces", en: "Lights out" },
    detail: {
      es: "8 h hasta la alarma 06:40.",
      en: "8 h before the 06:40 alarm.",
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
    detail: { es: "Interrogación de Bases de Datos. Empezar a estudiar esta semana.", en: "Bases de Datos midterm. Start studying this week." },
  },
  {
    id: "ucb-cogs",
    when: { es: "mié 14 oct · 21:00", en: "Wed 14 Oct · 21:00" },
    title: { es: "UC B vs COGS", en: "UC B vs COGS" },
    detail: { es: "Juegas.", en: "You play." },
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
    detail: { es: "Interrogación de arquitectura.", en: "Architecture midterm." },
  },
  {
    id: "ucb-alumni",
    when: { es: "sáb 17 oct", en: "Sat 17 Oct" },
    title: { es: "UC B vs Alumni", en: "UC B vs Alumni" },
    detail: { es: "Juegas.", en: "You play." },
  },
  {
    id: "acfin",
    when: { es: "jue 15 oct · 15:00", en: "Thu 15 Oct · 15:00" },
    title: { es: "Seguimiento ACFIN", en: "Seguimiento ACFIN" },
    detail: { es: "Remoto. Llevar avance para mostrar.", en: "Remote. Bring progress to show." },
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
  committed: "1",
  transit: "—",
  first: "08:30",
};
