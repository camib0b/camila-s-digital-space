export const TOMORROW_DATE = "2026-09-06";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-09-05T08:41:00-04:00";

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
  kicker: { es: "domingo 6 de septiembre", en: "sunday 6 september" } satisfies Copy,
  title: { es: "Mañana", en: "Morning" } satisfies Copy,
  subtitle: {
    es: "Gira Sub-16 en Rosario — día de regreso. Vuelo SKY H2536 aterriza ~23:00. Sin gimnasio ni universidad.",
    en: "Sub-16 tour in Rosario — return day. SKY H2536 lands ~23:00. No gym, no university.",
  } satisfies Copy,
  timezone: { es: "Santiago · UTC−4 · Rosario local UTC−3", en: "Santiago · UTC−4 · Rosario local UTC−3" } satisfies Copy,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies Copy,
  committed: { es: "En calendario", en: "On the calendar" } satisfies Copy,
  transit: { es: "Traslado", en: "Transit" } satisfies Copy,
  first: { es: "Primer bloque", en: "First block" } satisfies Copy,
  note: {
    es: "Último día de la gira Sub-16 en Rosario. Bloque de calendario hasta el 7 de septiembre; tramo de vuelta SKY H2536 aterriza ~23:00. No hay partidos listados en el calendario para este día. Mañana fría ~2–4 °C, máxima ~11–13 °C, mayormente despejado — base + capa media (polar o polar liviano) para salir del alojamiento.",
    en: "Last day of the Sub-16 tour in Rosario. Calendar block through 7 September; return leg SKY H2536 lands ~23:00. No matches listed on the calendar for this day. Cold morning ~2–4 °C, high ~11–13 °C, mostly clear — base + mid layer (fleece or light polar) for leaving accommodation.",
  } satisfies Copy,
  later: { es: "Más tarde", en: "Later today" } satisfies Copy,
  laterBody: {
    es: "Recuperación, comida real e hidratación según ritmo del equipo. Empacar y coordinar traslados al aeropuerto con el plan del equipo. Vuelo de regreso aterriza ~23:00. No es día de gimnasio ni de clases.",
    en: "Recovery, real food and hydration per team rhythm. Pack and coordinate airport transfers with the team plan. Return flight lands ~23:00. Not a gym or class day.",
  } satisfies Copy,
  night: { es: "La noche anterior", en: "The night before" } satisfies Copy,
  source: {
    es: "Desde Google Calendar · 5 sep 2026, 08:41",
    en: "From Google Calendar · 5 Sep 2026, 08:41",
  } satisfies Copy,
  map: { es: "Mapa", en: "Map" } satisfies Copy,
};

export const nightBefore: Copy[] = [
  {
    es: "Empacar lo esencial para el regreso: indumentaria limpia, documentos, cargadores, botella. Dejar el kit de viaje visible y el resto ordenado para no buscar a la mañana.",
    en: "Pack essentials for the return: clean clothes, documents, chargers, bottle. Leave the travel kit visible and the rest tidy so you are not searching in the morning.",
  },
  {
    es: "Capas para ~2–4 °C a la salida y máxima ~11–13 °C: base o manga larga + capa media (polar o polar liviano). Una sola sugerencia; tú decides el resto.",
    en: "Layers for ~2–4 °C at leave and high ~11–13 °C: base or long sleeve + mid layer (fleece or light polar). One suggestion only; you decide the rest.",
  },
  {
    es: "Alarma 08:00, backup 08:10. Mañana más calmada: no hay partido temprano. Botella llena, teléfono cargado, documentos del equipo y del vuelo a mano.",
    en: "Alarm 08:00, backup 08:10. Calmer morning: no early match. Bottle filled, phone charged, team and flight documents ready.",
  },
  {
    es: "400–500 ml de agua al despertar, luego sorber hasta ~600–800 ml. Desayuno real cuando el plan del equipo lo permita; priorizar proteína y carbohidratos para recuperación.",
    en: "400–500 ml water on waking, then sip to ~600–800 ml. Real breakfast when the team plan allows; prioritise protein and carbs for recovery.",
  },
  {
    es: "Confirmar con el equipo hora de salida del alojamiento, traslado al aeropuerto y detalles del vuelo SKY H2536. No improvisar tiempos de puerta a terminal.",
    en: "Confirm with the team leave time from accommodation, airport transfer and SKY H2536 details. Do not improvise door-to-terminal times.",
  },
  {
    es: "Luces apagadas ~22:30–23:00. Con alarma a las 08:00 necesitas ~7.5–8.5 h en cama. El primer despertar cuesta — no recortes esto.",
    en: "Lights out ~22:30–23:00. An 08:00 alarm needs ~7.5–8.5 h in bed. First alarm is hard — do not cut this.",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "08:00",
    end: "09:00",
    title: { es: "Despertar · hidratar", en: "Wake · hydrate" },
    detail: {
      es: "400–500 ml de agua al despertar. Hidratar hasta ~600–800 ml. Mañana calmada: no hay partido temprano. Revisar checklist de equipaje y documentos del vuelo.",
      en: "400–500 ml water on waking. Sip to ~600–800 ml. Calm morning: no early match. Check luggage and flight-document checklist.",
    },
    location: { es: "Alojamiento", en: "Accommodation" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "recovery",
    kind: "plan",
    start: "09:00",
    end: "12:00",
    title: { es: "Recuperación · comida", en: "Recovery · food" },
    detail: {
      es: "Comida real con proteína + carbohidratos. Hidratación continua. Descanso relativo y movilidad ligera si el cuerpo lo pide. Coordinar con el ritmo del equipo.",
      en: "Real food with protein + carbs. Ongoing hydration. Relative rest and light mobility if the body asks. Coordinate with the team rhythm.",
    },
    location: { es: "Rosario / gira", en: "Rosario / tour" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "gira-block",
    kind: "event",
    start: "12:00",
    end: undefined,
    title: { es: "Gira Sub-16 (regreso)", en: "Sub-16 tour (return)" },
    detail: {
      es: "Bloque de calendario hasta el 7 de septiembre. Empacar, traslados al aeropuerto y vuelo SKY H2536 según plan del equipo. Aterrizaje ~23:00. No es carga de gimnasio personal.",
      en: "Calendar block through 7 September. Pack, airport transfers and SKY H2536 per team plan. Landing ~23:00. Not personal gym load.",
    },
    location: { es: "Rosario / gira", en: "Rosario / tour" },
    tag: { es: "Calendario", en: "Calendar" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "travel",
    kind: "transit",
    start: "15:00",
    end: "23:00",
    title: { es: "Traslado · vuelo de regreso", en: "Transfer · return flight" },
    detail: {
      es: "Coordinar con el equipo salida del alojamiento, traslado al aeropuerto y conexión si corresponde. SKY H2536 aterriza ~23:00. Mantener hidratación y una colación con proteína en el viaje.",
      en: "Coordinate with the team leave from accommodation, airport transfer and connection if needed. SKY H2536 lands ~23:00. Keep hydrating and a protein snack on the journey.",
    },
    location: { es: "Hacia aeropuerto / vuelo", en: "To airport / flight" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "arrive",
    kind: "plan",
    start: "23:00",
    end: undefined,
    title: { es: "Llegada · casa", en: "Arrival · home" },
    detail: {
      es: "Aterrizaje ~23:00. Traslado a casa, hidratación final y descanso. Mañana sin carga de gimnasio ni clases obligatorias según el bloque de gira.",
      en: "Landing ~23:00. Transfer home, final hydration and rest. Tomorrow no gym load or mandatory classes per the tour block.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
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
  committed: "1",
  transit: "~8h",
  first: "08:00",
};
