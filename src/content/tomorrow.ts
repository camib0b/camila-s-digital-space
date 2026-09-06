export const TOMORROW_DATE = "2026-09-07";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-09-06T08:40:00-03:00";

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
  kicker: { es: "lunes 7 de septiembre", en: "monday 7 september" } satisfies Copy,
  title: { es: "Mañana", en: "Morning" } satisfies Copy,
  subtitle: {
    es: "Recuperación post-gira Sub-16. Llegada la noche anterior ~23:00. Tutor de mates 16:00. Sin gimnasio ni universidad.",
    en: "Recovery after Sub-16 tour. Arrival the night before ~23:00. Math tutor 16:00. No gym, no university.",
  } satisfies Copy,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies Copy,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies Copy,
  committed: { es: "En calendario", en: "On the calendar" } satisfies Copy,
  transit: { es: "Traslado", en: "Transit" } satisfies Copy,
  first: { es: "Primer bloque", en: "First block" } satisfies Copy,
  note: {
    es: "Día de recuperación después de la gira Sub-16 y el vuelo de regreso (aterrizaje ~23:00 la noche anterior). Sin carga de gimnasio ni clases. Sesión con tutor de mates 16:00–17:30. Mañana fresca ~6–8 °C, máxima ~18–20 °C, mayormente despejado — base o manga larga + capa liviana si sales temprano.",
    en: "Recovery day after the Sub-16 tour and return flight (landing ~23:00 the night before). No gym load or classes. Math tutor session 16:00–17:30. Cool morning ~6–8 °C, high ~18–20 °C, mostly clear — base or long sleeve + light layer if you go out early.",
  } satisfies Copy,
  later: { es: "Más tarde", en: "Later today" } satisfies Copy,
  laterBody: {
    es: "Priorizar sueño, comida real e hidratación. Preparar material para el tutor de mates. Sesión 16:00–17:30. Después, cena ligera y cierre temprano si el cuerpo lo pide.",
    en: "Prioritise sleep, real food and hydration. Prep materials for the math tutor. Session 16:00–17:30. Afterwards, light dinner and an early wind-down if the body asks.",
  } satisfies Copy,
  night: { es: "La noche anterior", en: "The night before" } satisfies Copy,
  source: {
    es: "Desde Google Calendar · 6 sep 2026, 08:40",
    en: "From Google Calendar · 6 Sep 2026, 08:40",
  } satisfies Copy,
  map: { es: "Mapa", en: "Map" } satisfies Copy,
};

export const nightBefore: Copy[] = [
  {
    es: "Llegada ~23:00. Traslado a casa, hidratación final y colación si hace falta. Dejar el equipaje de viaje en un solo lugar; sacar solo lo esencial para la mañana.",
    en: "Arrival ~23:00. Transfer home, final hydration and a snack if needed. Leave travel bags in one place; take out only essentials for the morning.",
  },
  {
    es: "Capas para mañana fresca ~6–8 °C y máxima ~18–20 °C: base o manga larga + capa liviana (polar fino o campera liviana). Una sola sugerencia; tú decides el resto.",
    en: "Layers for a cool morning ~6–8 °C and high ~18–20 °C: base or long sleeve + light layer (thin fleece or light jacket). One suggestion only; you decide the rest.",
  },
  {
    es: "Alarma 09:00, backup 09:15. Mañana de recuperación: sin gimnasio ni universidad. Botella lista, teléfono cargado, material del tutor a mano si se puede preparar antes de dormir.",
    en: "Alarm 09:00, backup 09:15. Recovery morning: no gym, no university. Bottle ready, phone charged, tutor materials to hand if you can prep before sleep.",
  },
  {
    es: "400–500 ml de agua al despertar, luego sorber hasta ~600–800 ml. Desayuno real con proteína y carbohidratos cuando el cuerpo lo pida; no forzar hora temprana.",
    en: "400–500 ml water on waking, then sip to ~600–800 ml. Real breakfast with protein and carbs when the body asks; do not force an early window.",
  },
  {
    es: "Revisar horario y material para tutor de mates 16:00. Confirmar ruta y tiempo de salida con ~15–20 min de holgura. No dejar la preparación para el último momento.",
    en: "Check schedule and materials for the 16:00 math tutor. Confirm route and leave time with ~15–20 min buffer. Do not leave prep for the last minute.",
  },
  {
    es: "Luces apagadas lo antes posible después de llegar (~00:00–00:30). Con alarma a las 09:00 buscas ~7.5–8.5 h en cama. El primer despertar cuesta — protege este sueño de recuperación.",
    en: "Lights out as soon as possible after arriving (~00:00–00:30). A 09:00 alarm needs ~7.5–8.5 h in bed. First alarm is hard — protect this recovery sleep.",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "09:00",
    end: "10:00",
    title: { es: "Despertar · hidratar", en: "Wake · hydrate" },
    detail: {
      es: "400–500 ml de agua al despertar. Hidratar hasta ~600–800 ml. Mañana de recuperación post-viaje: sin presión de salida temprana. Revisar checklist ligero (botella, material del tutor).",
      en: "400–500 ml water on waking. Sip to ~600–800 ml. Recovery morning after travel: no early leave pressure. Light checklist (bottle, tutor materials).",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "recovery",
    kind: "plan",
    start: "10:00",
    end: "13:00",
    title: { es: "Recuperación · comida", en: "Recovery · food" },
    detail: {
      es: "Comida real con proteína + carbohidratos. Hidratación continua. Descanso relativo, movilidad ligera o caminata corta si el cuerpo lo pide. Preparar material para el tutor si no quedó listo la noche anterior.",
      en: "Real food with protein + carbs. Ongoing hydration. Relative rest, light mobility or a short walk if the body asks. Prep tutor materials if not done the night before.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "prep",
    kind: "plan",
    start: "13:00",
    end: "15:00",
    title: { es: "Prep · salida", en: "Prep · leave" },
    detail: {
      es: "Almuerzo si corresponde. Revisar apuntes o ejercicios para la sesión. Salir de casa con 15–20 min de holgura antes de la hora de llegada al tutor. Hidratación y colación ligera si hace falta.",
      en: "Lunch if needed. Review notes or exercises for the session. Leave home with 15–20 min buffer before arrival at the tutor. Hydration and a light snack if needed.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "tutor",
    kind: "event",
    start: "16:00",
    end: "17:30",
    title: { es: "Tutor de mates", en: "Math tutor" },
    detail: {
      es: "Sesión en calendario 16:00–17:30. Llevar material preparado. No es carga de entrenamiento físico.",
      en: "Calendar session 16:00–17:30. Bring prepared materials. Not physical training load.",
    },
    location: { es: "Tutor de mates", en: "Math tutor" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "evening",
    kind: "plan",
    start: "17:30",
    end: undefined,
    title: { es: "Regreso · cierre", en: "Return · wind-down" },
    detail: {
      es: "Regreso a casa, cena real con proteína si aún no comiste bien, hidratación final. Cierre temprano si el cuerpo pide más sueño de recuperación.",
      en: "Return home, real dinner with protein if you have not eaten well yet, final hydration. Early wind-down if the body asks for more recovery sleep.",
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
  transit: "—",
  first: "09:00",
};
