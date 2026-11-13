import { describe, expect, it } from "vitest";
import { elementIdFromHash, scheduleScrollToHash, type HashScrollScheduler } from "@/lib/hashScroll";

describe("hash scroll", () => {
  it("uses the same form id after /ava redirects to /ava/", () => {
    expect(elementIdFromHash("#ava-interest")).toBe("ava-interest");
    expect(elementIdFromHash(new URL("https://camilaescudero.cl/ava#ava-interest").hash)).toBe("ava-interest");
    expect(elementIdFromHash(new URL("https://camilaescudero.cl/ava/#ava-interest").hash)).toBe("ava-interest");
  });

  it("scrolls on the frame after the form is painted, including when the route renders late", () => {
    let form: HTMLElement | null = null;
    const frames: Array<() => void> = [];
    let onChange: (() => void) | null = null;
    const scrolled: HTMLElement[] = [];
    let settled = 0;

    const scheduler: HashScrollScheduler = {
      getElementById: () => form,
      observe: (callback) => {
        onChange = callback;
        return () => {
          onChange = null;
        };
      },
      requestFrame: (callback) => {
        frames.push(callback);
        return frames.length;
      },
      cancelFrame: () => {},
      setTimeout: () => 1,
      clearTimeout: () => {},
      scrollTo: (element) => {
        scrolled.push(element);
      },
    };

    scheduleScrollToHash("#ava-interest", scheduler, () => {
      settled += 1;
    });
    expect(scrolled).toEqual([]);

    form = { id: "ava-interest" } as HTMLElement;
    onChange?.();
    expect(scrolled).toEqual([]);
    expect(frames).toHaveLength(1);

    frames[0]();
    expect(scrolled).toEqual([form]);
    expect(settled).toBe(1);
  });

  it("does not scroll after the navigation is cancelled", () => {
    const form = { id: "ava-interest" } as HTMLElement;
    const frames: Array<() => void> = [];
    const scrolled: HTMLElement[] = [];

    const cancel = scheduleScrollToHash("#ava-interest", {
      getElementById: () => form,
      observe: () => () => {},
      requestFrame: (callback) => {
        frames.push(callback);
        return frames.length;
      },
      cancelFrame: () => {},
      setTimeout: () => 1,
      clearTimeout: () => {},
      scrollTo: (element) => {
        scrolled.push(element);
      },
    });

    expect(frames).toHaveLength(1);
    cancel();
    frames[0]();
    expect(scrolled).toEqual([]);
  });
});
