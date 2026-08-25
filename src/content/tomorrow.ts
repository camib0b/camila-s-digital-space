export const TOMORROW_DATE = "2026-08-26";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-08-25T09:39:00-04:00";

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
  kicker: { es: "miércoles 26 de agosto", en: "wednesday 26 august" } satisfies Copy,
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
    es: "WFH cierra a las 09:30 en Vitacura. Deja ~55–60 min para llegar a Ingeniería UC (Macul) a las 11:00. Hockey a las 17:00 se solapa 20 min con el fin del bloque de clases.",
    en: "WFH ends at 09:30 in Vitacura. Leave ~55–60 min to reach Ingeniería UC (Macul) by 11:00. Hockey at 17:00 overlaps the last 20 min of the class block.",
  } satisfies Copy,
  later: { es: "Más tarde", en: "Later today" } satisfies Copy,
  laterBody: {
    es: "El bloque «clases» en campus sigue hasta las 17:20. Después, hockey en Ñuñoa.",
    en: "The campus «clases» block continues until 17:20. Then hockey in Ñuñoa.",
  } satisfies Copy,
  night: { es: "La noche anterior", en: "The night before" } satisfies Copy,
  source: {
    es: "Desde Google Calendar · 25 ago 2026",
    en: "From Google Calendar · 25 Aug 2026",
  } satisfies Copy,
  map: { es: "Mapa", en: "Map" } satisfies Copy,
};

export const nightBefore: Copy[] = [
  {
    es: "Dejar ropa lista para WFH + uni, y la bolsa de hockey",
    en: "Lay out clothes for WFH + campus, and the hockey bag",
  },
  {
    es: "Armar mochila: laptop, cargadores, apuntes",
    en: "Pack the backpack: laptop, chargers, notes",
  },
  {
    es: "Preparar desayuno y botella de agua en el refri",
    en: "Prep breakfast and a water bottle in the fridge",
  },
  {
    es: "Alarma 06:15, con un backup a las 06:25",
    en: "Alarm at 06:15, with a backup at 06:25",
  },
  {
    es: "Cargar teléfono y laptop",
    en: "Charge phone and laptop",
  },
  {
    es: "Luces apagadas ~22:30–23:00 para 7.5–8 h de sueño",
    en: "Lights out ~22:30–23:00 for 7.5–8 h of sleep",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "06:15",
    end: "06:45",
    title: { es: "Despertar · rutina", en: "Wake · morning routine" },
    detail: {
      es: "Agua, baño, cara, estiramiento liviano. Ropa lista de anoche.",
      en: "Water, bathroom, face, light stretch. Clothes laid out last night.",
    },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "breakfast",
    kind: "plan",
    start: "06:45",
    end: "07:15",
    title: { es: "Desayuno + prep", en: "Breakfast + prep" },
    detail: {
      es: "Desayuno con proteína. Revisar mochila uni y notas del bloque WFH.",
      en: "Protein-forward breakfast. Check uni bag and notes for the WFH block.",
    },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "settle",
    kind: "plan",
    start: "07:15",
    end: "07:30",
    title: { es: "Acomodarse", en: "Settle in" },
    detail: {
      es: "Abrir laptop, escritorio listo, ambiente de trabajo.",
      en: "Open the laptop, clear the desk, start the work environment.",
    },
    location: {
      es: "Av. Vitacura 4747, Vitacura",
      en: "Av. Vitacura 4747, Vitacura",
    },
    mapQuery: "Av Vitacura 4747, Vitacura, Chile",
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "wfh",
    kind: "event",
    start: "07:30",
    end: "09:30",
    title: { es: "Trabajo desde casa", en: "Work from home" },
    detail: {
      es: "Bloque de deep work antes de salir a campus. Del calendario.",
      en: "Deep-work block before heading to campus. From the calendar.",
    },
    location: {
      es: "Av. Vitacura 4747, Vitacura",
      en: "Av. Vitacura 4747, Vitacura",
    },
    mapQuery: "Av Vitacura 4747, Vitacura, Chile",
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "commute",
    kind: "transit",
    start: "09:30",
    end: "11:00",
    title: { es: "Camino a campus", en: "Travel to campus" },
    detail: {
      es: "Vitacura → San Joaquín. Ventana libre en el calendario — salir ~09:50 para ~55–60 min de trayecto.",
      en: "Vitacura → San Joaquín. Open calendar window — leave ~09:50 for a ~55–60 min ride.",
    },
    location: {
      es: "Hacia Ingeniería UC, Macul",
      en: "To Ingeniería UC, Macul",
    },
    mapQuery: "Ingeniería UC, Benito Rebolledo 1872, Macul, Chile",
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "bdd",
    kind: "event",
    start: "11:00",
    end: "12:20",
    title: { es: "Bases de datos", en: "Databases" },
    detail: {
      es: "Primera sesión del bloque «clases» (11:00 bdd).",
      en: "First session in the campus «clases» block (11:00 bdd).",
    },
    location: {
      es: "Ingeniería UC, Benito Rebolledo 1872–1976, Macul",
      en: "Ingeniería UC, Benito Rebolledo 1872–1976, Macul",
    },
    mapQuery: "Ingeniería UC, Benito Rebolledo 1872, Macul, Chile",
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "innovacion",
    kind: "event",
    start: "12:20",
    end: "13:40",
    title: { es: "Innovación", en: "Innovation" },
    detail: {
      es: "Cierra la mañana en campus (12:20 innovación). El bloque «clases» sigue hasta las 17:20.",
      en: "Closes the morning on campus (12:20 innovación). The «clases» block continues until 17:20.",
    },
    location: {
      es: "Ingeniería UC, Campus San Joaquín",
      en: "Ingeniería UC, San Joaquín campus",
    },
    mapQuery: "Ingeniería UC, Benito Rebolledo 1872, Macul, Chile",
    tag: { es: "Calendario", en: "Calendar" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "eti",
    kind: "event",
    start: "14:50",
    end: "16:10",
    title: { es: "ETI", en: "ETI" },
    detail: {
      es: "Tercera sesión anotada en el bloque de clases (14:50 eti).",
      en: "Third session noted inside the campus class block (14:50 eti).",
    },
    location: {
      es: "Ingeniería UC, Macul",
      en: "Ingeniería UC, Macul",
    },
    mapQuery: "Ingeniería UC, Benito Rebolledo 1872, Macul, Chile",
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "hockey",
    kind: "event",
    start: "17:00",
    end: "19:00",
    title: { es: "Sub-12 grupo azul", en: "U-12 blue group" },
    detail: {
      es: "Entrenamiento. Se solapa 20 min con el fin del bloque de clases (hasta 17:20).",
      en: "Coaching. Overlaps 20 min with the end of the campus class block (until 17:20).",
    },
    location: {
      es: "Chile Hockey · Centro Claudia Schüler, Av. Marathón 1420, Ñuñoa",
      en: "Chile Hockey · Centro Claudia Schüler, Av. Marathón 1420, Ñuñoa",
    },
    mapQuery: "Centro Claudia Schüler, Av. Marathón 1420, Ñuñoa, Chile",
    tag: { es: "Calendario", en: "Calendar" },
  },
];

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
  committed: "4h 40m",
  transit: "1h 30m",
  first: "07:30",
};
