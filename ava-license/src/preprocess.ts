import { canonicalTeamName, normalizeTeamKey } from "./teams.ts";

export interface SuggestedField {
  value: string | null;
  confidence: number | null;
  source: "tool" | "llm" | null;
}

export interface NameSuggestion {
  home: SuggestedField;
  away: SuggestedField;
  date: SuggestedField;
}

const VIDEO_EXTENSION = /\.(mp4|mov|mts|m4v|m2ts|avi)$/i;
const COPY_PREFIX = /^(?:copia de|copy of)\s+/i;
const ROUND_CODE = /\b(?:fecha\s+\d+|f\d+)\b/gi;
const STANDALONE_YEAR = /\b(?:19|20)\d{2}\b/g;
const TEAM_SEPARATOR = /\s+(?:vs\.?|v\.?|[-–—])\s+/i;

const MONTH_NUMBERS: Readonly<Record<string, number>> = {
  january: 1,
  jan: 1,
  enero: 1,
  ene: 1,
  february: 2,
  feb: 2,
  febrero: 2,
  march: 3,
  mar: 3,
  marzo: 3,
  april: 4,
  apr: 4,
  abril: 4,
  abr: 4,
  may: 5,
  mayo: 5,
  june: 6,
  jun: 6,
  junio: 6,
  july: 7,
  jul: 7,
  julio: 7,
  august: 8,
  aug: 8,
  agosto: 8,
  ago: 8,
  september: 9,
  sept: 9,
  sep: 9,
  septiembre: 9,
  setiembre: 9,
  october: 10,
  oct: 10,
  octubre: 10,
  november: 11,
  nov: 11,
  noviembre: 11,
  december: 12,
  dec: 12,
  diciembre: 12,
  dic: 12,
};

const MONTH_PATTERN = Object.keys(MONTH_NUMBERS)
  .sort((left, right) => right.length - left.length)
  .join("|");

interface DateHit {
  iso: string;
  start: number;
  end: number;
}

export function suggestNamesFromFileNames(fileNames: readonly string[]): NameSuggestion {
  let home: SuggestedField = abstain();
  let away: SuggestedField = abstain();
  let date: SuggestedField = decided(null);
  let dateWasUnparsed = false;
  let sawAnyFile = false;

  for (const fileName of fileNames) {
    const parsed = parseFileName(fileName);
    sawAnyFile = true;
    if (home.value === null && parsed.home.value !== null) home = parsed.home;
    if (away.value === null && parsed.away.value !== null) away = parsed.away;
    if (date.value === null && parsed.date.value !== null) date = parsed.date;
    if (parsed.date.source === null) dateWasUnparsed = true;
  }

  if (!sawAnyFile) {
    return { home: abstain(), away: abstain(), date: abstain() };
  }
  if (date.value === null && dateWasUnparsed) {
    date = abstain();
  }
  return { home, away, date };
}

export function parseFileName(fileName: string): NameSuggestion {
  let working = fileName.normalize("NFC").trim();
  working = working.replace(VIDEO_EXTENSION, "");
  working = working.replace(COPY_PREFIX, "");
  working = working.replace(/\s+/g, " ").trim();

  const dateHit = findDate(working);
  let date = decided(null);
  if (dateHit?.iso) {
    date = decided(dateHit.iso);
    working = `${working.slice(0, dateHit.start)} ${working.slice(dateHit.end)}`;
  } else if (dateHit && !dateHit.iso) {
    date = abstain();
    working = `${working.slice(0, dateHit.start)} ${working.slice(dateHit.end)}`;
  }

  ROUND_CODE.lastIndex = 0;
  working = working.replace(ROUND_CODE, " ");
  STANDALONE_YEAR.lastIndex = 0;
  working = working.replace(STANDALONE_YEAR, " ");
  working = working.replace(COPY_PREFIX, "");
  working = working.replace(/\s+/g, " ").trim();

  const sides = splitTeamSides(working);
  if (!sides) {
    return { home: abstain(), away: abstain(), date };
  }
  return {
    home: canonicalSide(sides.home),
    away: canonicalSide(sides.away),
    date,
  };
}

export function cleanModelTeamName(value: string): string {
  let working = value.normalize("NFC").trim();
  working = working.replace(VIDEO_EXTENSION, "");
  working = working.replace(ROUND_CODE, " ");
  working = working.replace(/\s+/g, " ").trim();
  return working;
}

function canonicalSide(side: string): SuggestedField {
  const canonical = canonicalTeamName(cleanModelTeamName(side));
  if (!canonical) return abstain();
  return decided(canonical);
}

function abstain(): SuggestedField {
  return { value: null, confidence: null, source: null };
}

function decided(value: string | null): SuggestedField {
  return { value, confidence: 1, source: "tool" };
}

function splitTeamSides(value: string): { home: string; away: string } | null {
  const match = TEAM_SEPARATOR.exec(value);
  if (!match || match.index === undefined) return null;
  const home = cleanSide(value.slice(0, match.index));
  const away = cleanSide(value.slice(match.index + match[0].length));
  if (!home || !away) return null;
  return { home, away };
}

function cleanSide(value: string): string {
  return value.replace(/^[\s._-]+|[\s._-]+$/g, "").replace(/\s+/g, " ").trim();
}

function findDate(value: string): DateHit | null {
  const candidates = [
    matchIso(value),
    matchCompact(value),
    matchDotted(value),
    matchMonthName(value, "month-first"),
    matchMonthName(value, "day-first"),
  ].filter((candidate): candidate is DateHit => candidate !== null);
  const valid = candidates.filter((candidate) => candidate.iso.length > 0);
  const pool = valid.length > 0 ? valid : candidates;
  let best: DateHit | null = null;
  for (const candidate of pool) {
    if (!best || candidate.start < best.start || (candidate.start === best.start && candidate.end > best.end)) {
      best = candidate;
    }
  }
  return best;
}

function matchIso(value: string): DateHit | null {
  const match = /\b(\d{4})-(\d{2})-(\d{2})\b/.exec(value);
  if (!match || match.index === undefined) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return hit(match.index, match.index + match[0].length, isoDateFromParts(year, month, day));
}

function matchCompact(value: string): DateHit | null {
  const match = /\b(20\d{2})(\d{2})(\d{2})\b/.exec(value);
  if (!match || match.index === undefined) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return hit(match.index, match.index + match[0].length, isoDateFromParts(year, month, day));
}

function matchDotted(value: string): DateHit | null {
  const match = /\b(\d{1,2})[./](\d{1,2})[./](\d{4}|\d{2})\b/.exec(value);
  if (!match || match.index === undefined) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = expandYear(match[3] ?? "");
  return hit(match.index, match.index + match[0].length, isoDateFromParts(year, month, day));
}

function matchMonthName(value: string, order: "month-first" | "day-first"): DateHit | null {
  const pattern =
    order === "month-first"
      ? new RegExp(`\\b(${MONTH_PATTERN})\\s+(\\d{1,2})(?:st|nd|rd|th)?[,]?\\s+(20\\d{2})\\b`, "i")
      : new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(${MONTH_PATTERN})\\s+(20\\d{2})\\b`, "i");
  const match = pattern.exec(value);
  if (!match || match.index === undefined) return null;
  const monthToken = order === "month-first" ? match[1] : match[2];
  const dayToken = order === "month-first" ? match[2] : match[1];
  const yearToken = match[3];
  const month = MONTH_NUMBERS[(monthToken ?? "").toLocaleLowerCase("en")];
  if (!month || !dayToken || !yearToken) return null;
  return hit(match.index, match.index + match[0].length, isoDateFromParts(Number(yearToken), month, Number(dayToken)));
}

function hit(start: number, end: number, iso: string | null): DateHit {
  return { start, end, iso: iso ?? "" };
}

function expandYear(yearText: string): number {
  const year = Number(yearText);
  if (yearText.length === 2) return year >= 70 ? 1900 + year : 2000 + year;
  return year;
}

export function isoDateFromParts(year: number, month: number, day: number): string | null {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
  if (year < 1990 || year > 2100) return null;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const utc = new Date(Date.UTC(year, month - 1, day));
  if (utc.getUTCFullYear() !== year || utc.getUTCMonth() !== month - 1 || utc.getUTCDate() !== day) {
    return null;
  }
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  return isoDateFromParts(year, month, day) === value;
}

export function normalizeHexColor(value: string | null | undefined): string | null {
  if (!value) return null;
  let text = value.trim();
  if (!text || text.toLocaleLowerCase("en") === "null") return null;
  if (!text.startsWith("#")) text = `#${text}`;
  if (/^#[0-9a-fA-F]{6}$/.test(text)) return text.toUpperCase();
  if (/^#[0-9a-fA-F]{3}$/.test(text)) {
    const digits = text.slice(1);
    return `#${digits[0]}${digits[0]}${digits[1]}${digits[1]}${digits[2]}${digits[2]}`.toUpperCase();
  }
  return null;
}

export function teamKeysMatch(left: string | null, right: string | null): boolean {
  if (!left || !right) return false;
  return normalizeTeamKey(left) === normalizeTeamKey(right);
}
