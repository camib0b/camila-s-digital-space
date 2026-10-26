import { useEffect, useRef, type CSSProperties, type RefObject } from "react";

const ANALYTICS_PLAYING_CLASS = "experience-analytics-playing";
const CURTAIN_ANIMATION_NAME = "curtain-fall";
const MAXIMUM_CURTAIN_WAIT_MILLISECONDS = 800;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isCurtainAnimation(animation: Animation): boolean {
  return "animationName" in animation && animation.animationName === CURTAIN_ANIMATION_NAME;
}

function declaredCurtainMilliseconds(roleRow: HTMLElement): number {
  const rootStyle = getComputedStyle(document.documentElement);
  const duration = Number.parseFloat(rootStyle.getPropertyValue("--curtain-duration")) || 480;
  const stagger = Number.parseFloat(rootStyle.getPropertyValue("--curtain-stagger")) || 0;
  const index = Number.parseFloat(roleRow.style.getPropertyValue("--curtain-index")) || 0;
  return duration + index * stagger;
}

function curtainRemainingMilliseconds(roleRow: HTMLElement): number {
  if (!roleRow.classList.contains("curtain-reveal-item") || typeof roleRow.getAnimations !== "function") {
    return 0;
  }

  const curtainAnimation = roleRow.getAnimations().find(isCurtainAnimation);
  const computedTiming = curtainAnimation?.effect?.getComputedTiming();
  if (!computedTiming) {
    return Math.min(MAXIMUM_CURTAIN_WAIT_MILLISECONDS, declaredCurtainMilliseconds(roleRow));
  }

  const endTime = Number(computedTiming.endTime ?? 0);
  const currentTime = Number(computedTiming.currentTime ?? 0);
  const remainingMilliseconds = endTime - currentTime;
  if (!Number.isFinite(remainingMilliseconds)) {
    return 0;
  }

  return Math.min(MAXIMUM_CURTAIN_WAIT_MILLISECONDS, Math.max(0, remainingMilliseconds));
}

function playAnalyticsDiagram(diagram: SVGSVGElement) {
  diagram.classList.remove(ANALYTICS_PLAYING_CLASS);
  void diagram.getBoundingClientRect();
  diagram.classList.add(ANALYTICS_PLAYING_CLASS);
}

function usePlayOnceInView(diagramRef: RefObject<SVGSVGElement>) {
  const hasPlayedOnViewRef = useRef(false);

  useEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram || prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      return;
    }

    const roleRow = diagram.closest("[data-experience-role]");
    if (!(roleRow instanceof HTMLElement)) {
      return;
    }

    let playTimer = 0;
    let viewPlayIsPending = false;

    const playOnceFromView = () => {
      if (hasPlayedOnViewRef.current) {
        return;
      }
      hasPlayedOnViewRef.current = true;
      viewPlayIsPending = true;
      window.clearTimeout(playTimer);
      playTimer = window.setTimeout(() => {
        viewPlayIsPending = false;
        playAnalyticsDiagram(diagram);
      }, curtainRemainingMilliseconds(roleRow));
    };

    const playOnPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === "touch" || viewPlayIsPending) {
        return;
      }
      playAnalyticsDiagram(diagram);
    };

    const playOnTouchEnd = (event: PointerEvent) => {
      if (event.pointerType !== "touch" || viewPlayIsPending) {
        return;
      }
      playAnalyticsDiagram(diagram);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const isInView = entries.some((entry) => entry.isIntersecting);
        if (!isInView) {
          return;
        }
        playOnceFromView();
        observer.disconnect();
      },
      { threshold: 0.3 },
    );

    observer.observe(roleRow);
    roleRow.addEventListener("pointerenter", playOnPointerEnter);
    roleRow.addEventListener("pointerup", playOnTouchEnd);

    return () => {
      window.clearTimeout(playTimer);
      observer.disconnect();
      roleRow.removeEventListener("pointerenter", playOnPointerEnter);
      roleRow.removeEventListener("pointerup", playOnTouchEnd);
    };
  }, [diagramRef]);
}

const AnalyticsDiagram = () => {
  const diagramRef = useRef<SVGSVGElement>(null);
  usePlayOnceInView(diagramRef);

  const barTileShift = { "--tile-shift": "8px" } as CSSProperties;
  const numberTileShift = { "--tile-shift": "-8px" } as CSSProperties;

  return (
    <svg
      ref={diagramRef}
      viewBox="0 0 188 60"
      aria-hidden="true"
      className="experience-analytics pointer-events-none h-[60px] w-[188px] shrink-0 overflow-hidden fill-none stroke-muted-foreground"
    >
      <text
        x="4"
        y="16"
        fontSize="8"
        className="experience-analytics-sql experience-analytics-sql-select fill-muted-foreground stroke-none font-mono"
      >
        SELECT
      </text>
      <text
        x="4"
        y="30"
        fontSize="8"
        className="experience-analytics-sql experience-analytics-sql-metric fill-muted-foreground stroke-none font-mono"
      >
        metric
      </text>
      <text
        x="4"
        y="44"
        fontSize="8"
        className="experience-analytics-sql experience-analytics-sql-group fill-muted-foreground stroke-none font-mono"
      >
        GROUP BY
      </text>

      <rect x="74" y="6" width="108" height="48" rx="2" className="fill-background" />

      <g className="experience-analytics-tile" style={barTileShift}>
        <rect x="80" y="12" width="28" height="36" />
        <line
          x1="88"
          y1="42"
          x2="88"
          y2="34"
          pathLength={1}
          strokeLinecap="butt"
          className="experience-analytics-mark stroke-foreground"
        />
        <line
          x1="94"
          y1="42"
          x2="94"
          y2="24"
          pathLength={1}
          strokeLinecap="butt"
          className="experience-analytics-mark experience-analytics-mark-middle stroke-foreground"
        />
        <line
          x1="100"
          y1="42"
          x2="100"
          y2="30"
          pathLength={1}
          strokeLinecap="butt"
          className="experience-analytics-mark experience-analytics-mark-late stroke-foreground"
        />
      </g>

      <g className="experience-analytics-tile">
        <rect x="114" y="12" width="28" height="36" />
        <polyline
          points="120,40 126,31 132,34 138,23"
          pathLength={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="experience-analytics-line stroke-foreground"
        />
      </g>

      <g className="experience-analytics-tile" style={numberTileShift}>
        <rect x="148" y="12" width="28" height="36" />
        <text
          x="162"
          y="32"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="13"
          className="experience-analytics-number fill-accent-teal stroke-none font-medium"
        >
          128
        </text>
      </g>
    </svg>
  );
};

export default AnalyticsDiagram;
