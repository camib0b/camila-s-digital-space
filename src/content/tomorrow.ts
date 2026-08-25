export const TOMORROW_DATE = "2026-08-26";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-08-25T09:26:00-04:00";

export type Lang = "en" | "es";

export type Copy = Record<Lang, string>;

export type BlockKind = "event" | "transit";

export interface ScheduleBlock {
  id: string;
  kind: BlockKind;
  start: string;
  end: string;
  title: Copy;
  detail?: Copy;
  location?: Copy;
  mapQuery?: string;
  tag?: Copy;
}

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wfh",
    kind: "event",
    start: "07:30",
    end: "09:30",
    title: { es: "Trabajo desde casa", en: "Work from home" },
    detail: {
      es: "Bloque de deep work antes de salir a campus.",
      en: "Deep-work block before heading to campus.",
    },
    location: {
      es: "Av. Vitacura 4747, Vitacura",
      en: "Av. Vitacura 4747, Vitacura",
    },
    mapQuery: "Av Vitacura 4747, Vitacura, Chile",
    tag: { es: "Trabajo", en: "Work" },
  },
  {
    id: "commute",
    kind: "transit",
    start: "09:30",
    end: "11:00",
    title: { es: "Camino a campus", en: "Travel to campus" },
    detail: {
      es: "Vitacura → San Joaquín. Ventana libre en el calendario — úsala para traslado y llegada.",
      en: "Vitacura → San Joaquín. Open calendar window — commute and arrive.",
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
      es: "Primera clase del bloque «clases». Módulo de 80 minutos.",
      en: "First session in the campus «clases» block. 80-minute module.",
    },
    location: {
      es: "Ingeniería UC, Benito Rebolledo 1872–1976, Macul",
      en: "Ingeniería UC, Benito Rebolledo 1872–1976, Macul",
    },
    mapQuery: "Ingeniería UC, Benito Rebolledo 1872, Macul, Chile",
    tag: { es: "Clases", en: "Class" },
  },
  {
    id: "innovacion",
    kind: "event",
    start: "12:20",
    end: "13:40",
    title: { es: "Innovación", en: "Innovation" },
    detail: {
      es: "Cierra la mañana en campus. El bloque «clases» del calendario sigue hasta las 17:20.",
      en: "Closes the morning on campus. The calendar «clases» block continues until 17:20.",
    },
    location: {
      es: "Ingeniería UC, Campus San Joaquín",
      en: "Ingeniería UC, San Joaquín campus",
    },
    mapQuery: "Ingeniería UC, Benito Rebolledo 1872, Macul, Chile",
    tag: { es: "Clases", en: "Class" },
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
      es: "Tercera sesión anotada en el bloque de clases.",
      en: "Third session noted inside the campus class block.",
    },
    location: {
      es: "Ingeniería UC, Macul",
      en: "Ingeniería UC, Macul",
    },
    mapQuery: "Ingeniería UC, Benito Rebolledo 1872, Macul, Chile",
    tag: { es: "Clases", en: "Class" },
  },
  {
    id: "hockey",
    kind: "event",
    start: "17:00",
    end: "19:00",
    title: { es: "Sub-12 grupo azul", en: "U-12 blue group" },
    detail: {
      es: "Entrenamiento. Se solapa 20 min con el fin del bloque de clases en el calendario.",
      en: "Coaching. Overlaps 20 min with the end of the campus class block.",
    },
    location: {
      es: "Chile Hockey · Centro Claudia Schüler, Av. Marathón 1420, Ñuñoa",
      en: "Chile Hockey · Centro Claudia Schüler, Av. Marathón 1420, Ñuñoa",
    },
    mapQuery: "Centro Claudia Schüler, Av. Marathón 1420, Ñuñoa, Chile",
    tag: { es: "Hockey", en: "Hockey" },
  },
];

export function durationLabel(start: string, end: string, lang: Lang): string {
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
