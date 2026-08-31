export const TOMORROW_DATE = "2026-08-31";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-08-30T21:30:00-04:00";

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
  kicker: { es: "lunes 31 de agosto", en: "monday 31 august" } satisfies Copy,
  title: { es: "Mañana", en: "Morning" } satisfies Copy,
  subtitle: {
    es: "Gym 07:00–09:00, luego Home, y University a las 11:00 (bdd, después innovación). Math tutor a las 16:00.",
    en: "Gym 07:00–09:00, back Home, then University at 11:00 (bdd, then innovación). Math tutor at 16:00.",
  } satisfies Copy,
  timezone: { es: "Santiago · UTC−4", en: "Santiago · UTC−4" } satisfies Copy,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies Copy,
  committed: { es: "En calendario", en: "On the calendar" } satisfies Copy,
  transit: { es: "Traslado", en: "Transit" } satisfies Copy,
  first: { es: "Primer bloque", en: "First block" } satisfies Copy,
  note: {
    es: "Tres eventos en Google Calendar: gym 07:00–09:00, clases 11:00–13:30 en University, Math tutor 16:00–17:30. El bloque de gym de 2 h no cabe entero si hay que ducharse y volver a Home con buffer antes de salir a las 10:00. Corte real: última serie ~08:25, proteína + carbos en el gym, ducha 25–30 min, auto 25 min. Mañana fría y húmeda (~8–11 °C), máxima ~18–19 °C; chubascos residuales temprano — impermeable puesto en los dos traslados de la mañana.",
    en: "Three Google Calendar events: gym 07:00–09:00, class 11:00–13:30 at University, Math tutor 16:00–17:30. A full 2 h gym block does not fit if you still shower and get back to Home with buffer before leaving at 10:00. Real cut: last set ~08:25, protein + carbs at the gym, 25–30 min shower, 25 min drive. Cold damp morning (~8–11 °C), high ~18–19 °C; leftover showers early — waterproof on for both morning trips.",
  } satisfies Copy,
  later: { es: "Más tarde", en: "Later today" } satisfies Copy,
  laterBody: {
    es: "Después de innovación (~13:30), almuerzo real y un rato en University o Home antes de Math tutor a las 16:00. Ese bloque no es entrenamiento: no aplica el protocolo post-gym.",
    en: "After innovación (~13:30), a real lunch and a stretch at University or Home before Math tutor at 16:00. That block is not training: skip the post-gym protocol.",
  } satisfies Copy,
  night: { es: "La noche anterior", en: "The night before" } satisfies Copy,
  source: {
    es: "Desde Google Calendar · 30 ago 2026, 21:30",
    en: "From Google Calendar · 30 Aug 2026, 21:30",
  } satisfies Copy,
  map: { es: "Mapa", en: "Map" } satisfies Copy,
};

export const nightBefore: Copy[] = [
  {
    es: "Bolso de gym: toalla, ropa limpia para después de la ducha (la que usas en University), proteína + carbos para comer en el gym apenas termines. Jabón y shampoo están allá.",
    en: "Gym bag: towel, clean clothes for after the shower (what you wear at University), protein + carbs to eat at the gym right after the last set. Soap and shampoo are already there.",
  },
  {
    es: "Mochila de University armada anoche: cuaderno/laptop, cargador, botella, colación, notas para bdd (11:00) e innovación (12:20). Queda en Home lista para las 09:20.",
    en: "University bag packed tonight: notebook/laptop, charger, bottle, snack, notes for bdd (11:00) and innovación (12:20). Leave it at Home ready for 09:20.",
  },
  {
    es: "Capas para ~8–11 °C y calle húmeda a las 06:35: base térmica o manga larga, polar o hoodie, chaqueta impermeable. En el gym te cambias a ropa limpia; para el bus de las 10:00 reusas la capa de abrigo liviana y te la sacas en University (~18 °C).",
    en: "Layers for ~8–11 °C and a wet street at 06:35: thermal or long-sleeve base, fleece or hoodie, waterproof jacket. Change into clean clothes at the gym; reuse the light warm layer for the 10:00 bus and shed it at University (~18 °C).",
  },
  {
    es: "Alarma 05:50, backup 06:00. Sales de Home al gym a las 06:35. Botella llena, teléfono cargado, llaves, tarjeta de transporte en la mochila de University — no la dejes en el bolso de gym.",
    en: "Alarm 05:50, backup 06:00. Leave Home for the gym at 06:35. Bottle filled, phone charged, keys, transit card in the University bag — do not leave it in the gym bag.",
  },
  {
    es: "Pre-workout: solo agua, o un bocado mínimo. El desayuno real espera a Home ~09:20 o un café al salir del gym después de la ducha.",
    en: "Pre-workout: water only, or a tiny bite. Real food waits at Home ~09:20, or coffee on the way out of the gym after the shower.",
  },
  {
    es: "Confirmar materiales de Math tutor (16:00) para no decidir eso a las 15:00.",
    en: "Confirm materials for Math tutor (16:00) so you are not deciding that at 15:00.",
  },
  {
    es: "Luces apagadas ~21:50–22:15. Con alarma a las 05:50 necesitas ~8 h en cama. El primer despertar cuesta — no recortes esto.",
    en: "Lights out ~21:50–22:15. A 05:50 alarm needs ~8 h in bed. First alarm is hard — do not cut this.",
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
      es: "400–500 ml de agua al despertar. Baño, cara, ropa de gym + capas de anoche. Sin desayuno pesado. Hidratar hasta ~600–800 ml. Buffer de 45 min porque el primer despertar se atrasa.",
      en: "400–500 ml water on waking. Bathroom, face, gym clothes + layers from last night. No heavy breakfast. Sip to ~600–800 ml. 45 min buffer because the first alarm slips.",
    },
    location: { es: "Home", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "drive-gym",
    kind: "transit",
    start: "06:35",
    end: "07:00",
    title: { es: "Auto al gym", en: "Drive to gym" },
    detail: {
      es: "25 min en auto. Calle fría y posiblemente mojada. Impermeable puesto, no en el asiento de atrás.",
      en: "25 min by car. Cold street, possibly wet. Waterproof is on, not on the back seat.",
    },
    location: { es: "Hacia el gym", en: "To the gym" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "gym",
    kind: "event",
    start: "07:00",
    end: "08:25",
    title: { es: "Gym", en: "Gym" },
    detail: {
      es: "Calendario dice 07:00–09:00; 2 h de sesión + ducha no llegan a Home con buffer. Última serie ~08:25. Proteína + carbos en el gym en los 5–15 min siguientes, no en Home.",
      en: "Calendar says 07:00–09:00; a 2 h session plus shower does not get you Home with buffer. Last set ~08:25. Protein + carbs at the gym in the next 5–15 min, not at Home.",
    },
    location: { es: "Gym", en: "Gym" },
    tag: { es: "Calendario", en: "Calendar" },
  },
  {
    id: "shower",
    kind: "plan",
    start: "08:25",
    end: "08:55",
    title: { es: "Ducha · cambio", en: "Shower · change" },
    detail: {
      es: "Ducha con lo del gym, toalla propia, ropa limpia. Café en la cafetería del gym al salir si quieres. Saliendo del gym ~08:55.",
      en: "Shower with gym soap, own towel, clean clothes. Coffee at the gym shop on the way out if you want. Leave the gym ~08:55.",
    },
    location: { es: "Gym", en: "Gym" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "drive-home",
    kind: "transit",
    start: "08:55",
    end: "09:20",
    title: { es: "Auto a Home", en: "Drive to Home" },
    detail: {
      es: "25 min. Llegas ~09:20 con 40 min antes de salir a University.",
      en: "25 min. Home ~09:20, 40 min before leaving for University.",
    },
    location: { es: "Hacia Home", en: "To Home" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "home-buffer",
    kind: "plan",
    start: "09:20",
    end: "10:00",
    title: { es: "Home · reset", en: "Home · reset" },
    detail: {
      es: "Secar pelo, revisar mochila, algo fácil de comer si no desayunaste, botella. No empieces otra tarea. Sales a las 10:00.",
      en: "Dry hair, check the bag, easy food if you skipped breakfast, refill the bottle. Do not start another task. Leave at 10:00.",
    },
    location: { es: "Home", en: "Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "transit-uni",
    kind: "transit",
    start: "10:00",
    end: "10:55",
    title: { es: "Transporte a University", en: "Transit to University" },
    detail: {
      es: "55 min puerta a sala. Salir a las 10:00, no a las 10:10. Si sigue húmedo, impermeable puesto.",
      en: "55 min door to classroom. Leave at 10:00, not 10:10. If the street is still wet, waterproof on.",
    },
    location: { es: "Hacia University", en: "To University" },
    tag: { es: "Traslados", en: "Transit" },
  },
  {
    id: "clases",
    kind: "event",
    start: "11:00",
    end: "13:30",
    title: { es: "Clases", en: "Classes" },
    detail: {
      es: "11:00 bdd · 12:20 innovación. Bloque continuo hasta 13:30. Agua a mano; no dejes el almuerzo para las 16:00.",
      en: "11:00 bdd · 12:20 innovación. Continuous block until 13:30. Water on hand; do not push lunch to 16:00.",
    },
    location: { es: "University", en: "University" },
    tag: { es: "Calendario", en: "Calendar" },
  },
];

export const laterBlocks: ScheduleBlock[] = [
  {
    id: "lunch",
    kind: "plan",
    start: "13:30",
    end: "15:15",
    title: { es: "Almuerzo · respiro", en: "Lunch · reset" },
    detail: {
      es: "Comida real después de innovación. Luego University o Home, según te alcance el tiempo antes del tutor.",
      en: "Real meal after innovación. Then University or Home, depending on how much time you have before the tutor.",
    },
    location: { es: "University o Home", en: "University or Home" },
    tag: { es: "Plan", en: "Plan" },
  },
  {
    id: "tutor",
    kind: "event",
    start: "16:00",
    end: "17:30",
    title: { es: "Math tutor", en: "Math tutor" },
    detail: {
      es: "Bloque de calendario 16:00–17:30. No es entrenamiento: sin protocolo de proteína post-gym.",
      en: "Calendar block 16:00–17:30. Not training: no post-gym protein protocol.",
    },
    location: { es: "Math tutor", en: "Math tutor" },
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
  committed: "3",
  transit: "25+55m",
  first: "07:00",
};
