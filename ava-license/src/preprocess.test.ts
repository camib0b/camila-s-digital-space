import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { scoreTools } from "../eval/eval-tools.ts";
import { parseFileName, suggestNamesFromFileNames } from "./preprocess.ts";
import { TEAM_ALIASES, canonicalTeamName } from "./teams.ts";

interface DatasetItem {
  id: string;
  file_names: string[];
  truth: { home: string; away: string; date: string };
  truth_conflict?: boolean;
  file_name_has_full_date?: boolean;
}

const datasetPath = fileURLToPath(new URL("../eval/dataset.jsonl", import.meta.url));
const dataset: DatasetItem[] = readFileSync(datasetPath, "utf8")
  .split("\n")
  .filter((line) => line.trim())
  .map((line) => JSON.parse(line) as DatasetItem);

const expectedById: Record<string, { home: string; away: string; date: string | null }> = {
  "cogs-pwcc-2026-04-25": { home: "COGS", away: "PWCC", date: "2026-04-24" },
  "or-alu-2026-09-05": { home: "Alumni", away: "Old Reds", date: null },
  "ucb-mqa-2026-10-01": { home: "Manquehue", away: "UC Primera B", date: null },
};

function expectedFor(item: DatasetItem): { home: string; away: string; date: string | null } {
  return (
    expectedById[item.id] ?? {
      home: item.truth.home,
      away: item.truth.away,
      date: item.file_name_has_full_date ? item.truth.date : null,
    }
  );
}

test("every alias and canonical name resolves", () => {
  for (const [canonicalName, aliases] of Object.entries(TEAM_ALIASES)) {
    assert.equal(canonicalTeamName(canonicalName), canonicalName);
    for (const alias of aliases) {
      assert.equal(canonicalTeamName(alias), canonicalName, alias);
    }
  }
  assert.equal(canonicalTeamName("CDA"), "Alumni");
  assert.equal(canonicalTeamName("Católica A"), "UC Primera A");
  assert.equal(canonicalTeamName("Cato\u0301lica B"), "UC Primera B");
});

test("date parser uses Chilean day-first order and month names", () => {
  assert.equal(parseFileName("F13 Cogs vs Old Girls 03.10.26.mp4").date.value, "2026-10-03");
  assert.equal(parseFileName("COGS vs Catolica B 16.05.26.mp4").date.value, "2026-05-16");
  assert.equal(parseFileName("F3 COGS vs PWCC 24.04.26.mov").date.value, "2026-04-24");
  assert.equal(parseFileName("Cogs vs Católica A 26.09.2026.mp4").date.value, "2026-09-26");
  assert.equal(parseFileName("match 2026-10-03 COGS vs Old Girls.mp4").date.value, "2026-10-03");
  assert.equal(parseFileName("20260516 MA vs Old Girls.mov").date.value, "2026-05-16");
  assert.equal(parseFileName("F13 Cogs vs Old Girls Oct 3 2026.mp4").date.value, "2026-10-03");
  assert.equal(parseFileName("Cogs vs Old Girls 3 October 2026.mp4").date.value, "2026-10-03");
  assert.equal(parseFileName("COGS vs PWCC 16/05/2026.mp4").date.value, "2026-05-16");
  assert.equal(parseFileName("F11 CDA VS O. REDS 2026.mp4").date.value, null);
  assert.equal(parseFileName("F11 CDA VS O. REDS 2026.mp4").date.source, "tool");
  assert.equal(parseFileName("COGS vs PWCC 32.13.26.mp4").date.source, null);
});

test("round codes and the hyphen separator do not stick to team names", () => {
  const fecha = parseFileName("F3 COGS vs PWCC 24.04.26.mov");
  assert.equal(fecha.home.value, "COGS");
  assert.notEqual(fecha.home.value, "F3 COGS");
  const doce = parseFileName("F12 UC B vs OLD REDS.mp4");
  assert.equal(doce.home.value, "UC Primera B");
  assert.equal(doce.away.value, "Old Reds");
  const hyphen = parseFileName("Old reds - UC B.MP4");
  assert.equal(hyphen.home.value, "Old Reds");
  assert.equal(hyphen.away.value, "UC Primera B");
  const enDash = parseFileName("Old reds – UC B.mp4");
  assert.equal(enDash.home.value, "Old Reds");
  assert.equal(enDash.away.value, "UC Primera B");
  const fechaWord = parseFileName("Fecha 7 PWCC v OGIRLS.mov");
  assert.equal(fechaWord.home.value, "PWCC");
  assert.equal(fechaWord.away.value, "Old Girls");
  const copy = parseFileName("Copia de OG vs UCB.mp4");
  assert.equal(copy.home.value, "Old Girls");
  assert.equal(copy.away.value, "UC Primera B");
});

test("tools cover every dataset file name", () => {
  assert.equal(dataset.length, 16);
  let bothTeams = 0;
  for (const item of dataset) {
    const suggestion = suggestNamesFromFileNames(item.file_names);
    const expected = expectedFor(item);
    assert.equal(suggestion.home.value, expected.home, item.id);
    assert.equal(suggestion.away.value, expected.away, item.id);
    assert.equal(suggestion.date.value, expected.date, item.id);
    assert.equal(suggestion.home.source, "tool", item.id);
    assert.equal(suggestion.away.source, "tool", item.id);
    assert.equal(suggestion.date.source, "tool", item.id);
    assert.equal(suggestion.home.confidence, 1, item.id);
    if (suggestion.home.value === item.truth.home && suggestion.away.value === item.truth.away) {
      bothTeams += 1;
    }
  }
  assert.equal(bothTeams, 14);
  const report = scoreTools(dataset);
  assert.equal(report.names.both_normalized.k, 14);
  assert.equal(report.names.both_normalized.n, 16);
  assert.equal(report.names.swapped.k, 2);
  assert.equal(report.names.date_exact.k, 8);
  assert.equal(report.names.date_pm1.k, 9);
  assert.equal(report.names.date_exact_when_full_date_in_name.k, 8);
  assert.equal(report.names.date_exact_when_full_date_in_name.n, 9);
  assert.equal(report.names.date_null_when_no_full_date_in_name.k, 7);
});
