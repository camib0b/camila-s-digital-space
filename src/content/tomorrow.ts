export const TOMORROW_DATE = "2026-08-31";
export const TIMEZONE = "America/Santiago";
export const SOURCED_AT = "2026-08-30T08:42:00-04:00";

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
    es: "University a las 11:00 (bdd, luego innovación). Sin gym en el calendario — la mañana sale de Home hacia University. Math tutor a las 16:00.",
    en: "University at 11:00 (bdd, then innovación). No gym on the calendar — morning runs Home to University. Math tutor at 16:00.",
  } satisfies Copy,
  timezone: { es: "Santiago · UTC−4", en: "Santiago · UTC−4" } satisfies Copy,
  blocksLabel: { es: "Bloques", en: "Blocks" } satisfies Copy,
  committed: { es: "En calendario", en: "On the calendar" } satisfies Copy,
  transit: { es: "Traslado", en: "Transit" } satisfies Copy,
  first: { es: "Primer bloque", en: "First block" } satisfies Copy,
  note: {
    es: "Dos eventos en Google Calendar. Clase 11:00–13:30 en University; Math tutor 16:00–17:30. Transporte público: salir de Home 55–60 min antes (10:00). Mañana fresca (~8–12 °C), máxima ~18–19 °C; posible resto de chubascos temprano — impermeable liviano. Gym no entra: el despertar a las 06:30 para encajar ida + sesión + ducha + vuelta antes de las 10:00 comprime el sueño y el clima no ayuda.",
    en: "Two Google Calendar events. Class 11:00–13:30 at University; Math tutor 16:00–17:30. Public transport: leave Home 55–60 min before class (10:00). Cool morning (~8–12 °C), high ~18–19 °C; leftover showers possible early — light waterproof. Gym stays out: a 06:30 wake to fit drive + session + shower + return before 10:00 would compress sleep, and the weather does not help.",
  } satisfies Copy,
  later: { es: "Más tarde", en: "Later today" } satisfies Copy,
  laterBody: {
    es: "Después de innovación (~13:30), almuerzo y un rato en University o Home antes de Math tutor a las 16:00. No es entrenamiento: no aplica el protocolo post-gym.",
    en: "After innovación (~13:30), lunch and a stretch at University or Home before Math tutor at 16:00. That block is not training: skip the post-gym protocol.",
  } satisfies Copy,
  night: { es: "La noche anterior", en: "The night before" } satisfies Copy,
  source: {
    es: "Desde Google Calendar · 30 ago 2026, 08:42",
    en: "From Google Calendar · 30 Aug 2026, 08:42",
  } satisfies Copy,
  map: { es: "Mapa", en: "Map" } satisfies Copy,
};

export const nightBefore: Copy[] = [
  {
    es: "Armar mochila de University: cuaderno/laptop, cargador, botella, colación. Notas a mano para bdd (11:00) e innovación (12:20)",
    en: "Pack the University bag: notebook/laptop, charger, bottle, snack. Notes ready for bdd (11:00) and innovación (12:20)",
  },
  {
    es: "Desayuno real en Home — no hay gym antes de clase. Dejar algo fácil listo (yogur + fruta, tostadas, huevos)",
    en: "Real breakfast at Home — no gym before class. Leave something easy ready (yogurt + fruit, toast, eggs)",
  },
  {
    es: "Capas para ~8–12 °C al salir y ~18 °C al mediodía: base manga larga + polar o hoodie + chaqueta liviana. Impermeable compacto por si queda llovizna. En University te sacas la capa de abrigo",
    en: "Layers for ~8–12 °C on the way out and ~18 °C by midday: long-sleeve base + fleece or hoodie + light jacket. Compact waterproof if drizzle lingers. Shed the warm layer at University",
  },
  {
    es: "Alarma 09:15, backup 09:25. Sales de Home a las 10:00. Botella llena, teléfono cargado, tarjeta de transporte",
    en: "Alarm 09:15, backup 09:25. Leave Home at 10:00. Bottle filled, phone charged, transit card",
  },
  {
    es: "Confirmar hora y materiales de Math tutor (16:00) para no decidir eso a las 15:00",
    en: "Confirm time and materials for Math tutor (16:00) so you are not deciding that at 15:00",
  },
  {
    es: "Luces apagadas ~23:15–23:30. El primer despertar cuesta — no comprimas el sueño aunque la alarma sea más tarde que un día de gym",
    en: "Lights out ~23:15–23:30. First alarm is hard — do not compress sleep even though the alarm is later than a gym day",
  },
];

export const morningBlocks: ScheduleBlock[] = [
  {
    id: "wake",
    kind: "plan",
    start: "09:15",
    end: "10:00",
    title: { es: "Despertar · salir", en: "Wake · leave" },
    detail: {
      es: "400–500 ml de agua al despertar. Baño, cara, capas de anoche. Desayuno real. Hidratar hasta ~600–800 ml. Mochila ya armada. Buffer de 45 min porque el primer despertar se atrasa.",
      en: "400–500 ml water on waking. Bathroom, face, layers from last night. Real breakfast. Sip to ~600–800 ml. Bag already packed. 45 min buffer because the first alarm slips.",
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
      es: "55 min puerta a sala. Salir a las 10:00, no a las 10:10. Si quedó humedad en la calle, la chaqueta impermeable va puesta, no en la mochila.",
      en: "55 min door to classroom. Leave at 10:00, not 10:10. If the street is still wet, the waterproof jacket is on, not in the bag.",
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
  committed: "2",
  transit: "55m",
  first: "11:00",
};
