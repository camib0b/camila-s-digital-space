/**
 * Canonical team names and aliases.
 *
 * carpeta.cl's D1 database (`carpeta-de-clips`) has `matches.home_team` and
 * `matches.away_team`. It does not have a `teams` table (see migrations in
 * camib0b/carpeta-de-clips). Binding that database from this Worker would be a
 * read of match rows, not a team catalog, and would couple license checks to
 * the production clips database. This static list is the catalog.
 *
 * Aliases match score.py's nickname table. CDA = Alumni, confirmed 2026-10-27.
 * "OG" maps to Old Girls, which is ambiguous with Old Gabs when the token is alone.
 */
export const TEAM_ALIASES: Readonly<Record<string, readonly string[]>> = {
  COGS: ["cogs", "cog"],
  PWCC: ["pwcc", "pwc", "prince of wales", "prince of wales country club", "pwcc a"],
  "UC Primera B": ["uc primera b", "ucb", "uc b", "u.c b", "catolica b", "universidad catolica b", "uc 1era b"],
  "UC Primera A": ["uc primera a", "uca", "uc a", "u.c a", "catolica a", "universidad catolica a", "uc 1era a"],
  Manquehue: ["manquehue", "ma", "mqa", "mq", "manquehue a", "manquhue a"],
  "Old Girls": ["old girls", "og", "ogi", "ogirls", "o.girls", "o girls", "o.g"],
  "Old Reds": ["old reds", "or", "ore", "o.reds", "o. reds", "o reds", "oreds", "o.r"],
  "Old Gabs": ["old gabs", "oga"],
  Alumni: ["alumni", "alu", "cda", "club deportivo alumni"],
  "UC Sub-16 A": ["uc sub-16 a", "uc sub 16 a", "s16a uc", "uc s16a"],
};

export function normalizeTeamKey(value: string): string {
  const decomposed = value.normalize("NFKD");
  let withoutMarks = "";
  for (const character of decomposed) {
    const code = character.codePointAt(0) ?? 0;
    if (code >= 0x0300 && code <= 0x036f) continue;
    withoutMarks += character;
  }
  return withoutMarks
    .toLocaleLowerCase("en")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

const ALIAS_INDEX: ReadonlyMap<string, string> = buildAliasIndex();

function buildAliasIndex(): Map<string, string> {
  const index = new Map<string, string>();
  for (const [canonicalName, aliases] of Object.entries(TEAM_ALIASES)) {
    for (const alias of [...aliases, canonicalName]) {
      index.set(normalizeTeamKey(alias), canonicalName);
    }
  }
  return index;
}

export function canonicalTeamName(value: string | null | undefined): string | null {
  if (!value) return null;
  const key = normalizeTeamKey(value);
  if (!key) return null;
  return ALIAS_INDEX.get(key) ?? null;
}
