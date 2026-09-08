export const TOMORROW_DATE = "2026-09-08";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-09-07T23:46:00-03:00";

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
  kicker: { es: "martes 8 de septiembre", en: "tuesday 8 september" } satisfies Copy,
  title: { es: "Mañana", en: "Morning" } satisfies Copy,
  subtitle: {
    es: "Sin gimnasio. Universidad 08:20 (arqui, después web). Tutor de mates 17:30. Entrenamiento de hockey 19:30.",
    en: "No gym. University 08:20 (arqui, then web). Math tutor 17:30. Hockey training 19:30.",
  } satisfies Copy,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies Copy,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies Copy,
  committed: { es: "En calendario", en: "On the calendar" } satisfies Copy,
  transit: { es: "Traslado", en: "Transit" } satisfies Copy,
  first: { es: "Primer bloque", en: "First block" } satisfies Copy,
  note: {
    es: "Tres eventos en calendario: clases 08:20–11:00 en Universidad (8:20 arqui · 9:40 web), tutor de mates 17:30–18:40, hockey 19:30–21:00 (entrenamiento propio, no coaching). Sin gimnasio. Sal de Casa a las 07:20 (55–60 min puerta a sala). Mañana fresca ~7–9 °C, máxima ~15–17 °C — manga larga o base + capa liviana.",
    en: "Three calendar events: class 08:20–11:00 at University (8:20 arqui · 9:40 web), math tutor 17:30–18:40, hockey 19:30–21:00 (your training, not coaching). No gym. Leave Home at 07:20 (55–60 min door to classroom). Cool morning ~7–9 °C, high ~15–17 °C — long sleeve or base + light layer.",
  } satisfies Copy,
  later: { es: "Más tarde", en: "Later today" } satisfies Copy,
  laterBody: {
    es: "Después de web (~11:00), almuerzo real. Tutor de mates 17:30–18:40; salir de ahí con holgura hacia hockey 19:30–21:00. Después del último ejercicio: proteína + carbohidratos en 5–15 min. Cena real si falta y cierre.",
    en: "After web (~11:00), a real lunch. Math tutor 17:30–18:40; leave with buffer toward hockey 19:30–21:00. After the last drill: protein + carbs within 5–15 min. Real dinner if still needed, then wind-down.",
  } satisfies Copy,
  night: { es: "La noche anterior", en: "The night before" } satisfies Copy,
  source: {
    es: "Desde Google Calendar · 7 sep 2026, 23:46",
    en: "From Google Calendar · 7 Sep 2026, 23:46",
  } satisfies Copy,
  map: { es: "Mapa", en: "Map" } satisfies Copy,
};

export const nightBefore: Copy[] = [
  {
    es: "Capas para mañana fresca ~7–9 °C y máxima ~15–17 °C: manga larga o base + capa liviana. Una sola sugerencia; tú decides el resto. El entrenamiento de hockey es de noche y más fresco.",
    en: "Layers for a cool morning ~7–9 °C and high ~15–17 °C: long sleeve or base + light layer. One suggestion only; you decide the rest. Hockey training is in the evening and cooler.",
  },
  {
    es: "Alarma 06:40, backup 06:50. Sin gimnasio. Botella lista, teléfono cargado, mochila de universidad armada (apuntes arqui/web, cargador). Bolso de hockey aparte para la tarde.",
    en: "Alarm 06:40, backup 06:50. No gym. Bottle ready, phone charged, university bag packed (arqui/web notes, charger). Separate hockey bag for the afternoon.",
  },
  {
    es: "400–500 ml de agua al despertar, luego sorber hasta ~600–800 ml antes de salir. Pre-salida: solo agua o un snack mínimo.",
    en: "400–500 ml water on waking, then sip to ~600–800 ml before leaving. Pre-leave: water only or a tiny snack.",
  },
  {
    es: "Salida de Casa 07:20. Transporte público: 55–60 min puerta a sala. No recortar el margen. Confirmar Bip y ruta.",
    en: "Leave Home 07:20. Public transport: 55–60 min door to classroom. Do not cut the buffer. Confirm Bip and route.",
  },
  {
    es: "Material del tutor de mates listo. Snack de proteína + carbohidratos para después de hockey (5–15 min post último ejercicio).",
    en: "Math tutor materials ready. Protein + carb snack for after hockey (5–15 min after the last drill).",
  },
  {
    es: "Luces apagadas lo antes posible. Con alarma a las 06:40 buscas ~7.5–8.5 h; si ya es tarde, duerme ya. El primer despertar cuesta.",
    en: "Lights out as soon as possible. A 06:40 alarm wants ~7.5–8.5 h; if it is already late, sleep now. First alarm is hard.",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "06:40",
    end: "07:20",
    title: { es: "Despertar · hidratar", en: "Wake · hydrate" },
    detail: {
      es: "400–500 ml de agua al despertar. Hidratar hasta ~600–800 ml. Checklist: botella, mochila, teléfono, tarjeta de transporte.",
      en: "400–500 ml water on waking. Sip to ~600–800 ml. Checklist: bottle, bag, phone, transit card.",
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
      es: "Transporte público. 55–60 min puerta a sala. Salir a las 07:20, no más tarde. Agua a mano.",
      en: "Public transport. 55–60 min door to classroom. Leave at 07:20, not later. Water on hand.",
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
    end: "17:30",
    title: { es: "Almuerzo · tarde", en: "Lunch · afternoon" },
    detail: {
      es: "Comida real con proteína + carbohidratos después de web. Hidratación. Tareas o descanso según energía. Salir hacia el tutor de mates con holgura.",
      en: "Real meal with protein + carbs after web. Hydration. Work or rest according to energy. Leave toward the math tutor with buffer.",
    },
    location: { es: "Universidad o Casa", en: "University or Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "tutor",
    kind: "event",
    start: "17:30",
    end: "18:40",
    title: { es: "Tutor de mates", en: "Math tutor" },
    detail: {
      es: "Sesión 17:30–18:40. Llevar material. Salir al terminar con holgura hacia hockey 19:30.",
      en: "Session 17:30–18:40. Bring materials. Leave when it ends with buffer toward hockey 19:30.",
    },
    location: { es: "Tutor de mates", en: "Math tutor" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "hockey",
    kind: "event",
    start: "19:30",
    end: "21:00",
    title: { es: "Hockey", en: "Hockey" },
    detail: {
      es: "Entrenamiento propio 19:30–21:00, no sesión de coaching. Agua durante. Proteína + carbohidratos 5–15 min después del último ejercicio.",
      en: "Your training 19:30–21:00, not a coaching session. Water during. Protein + carbs 5–15 min after the last drill.",
    },
    location: { es: "Hockey", en: "Hockey" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "evening",
    kind: "plan",
    start: "21:00",
    end: undefined,
    title: { es: "Regreso · cierre", en: "Return · wind-down" },
    detail: {
      es: "Regreso a Casa. Si no alcanzó el snack post-entreno, completar proteína + carbohidratos. Cena real si falta. Hidratación final y cierre.",
      en: "Return Home. If the post-training snack did not happen, finish protein + carbs. Real dinner if still needed. Final hydration and wind-down.",
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
  committed: "3",
  transit: "55m",
  first: "08:20",
};
