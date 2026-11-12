import { useEffect, useLayoutEffect, useState, type FocusEvent, type PointerEvent, type RefObject } from "react";
import { flushSync } from "react-dom";
import { keptDuration } from "@/lib/motion";

const visibleHeightMinimum = 64;
const tapSlopPixels = 10;

type ExperienceMotionMode = "ready" | "play" | undefined;
type ExperienceMotionSetter = (mode: ExperienceMotionMode) => void;

const lastRestartAt = new WeakMap<HTMLElement, number>();
const pointerOrigin = new WeakMap<HTMLElement, { x: number; y: number }>();
const ignoreMouseUntil = new WeakMap<HTMLElement, number>();
const experienceMotionMode = new WeakMap<HTMLElement, ExperienceMotionMode>();
const experienceMotionSetters = new WeakMap<HTMLElement, ExperienceMotionSetter>();

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function usePrefersReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReducedMotion = () => {
      setReducedMotion(reducedMotionQuery.matches);
    };

    syncReducedMotion();
    reducedMotionQuery.addEventListener("change", syncReducedMotion);
    return () => reducedMotionQuery.removeEventListener("change", syncReducedMotion);
  }, []);

  return reducedMotion;
}

function readExperienceMotion(roleRow: HTMLElement): ExperienceMotionMode {
  if (experienceMotionMode.has(roleRow)) {
    return experienceMotionMode.get(roleRow);
  }

  const attribute = roleRow.dataset.experienceMotion;
  if (attribute === "ready" || attribute === "play") {
    return attribute;
  }

  return undefined;
}

/**
 * Commit the motion attribute.
 * Synchronous commits are for replay: `play` does not restart while it is
 * already set, so the start frame has to be painted before `play` returns.
 */
function commitExperienceMotion(roleRow: HTMLElement, mode: ExperienceMotionMode, synchronous: boolean): void {
  experienceMotionMode.set(roleRow, mode);
  const setExperienceMotion = experienceMotionSetters.get(roleRow);
  if (setExperienceMotion === undefined) {
    if (mode === undefined) {
      delete roleRow.dataset.experienceMotion;
    } else {
      roleRow.dataset.experienceMotion = mode;
    }
    return;
  }

  if (synchronous) {
    flushSync(() => {
      setExperienceMotion(mode);
    });
    return;
  }

  setExperienceMotion(mode);
}

/** Drop back to the start frame without playing. Used when a row leaves the viewport. */
export function armExperienceMotion(roleRow: HTMLElement): void {
  if (prefersReducedMotion()) {
    commitExperienceMotion(roleRow, undefined, false);
    return;
  }

  commitExperienceMotion(roleRow, "ready", false);
}

function playExperienceMotion(roleRow: HTMLElement): void {
  if (prefersReducedMotion()) {
    commitExperienceMotion(roleRow, undefined, false);
    return;
  }

  if (readExperienceMotion(roleRow) === "play") {
    return;
  }

  commitExperienceMotion(roleRow, "play", false);
}

/**
 * Replay from the start frame.
 * Hover, click, focus, and tap all go through `replayExperienceIfSettled` first,
 * so a sequence that is still running is left alone.
 */
export function restartExperienceMotion(roleRow: HTMLElement): void {
  if (prefersReducedMotion()) {
    commitExperienceMotion(roleRow, undefined, false);
    return;
  }

  const now = performance.now();
  const previousRestartAt = lastRestartAt.get(roleRow) ?? Number.NEGATIVE_INFINITY;
  if (now - previousRestartAt < keptDuration.snap) {
    return;
  }

  lastRestartAt.set(roleRow, now);
  commitExperienceMotion(roleRow, "ready", true);
  void roleRow.getBoundingClientRect();
  commitExperienceMotion(roleRow, "play", true);
}

function experienceMotionSettled(roleRow: HTMLElement): boolean {
  if (typeof roleRow.getAnimations !== "function") {
    return true;
  }

  const animations = roleRow.getAnimations({ subtree: true });
  if (animations.length === 0) {
    return true;
  }

  return animations.every((animation) => animation.playState === "finished");
}

function replayExperienceIfSettled(roleRow: HTMLElement): void {
  if (!experienceMotionSettled(roleRow)) {
    return;
  }

  restartExperienceMotion(roleRow);
}

function visibleEnough(entry: IntersectionObserverEntry): boolean {
  return entry.isIntersecting && (entry.intersectionRatio >= 0.2 || entry.intersectionRect.height >= visibleHeightMinimum);
}

export function useExperienceDiagramMotion(roleRef: RefObject<HTMLElement | null>): ExperienceMotionMode {
  // Present on the first commit so the start frame paints. Reduced motion and
  // no-JS keep the finished frame (no attribute, plus the reduced-motion rule).
  const [experienceMotion, setExperienceMotion] = useState<ExperienceMotionMode>(() =>
    prefersReducedMotion() ? undefined : "ready",
  );

  useLayoutEffect(() => {
    const roleRow = roleRef.current;
    if (roleRow === null) {
      return undefined;
    }

    experienceMotionSetters.set(roleRow, setExperienceMotion);
    if (!experienceMotionMode.has(roleRow)) {
      const attribute = roleRow.dataset.experienceMotion;
      experienceMotionMode.set(roleRow, attribute === "play" || attribute === "ready" ? attribute : undefined);
    }

    return () => {
      experienceMotionSetters.delete(roleRow);
      experienceMotionMode.delete(roleRow);
    };
  }, [roleRef]);

  useEffect(() => {
    const roleRow = roleRef.current;
    if (roleRow === null || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | null = null;

    const stopObserving = () => {
      observer?.disconnect();
      observer = null;
    };

    const syncMotion = () => {
      stopObserving();
      if (reducedMotionQuery.matches) {
        commitExperienceMotion(roleRow, undefined, false);
        return;
      }

      if (readExperienceMotion(roleRow) !== "play") {
        commitExperienceMotion(roleRow, "ready", false);
      }

      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[entries.length - 1];
          if (!entry.isIntersecting) {
            armExperienceMotion(roleRow);
            return;
          }

          if (visibleEnough(entry)) {
            playExperienceMotion(roleRow);
          }
        },
        { threshold: [0, 0.05, 0.2, 0.5] },
      );
      observer.observe(roleRow);
    };

    syncMotion();
    reducedMotionQuery.addEventListener("change", syncMotion);

    return () => {
      reducedMotionQuery.removeEventListener("change", syncMotion);
      stopObserving();
    };
  }, [roleRef]);

  return experienceMotion;
}

function roleRowFromEvent(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) {
    return null;
  }

  const roleRow = target.closest("[data-experience-role]");
  return roleRow instanceof HTMLElement ? roleRow : null;
}

function mouseReplaySuppressed(roleRow: HTMLElement): boolean {
  const suppressedUntil = ignoreMouseUntil.get(roleRow) ?? 0;
  return performance.now() < suppressedUntil;
}

/** Mouse hover replays only from the diagram button, and only once the sequence has settled. */
export function replayExperienceOnPointerEnter(event: PointerEvent<HTMLElement>): void {
  if (event.pointerType !== "mouse") {
    return;
  }

  const roleRow = roleRowFromEvent(event.currentTarget);
  if (roleRow === null || mouseReplaySuppressed(roleRow)) {
    return;
  }

  replayExperienceIfSettled(roleRow);
}

export function rememberExperiencePointerOrigin(event: PointerEvent<HTMLElement>): void {
  if (event.pointerType !== "touch" && event.pointerType !== "pen") {
    return;
  }

  pointerOrigin.set(event.currentTarget, { x: event.clientX, y: event.clientY });
}

export function replayExperienceOnPointerUp(event: PointerEvent<HTMLElement>): void {
  if (event.pointerType !== "touch" && event.pointerType !== "pen") {
    return;
  }

  const origin = pointerOrigin.get(event.currentTarget);
  pointerOrigin.delete(event.currentTarget);
  if (origin === undefined) {
    return;
  }

  const distance = Math.hypot(event.clientX - origin.x, event.clientY - origin.y);
  if (distance > tapSlopPixels) {
    return;
  }

  ignoreMouseUntil.set(event.currentTarget, performance.now() + keptDuration.residue);
  replayExperienceIfSettled(event.currentTarget);
}

export function replayExperienceOnActivate(event: { currentTarget: EventTarget | null }): void {
  const roleRow = roleRowFromEvent(event.currentTarget);
  if (roleRow === null || mouseReplaySuppressed(roleRow)) {
    return;
  }

  replayExperienceIfSettled(roleRow);
}

export function clearExperiencePointerOrigin(event: PointerEvent<HTMLElement>): void {
  pointerOrigin.delete(event.currentTarget);
}

export function replayExperienceOnFocus(event: FocusEvent<HTMLElement>): void {
  if (!event.currentTarget.matches(":focus-visible")) {
    return;
  }

  const roleRow = roleRowFromEvent(event.currentTarget);
  if (roleRow !== null) {
    replayExperienceIfSettled(roleRow);
  }
}
