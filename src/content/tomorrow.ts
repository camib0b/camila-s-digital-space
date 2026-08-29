export const TOMORROW_DATE = "2026-08-30";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-08-29T08:41:00-04:00";

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
  kicker: { es: "domingo 30 de agosto", en: "sunday 30 august" } satisfies Copy,
  title: { es: "Mañana", en: "Morning" } satisfies Copy,
  subtitle: {
    es: "Calendario vacío el domingo. Mañana recomendada: gym con buffers, volver a Home, y guardar la tarde por si llueve.",
    en: "Empty calendar on Sunday. Recommended morning: gym with buffers, back to Home, keep the afternoon flexible if rain shows up.",
  } satisfies Copy,
  timezone: { es: "Santiago · UTC−4", en: "Santiago · UTC−4" } satisfies Copy,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies Copy,
  committed: { es: "En calendario", en: "On the calendar" } satisfies Copy,
  transit: { es: "Traslado", en: "Transit" } satisfies Copy,
  first: { es: "Primer bloque", en: "First block" } satisfies Copy,
  note: {
    es: "Ningún evento en Google Calendar el domingo. El gym es plan, no compromiso. 25 min en auto cada tramo. Sesión ~75 min + ducha 30 min + proteína/carbos en el gym. Mañana fresca (~6–9 °C), máxima ~15–17 °C; lluvia más probable después del mediodía — capa impermeable en la mochila.",
    en: "No Google Calendar events on Sunday. Gym is a plan, not a commitment. 25 min drive each way. ~75 min session + 30 min shower + protein/carbs at the gym. Cool morning (~6–9 °C), high ~15–17 °C; rain more likely after midday — pack a light waterproof layer.",
  } satisfies Copy,
  later: { es: "Más tarde", en: "Later today" } satisfies Copy,
  laterBody: {
    es: "Tarde libre. Lunes sí hay University (11:00) y Math tutor (16:00), así que no dejes la noche del domingo tarde. Si el cielo se cierra, quédate en Home.",
    en: "Open afternoon. Monday does have University (11:00) and Math tutor (16:00), so do not make Sunday night late. If the sky closes in, stay at Home.",
  } satisfies Copy,
  night: { es: "La noche anterior", en: "The night before" } satisfies Copy,
  source: {
    es: "Desde Google Calendar · 29 ago 2026, 08:41",
    en: "From Google Calendar · 29 Aug 2026, 08:41",
  } satisfies Copy,
  map: { es: "Mapa", en: "Map" } satisfies Copy,
};

export const nightBefore: Copy[] = [
  {
    es: "Hoy (sábado) I1 arqui termina 10:30. Almuerzo real al volver a Home. Si entrenas sábado tarde, proteína + carbos al terminar",
    en: "Today (Saturday) I1 arqui ends 10:30. Real lunch once you are Home. If you train Saturday afternoon, protein + carbs as soon as you finish",
  },
  {
    es: "Armar bolsa de gym: toalla, ropa de entrenamiento, set limpio para después de la ducha. El gym pone jabón y shampoo",
    en: "Pack the gym bag: towel, training clothes, clean set for after the shower. Gym provides soap and shampoo",
  },
  {
    es: "Dejar shake o snack de proteína + carbos rápido listo para llevar — se come en el gym al terminar el último set",
    en: "Prep a shake or fast protein + carb snack to take — eat it at the gym after the last set",
  },
  {
    es: "Capas para ~6–9 °C al salir: base manga larga + mid + chaqueta. Impermeable liviano por si la lluvia se adelanta",
    en: "Layers for ~6–9 °C on the way out: long-sleeve base + mid + jacket. Light waterproof in case rain comes early",
  },
  {
    es: "Alarma 07:30, backup 07:40. Sales de Home a las 08:15. Botella llena, teléfono cargado",
    en: "Alarm 07:30, backup 07:40. Leave Home at 08:15. Bottle filled, phone charged",
  },
  {
    es: "Luces apagadas ~23:00–23:15 para ~8–8.5 h. El primer despertar cuesta — no comprimas el sueño",
    en: "Lights out ~23:00–23:15 for ~8–8.5 h. First alarm is hard — do not compress sleep",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "07:30",
    end: "08:15",
    title: { es: "Despertar · salir", en: "Wake · leave" },
    detail: {
      es: "400–500 ml de agua al despertar. Baño, cara, capas de anoche. Solo agua o snack mínimo antes de entrenar. Hidratar hasta ~600–800 ml. Bolsa ya armada.",
      en: "400–500 ml water on waking. Bathroom, face, layers from last night. Water only or a tiny snack before training. Sip to ~600–800 ml. Bag already packed.",
    },
    location: { es: "Home", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "drive-gym",
    kind: "transit",
    start: "08:15",
    end: "08:40",
    title: { es: "Auto al gym", en: "Drive to gym" },
    detail: {
      es: "25 min desde Home. Auto ida y vuelta; después del gym vuelves a Home.",
      en: "25 min from Home. Car both ways; you return Home after the gym.",
    },
    location: { es: "Hacia el gym", en: "To the gym" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "gym",
    kind: "plan",
    start: "08:40",
    end: "10:00",
    title: { es: "Gym", en: "Gym" },
    detail: {
      es: "Sesión ~75 min con descansos reales, no el tiempo teórico. Sigue tomando agua. Esto sí cuenta como entrenamiento.",
      en: "~75 min session with real rest, not theoretical times. Keep sipping water. This counts as training.",
    },
    location: { es: "Gym", en: "Gym" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "post-gym",
    kind: "plan",
    start: "10:00",
    end: "10:40",
    title: { es: "Proteína · ducha · cambio", en: "Protein · shower · change" },
    detail: {
      es: "Proteína + carbos rápidos en los 5–15 min post último set, todavía en el gym. Ducha (jabón/shampoo del gym), secar, ropa limpia. Café del gym si quieres, de salida.",
      en: "Protein + fast carbs within 5–15 min of the last set, still at the gym. Shower (gym soap/shampoo), dry off, clean clothes. Gym coffee on the way out if you want it.",
    },
    location: { es: "Gym", en: "Gym" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "drive-home",
    kind: "transit",
    start: "10:40",
    end: "11:05",
    title: { es: "Auto a Home", en: "Drive home" },
    detail: {
      es: "25 min de vuelta. Sin clase detrás — no hay que apurar el cierre.",
      en: "25 min back. No class behind this — no need to rush the close.",
    },
    location: { es: "Hacia Home", en: "To Home" },
    tag: { es: "Traslados", en: "Transit" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "open-sunday",
    kind: "plan",
    start: "11:05",
    end: "21:00",
    title: { es: "Domingo libre", en: "Open Sunday" },
    detail: {
      es: "Almuerzo real en Home. Tarde abierta; lluvia más probable después del mediodía.",
      en: "Real lunch at Home. Open afternoon; rain more likely after midday.",
    },
    location: { es: "Home", en: "Home" },
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
  committed: "0",
  transit: "50m",
  first: "—",
};
