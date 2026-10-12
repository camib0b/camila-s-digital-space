import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-10-13";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-10-12T20:25:00-03:00";

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
  kicker: { es: "martes 13 de octubre", en: "tuesday 13 october" } satisfies LocalizedText,
  title: { es: "Mañana", en: "Morning" } satisfies LocalizedText,
  subtitle: {
    es: "Sin gimnasio. Alarma 06:40, salir 07:20. Clases 08:20 (arqui + web). Tarde: Perfil de Proyecto. Luces ~23:00.",
    en: "No gym. Alarm 06:40, leave 07:20. Classes 08:20 (arqui + web). Afternoon: Project Profile. Lights ~23:00.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Ancla: clase 08:20 — salir de Casa 07:20. Sin gimnasio (no está en el calendario; partido el miércoles). Tarde: cerrar Perfil de Proyecto (IIC3743, entrega mié 14 · 13:00). Impermeable o paraguas: lluvia desde ~15:00, 9–18 °C.",
    en: "Anchor: class 08:20 — leave Home 07:20. No gym (not on the calendar; match Wednesday). Afternoon: finish Project Profile (IIC3743, due Wed 14 · 13:00). Rain jacket or umbrella: rain from ~15:00, 9–18 °C.",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Clases 08:20–11:00 (arqui + web). Almuerzo en Casa. Tarde: Perfil de Proyecto antes del corte del miércoles 13:00. Noche liviana; luces ~23:00 — el miércoles sales a las 10:00 (clase 11:00).",
    en: "Classes 08:20–11:00 (arqui + web). Lunch at Home. Afternoon: Project Profile before Wednesday's 13:00 cutoff. Light evening; lights ~23:00 — Wednesday you leave at 10:00 (class 11:00).",
  } satisfies LocalizedText,
  upcoming: { es: "Próximo", en: "Upcoming" } satisfies LocalizedText,
  upcomingBody: {
    es: "Lo que pide preparación en los próximos días.",
    en: "What needs prep in the next several days.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 12 oct 2026, 20:25",
    en: "From Google Calendar · 12 Oct 2026, 20:25",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Luces ~22:40 — 8 h hasta la alarma 06:40.",
    en: "Lights ~22:40 — 8 h before the 06:40 alarm.",
  },
  {
    es: "Alarma 06:40, backup 06:50. Salir de Casa 07:20 (clase 08:20).",
    en: "Alarm 06:40, backup 06:50. Leave Home 07:20 (class 08:20).",
  },
  {
    es: "Mochila de clase y botella listas.",
    en: "Class bag and bottle ready.",
  },
  {
    es: "Impermeable o paraguas (lluvia desde ~15:00, 9–18 °C).",
    en: "Rain jacket or umbrella (rain from ~15:00, 9–18 °C).",
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
      es: "Mochila, botella, impermeable. Salir a las 07:20 en punto.",
      en: "Bag, bottle, rain jacket. Leave at 07:20 sharp.",
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
    id: "perfil",
    kind: "plan",
    start: "13:00",
    end: "17:00",
    title: { es: "Perfil de Proyecto", en: "Project Profile" },
    detail: {
      es: "IIC3743 · entrega mié 14 · 13:00. Cerrar borrador en grupo.",
      en: "IIC3743 · due Wed 14 · 13:00. Close the group draft.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "wind",
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
    id: "perfil",
    when: { es: "mié 14 oct · 13:00", en: "Wed 14 Oct · 13:00" },
    title: { es: "Perfil de Proyecto", en: "Project Profile" },
    detail: { es: "IIC3743 · Informe Preliminar. Cerrar mañana.", en: "IIC3743 · preliminary report. Finish tomorrow." },
  },
  {
    id: "i2-bdd",
    when: { es: "lun 19 oct · 17:30", en: "Mon 19 Oct · 17:30" },
    title: { es: "I2 bdd", en: "I2 bdd" },
    detail: { es: "Interrogación de Bases de Datos. Seguir estudiando esta semana.", en: "Bases de Datos midterm. Keep studying this week." },
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
  transit: "55 min",
  first: "06:40",
};
