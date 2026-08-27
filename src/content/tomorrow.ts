export const TOMORROW_DATE = "2026-08-28";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-08-27T08:40:00-04:00";

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
    es: "Agenda completa de la mañana, leída de tu calendario — sin clases ni gym en la mañana; el primer bloque fijo es hockey en la tarde.",
    en: "Full morning laid out from your calendar — no morning classes or gym; the first fixed block is hockey in the afternoon.",
  } satisfies Copy,
  timezone: { es: "Santiago · UTC−4", en: "Santiago · UTC−4" } satisfies Copy,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies Copy,
  committed: { es: "En calendario", en: "On the calendar" } satisfies Copy,
  transit: { es: "Traslado", en: "Transit" } satisfies Copy,
  first: { es: "Primer bloque", en: "First block" } satisfies Copy,
  note: {
    es: "Viernes sin clases ni gym en el calendario. Mañana libre en Home. Hockey Sub-14 16:30 y Sub-16 18:30. Pronóstico: ~6–14 °C, nublado, probabilidad alta de lluvia — base + mid + capa impermeable.",
    en: "Friday has no classes or gym on the calendar. Free morning at Home. U-14 hockey 16:30 and U-16 18:30. Forecast: ~6–14 °C, cloudy, high chance of rain — base + mid + waterproof outer.",
  } satisfies Copy,
  later: { es: "Más tarde", en: "Later today" } satisfies Copy,
  laterBody: {
    es: "El calendario de viernes está vacío hasta las 16:30. Después hay cuatro horas seguidas de hockey. Sale de Home con margen; no comprimas el almuerzo.",
    en: "Friday’s calendar is empty until 16:30. Then four straight hours of hockey. Leave Home with buffer; don’t compress lunch.",
  } satisfies Copy,
  night: { es: "La noche anterior", en: "The night before" } satisfies Copy,
  source: {
    es: "Desde Google Calendar · 27 ago 2026",
    en: "From Google Calendar · 27 Aug 2026",
  } satisfies Copy,
  map: { es: "Mapa", en: "Map" } satisfies Copy,
};

export const nightBefore: Copy[] = [
  {
    es: "Después del entrenamiento de hoy (~21:00): ducha, cena con proteína + carbos, hidratar",
    en: "After today’s training (~21:00): shower, protein + carbs dinner, rehydrate",
  },
  {
    es: "Dejar ropa lista: base + mid + capa impermeable (lluvia prevista)",
    en: "Lay out clothes: base + mid + waterproof outer (rain expected)",
  },
  {
    es: "Armar bolsa de hockey (dos bloques: Sub-14 y Sub-16) y toalla",
    en: "Pack the hockey bag (two blocks: U-14 and U-16) and a towel",
  },
  {
    es: "Preparar desayuno y botella de agua en el refri",
    en: "Prep breakfast and a water bottle in the fridge",
  },
  {
    es: "Alarma 07:30, con un backup a las 07:40",
    en: "Alarm at 07:30, with a backup at 07:40",
  },
  {
    es: "Cargar teléfono",
    en: "Charge the phone",
  },
  {
    es: "Luces apagadas ~23:15–23:30 para ~8 h de sueño (entrenas hasta las 21:00)",
    en: "Lights out ~23:15–23:30 for ~8 h of sleep (training ends at 21:00)",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "07:30",
    end: "08:00",
    title: { es: "Despertar · rutina", en: "Wake · morning routine" },
    detail: {
      es: "400–500 ml de agua al despertar. Baño, cara, estiramiento liviano. Ropa lista de anoche. Mañana más calma: no hay clase a las 08:20.",
      en: "400–500 ml water on waking. Bathroom, face, light stretch. Clothes laid out last night. Calmer start: no 08:20 class.",
    },
    location: { es: "Home", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "breakfast",
    kind: "plan",
    start: "08:00",
    end: "08:30",
    title: { es: "Desayuno + hidratación", en: "Breakfast + hydration" },
    detail: {
      es: "Desayuno con proteína. Seguir hidratando hasta ~600–800 ml. No hace falta salir temprano.",
      en: "Protein-forward breakfast. Keep sipping to ~600–800 ml. No need to leave early.",
    },
    location: { es: "Home", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "settle",
    kind: "plan",
    start: "08:30",
    end: "09:00",
    title: { es: "Acomodarse", en: "Settle in" },
    detail: {
      es: "Abrir laptop, escritorio listo. Ventana libre en el calendario hasta la tarde.",
      en: "Open the laptop, clear the desk. Open calendar window until the afternoon.",
    },
    location: { es: "Home", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "focus",
    kind: "plan",
    start: "09:00",
    end: "12:00",
    title: { es: "Bloque libre · estudio / deep work", en: "Open block · study / deep work" },
    detail: {
      es: "Nada fijado en el calendario. Buen tramo para web, arqui o trabajo. Pausa a media mañana. Almuerzo no negociable antes del hockey.",
      en: "Nothing fixed on the calendar. Good window for web, arqui, or work. Mid-morning pause. Lunch is non-negotiable before hockey.",
    },
    location: { es: "Home", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "midday",
    kind: "plan",
    start: "12:00",
    end: "13:00",
    title: { es: "Cierre de mañana + almuerzo", en: "Morning wrap + lunch" },
    detail: {
      es: "Almuerzo con proteína + carbos. Revisar bolsa de hockey. Capa impermeable a mano — la tarde viene inestable.",
      en: "Lunch with protein + carbs. Check the hockey bag. Waterproof layer ready — the afternoon looks unsettled.",
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
      es: "Salir de Home con margen para el inicio a las 16:30. Llevar capa impermeable.",
      en: "Leave Home with buffer for the 16:30 start. Bring a waterproof layer.",
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
      es: "Primer bloque de hockey del viernes. Del calendario.",
      en: "First hockey block of Friday. From the calendar.",
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
      en: "Second block, back to back. Protein + carbs after the last set if you can.",
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
  committed: "4h",
  transit: "40m",
  first: "16:30",
};
