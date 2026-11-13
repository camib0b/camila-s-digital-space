import { describe, expect, it } from "vitest";
import { AVA_WAITLIST_HREF, personalProjects } from "@/content/personalProjects";
import { cvGrowthJobs, cvGrowthProjects } from "@/content/cvGrowth";
import en from "@/i18n/en";
import es from "@/i18n/es";

const homeKeys = [
  "hero.lead",
  "hero.carpeta",
  "hero.ava",
  "hero.cta.lookout",
  "personalProjects.label",
  "personalProjects.clipLibrary.problem",
  "personalProjects.clipLibrary.built",
  "personalProjects.clipLibrary.result",
  "personalProjects.publishingPipeline",
  "personalProjects.videoAnalysis.problem",
  "personalProjects.videoAnalysis.built",
  "personalProjects.videoAnalysis.result",
  "personalProjects.videoAnalysis.waitlistStatus",
  "personalProjects.videoAnalysis.waitlist",
  "personalProjects.acfin.problem",
  "personalProjects.acfin.built",
  "personalProjects.acfin.result",
  "personalProjects.capital",
  "experience.acfin.description",
  "experience.a3.description",
] as const;

const growthKeys = [
  "cv.growth.role",
  "cv.growth.summary",
  "cv.growth.skills",
  "cv.growth.acfin.bullet1",
  "cv.growth.acfin.bullet2",
  "cv.growth.pipeline.description",
  "cv.growth.pipeline.carpeta",
  "cv.growth.pipeline.ava",
  "cv.growth.capital.description",
  "cv.growth.a3.title",
  "cv.growth.a3.bullet",
] as const;

const bannedPhrases = ["power bi", "larrainvial", "larrain", "passionate", "leveraged", "investor reporting"];

function joined(source: Record<string, string>, keys: readonly string[]): string {
  return keys.map((key) => source[key]).join("\n");
}

describe("home copy", () => {
  it("orders carpeta and AVA as one pipeline, then ACFIN, with capital next", () => {
    const featuredIds = personalProjects
      .filter((project) => project.category === "project" || project.category === "connector")
      .map((project) => project.id);
    expect(featuredIds).toEqual(["clip-library", "publishing-pipeline", "video-analysis", "acfin"]);

    const smallToolIds = personalProjects
      .filter((project) => project.category === "small-tool")
      .map((project) => project.id);
    expect(smallToolIds[0]).toBe("capital");
  });

  it("says each home-page figure once and does not invent ACFIN figures", () => {
    const home = joined(en, homeKeys);
    expect(home.match(/2 teams/g)).toEqual(["2 teams"]);
    expect(home.match(/April 2026/g)).toEqual(["April 2026"]);
    expect(home.match(/30 minutes/g)).toEqual(["30 minutes"]);
    expect(home.match(/175 clips/g)).toEqual(["175 clips"]);
    expect(home.match(/8 factoring clients/g)).toEqual(["8 factoring clients"]);
    expect(home.match(/11-hotel/g)).toEqual(["11-hotel"]);
    expect(en["hero.lead"]).toBe("Analytics automation at a structured-credit firm.");
    expect(en["hero.carpeta"]).toBe("carpeta.cl is a paid clip service for 2 field-hockey teams.");
    expect(en["hero.ava"]).toBe("AVA is a field-hockey video analysis app.");
    expect(en["hero.cta.lookout"]).toBe("On the lookout for growth and ops engineering roles.");
    expect(es["hero.lead"]).toBe("Automatización de analítica en una firma de crédito estructurado.");
    expect(es["hero.cta.lookout"]).toBe("Buscando roles de growth y ops engineering.");
    expect(es["hero.carpeta"]).toContain("un servicio pago de clips");
    expect(en["hero.lead"]).not.toMatch(/revenue|larrain|power bi/i);
    expect(en["experience.acfin.description"]).toBe("");
    expect(en["personalProjects.clipLibrary.built"]).toMatch(/founded it and I run it/);
    expect(joined(en, homeKeys)).not.toMatch(/\bFounder\b/);
    expect(en["personalProjects.publishingPipeline"]).toBe(
      "AVA processes the match. carpeta.cl delivers the clips.",
    );
    expect(en["personalProjects.publishingPipeline"]).not.toMatch(/30|175|2 teams/);

    const acfin = [
      en["personalProjects.acfin.problem"],
      en["personalProjects.acfin.built"],
      en["personalProjects.acfin.result"],
      en["experience.acfin.description"],
    ].join(" ");
    expect(acfin.toLowerCase()).not.toMatch(/intern|hour|rollout|dashboard/);
  });

  it("keeps the analytics CV and adds the growth variant beside it", () => {
    expect(en["cv.a3.title"]).toBe("Hotel asset reporting");
    expect(en["cv.a3.period"]).toBe("Summer Internship 2023");
    expect(en["cv.acfin.bullet1"].startsWith("Investor-facing analytics")).toBe(true);
    expect(en["cv.growth.a3.title"]).toBe("Asset management intern");
    expect(en["cv.growth.a3.period"]).toBe("Summer 2023");
    expect(en["cv.growth.acfin.bullet1"]).toBe(
      "Built and automated the analytics layer for 8 factoring clients, with reconciled multi-currency books and scheduled reports.",
    );
    expect(en["cv.growth.pipeline.ava"]).toBe(
      "Built AVA, a tagging-to-clips pipeline that cut processing from 30 minutes to 5 per match, across 23 matches and 175 clips.",
    );
    expect(en["cv.growth.pipeline.carpeta"]).toContain("Founded and run");
    expect(en["cv.growth.pipeline.carpeta"]).toContain("both with me since April 2026");
    expect(en["cv.growth.summary"]).toBe("Analytics automation at a structured-credit firm.");
    expect(en["cv.growth.capital.description"]).toBe(
      "Portfolio analytics: returns versus a benchmark, risk, and look-through exposure, automated.",
    );
    expect(es["cv.growth.summary"]).toBe("Automatización de analítica en una firma de crédito estructurado.");
    expect(es["cv.growth.acfin.bullet2"].startsWith("Lancé productos")).toBe(true);
    expect(es["hero.carpeta"]).toContain("un servicio pago de clips");
    expect(cvGrowthJobs.map((job) => job.id)).toEqual(["acfin", "finapsys", "a3", "visionary"]);
    expect(cvGrowthProjects.map((project) => project.id)).toEqual(["pipeline", "capital", "fleetOptimizer"]);
    expect(cvGrowthProjects[0]?.externalHref).toBe("https://carpeta.cl/");

    const acfinJob = cvGrowthJobs.find((job) => job.id === "acfin");
    expect(acfinJob?.technologies).toEqual([]);
    expect(acfinJob?.bulletKeys.join(" ")).not.toMatch(/Looker|BigQuery|Power BI/);

    const pipeline = cvGrowthProjects.find((project) => project.id === "pipeline");
    expect(pipeline?.waitlistHref).toBe(AVA_WAITLIST_HREF);
    expect(pipeline?.bulletKeys).toEqual(["cv.growth.pipeline.carpeta", "cv.growth.pipeline.ava"]);
  });

  it("avoids banned phrases in the new English and Spanish copy", () => {
    const english = joined(en, [...homeKeys, ...growthKeys]);
    const spanish = joined(es, [...homeKeys, ...growthKeys]);
    for (const phrase of bannedPhrases) {
      expect(english.toLowerCase()).not.toContain(phrase);
      expect(spanish.toLowerCase()).not.toContain(phrase);
    }
    expect(es["personalProjects.clipLibrary.result"]).toContain("abril de 2026");
    expect(es["personalProjects.publishingPipeline"]).toBe(
      "AVA procesa el partido. carpeta.cl entrega los clips.",
    );
    expect(es["cv.growth.a3.title"]).toBe("Practicante de asset management");
  });
});
