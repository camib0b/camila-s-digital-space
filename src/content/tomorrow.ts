export const TOMORROW_DATE = "2026-08-29";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-08-28T08:41:00-04:00";

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
  kicker: { es: "sábado 29 de agosto", en: "saturday 29 august" } satisfies Copy,
  title: { es: "Mañana", en: "Morning" } satisfies Copy,
  subtitle: {
    es: "Agenda reconstruida desde el calendario: I1 arqui 08:20–10:30 en University. El gym no cabe antes de esa hora.",
    en: "Rebuilt from the calendar: I1 arqui 08:20–10:30 at University. Gym does not fit before class.",
  } satisfies Copy,
  timezone: { es: "Santiago · UTC−4", en: "Santiago · UTC−4" } satisfies Copy,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies Copy,
  committed: { es: "En calendario", en: "On the calendar" } satisfies Copy,
  transit: { es: "Traslado", en: "Transit" } satisfies Copy,
  first: { es: "Primer bloque", en: "First block" } satisfies Copy,
  note: {
    es: "Único evento del sábado: I1 arqui 08:20–10:30. Transporte público, 55–60 min puerta a sala — salir de Home a las 07:20. Gym antes de clase exigiría alarma ~04:00 después del hockey del viernes; no. Pronóstico seco y fresco (~7–17 °C) — base + mid + chaqueta liviana que puedas quitar en campus.",
    en: "Only Saturday event: I1 arqui 08:20–10:30. Public transport, 55–60 min door to classroom — leave Home at 07:20. Gym before class would mean a ~04:00 alarm after Friday hockey; skip it. Dry and cool (~7–17 °C) — base + mid + light jacket you can shed on campus.",
  } satisfies Copy,
  later: { es: "Más tarde", en: "Later today" } satisfies Copy,
  laterBody: {
    es: "Después de clase no hay nada más en el calendario. Vuelves a Home en transporte público. Si entrenas, que sea después de llegar (~11:30), no apretado contra las 08:20.",
    en: "Nothing else on the calendar after class. Public transport back to Home. If you train, do it after you arrive (~11:30), not squeezed against 08:20.",
  } satisfies Copy,
  night: { es: "La noche anterior", en: "The night before" } satisfies Copy,
  source: {
    es: "Desde Google Calendar · 28 ago 2026, 08:41",
    en: "From Google Calendar · 28 Aug 2026, 08:41",
  } satisfies Copy,
  map: { es: "Mapa", en: "Map" } satisfies Copy,
};

export const nightBefore: Copy[] = [
  {
    es: "Hoy el hockey cierra ~20:30. Cena con proteína + carbos e hidratar al llegar a Home",
    en: "Hockey wraps ~20:30 tonight. Protein + carbs dinner and rehydrate once you are Home",
  },
  {
    es: "Dejar ropa de campus lista: base manga larga + mid + chaqueta liviana. Zapatos cómodos para micro/metro",
    en: "Lay out campus clothes: long-sleeve base + mid + light jacket. Comfortable shoes for buses/metro",
  },
  {
    es: "Armar la mochila de University (cuaderno / laptop / carga). Botella de agua llena",
    en: "Pack the University bag (notebook / laptop / charger). Fill a water bottle",
  },
  {
    es: "Snack chico por si el desayuno en casa queda corto. No hace falta shake de gym",
    en: "Small snack in case breakfast at home is light. No gym shake needed",
  },
  {
    es: "Alarma 06:35, backup 06:45. No negociable: sales de Home a las 07:20",
    en: "Alarm 06:35, backup 06:45. Non-negotiable: leave Home at 07:20",
  },
  {
    es: "Cargar teléfono. Luces apagadas ~22:30–22:45 para ~8 h (el primer despertar cuesta)",
    en: "Charge the phone. Lights out ~22:30–22:45 for ~8 h (first alarm is hard)",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "06:35",
    end: "07:20",
    title: { es: "Despertar · salir", en: "Wake · leave" },
    detail: {
      es: "400–500 ml de agua al despertar. Baño, cara, capas de anoche. Desayuno chico si alcanza. Hidratar hasta ~600–800 ml. Mochila ya armada — cero decisiones.",
      en: "400–500 ml water on waking. Bathroom, face, layers from last night. Small breakfast if there is time. Sip to ~600–800 ml. Bag already packed — zero decisions.",
    },
    location: { es: "Home", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "transit-uni",
    kind: "transit",
    start: "07:20",
    end: "08:20",
    title: { es: "Transporte a University", en: "Transit to University" },
    detail: {
      es: "55–60 min puerta a sala. Salir a las 07:20 da margen para la clase de las 08:20.",
      en: "55–60 min door to classroom. Leaving at 07:20 gives buffer for the 08:20 class.",
    },
    location: { es: "Hacia University", en: "To University" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "i1-arqui",
    kind: "event",
    start: "08:20",
    end: "10:30",
    title: { es: "I1 arqui", en: "I1 arqui" },
    detail: {
      es: "Único bloque del calendario. 2 h 10 m en University.",
      en: "Only calendar block. 2 h 10 m at University.",
    },
    location: { es: "University", en: "University" },
    tag: { es: "Calendario", en: "Calendar" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "transit-home",
    kind: "transit",
    start: "10:30",
    end: "11:30",
    title: { es: "Vuelta a Home", en: "Transit home" },
    detail: {
      es: "Transporte público de vuelta. Sin más eventos fijos después.",
      en: "Public transport back. No more fixed events after this.",
    },
    location: { es: "Hacia Home", en: "To Home" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "open-saturday",
    kind: "plan",
    start: "11:30",
    end: "21:00",
    title: { es: "Sábado libre", en: "Open Saturday" },
    detail: {
      es: "Calendario vacío. Almuerzo real. Gym opcional solo si llegas descansada — no es un bloque comprometido.",
      en: "Empty calendar. Real lunch. Optional gym only if you arrive recovered — not a committed block.",
    },
    location: { es: "Home", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
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
  committed: "2h 10m",
  transit: "60m",
  first: "08:20",
};
