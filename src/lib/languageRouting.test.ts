import { describe, expect, it } from "vitest";
import { languageAfterNavigation } from "@/lib/languageRouting";

describe("language after navigation", () => {
  it("keeps the English site language on /ava when nothing has been saved", () => {
    expect(languageAfterNavigation(null, "en", "/ava", "es")).toBe("en");
    expect(languageAfterNavigation(null, "en", "/ava/", "es")).toBe("en");
  });

  it("keeps a saved choice, and leaves a first visit to /ava in Spanish", () => {
    expect(languageAfterNavigation("es", "en", "/ava", "en")).toBe("es");
    expect(languageAfterNavigation("en", "es", "/", "es")).toBe("en");
    expect(languageAfterNavigation(null, "es", "/ava", "en")).toBe("es");
  });

  it("still uses the path default away from /ava", () => {
    expect(languageAfterNavigation(null, "es", "/", "es")).toBe("en");
    expect(languageAfterNavigation(null, "en", "/concat", "es")).toBe("es");
  });
});
