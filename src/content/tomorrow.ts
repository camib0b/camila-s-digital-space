import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-09-28";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-09-27T20:37:00-03:00";

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
    es: "Gimnasio corto. Salir a las 10:00. I1 Innovación 12:20. Clase de mates 16:00. Entrenamiento de hockey 20:00.",
    en: "Short gym. Leave at 10:00. I1 Innovación at 12:20. Math class at 16:00. Hockey training at 20:00.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Ancla: clase 11:00 — salir de Casa a las 10:00. Gimnasio acortado (~75 min, carga moderada): entrenamiento de hockey a las 20:00. ~11 °C a las 07:00, máx ~18 °C; chubascos desde ~14:00 hasta la noche — chaqueta de lluvia sobre una capa liviana.",
    en: "Anchor: class 11:00 — leave Home at 10:00. Gym shortened (~75 min, moderate load): hockey training at 20:00. ~11 °C at 07:00, high ~18 °C; showers from ~14:00 into the night — rain jacket over a light layer.",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Clases 11:00–13:30 (bdd + I1 Innovación). Almuerzo en Casa. Salir ~15:20 a clase de mates 16:00–18:00. Comida liviana en Casa y salir 19:30 a entrenamiento de hockey 20:00–21:30. Después: proteína + carbohidratos y a dormir temprano (martes clase 08:20).",
    en: "Classes 11:00–13:30 (bdd + I1 Innovación). Lunch at Home. Leave ~15:20 for math class 16:00–18:00. Light meal at Home, leave 19:30 for hockey training 20:00–21:30. After: protein + carbs and an early night (Tuesday class 08:20).",
  } satisfies LocalizedText,
  upcoming: { es: "Próximo", en: "Upcoming" } satisfies LocalizedText,
  upcomingBody: {
    es: "Lo que pide preparación en los próximos días.",
    en: "What needs prep in the next several days.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 27 sep 2026, 20:37",
    en: "From Google Calendar · 27 Sep 2026, 20:37",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Luces apagadas ~22:30 — casi 8 h hacia la alarma 06:20. Material de I1 Innovación en la mochila.",
    en: "Lights out ~22:30 — close to 8 h before the 06:20 alarm. I1 Innovación materials in the bag.",
  },
  {
    es: "Alarma 06:20, backup 06:30. Salir de Casa 07:00 al Gimnasio; salir de Casa 10:00 a la universidad (clase 11:00).",
    en: "Alarm 06:20, backup 06:30. Leave Home 07:00 for the Gym; leave Home 10:00 for university (class 11:00).",
  },
  {
    es: "Empacar toalla del gimnasio, proteína + carbohidratos listos, botella. Bolso de hockey listo para el entrenamiento de las 20:00.",
    en: "Pack gym towel, protein + carbs ready, bottle. Hockey bag ready for 20:00 training.",
  },
  {
    es: "Capa: chaqueta de lluvia sobre una capa liviana (~11 °C temprano, máx ~18 °C, chubascos desde ~14:00).",
    en: "Layer: rain jacket over a light layer (~11 °C early, high ~18 °C, showers from ~14:00).",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "06:20",
    end: "07:00",
    title: { es: "Despertar · pre-entreno", en: "Wake · pre-workout" },
    detail: {
      es: "400–500 ml de agua al despertar; hidratar hasta ~600–800 ml. Snack pequeño si hace falta.",
      en: "400–500 ml water on waking; sip to ~600–800 ml. Tiny snack if needed.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "to-gym",
    kind: "transit",
    start: "07:00",
    end: "07:25",
    title: { es: "Salir al gimnasio", en: "Leave for the gym" },
    detail: {
      es: "Salir de Casa a las 07:00.",
      en: "Leave Home at 07:00.",
    },
    location: { es: "Hacia Gimnasio", en: "To Gym" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "gym",
    kind: "event",
    start: "07:25",
    end: "08:45",
    title: { es: "Gimnasio · sesión corta", en: "Gym · short session" },
    detail: {
      es: "~75 min, carga moderada — hockey a las 20:00. Recortar series antes que atrasar la salida.",
      en: "~75 min, moderate load — hockey at 20:00. Cut sets rather than push back the leave time.",
    },
    location: { es: "Gimnasio", en: "Gym" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "post-gym",
    kind: "plan",
    start: "08:45",
    end: "09:10",
    title: { es: "Proteína + carbohidratos · ducha", en: "Protein + carbs · shower" },
    detail: {
      es: "Proteína + carbohidratos en el gimnasio tras la última serie. Ducha rápida. Salir 09:10.",
      en: "Protein + carbs at the gym after the last set. Quick shower. Leave 09:10.",
    },
    location: { es: "Gimnasio", en: "Gym" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "to-home",
    kind: "transit",
    start: "09:10",
    end: "09:35",
    title: { es: "Volver a Casa", en: "Back Home" },
    detail: {
      es: "Salir del gimnasio a las 09:10.",
      en: "Leave the gym at 09:10.",
    },
    location: { es: "Hacia Casa", en: "To Home" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "buffer",
    kind: "plan",
    start: "09:35",
    end: "10:00",
    title: { es: "Margen · salir", en: "Buffer · leave" },
    detail: {
      es: "Desayuno rápido, repaso corto de I1 Innovación. Mochila, botella, chaqueta de lluvia. Salir a las 10:00 en punto.",
      en: "Quick breakfast, short I1 Innovación skim. Bag, bottle, rain jacket. Leave at 10:00 sharp.",
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
      es: "bdd 11:00; I1 Innovación 12:20 (en clase). Agua a mano.",
      en: "bdd 11:00; I1 Innovación 12:20 (in class). Water on hand.",
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
      es: "Comida real en Casa. Descanso antes de la tarde.",
      en: "Real meal at Home. Rest before the afternoon.",
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
      es: "Salir ~15:20. Clase de mates 16:00. Chaqueta de lluvia.",
      en: "Leave ~15:20. Math class at 16:00. Rain jacket.",
    },
    location: { es: "Hacia clase", en: "To class" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "math",
    kind: "event",
    start: "16:00",
    end: "18:00",
    title: { es: "Clase de mates", en: "Math class" },
    detail: {
      es: "Bloque en calendario. Luego a Casa.",
      en: "Calendar block. Then Home.",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "pre-hockey",
    kind: "plan",
    start: "18:40",
    end: "19:30",
    title: { es: "Comida liviana · bolso", en: "Light meal · bag" },
    detail: {
      es: "Comida liviana e hidratación. Bolso de hockey. Salir 19:30.",
      en: "Light meal and hydration. Hockey bag. Leave 19:30.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "hockey",
    kind: "event",
    start: "20:00",
    end: "21:30",
    title: { es: "Entrenamiento de hockey", en: "Hockey training" },
    detail: {
      es: "Salir de Casa 19:30. Después: proteína + carbohidratos, cena real y a dormir temprano (martes clase 08:20).",
      en: "Leave Home 19:30. After: protein + carbs, real dinner and an early night (Tuesday class 08:20).",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
];

export const upcomingItems: UpcomingItem[] = [
  {
    id: "i1-web",
    when: { es: "jue 1 oct · 17:30", en: "Thu 1 Oct · 17:30" },
    title: { es: "I1 web", en: "I1 web" },
    detail: {
      es: "Prueba — clase 0 a 11; temario amplio. Bloques de estudio desde el martes.",
      en: "University test — classes 0–11; wide syllabus. Study blocks from Tuesday.",
    },
  },
  {
    id: "t2-bdd",
    when: { es: "jue 8 oct", en: "Thu 8 Oct" },
    title: { es: "T2 bdd", en: "T2 bdd" },
    detail: {
      es: "Arrancar después de I1 web.",
      en: "Start after I1 web.",
    },
  },
  {
    id: "acfin",
    when: { es: "jue 1 oct · 12:30", en: "Thu 1 Oct · 12:30" },
    title: { es: "Seguimiento ACFIN", en: "Seguimiento ACFIN" },
    detail: {
      es: "Llevar docs y pruebas pendientes listos.",
      en: "Have pending docs and tests ready.",
    },
  },
  {
    id: "ucb-manq",
    when: { es: "jue 1 oct", en: "Thu 1 Oct" },
    title: { es: "UC B vs Manquehue", en: "UC B vs Manquehue" },
    detail: { es: "Juegas — mismo día que I1 web.", en: "You play — same day as I1 web." },
  },
  {
    id: "a4-arqui",
    when: { es: "mar 6 oct · 14:50", en: "Tue 6 Oct · 14:50" },
    title: { es: "A4 arqui", en: "A4 arqui" },
    detail: { es: "Tarea.", en: "Assignment." },
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
  committed: "4",
  transit: "1h45m",
  first: "06:20",
};
