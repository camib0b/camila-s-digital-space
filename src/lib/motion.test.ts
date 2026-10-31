import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cssMotionVariables } from "./motion";

const sourceRoot = join(process.cwd(), "src");
const indexStylesheetPath = join(sourceRoot, "index.css");
const tokenBlockStart = "/* motion-tokens:start */";
const tokenBlockEnd = "/* motion-tokens:end */";

const durationLiteral = /\d+(?:\.\d+)?ms\b|\d+(?:\.\d+)?s\b/g;
const cubicBezierLiteral = /cubic-bezier\(/g;
const tailwindDurationClass = /duration-\d+/g;

function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`])\/\/.*$/gm, "$1");
}

function readSource(relativePath: string): string {
  return readFileSync(join(sourceRoot, relativePath), "utf8");
}

function listStyleAndComponentSources(directory = sourceRoot, prefix = ""): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...listStyleAndComponentSources(join(directory, entry.name), relativePath));
      continue;
    }
    if (entry.name.endsWith(".css") || entry.name.endsWith(".tsx")) {
      files.push(relativePath);
    }
  }
  return files;
}

function motionTokenBlock(stylesheet: string): string {
  const start = stylesheet.indexOf(tokenBlockStart);
  const end = stylesheet.indexOf(tokenBlockEnd);
  if (start === -1 || end === -1 || end < start) {
    throw new Error("src/index.css is missing the motion-tokens block");
  }
  return stylesheet.slice(start + tokenBlockStart.length, end);
}

function declaredCustomProperties(block: string): Record<string, string> {
  const properties: Record<string, string> = {};
  const declaration = /(--[\w-]+)\s*:\s*([^;]+);/g;
  for (const match of block.matchAll(declaration)) {
    properties[match[1]] = match[2].trim();
  }
  return properties;
}

describe("motion tokens", () => {
  it("mirrors every custom property in the index.css motion-tokens block", () => {
    const declared = declaredCustomProperties(motionTokenBlock(readSource("index.css")));
    expect(declared).toEqual(cssMotionVariables);
  });

  it("rejects literal durations and cubic-bezier curves outside the token definitions", () => {
    const violations: string[] = [];
    for (const relativePath of listStyleAndComponentSources()) {
      let source = readSource(relativePath);
      if (relativePath === "index.css") {
        const start = source.indexOf(tokenBlockStart);
        const end = source.indexOf(tokenBlockEnd);
        source = source.slice(0, start) + source.slice(end + tokenBlockEnd.length);
      }
      const visibleSource = stripComments(source);
      for (const match of visibleSource.matchAll(durationLiteral)) {
        violations.push(`${relativePath}: ${match[0]}`);
      }
      for (const match of visibleSource.matchAll(cubicBezierLiteral)) {
        violations.push(`${relativePath}: cubic-bezier`);
      }
      for (const match of visibleSource.matchAll(tailwindDurationClass)) {
        violations.push(`${relativePath}: ${match[0]}`);
      }
    }
    expect(violations).toEqual([]);
  });

  it("points Tailwind duration and easing utilities at the same custom properties", () => {
    const tailwindConfig = readFileSync(join(process.cwd(), "tailwind.config.ts"), "utf8");
    const expectedReferences = [
      'press: "var(--duration-press)"',
      'fast: "var(--duration-fast)"',
      'hover: "var(--duration-hover)"',
      'base: "var(--duration-base)"',
      'enter: "var(--duration-enter)"',
      'hero: "var(--duration-hero)"',
      '"out-strong": "var(--ease-out-strong)"',
      '"in-out-strong": "var(--ease-in-out-strong)"',
      'hero: "var(--ease-hero)"',
      'hover: "var(--ease-hover)"',
      'standard: "var(--ease-standard)"',
    ];
    for (const reference of expectedReferences) {
      expect(tailwindConfig).toContain(reference);
    }
    expect(tailwindConfig).not.toMatch(/transitionDuration:[\s\S]*\d+ms/);
    expect(tailwindConfig).not.toContain("cubic-bezier(");
  });
});
