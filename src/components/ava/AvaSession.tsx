import { useEffect, useLayoutEffect, useRef, useState, type AnimationEvent, type CSSProperties } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { AVA_SESSION_WORST_CASE_COPY } from "@/components/ava/avaSessionWorstCase";
import {
  SESSION_TRACE_HIGHLIGHT_MS,
  SESSION_TRACE_RESIDUE_MS,
  SESSION_TRACE_STEP_IDS,
  isSessionTraceInView,
  measureSessionTrace,
  sessionTraceDurationMs,
  sessionTraceSectionOccupiesView,
  sessionTraceStepOrder,
  type SessionTraceArc,
} from "@/components/ava/sessionTrace";
import "./ava-session.css";

const SESSION_FLOW = [
  "ava.session.flow.import",
  "ava.session.flow.tag",
  "ava.session.flow.analyze",
  "ava.session.flow.present",
  "ava.session.flow.export",
] as const;

const TRACE_ORDER = sessionTraceStepOrder().join(" ");

type SessionTracePhase = "idle" | "play" | "done" | "static";

let hasPlayedSessionTrace = false;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initialTracePhase(): SessionTracePhase {
  if (typeof window === "undefined") return "idle";
  if (prefersReducedMotion()) return "static";
  if (hasPlayedSessionTrace) return "done";
  return "idle";
}

type SessionCopy = {
  kicker: string;
  headline: string;
  lede: string;
  withKicker: string;
  steps: readonly string[];
  aside: string;
  replayLabel: string;
};

function usePrefersReducedMotion(): boolean {
  const [matches, setMatches] = useState(prefersReducedMotion);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      setMatches(mediaQuery.matches);
    };
    mediaQuery.addEventListener("change", onChange);
    onChange();
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return matches;
}

function useAvaSessionCopy(): { copy: SessionCopy; worstCaseEnabled: boolean } {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const worstCaseEnabled = import.meta.env.DEV && searchParams.get("data") === "worst";
  if (worstCaseEnabled) {
    return {
      worstCaseEnabled,
      copy: {
        ...AVA_SESSION_WORST_CASE_COPY,
        replayLabel: t("ava.session.replay"),
      },
    };
  }
  return {
    worstCaseEnabled: false,
    copy: {
      kicker: t("ava.session.kicker"),
      headline: t("ava.session.headline"),
      lede: t("ava.session.lede"),
      withKicker: t("ava.session.with.kicker"),
      steps: SESSION_FLOW.map((stepKey) => t(stepKey)),
      aside: t("ava.session.with.body"),
      replayLabel: t("ava.session.replay"),
    },
  };
}

function SessionDataToggle() {
  const [searchParams, setSearchParams] = useSearchParams();
  if (!import.meta.env.DEV) return null;
  const worstCaseEnabled = searchParams.get("data") === "worst";

  function selectDemo() {
    const next = new URLSearchParams(searchParams);
    next.delete("data");
    setSearchParams(next, { replace: true, preventScrollReset: true });
  }

  function selectWorstCase() {
    const next = new URLSearchParams(searchParams);
    next.set("data", "worst");
    setSearchParams(next, { replace: true, preventScrollReset: true });
  }

  return (
    <div className="ava-session-data-toggle" data-session-data-toggle="true">
      <button type="button" aria-pressed={!worstCaseEnabled} onClick={selectDemo}>
        Demo data
      </button>
      <button type="button" aria-pressed={worstCaseEnabled} onClick={selectWorstCase}>
        Worst case
      </button>
    </div>
  );
}

const AvaSession = () => {
  const { copy } = useAvaSessionCopy();
  const prefersReducedMotionSetting = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const tracePhaseRef = useRef<SessionTracePhase>("idle");
  const traceGenerationRef = useRef(0);
  const landingIdRef = useRef(0);
  const highlightTimeoutRef = useRef<number | null>(null);
  const geometrySignatureRef = useRef("");
  const [tracePhase, setTracePhase] = useState<SessionTracePhase>(initialTracePhase);
  const [traceGeneration, setTraceGeneration] = useState(0);
  const [arcs, setArcs] = useState<SessionTraceArc[]>([]);
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
  const [landedStepIndex, setLandedStepIndex] = useState<number | null>(null);
  tracePhaseRef.current = tracePhase;
  const isReplayAvailable = !prefersReducedMotionSetting;
  const layoutKey = copy.steps.join("|");

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const list = listRef.current;
    if (!frame || !list) return undefined;

    const measure = () => {
      const geometry = measureSessionTrace(frame, list);
      if (!geometry) return;
      const signature = `${geometry.width.toFixed(2)}x${geometry.height.toFixed(2)}:${geometry.arcs.map((arc) => arc.path).join("|")}`;
      if (signature === geometrySignatureRef.current) return;
      geometrySignatureRef.current = signature;
      setFrameSize({ width: geometry.width, height: geometry.height });
      setArcs(geometry.arcs);
      if (tracePhaseRef.current === "play") {
        tracePhaseRef.current = "done";
        landingIdRef.current += 1;
        setLandedStepIndex(null);
        setTracePhase("done");
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [layoutKey]);

  useEffect(() => {
    if (tracePhase !== "idle") return undefined;
    const section = sectionRef.current;
    if (!section) return undefined;

    if (typeof IntersectionObserver === "undefined" || prefersReducedMotion()) {
      setTracePhase("static");
      return undefined;
    }

    let cancelled = false;
    let observer: IntersectionObserver | null = null;
    let fontTimer = 0;
    let tryStart: (() => void) | null = null;

    const stopWatching = () => {
      observer?.disconnect();
      if (!tryStart) return;
      window.removeEventListener("scroll", tryStart);
      window.removeEventListener("resize", tryStart);
    };

    const begin = () => {
      if (cancelled || hasPlayedSessionTrace) return;
      if (prefersReducedMotion()) {
        setTracePhase("static");
        return;
      }
      tryStart = () => {
        if (cancelled || hasPlayedSessionTrace) return;
        if (!sessionTraceSectionOccupiesView(section)) return;
        hasPlayedSessionTrace = true;
        setTracePhase("play");
        stopWatching();
      };
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry || !isSessionTraceInView(entry)) return;
          tryStart?.();
        },
        { threshold: [0, 0.25, 0.5, 0.6, 0.75, 1] },
      );
      observer.observe(section);
      window.addEventListener("scroll", tryStart, { passive: true });
      window.addEventListener("resize", tryStart);
      tryStart();
    };

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    void Promise.race([
      fontsReady.then(() => undefined),
      new Promise<void>((resolve) => {
        fontTimer = window.setTimeout(resolve, 1500);
      }),
    ]).then(begin);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => {
      if (!motionQuery.matches) return;
      hasPlayedSessionTrace = true;
      tracePhaseRef.current = "static";
      landingIdRef.current += 1;
      setLandedStepIndex(null);
      setTracePhase("static");
      stopWatching();
    };
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      cancelled = true;
      window.clearTimeout(fontTimer);
      stopWatching();
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, [tracePhase]);

  useEffect(() => {
    if (tracePhase !== "play") return undefined;
    const generationAtStart = traceGeneration;
    const timeout = window.setTimeout(() => {
      if (generationAtStart !== traceGenerationRef.current) return;
      landingIdRef.current += 1;
      setLandedStepIndex(null);
      setTracePhase("done");
    }, sessionTraceDurationMs() + SESSION_TRACE_RESIDUE_MS + 500);
    return () => window.clearTimeout(timeout);
  }, [tracePhase, traceGeneration]);

  useEffect(() => {
    if (!prefersReducedMotionSetting) return;
    if (tracePhaseRef.current === "static") return;
    hasPlayedSessionTrace = true;
    tracePhaseRef.current = "static";
    landingIdRef.current += 1;
    if (highlightTimeoutRef.current !== null) {
      window.clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = null;
    }
    setLandedStepIndex(null);
    setTracePhase("static");
  }, [prefersReducedMotionSetting]);

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current !== null) {
        window.clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  function landOnStep(stepIndex: number) {
    if (highlightTimeoutRef.current !== null) {
      window.clearTimeout(highlightTimeoutRef.current);
    }
    const landingId = ++landingIdRef.current;
    setLandedStepIndex(stepIndex);
    highlightTimeoutRef.current = window.setTimeout(() => {
      if (landingIdRef.current !== landingId) return;
      setLandedStepIndex(null);
    }, SESSION_TRACE_HIGHLIGHT_MS);
  }

  function replaySessionTrace() {
    if (prefersReducedMotion()) return;
    if (highlightTimeoutRef.current !== null) {
      window.clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = null;
    }
    landingIdRef.current += 1;
    hasPlayedSessionTrace = true;
    const nextTraceGeneration = traceGenerationRef.current + 1;
    traceGenerationRef.current = nextTraceGeneration;
    tracePhaseRef.current = "play";
    setLandedStepIndex(null);
    setTraceGeneration(nextTraceGeneration);
    setTracePhase("play");
  }

  function onTraceAnimationEnd(event: AnimationEvent<SVGPathElement>) {
    const eventGeneration = Number(event.currentTarget.dataset.traceGeneration);
    if (eventGeneration !== traceGenerationRef.current) return;
    if (tracePhaseRef.current !== "play") return;
    const path = event.currentTarget;
    const toIndex = Number(path.dataset.toIndex);
    if (!Number.isInteger(toIndex)) return;
    if (event.animationName === "ava-trace-draw") {
      landOnStep(toIndex);
      return;
    }
    if (event.animationName === "ava-trace-residue" && path.dataset.traceTerminal === "true") {
      if (highlightTimeoutRef.current !== null) {
        window.clearTimeout(highlightTimeoutRef.current);
      }
      landingIdRef.current += 1;
      tracePhaseRef.current = "done";
      setLandedStepIndex(null);
      setTracePhase("done");
    }
  }

  const frameStyle = {
    "--session-trace-residue-duration": `${SESSION_TRACE_RESIDUE_MS}ms`,
  } as CSSProperties;

  return (
    <section className="ava-section" id="una-sesion" aria-labelledby="ava-session-title" ref={sectionRef}>
      <div className="ava-shell">
        <div className="ava-section-head ava-session-head">
          <p className="ava-kicker">{copy.kicker}</p>
          <h2 id="ava-session-title">{copy.headline}</h2>
          <p className="ava-section-body">{copy.lede}</p>
        </div>

        <div className="ava-session">
          <div className="ava-session-block">
            <p className="ava-kicker" id="ava-session-with-title">
              {copy.withKicker}
            </p>
            <div
              className="ava-session-flow-frame"
              ref={frameRef}
              data-trace={tracePhase}
              data-trace-order={TRACE_ORDER}
              data-trace-generation={traceGeneration}
              data-trace-replayable={isReplayAvailable ? "true" : undefined}
              style={frameStyle}
            >
              <svg
                key={traceGeneration}
                className="ava-session-trace"
                aria-hidden="true"
                focusable="false"
                viewBox={frameSize.width > 0 ? `0 0 ${frameSize.width} ${frameSize.height}` : undefined}
              >
                {arcs.map((arc) => {
                  const pathStyle = {
                    "--hop-delay": `${arc.delayMs}ms`,
                    "--hop-duration": `${arc.durationMs}ms`,
                  } as CSSProperties;
                  return (
                    <path
                      key={`${arc.fromId}-${arc.toId}-${arc.delayMs}`}
                      d={arc.path}
                      pathLength={1}
                      style={pathStyle}
                      data-from={arc.fromId}
                      data-to={arc.toId}
                      data-to-index={arc.toIndex}
                      data-trace-terminal={arc.terminal ? "true" : undefined}
                      data-trace-generation={traceGeneration}
                      data-end-x={arc.endX}
                      data-end-y={arc.endY}
                      onAnimationEnd={onTraceAnimationEnd}
                    />
                  );
                })}
              </svg>
              <span className="ava-session-rail" aria-hidden="true" />
              <ol className="ava-session-flow" aria-labelledby="ava-session-with-title" ref={listRef}>
                {copy.steps.map((label, stepIndex) => (
                  <li
                    key={SESSION_FLOW[stepIndex]}
                    data-step={SESSION_TRACE_STEP_IDS[stepIndex]}
                    data-trace-landed={landedStepIndex === stepIndex ? "true" : undefined}
                  >
                    <span className="ava-session-marker" aria-hidden="true" />
                    <span className="ava-session-label">{label}</span>
                  </li>
                ))}
              </ol>
              {isReplayAvailable ? (
                <button
                  type="button"
                  className="ava-session-replay"
                  aria-label={copy.replayLabel}
                  onClick={replaySessionTrace}
                />
              ) : null}
            </div>
            <p className="ava-session-aside ava-session-aside-ava">{copy.aside}</p>
          </div>
        </div>
      </div>
      <SessionDataToggle />
    </section>
  );
};

export default AvaSession;
