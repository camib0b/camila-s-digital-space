import type { Language } from "@/i18n/types";

export const TOMORROW_DATE = "2026-09-14";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-09-13T08:57:00-03:00";

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
  kicker: { es: "lunes 14 de septiembre", en: "monday 14 september" } satisfies LocalizedText,
  title: { es: "Mañana", en: "Morning" } satisfies LocalizedText,
  subtitle: {
    es: "Primer día de receso. Sin gimnasio ni universidad. Mañana libre; una cita por la tarde.",
    en: "First day of the break. No gym, no university. Free morning; one afternoon appointment.",
  } satisfies LocalizedText,
  timezone: { es: "Santiago · UTC−3", en: "Santiago · UTC−3" } satisfies LocalizedText,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies LocalizedText,
  committed: { es: "En calendario", en: "On the calendar" } satisfies LocalizedText,
  transit: { es: "Traslado", en: "Transit" } satisfies LocalizedText,
  first: { es: "Primer bloque", en: "First block" } satisfies LocalizedText,
  note: {
    es: "Receso del 14 al 22. Sin clases ni gimnasio. Una cita en calendario: Mila Dittborn 16:00–17:30. Mañana fresca ~10 °C, máxima ~23 °C, mayormente soleado — manga larga o base + capa liviana si sales temprano; se puede sacar capas al mediodía.",
    en: "Break 14–22. No classes, no gym. One calendar appointment: Mila Dittborn 16:00–17:30. Cool morning ~10 °C, high ~23 °C, mostly sunny — long sleeve or base + light layer if you go out early; layers can come off by midday.",
  } satisfies LocalizedText,
  later: { es: "Más tarde", en: "Later today" } satisfies LocalizedText,
  laterBody: {
    es: "Mañana libre para recuperación y lo que apetezca. Por la tarde, cita fija 16:00–17:30. Después, cena real y cierre sin presión.",
    en: "Free morning for recovery and whatever feels good. Fixed afternoon appointment 16:00–17:30. After that, real dinner and an easy wind-down.",
  } satisfies LocalizedText,
  night: { es: "La noche anterior", en: "The night before" } satisfies LocalizedText,
  source: {
    es: "Desde Google Calendar · 13 sep 2026, 08:57",
    en: "From Google Calendar · 13 Sep 2026, 08:57",
  } satisfies LocalizedText,
  map: { es: "Mapa", en: "Map" } satisfies LocalizedText,
};

export const nightBefore: LocalizedText[] = [
  {
    es: "Capas para mañana fresca ~10 °C y máxima ~23 °C, mayormente soleado: manga larga o base + capa liviana. Una sola sugerencia; tú decides el resto. Al mediodía se puede quitar la capa.",
    en: "Layers for a cool morning ~10 °C and high ~23 °C, mostly sunny: long sleeve or base + light layer. One suggestion only; you decide the rest. Layer can come off by midday.",
  },
  {
    es: "Alarma 09:00, backup 09:15. Primer día de receso: sin gimnasio ni universidad. Botella lista, teléfono cargado. Nada de mochila de uni ni bolso de gym.",
    en: "Alarm 09:00, backup 09:15. First day of the break: no gym, no university. Bottle ready, phone charged. No uni bag or gym bag.",
  },
  {
    es: "400–500 ml de agua al despertar, luego sorber hasta ~600–800 ml. Desayuno real con proteína y carbohidratos cuando el cuerpo lo pida.",
    en: "400–500 ml water on waking, then sip to ~600–800 ml. Real breakfast with protein and carbs when the body asks.",
  },
  {
    es: "Cita Mila Dittborn 16:00–17:30 en el calendario. Confirmar hora de salida con margen; no publicar dirección en el plan.",
    en: "Mila Dittborn appointment 16:00–17:30 on the calendar. Confirm leave time with buffer; do not publish the address on the plan.",
  },
  {
    es: "Luces apagadas a tiempo. Con alarma a las 09:00 buscas ~7.5–8.5 h en cama. El primer despertar cuesta — protege el sueño de recuperación al inicio del receso.",
    en: "Lights out on time. A 09:00 alarm wants ~7.5–8.5 h in bed. First alarm is hard — protect recovery sleep at the start of the break.",
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
      es: "400–500 ml de agua al despertar. Hidratar hasta ~600–800 ml. Mañana libre de receso: sin presión de salida. Checklist mínimo: botella, teléfono.",
      en: "400–500 ml water on waking. Sip to ~600–800 ml. Free break morning: no leave pressure. Minimal checklist: bottle, phone.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "breakfast",
    kind: "plan",
    start: "10:00",
    end: "12:00",
    title: { es: "Desayuno · mañana libre", en: "Breakfast · free morning" },
    detail: {
      es: "Comida real con proteína + carbohidratos cuando el cuerpo lo pida. Seguir hidratando. Sin agenda fija hasta la tarde.",
      en: "Real meal with protein + carbs when the body asks. Keep hydrating. No fixed agenda until the afternoon.",
    },
    location: { es: "Casa", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "afternoon-free",
    kind: "plan",
    start: "12:00",
    end: "15:30",
    title: { es: "Tarde libre · prep cita", en: "Free afternoon · prep appointment" },
    detail: {
      es: "Movimiento liviano solo si apetece. Almuerzo real. Dejar margen para salir hacia la cita de las 16:00.",
      en: "Light movement only if it feels good. Real lunch. Leave buffer to head out for the 16:00 appointment.",
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
      es: "Cita en calendario. 16:00–17:30. Salir con margen; no publicar dirección.",
      en: "Calendar appointment. 16:00–17:30. Leave with buffer; do not publish the address.",
    },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "evening",
    kind: "plan",
    start: "18:00",
    end: undefined,
    title: { es: "Cena · cierre", en: "Dinner · wind-down" },
    detail: {
      es: "Cena real con proteína. Hidratación final. Cierre sin presión — primer día de receso.",
      en: "Real dinner with protein. Final hydration. Easy wind-down — first day of the break.",
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
  committed: "1",
  transit: "—",
  first: "09:00",
};
