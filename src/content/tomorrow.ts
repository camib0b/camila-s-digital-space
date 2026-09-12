export const TOMORROW_DATE = "2026-09-13";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-09-12T08:54:00-03:00";

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
  kicker: { es: "domingo 13 de septiembre", en: "sunday 13 september" } satisfies Copy,
  title: { es: "Mañana", en: "Morning" } satisfies Copy,
  subtitle: {
    es: "Día libre. Sin eventos en calendario. Sin gimnasio ni universidad. Recuperación y prep ligera para la semana.",
    en: "Free day. No calendar events. No gym, no university. Recovery and light prep for the week.",
  } satisfies Copy,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies Copy,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies Copy,
  committed: { es: "En calendario", en: "On the calendar" } satisfies Copy,
  transit: { es: "Traslado", en: "Transit" } satisfies Copy,
  first: { es: "Primer bloque", en: "First block" } satisfies Copy,
  note: {
    es: "Cero eventos en Google Calendar para el domingo. Día de recuperación y margen antes del receso que empieza el lunes. Sin gimnasio, sin universidad, sin tutor. Mañana fresca ~8–10 °C, máxima ~21–23 °C, soleado — manga larga o base + capa liviana si sales temprano; se puede sacar capas al mediodía.",
    en: "Zero Google Calendar events for Sunday. Recovery day and buffer before the break that starts Monday. No gym, no university, no tutor. Cool morning ~8–10 °C, high ~21–23 °C, sunny — long sleeve or base + light layer if you go out early; layers can come off by midday.",
  } satisfies Copy,
  later: { es: "Más tarde", en: "Later today" } satisfies Copy,
  laterBody: {
    es: "Priorizar sueño, comida real e hidratación. Movimiento liviano solo si el cuerpo lo pide (caminata corta o movilidad). Tarde libre: lectura, tareas pendientes o descanso. Cena real y cierre temprano si hace falta.",
    en: "Prioritise sleep, real food and hydration. Light movement only if the body asks (short walk or mobility). Free afternoon: reading, leftover tasks or rest. Real dinner and early wind-down if needed.",
  } satisfies Copy,
  night: { es: "La noche anterior", en: "The night before" } satisfies Copy,
  source: {
    es: "Desde Google Calendar · 12 sep 2026, 08:54",
    en: "From Google Calendar · 12 Sep 2026, 08:54",
  } satisfies Copy,
  map: { es: "Mapa", en: "Map" } satisfies Copy,
};

export const nightBefore: Copy[] = [
  {
    es: "Capas para mañana fresca ~8–10 °C y máxima ~21–23 °C, soleado: manga larga o base + capa liviana. Una sola sugerencia; tú decides el resto. Al mediodía se puede quitar la capa.",
    en: "Layers for a cool morning ~8–10 °C and high ~21–23 °C, sunny: long sleeve or base + light layer. One suggestion only; you decide the rest. Layer can come off by midday.",
  },
  {
    es: "Alarma 09:00, backup 09:15. Día libre: sin gimnasio ni universidad. Botella lista, teléfono cargado. Nada de mochila de uni ni bolso de gym que preparar.",
    en: "Alarm 09:00, backup 09:15. Free day: no gym, no university. Bottle ready, phone charged. No uni bag or gym bag to pack.",
  },
  {
    es: "400–500 ml de agua al despertar, luego sorber hasta ~600–800 ml. Desayuno real con proteína y carbohidratos cuando el cuerpo lo pida; no forzar hora temprana.",
    en: "400–500 ml water on waking, then sip to ~600–800 ml. Real breakfast with protein and carbs when the body asks; do not force an early window.",
  },
  {
    es: "Día sin traslados obligatorios. Si sales, solo por gusto. Confirmar que el teléfono y la botella estén listos; el resto puede esperar.",
    en: "No mandatory transit. If you go out, only by choice. Confirm phone and bottle are ready; everything else can wait.",
  },
  {
    es: "Luces apagadas lo antes posible. Con alarma a las 09:00 buscas ~7.5–8.5 h en cama. El primer despertar cuesta — protege este sueño de recuperación antes de la semana.",
    en: "Lights out as soon as possible. A 09:00 alarm wants ~7.5–8.5 h in bed. First alarm is hard — protect this recovery sleep before the week.",
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
      es: "400–500 ml de agua al despertar. Hidratar hasta ~600–800 ml. Mañana libre: sin presión de salida. Checklist mínimo: botella, teléfono.",
      en: "400–500 ml water on waking. Sip to ~600–800 ml. Free morning: no leave pressure. Minimal checklist: bottle, phone.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "breakfast",
    kind: "plan",
    start: "10:00",
    end: "12:00",
    title: { es: "Desayuno · recuperación", en: "Breakfast · recovery" },
    detail: {
      es: "Comida real con proteína + carbohidratos cuando el cuerpo lo pida. Seguir hidratando. Sin agenda fija hasta el mediodía.",
      en: "Real meal with protein + carbs when the body asks. Keep hydrating. No fixed agenda until midday.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "afternoon",
    kind: "plan",
    start: "12:00",
    end: "18:00",
    title: { es: "Tarde libre", en: "Free afternoon" },
    detail: {
      es: "Movimiento liviano solo si apetece (caminata corta o movilidad). Lectura, tareas pendientes o descanso. Almuerzo/merienda real. Hidratación continua.",
      en: "Light movement only if it feels good (short walk or mobility). Reading, leftover tasks or rest. Real lunch/snack. Ongoing hydration.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "evening",
    kind: "plan",
    start: "18:00",
    end: undefined,
    title: { es: "Cena · cierre", en: "Dinner · wind-down" },
    detail: {
      es: "Cena real con proteína. Hidratación final. Cierre temprano si el cuerpo lo pide — mañana empieza el receso y la semana puede pedir energía.",
      en: "Real dinner with protein. Final hydration. Early wind-down if the body asks — the break starts tomorrow and the week may need energy.",
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
  committed: "0",
  transit: "—",
  first: "09:00",
};
