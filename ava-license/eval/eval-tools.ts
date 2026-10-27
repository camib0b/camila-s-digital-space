import { readFileSync } from "node:fs";
import { argv } from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

import { suggestNamesFromFileNames } from "../src/preprocess.ts";
import { canonicalTeamName } from "../src/teams.ts";

interface DatasetItem {
  id: string;
  file_names: string[];
  truth: { home: string; away: string; date: string };
  truth_conflict?: boolean;
  file_name_has_full_date?: boolean;
}

interface ScoredItem {
  id: string;
  bothNormalized: boolean;
  swapped: boolean;
  dateExact: boolean;
  datePm1: boolean;
  truthConflict: boolean;
  fileNameHasFullDate: boolean;
  predictedDate: string | null;
}

export interface ToolScoreReport {
  dataset_items: number;
  names: {
    parse_or_schema_failure: Rate;
    both_normalized: Rate;
    swapped: Rate;
    date_exact: Rate;
    date_pm1: Rate;
    both_normalized_excl_truth_conflict: Rate;
    date_exact_when_full_date_in_name: Rate;
    date_pm1_when_full_date_in_name: Rate;
    date_null_when_no_full_date_in_name: Rate;
  };
}

interface Rate {
  n: number;
  k: number;
  rate: number | null;
}

export function loadDataset(path: string): DatasetItem[] {
  return readFileSync(path, "utf8")
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line) as DatasetItem);
}

export function scoreTools(items: readonly DatasetItem[]): ToolScoreReport {
  const scored = items.map(scoreItem);
  const dated = scored.filter((item) => item.fileNameHasFullDate);
  const undated = scored.filter((item) => !item.fileNameHasFullDate);
  const withoutConflict = scored.filter((item) => !item.truthConflict);
  return {
    dataset_items: items.length,
    names: {
      parse_or_schema_failure: rate(scored.map(() => false)),
      both_normalized: rate(scored.map((item) => item.bothNormalized)),
      swapped: rate(scored.map((item) => item.swapped)),
      date_exact: rate(scored.map((item) => item.dateExact)),
      date_pm1: rate(scored.map((item) => item.datePm1)),
      both_normalized_excl_truth_conflict: rate(withoutConflict.map((item) => item.bothNormalized)),
      date_exact_when_full_date_in_name: rate(dated.map((item) => item.dateExact)),
      date_pm1_when_full_date_in_name: rate(dated.map((item) => item.datePm1)),
      date_null_when_no_full_date_in_name: rate(undated.map((item) => item.predictedDate === null)),
    },
  };
}

function scoreItem(item: DatasetItem): ScoredItem {
  const suggestion = suggestNamesFromFileNames(item.file_names);
  const home = canonicalTeamName(suggestion.home.value);
  const away = canonicalTeamName(suggestion.away.value);
  const predictedDate = suggestion.date.value;
  const bothNormalized = home === item.truth.home && away === item.truth.away;
  const swapped = home === item.truth.away && away === item.truth.home && home !== null;
  let dateExact = false;
  let datePm1 = false;
  if (predictedDate) {
    const delta = daysBetween(predictedDate, item.truth.date);
    dateExact = delta === 0;
    datePm1 = Math.abs(delta) <= 1;
  }
  return {
    id: item.id,
    bothNormalized,
    swapped,
    dateExact,
    datePm1,
    truthConflict: item.truth_conflict === true,
    fileNameHasFullDate: item.file_name_has_full_date === true,
    predictedDate,
  };
}

function daysBetween(isoDate: string, truthDate: string): number {
  const left = Date.parse(`${isoDate}T00:00:00Z`);
  const right = Date.parse(`${truthDate}T00:00:00Z`);
  return Math.round((left - right) / 86_400_000);
}

function rate(values: boolean[]): Rate {
  const hits = values.filter(Boolean).length;
  return {
    n: values.length,
    k: hits,
    rate: values.length === 0 ? null : Math.round((hits / values.length) * 10_000) / 10_000,
  };
}

function isDirectRun(): boolean {
  const entry = argv[1];
  if (!entry) return false;
  return import.meta.url === pathToFileURL(entry).href;
}

function main(): void {
  const datasetPath = argv[2] ?? fileURLToPath(new URL("./dataset.jsonl", import.meta.url));
  const items = loadDataset(datasetPath);
  const report = scoreTools(items);
  console.log(JSON.stringify(report.names, null, 1));
  const both = report.names.both_normalized;
  console.log(`tools alone: both teams normalized ${both.k}/${both.n}`);
}

if (isDirectRun()) {
  main();
}
