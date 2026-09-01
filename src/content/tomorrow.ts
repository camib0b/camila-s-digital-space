export const TOMORROW_DATE = "2026-09-02";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-09-01T08:58:00-04:00";

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
  kicker: { es: "miércoles 2 de septiembre", en: "wednesday 2 september" } satisfies Copy,
  title: { es: "Mañana", en: "Morning" } satisfies Copy,
  subtitle: {
    es: "Gira Sub-16 a Rosario. Vuelo SKY H2537 despega 07:55 (SCL → AEP). Sin gimnasio ni universidad.",
    en: "Sub-16 tour to Rosario. SKY H2537 departs 07:55 (SCL → AEP). No gym, no university.",
  } satisfies Copy,
  timezone: { es: "Santiago · UTC−4", en: "Santiago · UTC−4" } satisfies Copy,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies Copy,
  committed: { es: "En calendario", en: "On the calendar" } satisfies Copy,
  transit: { es: "Traslado", en: "Transit" } satisfies Copy,
  first: { es: "Primer bloque", en: "First block" } satisfies Copy,
  note: {
    es: "Un evento en Google Calendar: Sub-16 Gira a Rosario 🇦🇷 (04:45–07 sep). Ida: SKY H2537 despega 07:55 hrs SCL → AEP. Vuelta: SKY H2536 aterriza 23:00. Sin gimnasio ni clases. Es coaching de gira, no entrenamiento personal — no aplica protocolo post-gimnasio. Mañana fresca ~10–12 °C, máxima ~18–20 °C, mayormente nublado — base + chaqueta liviana o polar para la salida temprano.",
    en: "One Google Calendar event: Sub-16 Tour to Rosario 🇦🇷 (04:45–07 Sep). Outbound: SKY H2537 departs 07:55 SCL → AEP. Return: SKY H2536 lands 23:00. No gym, no classes. Coaching tour, not personal training — no post-gym nutrition protocol. Cool morning ~10–12 °C, high ~18–20 °C, mostly cloudy — base + light jacket or fleece for the early leave.",
  } satisfies Copy,
  later: { es: "Más tarde", en: "Later today" } satisfies Copy,
  laterBody: {
    es: "Llegada a Buenos Aires (AEP) alrededor de 11:00 hora local. El bloque de calendario continúa hasta el 7 de septiembre. Coordinar traslado a Rosario según el plan del equipo. Hidratación y comida real en el camino; no es un día de entrenamiento personal.",
    en: "Arrival in Buenos Aires (AEP) around 11:00 local. Calendar block continues through 7 September. Coordinate transfer to Rosario with the team plan. Hydration and real food on the way; this is not a personal training day.",
  } satisfies Copy,
  night: { es: "La noche anterior", en: "The night before" } satisfies Copy,
  source: {
    es: "Desde Google Calendar · 1 sep 2026, 08:58",
    en: "From Google Calendar · 1 Sep 2026, 08:58",
  } satisfies Copy,
  map: { es: "Mapa", en: "Map" } satisfies Copy,
};

export const nightBefore: Copy[] = [
  {
    es: "Maleta / bolso de gira armado: ropa para varios días, documentos de viaje, cargadores, botella, cualquier material de coaching del equipo. Dejarlo en Casa listo para la salida de las 04:45.",
    en: "Tour bag packed: clothes for several days, travel documents, chargers, bottle, any team coaching materials. Leave it at Home ready for the 04:45 leave.",
  },
  {
    es: "Capas para ~10–12 °C a la salida temprano y máxima ~18–20 °C: base o manga larga, chaqueta o polar liviano. Una sola sugerencia de capas; tú decides el resto.",
    en: "Layers for ~10–12 °C at early leave and high ~18–20 °C: base or long sleeve, light jacket or fleece. One layer suggestion only; you decide the rest.",
  },
  {
    es: "Alarma 04:00, backup 04:10. Sales de Casa a las 04:45. Botella llena, teléfono cargado, documentos y llaves a mano.",
    en: "Alarm 04:00, backup 04:10. Leave Home at 04:45. Bottle filled, phone charged, documents and keys ready.",
  },
  {
    es: "400–500 ml de agua al despertar, luego sorber hasta ~600–800 ml antes de salir. Colación liviana si quieres; el desayuno real puede esperar al aeropuerto o al vuelo.",
    en: "400–500 ml water on waking, then sip to ~600–800 ml before leaving. Light snack if you want; real breakfast can wait at the airport or on the flight.",
  },
  {
    es: "Confirmar check-in online, asiento y requisitos de documentos (pasaporte/DNI según corresponda) para no improvisar a las 04:30.",
    en: "Confirm online check-in, seat and document requirements (passport/ID as needed) so you are not improvising at 04:30.",
  },
  {
    es: "Luces apagadas ~20:00–20:30. Con alarma a las 04:00 necesitas ~7.5–8.5 h en cama. El primer despertar cuesta — no recortes esto.",
    en: "Lights out ~20:00–20:30. A 04:00 alarm needs ~7.5–8.5 h in bed. First alarm is hard — do not cut this.",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "04:00",
    end: "04:45",
    title: { es: "Despertar · salir", en: "Wake · leave" },
    detail: {
      es: "400–500 ml de agua al despertar. Hidratar hasta ~600–800 ml. Maleta lista. Buffer de 45 min porque el primer despertar se atrasa. Sales a las 04:45.",
      en: "400–500 ml water on waking. Sip to ~600–800 ml. Bag ready. 45 min buffer because the first alarm slips. Leave at 04:45.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "transit-airport",
    kind: "transit",
    start: "04:45",
    end: "06:00",
    title: { es: "Traslado al aeropuerto", en: "Transit to airport" },
    detail: {
      es: "Salida 04:45 según el bloque de calendario. Llegar con margen para check-in y seguridad antes del despegue 07:55.",
      en: "Leave 04:45 per the calendar block. Arrive with buffer for check-in and security before 07:55 departure.",
    },
    location: { es: "Hacia el aeropuerto", en: "To the airport" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "airport-flight",
    kind: "event",
    start: "06:00",
    end: "07:55",
    title: { es: "Aeropuerto · vuelo", en: "Airport · flight" },
    detail: {
      es: "Check-in, seguridad, puerta. SKY H2537 despega 07:55 SCL → AEP. Agua a mano. Es día de gira de coaching Sub-16, no entrenamiento.",
      en: "Check-in, security, gate. SKY H2537 departs 07:55 SCL → AEP. Water on hand. Sub-16 coaching tour day, not personal training.",
    },
    location: { es: "Aeropuerto", en: "Airport" },
    tag: { es: "Calendario", en: "Calendar" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "flight-arrival",
    kind: "event",
    start: "07:55",
    end: "11:00",
    title: { es: "Vuelo · llegada AEP", en: "Flight · AEP arrival" },
    detail: {
      es: "Vuelo ~2 h. Llegada estimada ~11:00 hora local en Buenos Aires. Continuar según plan del equipo hacia Rosario.",
      en: "Flight ~2 h. Estimated arrival ~11:00 local in Buenos Aires. Continue per team plan toward Rosario.",
    },
    location: { es: "En vuelo / AEP", en: "In flight / AEP" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "gira-continue",
    kind: "event",
    start: "11:00",
    end: undefined,
    title: { es: "Gira Sub-16 (continúa)", en: "Sub-16 tour (continues)" },
    detail: {
      es: "Bloque de calendario hasta el 7 de septiembre. Coaching de gira, no carga de entrenamiento personal. Hidratación y comida real según el ritmo del equipo.",
      en: "Calendar block through 7 September. Coaching tour, not personal training load. Hydration and real food per team rhythm.",
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
  committed: "1",
  transit: "~75m",
  first: "04:45",
};
