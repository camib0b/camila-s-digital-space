import { describe, expect, it } from "vitest";
import { closestIndexToViewportCenter } from "./useScrollCenteredIndex";

describe("closestIndexToViewportCenter", () => {
  it("picks the item whose center is nearest the midline", () => {
    expect(closestIndexToViewportCenter([80, 220, 420], 240)).toBe(1);
  });

  it("picks the first item when every center is below the midline", () => {
    expect(closestIndexToViewportCenter([640, 780, 920], 400)).toBe(0);
  });

  it("picks the last item when every center is above the midline", () => {
    expect(closestIndexToViewportCenter([40, 120, 200], 900)).toBe(2);
  });

  it("returns the first index for an empty list", () => {
    expect(closestIndexToViewportCenter([], 400)).toBe(0);
  });
});
