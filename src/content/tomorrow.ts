import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-09-21";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-09-20T21:21:00-03:00";

export type LocalizedText = Record<Language, string>;

export type BlockKind = "plan" | "event" | "transit";

export interface ScheduleBlock {
  id: string;
  kind: BlockKind;
  start: string;
  end?: string;
  title: LocalizedText;
  detail?: LocalizedText;
  location?: LocalizedText;
  mapQuery?: string;
  tag: LocalizedText;
}

export const tomorrowPageText = {
  back: { es: "Volver", en: "Back" } satisfies LocalizedText,
  kicker: { es: "lunes 21 de septiembre", en: "monday 21 september" } satisfies LocalizedText,
  title: { es: "Mañana", en: "Morning" } satisfies LocalizedText,
  subtitle: {
    es: "Gimnasio 07:00–09:00 con lavado de pelo. Sin universidad (receso). Tarde: Mila 16:00, Amistoso Sub-16 17:30.",
    en: "Gym 07:00–09:00 with hair wash. No university (break). Afternoon: Mila 16:00, Sub-16 friendly 17:30.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Tres eventos: gimnasio 07:00–09:00 (lavado de pelo), Mila Dittborn 16:00–17:30, Amistoso Sub-16 17:30–20:00 (coaching, no entrenamiento propio). Sin clases. Alarma 05:50; salir de Casa a las 06:35. Última serie ~08:15; proteína + carbos en el gimnasio; ducha 25–35 min con jabón/shampoo del gym, toalla propia y ropa limpia; secar pelo corto en Casa. Mañana fresca ~8 °C, máxima ~19 °C, nublado y lluvia probable — base + capa + impermeable liviano.",
    en: "Three events: gym 07:00–09:00 (hair wash), Mila Dittborn 16:00–17:30, Sub-16 friendly 17:30–20:00 (coaching, not your training). No classes. Alarm 05:50; leave Home at 06:35. Last set ~08:15; protein + carbs at the gym; shower 25–35 min with gym soap/shampoo, own towel, clean clothes; short hair-dry at Home. Cool morning ~8 °C, high ~19 °C, overcast with likely rain — base + mid layer + light waterproof.",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Mañana libre después del gym. Por la tarde, Mila 16:00–17:30 y luego Amistoso Sub-16 17:30–20:00 (coaching: sin protocolo post-entreno). Después, cena real si falta y cierre deliberado — el día empezó temprano.",
    en: "Free stretch after the gym. Afternoon: Mila 16:00–17:30, then Sub-16 friendly 17:30–20:00 (coaching: no post-workout protocol). After that, real dinner if still needed and a deliberate wind-down — the day started early.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 20 sep 2026, 21:21",
    en: "From Google Calendar · 20 Sep 2026, 21:21",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Luces apagadas ~21:50–22:15. Alarma 05:50 necesita ~8 h en cama. El primer despertar cuesta — no cortes esto. Después del Amistoso (~20:00) el martes también pide sueño.",
    en: "Lights out ~21:50–22:15. A 05:50 alarm needs ~8 h in bed. First alarm is hard — do not cut this. After the friendly (~20:00) Tuesday also wants sleep.",
  },
  {
    es: "Bolso de gimnasio: toalla, ropa limpia post-ducha, proteína + carbos para comer en el gym tras la última serie. Jabón y shampoo del gym. Hoy sí lavas pelo — suma buffer de secado corto en Casa.",
    en: "Gym bag: towel, clean clothes for after the shower, protein + carbs to eat at the gym after the last set. Gym soap and shampoo. Hair wash today — keep a short hair-dry buffer at Home.",
  },
  {
    es: "Alarma 05:50, backup 06:00. Salir de Casa al gimnasio a las 06:35. Botella lista, teléfono cargado, llaves. Sin mochila de uni (receso).",
    en: "Alarm 05:50, backup 06:00. Leave Home for the gym at 06:35. Bottle ready, phone charged, keys. No uni bag (break).",
  },
  {
    es: "Capas para mañana ~8 °C y máxima ~19 °C, nublado y lluvia probable: base + capa + impermeable liviano. Una sola sugerencia; tú decides el resto.",
    en: "Layers for morning ~8 °C and high ~19 °C, overcast with likely rain: base + mid layer + light waterproof. One suggestion only; you decide the rest.",
  },
  {
    es: "Tarde: Mila 16:00–17:30, luego Amistoso Sub-16 17:30–20:00. Confirmar salidas con margen; no publicar direcciones. El amistoso es coaching — no es tu entrenamiento.",
    en: "Afternoon: Mila 16:00–17:30, then Sub-16 friendly 17:30–20:00. Confirm leave times with buffer; do not publish addresses. The friendly is coaching — not your training.",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "05:50",
    end: "06:35",
    title: { es: "Despertar · salir", en: "Wake · leave" },
    detail: {
      es: "400–500 ml de agua al despertar. Hidratar hasta ~600–800 ml. Bolso de gimnasio listo. Buffer de ~45 min porque el primer despertar se atrasa. Sales a las 06:35. Pre-entreno: solo agua o un bocado mínimo.",
      en: "400–500 ml water on waking. Sip to ~600–800 ml. Gym bag ready. ~45 min buffer because the first alarm slips. Leave at 06:35. Pre-workout: water only, or a tiny bite.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "drive-gym",
    kind: "transit",
    start: "06:35",
    end: "07:00",
    title: { es: "Auto al gimnasio", en: "Drive to gym" },
    detail: {
      es: "25 min en auto. Calle fresca y posiblemente mojada. Impermeable puesto, no en el asiento de atrás.",
      en: "25 min by car. Cool street, possibly wet. Waterproof is on, not on the back seat.",
    },
    location: { es: "Hacia el gimnasio", en: "To the gym" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "gym",
    kind: "event",
    start: "07:00",
    end: "08:15",
    title: { es: "Gimnasio", en: "Gym" },
    detail: {
      es: "Calendario 07:00–09:00; se corta para ducha con lavado de pelo. Última serie ~08:15. Proteína + carbos en el gimnasio en los 5–15 min siguientes, no en Casa.",
      en: "Calendar 07:00–09:00; cut short for a hair-wash shower. Last set ~08:15. Protein + carbs at the gym in the next 5–15 min, not at Home.",
    },
    location: { es: "Gimnasio", en: "Gym" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "shower",
    kind: "plan",
    start: "08:15",
    end: "08:50",
    title: { es: "Ducha · lavado de pelo", en: "Shower · hair wash" },
    detail: {
      es: "Ducha 25–35 min con jabón y shampoo del gimnasio, toalla propia, ropa limpia. Sí lavas pelo. Café en la cafetería del gym al salir si quieres. Saliendo del gimnasio ~08:50.",
      en: "Shower 25–35 min with gym soap and shampoo, own towel, clean clothes. Hair wash yes. Coffee at the gym shop on the way out if you want. Leave the gym ~08:50.",
    },
    location: { es: "Gimnasio", en: "Gym" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "drive-home",
    kind: "transit",
    start: "08:50",
    end: "09:15",
    title: { es: "Auto a Casa", en: "Drive to Home" },
    detail: {
      es: "25 min. Llegas ~09:15.",
      en: "25 min. Home ~09:15.",
    },
    location: { es: "Hacia Casa", en: "To Home" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "home-reset",
    kind: "plan",
    start: "09:15",
    end: "10:30",
    title: { es: "Casa · secar · desayuno", en: "Home · dry · breakfast" },
    detail: {
      es: "Secado corto de pelo. Desayuno real con proteína + carbohidratos. Seguir hidratando. Mañana libre hasta la tarde — sin universidad.",
      en: "Short hair-dry. Real breakfast with protein + carbs. Keep hydrating. Free morning until the afternoon — no university.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "afternoon-free",
    kind: "plan",
    start: "10:30",
    end: "15:30",
    title: { es: "Tarde libre · prep cita", en: "Free stretch · prep appointment" },
    detail: {
      es: "Recuperación liviana si apetece. Almuerzo real. Dejar margen para salir hacia Mila a las 16:00.",
      en: "Light recovery if it feels good. Real lunch. Leave buffer to head out for Mila at 16:00.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "mila",
    kind: "event",
    start: "16:00",
    end: "17:30",
    title: { es: "Mila Dittborn", en: "Mila Dittborn" },
    detail: {
      es: "Cita en calendario. 16:00–17:30. Salir con margen; no publicar dirección. Después sigue el Amistoso.",
      en: "Calendar appointment. 16:00–17:30. Leave with buffer; do not publish the address. The friendly follows.",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "amistoso",
    kind: "event",
    start: "17:30",
    end: "20:00",
    title: { es: "Amistoso Sub-16", en: "Sub-16 friendly" },
    detail: {
      es: "Coaching / bloque de equipo, no tu entrenamiento. Sin protocolo de proteína post-gimnasio. Termina ~20:00 — prioriza cierre y sueño.",
      en: "Coaching / team block, not your training. No post-gym protein protocol. Ends ~20:00 — prioritize wind-down and sleep.",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "evening",
    kind: "plan",
    start: "20:00",
    end: undefined,
    title: { es: "Cena · cierre", en: "Dinner · wind-down" },
    detail: {
      es: "Cena real con proteína si aún hace falta. Hidratación final. Luces hacia abajo — el día empezó a las 05:50.",
      en: "Real dinner with protein if still needed. Final hydration. Lights down — the day started at 05:50.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
];

export function durationLabel(
  start: string,
  end: string | undefined,
  language: Language
): string {
  if (!end) return "";
  if (!/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end)) return "";
  const [startHours, startMinutes] = start.split(":").map(Number);
  const [endHours, endMinutes] = end.split(":").map(Number);
  const minutes = endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
  if (minutes < 0) return "";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (language === "es") {
    if (hours && remainingMinutes) return `${hours}h ${remainingMinutes}m`;
    if (hours) return `${hours}h`;
    return `${remainingMinutes} min`;
  }
  if (hours && remainingMinutes) return `${hours}h ${remainingMinutes}m`;
  if (hours) return `${hours}h`;
  return `${remainingMinutes} min`;
}

export function googleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export const TOMORROW_SUMMARY_STATS = {
  blocks: String(morningBlocks.length),
  committed: "3",
  transit: "25+25m",
  first: "05:50",
};
