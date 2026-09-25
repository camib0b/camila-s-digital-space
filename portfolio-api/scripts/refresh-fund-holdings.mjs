/**
 * Download issuer N-PORT-P filings and write versioned holdings snapshots.
 * Run manually. The Worker reads the committed JSON and does not fetch filings per request.
 *
 *   node scripts/refresh-fund-holdings.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const USER_AGENT = "CamilaEscuderoResearch camila@camilaescudero.cl";
const OUTPUT_DIRECTORY = path.join(path.dirname(fileURLToPath(import.meta.url)), "../data/holdings");

const FILINGS = [
  {
    fundTicker: "VOO",
    name: "Vanguard S&P 500 ETF",
    isin: "US9229083632",
    assetClass: "equity",
    lookThrough: true,
    cik: 36405,
    accession: "0000036405-26-000473",
    issuer: "Vanguard Index Funds",
  },
  {
    fundTicker: "VXUS",
    name: "Vanguard Total International Stock ETF",
    isin: "US9219097683",
    assetClass: "equity",
    lookThrough: true,
    cik: 857489,
    accession: "0000857489-26-000187",
    issuer: "Vanguard International Equity Index Funds",
  },
  {
    fundTicker: "ROBO",
    name: "ROBO Global Robotics and Automation Index ETF",
    isin: "US3015057074",
    assetClass: "equity",
    lookThrough: true,
    cik: 1452937,
    accession: "0002048251-26-005392",
    issuer: "Exchange Traded Concepts Trust",
    alternateCik: 2048251,
  },
];

function cusipToIsin(countryCode, cusip) {
  const body = `${countryCode}${cusip}`;
  let digits = "";
  for (const character of body) {
    if (character >= "0" && character <= "9") {
      digits += character;
    } else {
      digits += String(character.charCodeAt(0) - 55);
    }
  }
  let total = 0;
  const reversed = [...digits].reverse();
  for (let index = 0; index < reversed.length; index += 1) {
    let value = Number(reversed[index]);
    if (index % 2 === 0) {
      value *= 2;
      if (value > 9) {
        value -= 9;
      }
    }
    total += value;
  }
  return `${body}${(10 - (total % 10)) % 10}`;
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", "\"")
    .replaceAll("&apos;", "'");
}

function tag(block, name) {
  const match = block.match(new RegExp(`<${name}>([^<]*)</${name}>`));
  return match ? decodeXml(match[1].trim()) : null;
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT, Accept: "application/xml,text/xml,*/*" } });
  if (!response.ok) {
    throw new Error(`${response.status} ${url}`);
  }
  return response.text();
}

async function downloadFiling(filing) {
  const accessionPath = filing.accession.replaceAll("-", "");
  const candidates = [filing.cik, filing.alternateCik].filter((cik) => cik !== undefined);
  let lastError = null;
  for (const cik of candidates) {
    const url = `https://www.sec.gov/Archives/edgar/data/${cik}/${accessionPath}/primary_doc.xml`;
    try {
      return await fetchText(url);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error(`Could not download ${filing.accession}`);
}

function parseHoldings(xml) {
  const seriesName = tag(xml, "seriesName");
  const asOf = tag(xml, "repPdDate");
  if (seriesName === null || asOf === null) {
    throw new Error("N-PORT is missing series name or report date");
  }
  const blocks = xml.split("<invstOrSec>").slice(1);
  const byIsin = new Map();
  let unresolvedWeight = 0;
  for (const block of blocks) {
    const item = block.slice(0, block.indexOf("</invstOrSec>"));
    const percent = Number(tag(item, "pctVal"));
    if (!Number.isFinite(percent)) {
      continue;
    }
    const weight = percent / 100;
    const name = tag(item, "name") ?? "Unknown security";
    let isin = item.match(/<isin value="([^"]+)"/)?.[1] ?? null;
    if (isin === null) {
      const cusip = tag(item, "cusip");
      const country = tag(item, "invCountry");
      if (cusip && country === "US" && /^[0-9A-Z]{9}$/.test(cusip)) {
        isin = cusipToIsin("US", cusip);
      }
    }
    if (isin === null) {
      unresolvedWeight += weight;
      continue;
    }
    const current = byIsin.get(isin);
    if (current === undefined) {
      byIsin.set(isin, { isin, name, weight });
    } else {
      current.weight += weight;
    }
  }
  const holdings = [...byIsin.values()].sort((left, right) => right.weight - left.weight);
  const coverage = holdings.reduce((total, holding) => total + holding.weight, 0);
  return { seriesName, asOf, holdings, coverage, unresolvedWeight };
}

await mkdir(OUTPUT_DIRECTORY, { recursive: true });
const manifest = [];

for (const filing of FILINGS) {
  const xml = await downloadFiling(filing);
  const parsed = parseHoldings(xml);
  const snapshot = {
    fundTicker: filing.fundTicker,
    name: filing.name,
    isin: filing.isin,
    asOf: parsed.asOf,
    source: `${filing.issuer} N-PORT-P ${filing.accession} (${parsed.seriesName})`,
    accession: filing.accession,
    assetClass: filing.assetClass,
    lookThrough: filing.lookThrough,
    holdings: parsed.holdings,
  };
  const filename = `${filing.fundTicker.toLowerCase()}-${parsed.asOf}.json`;
  await writeFile(path.join(OUTPUT_DIRECTORY, filename), `${JSON.stringify(snapshot)}\n`);
  manifest.push({
    fundTicker: filing.fundTicker,
    file: filename,
    asOf: parsed.asOf,
    seriesName: parsed.seriesName,
    holdingCount: parsed.holdings.length,
    coverage: parsed.coverage,
    unresolvedWeight: parsed.unresolvedWeight,
  });
  console.log(
    filing.fundTicker,
    parsed.seriesName,
    parsed.asOf,
    "holdings",
    parsed.holdings.length,
    "coverage",
    parsed.coverage.toFixed(4),
    "unresolved",
    parsed.unresolvedWeight.toFixed(4),
  );
}

const bondSnapshot = {
  fundTicker: "BND",
  name: "Vanguard Total Bond Market ETF",
  isin: "US9219378356",
  asOf: "2026-06-30",
  source:
    "Vanguard Bond Index Funds N-PORT-P 0000794105-26-000276 (Vanguard Total Bond Market Index Fund). Mapped to a bond bucket; corporate issuers are not look-through exposures.",
  accession: "0000794105-26-000276",
  assetClass: "bond",
  lookThrough: false,
  holdings: [],
};
await writeFile(path.join(OUTPUT_DIRECTORY, "bnd-2026-06-30.json"), `${JSON.stringify(bondSnapshot)}\n`);
manifest.push({
  fundTicker: "BND",
  file: "bnd-2026-06-30.json",
  asOf: "2026-06-30",
  seriesName: "VANGUARD TOTAL BOND MARKET INDEX FUND",
  holdingCount: 0,
  coverage: null,
  unresolvedWeight: null,
});

await writeFile(path.join(OUTPUT_DIRECTORY, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
