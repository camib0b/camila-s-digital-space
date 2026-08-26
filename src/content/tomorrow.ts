export const TOMORROW_DATE = "2026-08-27";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-08-26T09:30:00-04:00";

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
  kicker: { es: "jueves 27 de agosto", en: "thursday 27 august" } satisfies Copy,
  title: { es: "Mañana", en: "Morning" } satisfies Copy,
  subtitle: {
    es: "Agenda completa hasta el mediodía, leída de tu calendario — con el trayecto y el arranque alrededor del primer bloque.",
    en: "Full morning laid out from your calendar — plus the commute and the start around the first block.",
  } satisfies Copy,
  timezone: { es: "Santiago · UTC−4", en: "Santiago · UTC−4" } satisfies Copy,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies Copy,
  committed: { es: "En calendario", en: "On the calendar" } satisfies Copy,
  transit: { es: "Traslado", en: "Transit" } satisfies Copy,
  first: { es: "Primer bloque", en: "First block" } satisfies Copy,
  note: {
    es: "Clases en campus desde las 08:20 (arqui) y 09:40 (web). Deja ~55–60 min de casa a University. Pronóstico: fresco y con probabilidad alta de lluvia/tormentas — lleva capa impermeable y capas intermedias.",
    en: "Campus classes from 08:20 (arqui) and 09:40 (web). Leave ~55–60 min from Home to University. Forecast: cool with high chance of rain/thunderstorms — bring a waterproof outer layer and mid layers.",
  } satisfies Copy,
  later: { es: "Más tarde", en: "Later today" } satisfies Copy,
  laterBody: {
    es: "El bloque «clases» del calendario termina a las 11:00. El resto del día queda libre en el calendario por ahora.",
    en: "The calendar «clases» block ends at 11:00. The rest of the day is open on the calendar for now.",
  } satisfies Copy,
  night: { es: "La noche anterior", en: "The night before" } satisfies Copy,
  source: {
    es: "Desde Google Calendar · 26 ago 2026",
    en: "From Google Calendar · 26 Aug 2026",
  } satisfies Copy,
  map: { es: "Mapa", en: "Map" } satisfies Copy,
};

export const nightBefore: Copy[] = [
  {
    es: "Dejar ropa lista: base + mid + capa impermeable (lluvia prevista)",
    en: "Lay out clothes: base + mid + waterproof outer (rain expected)",
  },
  {
    es: "Armar mochila: laptop, cargadores, apuntes de arqui y web",
    en: "Pack the backpack: laptop, chargers, notes for arqui and web",
  },
  {
    es: "Preparar desayuno y botella de agua en el refri",
    en: "Prep breakfast and a water bottle in the fridge",
  },
  {
    es: "Alarma 06:00, con un backup a las 06:10",
    en: "Alarm at 06:00, with a backup at 06:10",
  },
  {
    es: "Cargar teléfono y laptop",
    en: "Charge phone and laptop",
  },
  {
    es: "Luces apagadas ~22:00–22:30 para ~7.5–8 h de sueño",
    en: "Lights out ~22:00–22:30 for ~7.5–8 h of sleep",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "06:00",
    end: "06:30",
    title: { es: "Despertar · rutina", en: "Wake · morning routine" },
    detail: {
      es: "400–500 ml de agua al despertar. Baño, cara, estiramiento liviano. Ropa lista de anoche.",
      en: "400–500 ml water on waking. Bathroom, face, light stretch. Clothes laid out last night.",
    },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "breakfast",
    kind: "plan",
    start: "06:30",
    end: "07:00",
    title: { es: "Desayuno + prep", en: "Breakfast + prep" },
    detail: {
      es: "Desayuno con proteína. Revisar mochila y notas. Seguir hidratando hasta ~600–800 ml antes de salir.",
      en: "Protein-forward breakfast. Check bag and notes. Keep sipping water to ~600–800 ml before leaving.",
    },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "final-prep",
    kind: "plan",
    start: "07:00",
    end: "07:20",
    title: { es: "Últimos detalles", en: "Final prep" },
    detail: {
      es: "Zapatos, capa impermeable, revisar que todo esté en la mochila. Salir con margen.",
      en: "Shoes, waterproof layer, final bag check. Leave with buffer.",
    },
    location: {
      es: "Home",
      en: "Home",
    },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "commute",
    kind: "transit",
    start: "07:20",
    end: "08:15",
    title: { es: "Camino a campus", en: "Travel to campus" },
    detail: {
      es: "Transporte público. ~55–60 min de puerta a puerta. Apuntar a llegar ~08:15 para el inicio a las 08:20.",
      en: "Public transport. ~55–60 min door to door. Aim to arrive ~08:15 for the 08:20 start.",
    },
    location: {
      es: "Hacia University",
      en: "To University",
    },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "arqui",
    kind: "event",
    start: "08:20",
    end: "09:40",
    title: { es: "Arqui", en: "Arqui" },
    detail: {
      es: "Primera sesión del bloque «clases» (08:20 arqui).",
      en: "First session in the campus «clases» block (08:20 arqui).",
    },
    location: {
      es: "University",
      en: "University",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "web",
    kind: "event",
    start: "09:40",
    end: "11:00",
    title: { es: "Web", en: "Web" },
    detail: {
      es: "Segunda sesión del bloque «clases» (09:40 web). El bloque del calendario cierra a las 11:00.",
      en: "Second session in the campus «clases» block (09:40 web). Calendar block ends at 11:00.",
    },
    location: {
      es: "University",
      en: "University",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
];

export const laterBlocks: ScheduleBlock[] = [];

export function durationLabel(start: string, end: string | undefined, lang: Lang): string {
  if (!end) return "";
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const minutes = eh * 60 + em - (sh * 60 + sm);
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
  committed: "2h 40m",
  transit: "55m",
  first: "08:20",
};
