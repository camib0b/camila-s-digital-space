import type { ConcatPartView } from "@/lib/concat/types";

export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = values[key];
    return value === undefined ? match : String(value);
  });
}

/** Exact byte count with grouping. Never rounded, so two files stay comparable. */
export function formatByteCount(bytes: number, language: string): string {
  if (!Number.isFinite(bytes)) {
    return "";
  }
  const grouped = new Intl.NumberFormat(language, { maximumFractionDigits: 0 }).format(Math.round(bytes));
  return `${grouped} B`;
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "";
  }
  const totalSeconds = Math.round(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  const minuteText = String(minutes).padStart(2, "0");
  const secondText = String(remainingSeconds).padStart(2, "0");
  if (hours > 0) {
    return `${hours}:${minuteText}:${secondText}`;
  }
  return `${minutes}:${secondText}`;
}

/**
 * How long a join took. Under a minute: "12.4 s" (locale decimal).
 * Then m:ss, and h:mm:ss once it passes an hour.
 */
export function formatJoinDuration(durationMilliseconds: number, language: string): string {
  const safeMilliseconds =
    Number.isFinite(durationMilliseconds) && durationMilliseconds > 0 ? durationMilliseconds : 0;
  const roundedTenths = Math.round(safeMilliseconds / 100) / 10;
  if (roundedTenths < 60) {
    const secondsLabel = new Intl.NumberFormat(language, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(roundedTenths);
    return `${secondsLabel} s`;
  }
  const totalSeconds = Math.round(safeMilliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const secondText = String(seconds).padStart(2, "0");
  if (hours > 0) {
    const minuteText = String(minutes).padStart(2, "0");
    return `${hours}:${minuteText}:${secondText}`;
  }
  return `${minutes}:${secondText}`;
}

export function formatPartIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function sumKnownBytes(parts: readonly Pick<ConcatPartView, "sizeBytes">[]): number | null {
  if (parts.length === 0) {
    return 0;
  }
  let total = 0;
  for (const part of parts) {
    if (part.sizeBytes === null || !Number.isFinite(part.sizeBytes)) {
      return null;
    }
    total += part.sizeBytes;
  }
  return total;
}

export function sumKnownDuration(parts: readonly Pick<ConcatPartView, "durationSeconds">[]): number | null {
  if (parts.length === 0) {
    return 0;
  }
  let total = 0;
  for (const part of parts) {
    if (part.durationSeconds === null || !Number.isFinite(part.durationSeconds)) {
      return null;
    }
    total += part.durationSeconds;
  }
  return total;
}

/** libx264 and typical AVC encoders want even dimensions. */
export function evenDimension(value: number): number {
  const rounded = Math.max(2, Math.round(value));
  return rounded % 2 === 0 ? rounded : rounded + 1;
}

export function roundFrameRate(frameRate: number): number {
  if (!Number.isFinite(frameRate) || frameRate <= 0) {
    return 0;
  }
  return Math.round(frameRate * 1000) / 1000;
}

/** A visible file name that keeps the extension, which is where parts differ. */
export function splitFileName(name: string): { stem: string; extension: string; title: string } {
  const title = name;
  const singleLine = name.replace(/\s+/g, " ").trim();
  const visible = singleLine.length > 0 ? singleLine : "—";
  const dotIndex = visible.lastIndexOf(".");
  const extensionLength = visible.length - dotIndex;
  const hasExtension = dotIndex > 0 && extensionLength > 1 && extensionLength <= 8;
  if (!hasExtension) {
    return { stem: visible, extension: "", title };
  }
  return {
    stem: visible.slice(0, dotIndex),
    extension: visible.slice(dotIndex),
    title,
  };
}
