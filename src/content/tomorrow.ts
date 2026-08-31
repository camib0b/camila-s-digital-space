export const TOMORROW_DATE = "2026-09-01";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-08-31T08:45:00-04:00";

export type Lang = "en" | "es";

export type Copy = Record<Lang, string>;

export type BlockKind = "plan" | "event" | "transit";

export interface ScheduleBlock {
  id: string;
  kind: BlockKind;
  start: string;
  end?: string;
  title: Copy;
  detail?: Copy;
  location?: Copy;
  mapQuery?: string;
  tag: Copy;
}

export const pageCopy = {
  back: { es: "Volver", en: "Back" } satisfies Copy,
  kicker: { es: "martes 1 de septiembre", en: "tuesday 1 september" } satisfies Copy,
  title: { es: "Mañana", en: "Morning" } satisfies Copy,
  subtitle: {
    es: "Sin gimnasio. Universidad a las 08:20 (arqui, después web). A2 arqui a las 14:50.",
    en: "No gym. University at 08:20 (arqui, then web). A2 arqui at 14:50.",
  } satisfies Copy,
  timezone: { es: "Santiago · UTC−4", en: "Santiago · UTC−4" } satisfies Copy,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies Copy,
  committed: { es: "En calendario", en: "On the calendar" } satisfies Copy,
  transit: { es: "Traslado", en: "Transit" } satisfies Copy,
  first: { es: "Primer bloque", en: "First block" } satisfies Copy,
  note: {
    es: "Dos eventos en Google Calendar: clases 08:20–11:00 en Universidad (8:20 arqui · 9:40 web), A2 arqui 14:50–17:00. Sin gimnasio esta mañana. Sal de Casa a las 07:20 (55–60 min puerta a sala). Mañana fresca ~10–13 °C, máxima ~17–21 °C, parcialmente nublado — manga larga o base ligera más chaqueta liviana.",
    en: "Two Google Calendar events: class 08:20–11:00 at University (8:20 arqui · 9:40 web), A2 arqui 14:50–17:00. No gym this morning. Leave Home at 07:20 (55–60 min door to classroom). Cool morning ~10–13 °C, high ~17–21 °C, partly cloudy — long sleeve or light base plus a light jacket.",
  } satisfies Copy,
  later: { es: "Más tarde", en: "Later today" } satisfies Copy,
  laterBody: {
    es: "Después de web (~11:00), almuerzo real y tiempo libre en Universidad o Casa antes de A2 arqui a las 14:50. Ese bloque es trabajo de curso, no entrenamiento.",
    en: "After web (~11:00), a real lunch and free time at University or Home before A2 arqui at 14:50. That block is course work, not training.",
  } satisfies Copy,
  night: { es: "La noche anterior", en: "The night before" } satisfies Copy,
  source: {
    es: "Desde Google Calendar · 31 ago 2026, 08:45",
    en: "From Google Calendar · 31 Aug 2026, 08:45",
  } satisfies Copy,
  map: { es: "Mapa", en: "Map" } satisfies Copy,
};

export const nightBefore: Copy[] = [
  {
    es: "Mochila de Universidad armada anoche: cuaderno/laptop, cargador, botella, colación, notas para arqui (08:20) y web (09:40). Queda en Casa lista para las 07:20.",
    en: "University bag packed tonight: notebook/laptop, charger, bottle, snack, notes for arqui (08:20) and web (09:40). Leave it at Home ready for 07:20.",
  },
  {
    es: "Capas para ~10–13 °C a la salida y máxima ~17–21 °C: manga larga o base ligera, chaqueta o polar liviano. Una sola sugerencia de capas; tú decides el resto.",
    en: "Layers for ~10–13 °C at leave time and high ~17–21 °C: long sleeve or light base, light jacket or fleece. One layer suggestion only; you decide the rest.",
  },
  {
    es: "Alarma 06:40, backup 06:50. Sales de Casa a las 07:20. Botella llena, teléfono cargado, llaves, tarjeta de transporte en la mochila.",
    en: "Alarm 06:40, backup 06:50. Leave Home at 07:20. Bottle filled, phone charged, keys, transit card in the bag.",
  },
  {
    es: "400–500 ml de agua al despertar, luego sorber hasta ~600–800 ml antes de salir. Desayuno liviano en Casa si quieres; no hace falta más.",
    en: "400–500 ml water on waking, then sip to ~600–800 ml before leaving. Light breakfast at Home if you want; nothing more is required.",
  },
  {
    es: "Revisar materiales de A2 arqui (14:50) para no decidir eso a las 14:00.",
    en: "Check materials for A2 arqui (14:50) so you are not deciding that at 14:00.",
  },
  {
    es: "Luces apagadas ~22:15–22:45. Con alarma a las 06:40 necesitas ~7.5–8.5 h en cama. El primer despertar cuesta — no recortes esto.",
    en: "Lights out ~22:15–22:45. A 06:40 alarm needs ~7.5–8.5 h in bed. First alarm is hard — do not cut this.",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "06:40",
    end: "07:20",
    title: { es: "Despertar · salir", en: "Wake · leave" },
    detail: {
      es: "400–500 ml de agua al despertar. Hidratar hasta ~600–800 ml. Mochila lista. Buffer de 40 min porque el primer despertar se atrasa. Sales a las 07:20.",
      en: "400–500 ml water on waking. Sip to ~600–800 ml. Bag ready. 40 min buffer because the first alarm slips. Leave at 07:20.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "transit-uni",
    kind: "transit",
    start: "07:20",
    end: "08:20",
    title: { es: "Traslado a Universidad", en: "Transit to University" },
    detail: {
      es: "55 min puerta a sala. Sale a las 07:20, no a las 07:30. Transporte público.",
      en: "55 min door to classroom. Leave at 07:20, not 07:30. Public transport.",
    },
    location: { es: "Hacia Universidad", en: "To University" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "clases",
    kind: "event",
    start: "08:20",
    end: "11:00",
    title: { es: "Clases", en: "Classes" },
    detail: {
      es: "08:20 arqui · 09:40 web. Bloque continuo hasta 11:00. Agua a mano.",
      en: "08:20 arqui · 09:40 web. Continuous block until 11:00. Water on hand.",
    },
    location: { es: "Universidad", en: "University" },
    tag: { es: "Calendario", en: "Calendar" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "lunch",
    kind: "plan",
    start: "11:00",
    end: "14:50",
    title: { es: "Almuerzo · respiro", en: "Lunch · reset" },
    detail: {
      es: "Comida real después de web. Luego Universidad o Casa, según te alcance el tiempo antes de A2 arqui.",
      en: "Real meal after web. Then University or Home, depending on how much time you have before A2 arqui.",
    },
    location: { es: "Universidad o Casa", en: "University or Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "a2-arqui",
    kind: "event",
    start: "14:50",
    end: "17:00",
    title: { es: "A2 arqui", en: "A2 arqui" },
    detail: {
      es: "Bloque de calendario 14:50–17:00. Trabajo de curso, no entrenamiento.",
      en: "Calendar block 14:50–17:00. Course work, not training.",
    },
    location: { es: "Universidad", en: "University" },
    tag: { es: "Calendario", en: "Calendar" },
  },
];

export function durationLabel(start: string, end: string | undefined, lang: Lang): string {
  if (!end) return "";
  if (!/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end)) return "";
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const minutes = eh * 60 + em - (sh * 60 + sm);
  if (minutes < 0) return "";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (lang === "es") {
    if (hours && rest) return `${hours}h ${rest}m`;
    if (hours) return `${hours}h`;
    return `${rest} min`;
  }
  if (hours && rest) return `${hours}h ${rest}m`;
  if (hours) return `${hours}h`;
  return `${rest} min`;
}

export function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export const STATS = {
  blocks: String(morningBlocks.length),
  committed: "2",
  transit: "55m",
  first: "08:20",
};
