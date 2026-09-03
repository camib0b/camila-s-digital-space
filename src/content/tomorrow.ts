export const TOMORROW_DATE = "2026-09-04";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-09-03T08:47:00-04:00";

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
  kicker: { es: "viernes 4 de septiembre", en: "friday 4 september" } satisfies Copy,
  title: { es: "Mañana", en: "Morning" } satisfies Copy,
  subtitle: {
    es: "Gira Sub-16 en Rosario. Partido 07:30 vs Asociación Sanjuanina B · 13:00 vs Federación Cordobesa. Sin gimnasio ni universidad.",
    en: "Sub-16 tour in Rosario. Match 07:30 vs Asociación Sanjuanina B · 13:00 vs Federación Cordobesa. No gym, no university.",
  } satisfies Copy,
  timezone: { es: "Santiago · UTC−4 · Rosario local UTC−3", en: "Santiago · UTC−4 · Rosario local UTC−3" } satisfies Copy,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies Copy,
  committed: { es: "En calendario", en: "On the calendar" } satisfies Copy,
  transit: { es: "Traslado", en: "Transit" } satisfies Copy,
  first: { es: "Primer bloque", en: "First block" } satisfies Copy,
  note: {
    es: "Dos partidos en Google Calendar (Universitario 2, Rosario): 07:30–09:00 vs Asociación Sanjuanina B y 13:00–14:30 vs Federación Cordobesa. Son partidos de selección (eventos «vs»), no sesiones de coaching Sub-12/14/16. Protocolo de recuperación post-partido sí aplica. Mañana fresca ~8–10 °C, máxima ~18–21 °C, mayormente despejado — base + capa liviana para la salida temprano; se quita después.",
    en: "Two matches on Google Calendar (Universitario 2, Rosario): 07:30–09:00 vs Asociación Sanjuanina B and 13:00–14:30 vs Federación Cordobesa. Selection matches («vs» events), not Sub-12/14/16 coaching blocks. Post-match recovery nutrition applies. Cool morning ~8–10 °C, high ~18–21 °C, mostly clear — base + light layer for the early leave; remove later.",
  } satisfies Copy,
  later: { es: "Más tarde", en: "Later today" } satisfies Copy,
  laterBody: {
    es: "Ventana entre partidos para comida real, hidratación y descanso relativo. Segundo partido 13:00–14:30. El bloque de gira continúa hasta el 7 de septiembre. No es día de gimnasio ni de clases.",
    en: "Window between matches for real food, hydration and relative rest. Second match 13:00–14:30. Tour block continues through 7 September. Not a gym or class day.",
  } satisfies Copy,
  night: { es: "La noche anterior", en: "The night before" } satisfies Copy,
  source: {
    es: "Desde Google Calendar · 3 sep 2026, 08:47",
    en: "From Google Calendar · 3 Sep 2026, 08:47",
  } satisfies Copy,
  map: { es: "Mapa", en: "Map" } satisfies Copy,
};

export const nightBefore: Copy[] = [
  {
    es: "Kit de partido listo: indumentaria de juego, calzado, toalla, botella, cualquier material del equipo. Dejarlo visible para no buscar a las 06:00.",
    en: "Match kit ready: playing kit, shoes, towel, bottle, any team materials. Leave it visible so you are not searching at 06:00.",
  },
  {
    es: "Capas para ~8–10 °C a la salida y máxima ~18–21 °C: base o manga larga + capa liviana (polar o cortaviento fino). Una sola sugerencia; tú decides el resto.",
    en: "Layers for ~8–10 °C at leave and high ~18–21 °C: base or long sleeve + light layer (fleece or thin windbreaker). One suggestion only; you decide the rest.",
  },
  {
    es: "Alarma 05:45, backup 05:55. Buffer real porque el primer despertar se atrasa. Botella llena, teléfono cargado, llaves y documentos del equipo a mano.",
    en: "Alarm 05:45, backup 05:55. Real buffer because the first alarm slips. Bottle filled, phone charged, keys and team documents ready.",
  },
  {
    es: "400–500 ml de agua al despertar, luego sorber hasta ~600–800 ml antes de salir. Colación mínima si la necesitas; el desayuno real puede ser después del primer partido o en la ventana del mediodía.",
    en: "400–500 ml water on waking, then sip to ~600–800 ml before leaving. Minimal snack if needed; real breakfast can wait until after the first match or in the midday window.",
  },
  {
    es: "Confirmar hora de salida del alojamiento y traslado al Universitario 2 con el plan del equipo. No improvisar tiempos de puerta a cancha.",
    en: "Confirm leave time from accommodation and transfer to Universitario 2 with the team plan. Do not improvise door-to-pitch times.",
  },
  {
    es: "Luces apagadas ~21:30–22:00. Con alarma a las 05:45 necesitas ~7.5–8.5 h en cama. El primer despertar cuesta — no recortes esto.",
    en: "Lights out ~21:30–22:00. A 05:45 alarm needs ~7.5–8.5 h in bed. First alarm is hard — do not cut this.",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "05:45",
    end: "06:30",
    title: { es: "Despertar · salir", en: "Wake · leave" },
    detail: {
      es: "400–500 ml de agua al despertar. Hidratar hasta ~600–800 ml. Kit listo. Buffer de ~45 min porque el primer despertar se atrasa. Salida del alojamiento según plan del equipo para llegar con margen al Universitario 2.",
      en: "400–500 ml water on waking. Sip to ~600–800 ml. Kit ready. ~45 min buffer because the first alarm slips. Leave accommodation per team plan to arrive at Universitario 2 with margin.",
    },
    location: { es: "Alojamiento", en: "Accommodation" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "transit-venue",
    kind: "transit",
    start: "06:30",
    end: "07:15",
    title: { es: "Traslado a cancha", en: "Transit to pitch" },
    detail: {
      es: "Salida con margen para llegar al Universitario 2, Rosario, con tiempo de activación antes del 07:30. Coordinar con el equipo.",
      en: "Leave with margin to reach Universitario 2, Rosario, with activation time before 07:30. Coordinate with the team.",
    },
    location: { es: "Hacia Universitario 2", en: "To Universitario 2" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "match-1",
    kind: "event",
    start: "07:30",
    end: "09:00",
    title: { es: "Partido · vs Asociación Sanjuanina B", en: "Match · vs Asociación Sanjuanina B" },
    detail: {
      es: "Campeonato Argentino de Seleccionados Promocionales Sub 16 (pdo 8). Universitario 2, Rosario. Partido de selección — sí aplica recuperación con proteína + carbohidratos después (ideal 5–15 min post último esfuerzo si el plan del equipo lo permite).",
      en: "Argentine Championship of Promotional Selections U16 (match 8). Universitario 2, Rosario. Selection match — recovery with protein + carbs applies after (ideally 5–15 min post last effort if team plan allows).",
    },
    location: { es: "Universitario 2, Rosario", en: "Universitario 2, Rosario" },
    tag: { es: "Calendario", en: "Calendar" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "between",
    kind: "plan",
    start: "09:00",
    end: "12:30",
    title: { es: "Ventana entre partidos", en: "Between-matches window" },
    detail: {
      es: "Comida real, hidratación continua y descanso relativo. Preparar kit y mente para el segundo partido. No es sesión de gimnasio.",
      en: "Real food, ongoing hydration and relative rest. Prep kit and mind for the second match. Not a gym session.",
    },
    location: { es: "Rosario / gira", en: "Rosario / tour" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "match-2",
    kind: "event",
    start: "13:00",
    end: "14:30",
    title: { es: "Partido · vs Federación Cordobesa", en: "Match · vs Federación Cordobesa" },
    detail: {
      es: "Campeonato Argentino de Seleccionados Promocionales Sub 16 (pdo 12). Universitario 2, Rosario. Mismo criterio de recuperación post-partido si el plan del equipo lo permite.",
      en: "Argentine Championship of Promotional Selections U16 (match 12). Universitario 2, Rosario. Same post-match recovery approach if team plan allows.",
    },
    location: { es: "Universitario 2, Rosario", en: "Universitario 2, Rosario" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "gira-continue",
    kind: "event",
    start: "14:30",
    end: undefined,
    title: { es: "Gira Sub-16 (continúa)", en: "Sub-16 tour (continues)" },
    detail: {
      es: "Bloque de calendario hasta el 7 de septiembre. Recuperación, comida e hidratación según ritmo del equipo. No es carga de gimnasio personal.",
      en: "Calendar block through 7 September. Recovery, food and hydration per team rhythm. Not personal gym load.",
    },
    location: { es: "Rosario / gira", en: "Rosario / tour" },
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
  transit: "~45m",
  first: "06:30",
};
