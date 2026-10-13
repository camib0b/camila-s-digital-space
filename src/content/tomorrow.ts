import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-10-14";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-10-13T20:25:00-03:00";

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
  kicker: { es: "miércoles 14 de octubre", en: "wednesday 14 october" } satisfies LocalizedText,
  title: { es: "Mañana", en: "Morning" } satisfies LocalizedText,
  subtitle: {
    es: "Sin gimnasio. Alarma 07:30, Actividad 4 de web, salir 10:00. Clases 11:00–17:20. Partido UC B vs COGS 21:00.",
    en: "No gym. Alarm 07:30, Web Actividad 4, leave 10:00. Classes 11:00–17:20. UC B vs COGS match 21:00.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Ancla: clase 11:00 — salir de Casa 10:00. Sin gimnasio: el partido es el entrenamiento. Web Actividad 4 vence a las 22:00, en pleno partido: subirla antes de salir. Perfil de Proyecto vence a las 13:00, si falta. Chaqueta abrigada para la noche (~8 °C temprano, máx ~19 °C, ~13 °C a las 22:00).",
    en: "Anchor: class 11:00 — leave Home 10:00. No gym: the match is the workout. Web Actividad 4 is due 22:00, mid-match: push it before you leave. Project Profile is due 13:00, if still pending. Warm jacket for the night (~8 °C early, high ~19 °C, ~13 °C at 22:00).",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Clases 11:00–17:20 (bdd + innovación, almuerzo, eti). Vuelta a Casa, cerrar Actividad 4 si falta y comida pre-partido. UC B vs COGS 21:00. Después: proteína + carbohidratos, hidratar, luces ~23:30 — el jueves sales a las 07:20.",
    en: "Classes 11:00–17:20 (bdd + innovación, lunch, eti). Back Home, finish Actividad 4 if needed, pre-match meal. UC B vs COGS 21:00. After: protein + carbs, hydrate, lights ~23:30 — Thursday you leave at 07:20.",
  } satisfies LocalizedText,
  upcoming: { es: "Próximo", en: "Upcoming" } satisfies LocalizedText,
  upcomingBody: {
    es: "Lo que pide preparación en los próximos días.",
    en: "What needs prep in the next several days.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 13 oct 2026, 20:25",
    en: "From Google Calendar · 13 Oct 2026, 20:25",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Luces ~23:00 — 8.5 h hasta la alarma 07:30.",
    en: "Lights ~23:00 — 8.5 h before the 07:30 alarm.",
  },
  {
    es: "Alarma 07:30, backup 07:45. Salir de Casa 10:00 (clase 11:00).",
    en: "Alarm 07:30, backup 07:45. Leave Home 10:00 (class 11:00).",
  },
  {
    es: "Repo de la Actividad 4 abierto y listo para la mañana.",
    en: "Actividad 4 repo open and ready for the morning.",
  },
  {
    es: "Bolso de hockey listo esta noche; chaqueta abrigada para el partido.",
    en: "Hockey bag ready tonight; warm jacket for the match.",
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
      es: "400–500 ml de agua al despertar; hidratar hasta ~600–800 ml. Desayuno real.",
      en: "400–500 ml water on waking; sip to ~600–800 ml. Real breakfast.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "act4",
    kind: "plan",
    start: "08:00",
    end: "09:30",
    title: { es: "Web Actividad 4", en: "Web Actividad 4" },
    detail: {
      es: "Workflow de GitHub Actions en verde y en main. Vence 22:00, durante el partido.",
      en: "GitHub Actions workflow green and on main. Due 22:00, during the match.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "buffer",
    kind: "plan",
    start: "09:30",
    end: "10:00",
    title: { es: "Margen · salir", en: "Buffer · leave" },
    detail: {
      es: "Perfil de Proyecto entregado si falta (13:00). Mochila y botella. Salir a las 10:00 en punto.",
      en: "Project Profile submitted if pending (13:00). Bag and bottle. Leave at 10:00 sharp.",
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
      es: "Una hora, puerta a sala. Clase 11:00.",
      en: "One hour, door to classroom. Class at 11:00.",
    },
    location: { es: "Hacia Universidad", en: "To University" },
    tag: { es: "Traslados", en: "Transit" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "classes-am",
    kind: "event",
    start: "11:00",
    end: "13:30",
    title: { es: "Clases · bdd + innovación", en: "Classes · bdd + innovación" },
    detail: {
      es: "11:00 bdd · 12:20 innovación.",
      en: "11:00 bdd · 12:20 innovación.",
    },
    location: { es: "Universidad", en: "University" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "lunch",
    kind: "plan",
    start: "13:30",
    end: "14:50",
    title: { es: "Almuerzo", en: "Lunch" },
    detail: {
      es: "Almuerzo real.",
      en: "Real lunch.",
    },
    location: { es: "Universidad", en: "University" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "eti",
    kind: "event",
    start: "14:50",
    end: "17:20",
    title: { es: "Clase · eti", en: "Class · eti" },
    detail: {
      es: "Bloque de clases hasta 17:20.",
      en: "Class block to 17:20.",
    },
    location: { es: "Universidad", en: "University" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "prematch",
    kind: "plan",
    start: "18:20",
    end: "19:30",
    title: { es: "Actividad 4 · comida pre-partido", en: "Actividad 4 · pre-match meal" },
    detail: {
      es: "Cerrar y subir la Actividad 4 si falta. Comida real ~18:30.",
      en: "Finish and push Actividad 4 if needed. Real meal ~18:30.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "match",
    kind: "event",
    start: "21:00",
    end: "22:30",
    title: { es: "UC B vs COGS", en: "UC B vs COGS" },
    detail: {
      es: "Juegas. Salir con tiempo para calentar.",
      en: "You play. Leave with time to warm up.",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "recover",
    kind: "plan",
    start: "22:30",
    end: "23:30",
    title: { es: "Recuperación · cierre", en: "Recovery · wind-down" },
    detail: {
      es: "Proteína + carbohidratos, hidratar. Luces ~23:30, alarma jueves 06:45.",
      en: "Protein + carbs, hydrate. Lights ~23:30, Thursday alarm 06:45.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
];

export const upcomingItems: UpcomingItem[] = [
  {
    id: "perfil",
    when: { es: "mié 14 oct · 13:00", en: "Wed 14 Oct · 13:00" },
    title: { es: "Perfil de Proyecto", en: "Project Profile" },
    detail: { es: "Estrategias TI. Entregar antes de salir si falta.", en: "Estrategias TI. Submit before leaving if pending." },
  },
  {
    id: "act4",
    when: { es: "mié 14 oct · 22:00", en: "Wed 14 Oct · 22:00" },
    title: { es: "Web Actividad 4", en: "Web Actividad 4" },
    detail: { es: "GitHub Actions. Subirla antes del partido.", en: "GitHub Actions. Push it before the match." },
  },
  {
    id: "i2-bdd",
    when: { es: "lun 19 oct · 17:30", en: "Mon 19 Oct · 17:30" },
    title: { es: "I2 bdd", en: "I2 bdd" },
    detail: { es: "Interrogación de Bases de Datos. Seguir estudiando esta semana.", en: "Bases de Datos midterm. Keep studying this week." },
  },
  {
    id: "i2-arqui",
    when: { es: "jue 22 oct · 17:30", en: "Thu 22 Oct · 17:30" },
    title: { es: "I2 arqui", en: "I2 arqui" },
    detail: { es: "Interrogación de Arquitectura.", en: "Arquitectura midterm." },
  },
  {
    id: "acfin",
    when: { es: "jue 15 oct · 15:00", en: "Thu 15 Oct · 15:00" },
    title: { es: "Seguimiento ACFIN", en: "Seguimiento ACFIN" },
    detail: { es: "Remoto. Llevar avance para mostrar.", en: "Remote. Bring progress to show." },
  },
  {
    id: "ucb-alumni",
    when: { es: "dom 18 oct", en: "Sun 18 Oct" },
    title: { es: "UC B vs Alumni", en: "UC B vs Alumni" },
    detail: { es: "Juegas.", en: "You play." },
  },
  {
    id: "arqui-20",
    when: { es: "mar 20 oct", en: "Tue 20 Oct" },
    title: { es: "Ap arqui + A5 arqui", en: "Ap arqui + A5 arqui" },
    detail: { es: "Actividades evaluadas en clase, 08:20 y 14:50.", en: "Graded in-class activities, 08:20 and 14:50." },
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
  first: "07:30",
};
