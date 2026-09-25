const MILLISECONDS_PER_DAY = 86_400_000;

export function calendarDaysBetween(startDate: string, endDate: string): number {
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  return Math.round((end - start) / MILLISECONDS_PER_DAY);
}

export function isFriday(isoDate: string): boolean {
  return new Date(`${isoDate}T00:00:00Z`).getUTCDay() === 5;
}

export function addCalendarDays(isoDate: string, days: number): string {
  const time = Date.parse(`${isoDate}T00:00:00Z`) + days * MILLISECONDS_PER_DAY;
  return new Date(time).toISOString().slice(0, 10);
}

export function earlierDate(left: string, right: string): string {
  return left < right ? left : right;
}

export function laterDate(left: string, right: string): string {
  return left > right ? left : right;
}
