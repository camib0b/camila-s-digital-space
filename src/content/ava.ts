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
  { at: 6, token: "Circle Entry" },
  { at: 13, token: "Shot" },
  { at: 21, token: "PC" },
  { at: 29, token: "Goal" },
  { at: 37, token: "Turnover" },
  { at: 45, token: "Pass" },
  { at: 53, token: "Card" },
  { at: 61, token: "Circle Entry" },
  { at: 68, token: "Goal" },
];

export const MATCH_MINUTES = 70;

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
