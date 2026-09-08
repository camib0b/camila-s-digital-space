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
