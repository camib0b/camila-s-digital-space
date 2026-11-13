import { describe, expect, it } from "vitest";
import { cvVariantFromPath } from "@/content/cvGrowth";
import { COACHING_CV_PDF_URL, cvHockeyRoles } from "@/content/cvHockey";
import en from "@/i18n/en";
import es from "@/i18n/es";

describe("hockey CV", () => {
  it("is the third CV version, at its own path", () => {
    expect(cvVariantFromPath("/cv")).toBe("analytics");
    expect(cvVariantFromPath("/cv/growth")).toBe("growth");
    expect(cvVariantFromPath("/cv/hockey")).toBe("hockey");
    expect(cvVariantFromPath("/cv/hockey/")).toBe("hockey");
    expect(en["cv.variant.hockey"]).toBe("Hockey");
    expect(es["cv.variant.hockey"]).toBe("Hockey");
    expect(COACHING_CV_PDF_URL).toBe("/cv/Camila_Escudero_Coaching_CV.pdf");
  });

  it("keeps Club UC coaching in 2023–2025 and FEHOCH through 2026", () => {
    const clubUcCoachingYears = cvHockeyRoles
      .filter((role) => role.organizationKey === "cv.hockey.org.clubUc" && role.titleKey === "cv.hockey.coach")
      .map((role) => en[role.periodKey]);
    expect(clubUcCoachingYears).toEqual(["2023", "2024", "2025"]);

    const clubUc2026 = cvHockeyRoles.find((role) => role.id === "2026-club-uc");
    expect(clubUc2026?.titleKey).toBe("cv.hockey.videoAnalyst");

    const fehochYears = cvHockeyRoles
      .filter((role) => role.organizationKey === "cv.hockey.org.fehoch")
      .map((role) => en[role.periodKey]);
    expect(fehochYears).toEqual(["2024", "2025", "2026"]);

    expect(en["cv.hockey.summary"]).toContain("since October 2026");
    expect(es["cv.hockey.summary"]).toContain("desde octubre 2026");
    expect(en["cv.hockey.role"]).not.toMatch(/2023–present|larrain|power bi/i);
    expect(es["cv.hockey.role"]).toBe("Entrenadora de selecciones menores, jugadora, y analista de video.");
    expect(en["hockey.coachingCv"]).toBe("Coaching CV");
    expect(es["hockey.coachingCv"]).toBe("CV de entrenadora");
  });
});
