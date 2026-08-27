export const TOMORROW_DATE = "2026-08-28";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-08-27T09:43:00-04:00";

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
  kicker: { es: "viernes 28 de agosto", en: "friday 28 august" } satisfies Copy,
  title: { es: "Mañana", en: "Morning" } satisfies Copy,
  subtitle: {
    es: "Agenda reconstruida desde el calendario actualizado: gym 08:00–10:00, sin clases, hockey en la tarde.",
    en: "Rebuilt from the updated calendar: gym 08:00–10:00, no classes, hockey in the afternoon.",
  } satisfies Copy,
  timezone: { es: "Santiago · UTC−4", en: "Santiago · UTC−4" } satisfies Copy,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies Copy,
  committed: { es: "En calendario", en: "On the calendar" } satisfies Copy,
  transit: { es: "Traslado", en: "Transit" } satisfies Copy,
  first: { es: "Primer bloque", en: "First block" } satisfies Copy,
  note: {
    es: "Gym 08:00–10:00 (25 min en auto ida y vuelta). Sin clases. Hockey Sub-14 16:30 y Sub-16 18:30. Pronóstico fresco y húmedo (~6–14 °C) — base + mid + capa impermeable. Entrenar solo con agua o un snack chico; proteína + carbos al terminar, todavía en el gym.",
    en: "Gym 08:00–10:00 (25 min drive each way). No classes. U-14 hockey 16:30 and U-16 18:30. Cool and wet (~6–14 °C) — base + mid + waterproof outer. Train on water or a small snack; protein + carbs right after the last set, still at the gym.",
  } satisfies Copy,
  later: { es: "Más tarde", en: "Later today" } satisfies Copy,
  laterBody: {
    es: "Después del gym vuelves a Home. Almuerzo real antes de salir. Cuatro horas de hockey desde las 16:30.",
    en: "After the gym you come back to Home. Real lunch before leaving. Four hours of hockey from 16:30.",
  } satisfies Copy,
  night: { es: "La noche anterior", en: "The night before" } satisfies Copy,
  source: {
    es: "Desde Google Calendar · 27 ago 2026, 09:43",
    en: "From Google Calendar · 27 Aug 2026, 09:43",
  } satisfies Copy,
  map: { es: "Mapa", en: "Map" } satisfies Copy,
};

export const nightBefore: Copy[] = [
  {
    es: "Hoy cierras ~21:00. Ducha, cena con proteína + carbos, hidratar",
    en: "You wrap tonight ~21:00. Shower, protein + carbs dinner, rehydrate",
  },
  {
    es: "Dejar ropa de gym lista + toalla. Segunda muda limpia para después de la ducha del gym",
    en: "Lay out gym clothes + towel. Second clean set for after the gym shower",
  },
  {
    es: "Capa impermeable y mid listos (lluvia prevista)",
    en: "Waterproof outer and mid layer ready (rain expected)",
  },
  {
    es: "Armar bolsa de hockey (Sub-14 + Sub-16) para la tarde",
    en: "Pack the hockey bag (U-14 + U-16) for the afternoon",
  },
  {
    es: "Dejar shake o proteína + carbo listos para llevar al gym",
    en: "Pack the post-workout protein + carbs to take to the gym",
  },
  {
    es: "Alarma 06:45, backup 06:55. No negociable: el auto sale ~07:25",
    en: "Alarm 06:45, backup 06:55. Non-negotiable: leave ~07:25",
  },
  {
    es: "Cargar teléfono. Luces apagadas ~22:45–23:00 para ~8 h (el primer despertar cuesta)",
    en: "Charge the phone. Lights out ~22:45–23:00 for ~8 h (first alarm is hard)",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "06:45",
    end: "07:25",
    title: { es: "Despertar · salir", en: "Wake · leave" },
    detail: {
      es: "400–500 ml de agua al despertar. Baño, cara, ropa de gym de anoche. Snack chico solo si hace falta. Hidratar hasta ~600–800 ml. Toalla + proteína de post-entreno en la bolsa.",
      en: "400–500 ml water on waking. Bathroom, face, gym clothes from last night. Small snack only if needed. Sip to ~600–800 ml. Towel + post-workout protein in the bag.",
    },
    location: { es: "Home", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "drive-gym",
    kind: "transit",
    start: "07:25",
    end: "07:55",
    title: { es: "Auto al gym", en: "Drive to gym" },
    detail: {
      es: "25 min de manejo + margen. Apuntar a estar lista antes de las 08:00.",
      en: "25 min drive plus buffer. Be ready before 08:00.",
    },
    location: { es: "Hacia Gym", en: "To Gym" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "gym",
    kind: "event",
    start: "08:00",
    end: "10:00",
    title: { es: "Gym", en: "Gym" },
    detail: {
      es: "Bloque del calendario. Proteína + carbos en los 5–15 min después del último set, todavía en el gym.",
      en: "Calendar block. Protein + carbs within 5–15 min of the last set, still at the gym.",
    },
    location: { es: "Gym", en: "Gym" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "shower",
    kind: "plan",
    start: "10:00",
    end: "10:30",
    title: { es: "Ducha + muda", en: "Shower + change" },
    detail: {
      es: "Jabón y shampoo del gym. Solo toalla. Cambiar a ropa limpia. Café en el gym si quieres, de salida.",
      en: "Gym soap and shampoo. Towel only. Change into clean clothes. Coffee on the way out if you want it.",
    },
    location: { es: "Gym", en: "Gym" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "drive-home",
    kind: "transit",
    start: "10:30",
    end: "10:55",
    title: { es: "Vuelta a casa", en: "Drive home" },
    detail: {
      es: "25 min de manejo. Sin clases después — no hay que apurar el trayecto.",
      en: "25 min drive. No classes after — no need to rush the ride.",
    },
    location: { es: "Hacia Home", en: "To Home" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "home-block",
    kind: "plan",
    start: "10:55",
    end: "13:00",
    title: { es: "Home · almuerzo", en: "Home · lunch" },
    detail: {
      es: "Bajar revoluciones. Almuerzo con proteína + carbos. Revisar bolsa de hockey. Capa impermeable a mano.",
      en: "Downshift. Lunch with protein + carbs. Check the hockey bag. Waterproof layer ready.",
    },
    location: { es: "Home", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "leave-hockey",
    kind: "transit",
    start: "15:45",
    end: "16:25",
    title: { es: "Salida hacia hockey", en: "Leave for hockey" },
    detail: {
      es: "Salir de Home con margen para el 16:30. Llevar capa impermeable.",
      en: "Leave Home with buffer for 16:30. Bring a waterproof layer.",
    },
    location: { es: "Hacia Chile Hockey", en: "To Chile Hockey" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "sub14",
    kind: "event",
    start: "16:30",
    end: "18:30",
    title: { es: "Sub-14", en: "U-14" },
    detail: {
      es: "Primer bloque de hockey. Del calendario.",
      en: "First hockey block. From the calendar.",
    },
    location: { es: "Chile Hockey", en: "Chile Hockey" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "sub16",
    kind: "event",
    start: "18:30",
    end: "20:30",
    title: { es: "Sub-16", en: "U-16" },
    detail: {
      es: "Segundo bloque, seguido. Proteína + carbos al terminar si se puede.",
      en: "Second block, back to back. Protein + carbs after if you can.",
    },
    location: { es: "Chile Hockey", en: "Chile Hockey" },
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
  committed: "6h",
  transit: "50m",
  first: "08:00",
};
