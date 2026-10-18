import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-10-19";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-10-18T20:30:00-03:00";

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
  kicker: { es: "lunes 19 de octubre", en: "monday 19 october" } satisfies LocalizedText,
  title: { es: "Mañana", en: "Morning" } satisfies LocalizedText,
  subtitle: {
    es: "Sin clases. Alarma 08:00. Mañana de estudio I2 bdd. Mila 16:00. I2 bdd 17:30. Luces ~22:40.",
    en: "No classes. Alarm 08:00. I2 bdd study morning. Mila 16:00. I2 bdd 17:30. Lights ~22:40.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Ancla: I2 bdd 17:30 en el campus. Ojo: Mila termina 17:30, justo cuando empieza la I2; acortar la tutoría a ~16:40 y manejar directo al campus. Sin gimnasio: recuperación tras el partido del domingo. Chaqueta impermeable para la tarde (lluvia probable desde ~16:00, 14–22 °C).",
    en: "Anchor: I2 bdd 17:30 on campus. Heads-up: Mila ends at 17:30, exactly when the I2 starts; cut tutoring to ~16:40 and drive straight to campus. No gym: recovery after Sunday's match. Rain jacket for the afternoon (rain likely from ~16:00, 14–22 °C).",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Almuerzo en Casa y repaso final liviano, sin materia nueva. Salir con margen para Mila 16:00; terminar ~16:40 y manejar directo al campus para llegar ~17:10. I2 bdd 17:30–20:00. Después: cena, mochila del martes y luces ~22:40 — el martes la alarma es 06:40 (clase 08:20).",
    en: "Lunch at Home and a light final review, no new material. Leave with margin for Mila 16:00; wrap up ~16:40 and drive straight to campus to arrive ~17:10. I2 bdd 17:30–20:00. After: dinner, Tuesday bag and lights ~22:40 — Tuesday's alarm is 06:40 (class 08:20).",
  } satisfies LocalizedText,
  upcoming: { es: "Próximo", en: "Upcoming" } satisfies LocalizedText,
  upcomingBody: {
    es: "Lo que pide preparación en los próximos días.",
    en: "What needs prep in the next several days.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 18 oct 2026, 20:30",
    en: "From Google Calendar · 18 Oct 2026, 20:30",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Luces ~23:30 — ~8.5 h hasta la alarma 08:00.",
    en: "Lights ~23:30 — ~8.5 h before the 08:00 alarm.",
  },
  {
    es: "Alarma 08:00, backup 08:15. Rehidratar después del partido.",
    en: "Alarm 08:00, backup 08:15. Rehydrate after the match.",
  },
  {
    es: "Material de I2 bdd listo; lápices y carnet para la prueba; laptop cargado.",
    en: "I2 bdd material ready; pens and student ID for the exam; laptop charged.",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "08:00",
    end: "08:30",
    title: { es: "Despertar · recuperar", en: "Wake · recover" },
    detail: {
      es: "400–500 ml de agua al despertar; hidratar hasta ~600–800 ml. Desayuno con proteína y carbohidratos tras el partido.",
      en: "400–500 ml water on waking; sip to ~600–800 ml. Breakfast with protein and carbs after the match.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "study",
    kind: "plan",
    start: "08:45",
    end: "11:00",
    title: { es: "Estudio · I2 bdd", en: "Study · I2 bdd" },
    detail: {
      es: "Pruebas pasadas y ejercicios. Agua a mano.",
      en: "Past exams and exercises. Water on hand.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "walk",
    kind: "plan",
    start: "11:00",
    end: "11:20",
    title: { es: "Pausa · caminar", en: "Break · walk" },
    detail: {
      es: "Caminata corta o movilidad suave. Sin gimnasio hoy.",
      en: "Short walk or easy mobility. No gym today.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "study2",
    kind: "plan",
    start: "11:20",
    end: "13:00",
    title: { es: "Estudio · temas débiles", en: "Study · weak spots" },
    detail: {
      es: "I2 bdd: lo que más cuesta.",
      en: "I2 bdd: the hardest topics.",
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
      es: "Comida real.",
      en: "Real meal.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "review",
    kind: "plan",
    start: "14:00",
    end: "15:00",
    title: { es: "Repaso final · I2 bdd", en: "Final review · I2 bdd" },
    detail: {
      es: "Liviano, sin materia nueva.",
      en: "Light, no new material.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "mila",
    kind: "event",
    start: "16:00",
    end: "16:40",
    title: { es: "Mila · terminar ~16:40", en: "Mila · wrap up ~16:40" },
    detail: {
      es: "Clase de mates.",
      en: "Math class.",
    },
    location: { es: "Clase de mates", en: "Math class" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "drive",
    kind: "transit",
    start: "16:40",
    end: "17:15",
    title: { es: "Traslado al campus", en: "Drive to campus" },
    detail: {
      es: "Directo a la I2.",
      en: "Straight to the I2.",
    },
    location: { es: "Hacia Universidad", en: "To University" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "i2",
    kind: "event",
    start: "17:30",
    end: "20:00",
    title: { es: "I2 bdd", en: "I2 bdd" },
    detail: {
      es: "Interrogación de Bases de Datos.",
      en: "Bases de Datos midterm.",
    },
    location: { es: "Universidad", en: "University" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "wind",
    kind: "plan",
    start: "20:30",
    end: "22:40",
    title: { es: "Cena · cierre", en: "Dinner · wind-down" },
    detail: {
      es: "Mochila del martes. Luces ~22:40.",
      en: "Tuesday bag. Lights ~22:40.",
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
    detail: { es: "Interrogación de Bases de Datos. Prioridad de hoy.", en: "Bases de Datos midterm. Today's priority." },
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
    id: "acfin-22",
    when: { es: "jue 22 oct · 15:00", en: "Thu 22 Oct · 15:00" },
    title: { es: "Seguimiento ACFIN", en: "Seguimiento ACFIN" },
    detail: { es: "Remoto. Mostrar avance.", en: "Remote. Show progress." },
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
  transit: "1",
  first: "08:00",
};
