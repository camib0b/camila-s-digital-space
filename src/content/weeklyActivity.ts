export interface WeeklyActivityHours {
  coding: number;
  hockey: number;
  study: number;
}

/** Hours per weekday index (0 = Monday … 6 = Sunday). */
export const weeklyActivityHours: WeeklyActivityHours[] = [
  { coding: 4, hockey: 2, study: 3 },
  { coding: 6, hockey: 0, study: 4 },
  { coding: 5, hockey: 2, study: 2 },
  { coding: 7, hockey: 0, study: 3 },
  { coding: 4, hockey: 2, study: 2 },
  { coding: 2, hockey: 3, study: 1 },
  { coding: 1, hockey: 2, study: 0 },
];

export const dashboardStatValues = {
  yearsCoding: "4+",
  booksThisYear: "12",
  internships: "3",
  projects: "8+",
} as const;

export const WEEKDAY_NAMES = {
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  es: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
} as const;
