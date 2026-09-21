export const AVA_ACCESS_EMAIL = "camilaescuderob@gmail.com";
export const AVA_ACCESS_SUBJECT = "AVA";

export const AVA_EVENTS = [
  { token: "Goal", es: "Gol", en: "Goal" },
  { token: "Shot", es: "Tiro", en: "Shot" },
  { token: "PC", es: "Corto", en: "PC" },
  { token: "PC Foul", es: "Falta de PC", en: "PC Foul" },
  { token: "Card", es: "Tarjeta", en: "Card" },
  { token: "Pass", es: "Pase", en: "Pass" },
  { token: "Circle Entry", es: "Ingreso área", en: "Circle Entry" },
  { token: "16-yd", es: "16 yd", en: "16-yd" },
  { token: "50-yd", es: "50 yd", en: "50-yd" },
  { token: "75-yd", es: "75 yd", en: "75-yd" },
  { token: "Turnover", es: "Pérdida", en: "Turnover" },
  { token: "Special", es: "Special", en: "Special" },
  { token: "PS", es: "Penal", en: "PS" },
  { token: "S.O.", es: "S.O.", en: "S.O." },
] as const;

export const AVA_TIMELINE_MARKS: { at: number; token: (typeof AVA_EVENTS)[number]["token"] }[] = [
  { at: 5, token: "Circle Entry" },
  { at: 11, token: "Shot" },
  { at: 18, token: "PC" },
  { at: 25, token: "Goal" },
  { at: 32, token: "Turnover" },
  { at: 39, token: "Pass" },
  { at: 45, token: "Card" },
  { at: 52, token: "Circle Entry" },
  { at: 58, token: "Goal" },
];

export const MATCH_MINUTES = 60;

export const AVA_STATS = [
  { id: "possession", es: "Posesión", en: "Possession" },
  { id: "entries", es: "Ingresos", en: "Entries" },
  { id: "shots", es: "Tiros", en: "Shots" },
  { id: "pcs", es: "Cortos", en: "PCs" },
  { id: "turnovers", es: "Pérdidas", en: "Turnovers" },
] as const;

export const AVA_FOLLOW_UPS = [
  { id: "result", es: "Resultado", en: "Result", bodyKey: "ava.follow.result" },
  { id: "zone", es: "Zona", en: "Zone", bodyKey: "ava.follow.zone" },
  { id: "action", es: "Tipo de acción", en: "Action type", bodyKey: "ava.follow.action" },
  { id: "notes", es: "Notas", en: "Notes", bodyKey: "ava.follow.notes" },
] as const;

export const AVA_CONCAT_FILES = [
  { id: "q1", name: "Q1.MP4", duration: "17:31", seconds: 1051, quarter: "Q1" },
  { id: "q2", name: "Q2.MP4", duration: "17:28", seconds: 1048, quarter: "Q2" },
  { id: "q3", name: "Q3.MP4", duration: "17:33", seconds: 1053, quarter: "Q3" },
  { id: "card", name: "00004.MTS", duration: "12:04", seconds: 724, quarter: "Q4" },
] as const;

export const AVA_CONCAT_TOTAL_LABEL = "64:36";
