import { useId, useLayoutEffect, useRef, type RefObject } from "react";
import { AvaModeShot } from "@/components/ava/AvaModes";
import { AVA_MODES, resolveAvaModeMedia, type ResolvedAvaModeMedia } from "@/content/avaModes";

/** macOS window crop shared with the other section screenshots. */
const TELESTRATION_VIEWBOX_WIDTH = 2972;
const TELESTRATION_VIEWBOX_HEIGHT = 1878;

const MARKER_STROKE_WIDTH = 34;
const MARKER_DOT_LENGTH = 22;
const MARKER_DOT_GAP = 18;
const TELESTRATION_STROKE_COUNT = 4;

interface MarkerPoint {
  readonly x: number;
  readonly y: number;
}

function pointOnShot(xFraction: number, yFraction: number): MarkerPoint {
  return {
    x: xFraction * TELESTRATION_VIEWBOX_WIDTH,
    y: yFraction * TELESTRATION_VIEWBOX_HEIGHT,
  };
}

function formatPoint(point: MarkerPoint): string {
  return `${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
}

function markerArrowPath(start: MarkerPoint, end: MarkerPoint, bend: number): string {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const length = Math.hypot(deltaX, deltaY) || 1;
  const unitX = deltaX / length;
  const unitY = deltaY / length;
  const normalX = -unitY;
  const normalY = unitX;
  const firstControl = {
    x: start.x + deltaX * 0.32 + normalX * bend,
    y: start.y + deltaY * 0.28 + normalY * bend,
  };
  const secondControl = {
    x: start.x + deltaX * 0.7 + normalX * bend * 0.2,
    y: start.y + deltaY * 0.72 + normalY * bend * -0.45,
  };
  const headLength = 86;
  const leftBarb = {
    x: end.x - unitX * headLength + normalX * 48 - 8,
    y: end.y - unitY * headLength + normalY * 42 + 10,
  };
  const rightBarb = {
    x: end.x - unitX * (headLength - 14) - normalX * 40 + 6,
    y: end.y - unitY * (headLength + 8) - normalY * 46 - 7,
  };

  // One subpath: shaft, one barb, back through the tip, then the other barb.
  // A moveto would split the dash animation across subpaths.
  return [
    `M ${formatPoint(start)}`,
    `C ${formatPoint(firstControl)} ${formatPoint(secondControl)} ${formatPoint(end)}`,
    `L ${formatPoint(leftBarb)}`,
    `L ${formatPoint(end)}`,
    `L ${formatPoint(rightBarb)}`,
  ].join(" ");
}

function smoothOpenPath(points: readonly MarkerPoint[]): string {
  const commands = [`M ${formatPoint(points[0])}`];
  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[Math.max(0, index - 1)];
    const current = points[index];
    const next = points[index + 1];
    const following = points[Math.min(points.length - 1, index + 2)];
    const startControl = {
      x: current.x + (next.x - previous.x) / 6,
      y: current.y + (next.y - previous.y) / 6,
    };
    const endControl = {
      x: next.x - (following.x - current.x) / 6,
      y: next.y - (following.y - current.y) / 6,
    };
    commands.push(`C ${formatPoint(startControl)} ${formatPoint(endControl)} ${formatPoint(next)}`);
  }
  return commands.join(" ");
}

/** A marker circle that doesn't close cleanly and isn't a perfect ellipse. */
function markerCirclePath(center: MarkerPoint, radius: number): string {
  const radiusOffsets = [16, -12, 20, -8, 14, -18, 10, -6, 17];
  const startAngle = -0.7;
  const points = radiusOffsets.map((offset, index) => {
    const angle = startAngle + (Math.PI * 2 * index) / radiusOffsets.length;
    const distance = radius + offset;
    return {
      x: center.x + Math.cos(angle) * distance,
      y: center.y + Math.sin(angle) * distance,
    };
  });
  const closingAngle = startAngle + Math.PI * 2 + 0.5;
  points.push({
    x: center.x + Math.cos(closingAngle) * (radius + 12),
    y: center.y + Math.sin(closingAngle) * (radius - 8),
  });
  return smoothOpenPath(points);
}

const SOLID_ARROW_PATH = markerArrowPath(pointOnShot(0.17, 0.43), pointOnShot(0.445, 0.355), 46);
const DOTTED_ARROW_PATH = markerArrowPath(pointOnShot(0.36, 0.58), pointOnShot(0.48, 0.45), -38);
const CIRCLE_PATH = markerCirclePath(pointOnShot(0.52, 0.355), TELESTRATION_VIEWBOX_WIDTH * 0.058);
const SQUIGGLE_PATH = smoothOpenPath([
  pointOnShot(0.585, 0.47),
  pointOnShot(0.615, 0.435),
  pointOnShot(0.65, 0.485),
  pointOnShot(0.685, 0.44),
  pointOnShot(0.72, 0.465),
]);

function taggingScreenshot(): ResolvedAvaModeMedia {
  const taggingMode = AVA_MODES.find((mode) => mode.id === "tagging");
  const media = taggingMode?.media[0];
  if (!media) {
    throw new Error("The tagging screenshot is required for the telestration section.");
  }
  return resolveAvaModeMedia(media);
}

const TELESTRATION_SCREENSHOT = taggingScreenshot();

function clampUnit(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * 0 when the shot starts entering at the bottom of the viewport.
 * 1 when it has moved fully into view (or, if it is taller than the viewport,
 * when its top sits near the top). Further scrolling keeps the marks drawn.
 */
function imageTravelProgress(imageRect: DOMRect, viewportHeight: number): number {
  const topWhenEntering = viewportHeight;
  const topWhenInView =
    imageRect.height >= viewportHeight ? viewportHeight * 0.08 : viewportHeight - imageRect.height;
  const travel = topWhenEntering - topWhenInView;
  if (travel <= 0) {
    return 1;
  }
  return clampUnit((topWhenEntering - imageRect.top) / travel);
}

function strokeDrawOffset(progress: number, strokeIndex: number, strokeCount: number): number {
  const span = 1 / strokeCount;
  const start = strokeIndex * span;
  const drawnFraction = clampUnit((progress - start) / span);
  return 1 - drawnFraction;
}

function useTelestrationStrokeDraw(
  shotRef: RefObject<HTMLElement | null>,
  overlayRef: RefObject<SVGSVGElement | null>,
) {
  useLayoutEffect(() => {
    const shot = shotRef.current;
    const overlay = overlayRef.current;
    if (!shot || !overlay) {
      return undefined;
    }

    const strokes = Array.from(overlay.querySelectorAll<SVGPathElement>("[data-telestration-stroke]"));
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;
    let listening = false;

    const applyProgress = (progress: number) => {
      for (const stroke of strokes) {
        const strokeIndex = Number(stroke.getAttribute("data-telestration-stroke"));
        const offset = strokeDrawOffset(progress, strokeIndex, TELESTRATION_STROKE_COUNT);
        stroke.setAttribute("stroke-dashoffset", offset.toFixed(4));
      }
    };

    const measure = () => {
      frameId = 0;
      if (motionQuery.matches) {
        applyProgress(1);
        return;
      }
      const viewportHeight = window.innerHeight || 1;
      applyProgress(imageTravelProgress(shot.getBoundingClientRect(), viewportHeight));
    };

    const requestMeasure = () => {
      if (frameId !== 0) {
        return;
      }
      frameId = window.requestAnimationFrame(measure);
    };

    const stopListening = () => {
      if (!listening) {
        return;
      }
      listening = false;
      window.removeEventListener("scroll", requestMeasure);
      window.removeEventListener("resize", requestMeasure);
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
    };

    const syncMotion = () => {
      if (motionQuery.matches) {
        stopListening();
        applyProgress(1);
        return;
      }
      if (!listening) {
        listening = true;
        window.addEventListener("scroll", requestMeasure, { passive: true });
        window.addEventListener("resize", requestMeasure);
      }
      measure();
    };

    syncMotion();
    motionQuery.addEventListener("change", syncMotion);

    return () => {
      motionQuery.removeEventListener("change", syncMotion);
      stopListening();
    };
  }, [overlayRef, shotRef]);
}

function TelestrationMarks({ overlayRef }: { overlayRef: RefObject<SVGSVGElement | null> }) {
  const dottedRevealMaskId = `ava-telestration-dotted-${useId().replace(/:/g, "")}`;
  const hiddenOffset = 1;

  return (
    <svg
      ref={overlayRef}
      className="ava-telestration-overlay"
      viewBox={`0 0 ${TELESTRATION_VIEWBOX_WIDTH} ${TELESTRATION_VIEWBOX_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <mask id={dottedRevealMaskId} maskUnits="userSpaceOnUse">
          <path
            d={DOTTED_ARROW_PATH}
            pathLength={1}
            data-telestration-stroke="1"
            className="ava-telestration-reveal"
            stroke="#ffffff"
            strokeWidth={MARKER_STROKE_WIDTH + 28}
            strokeDasharray="1"
            strokeDashoffset={hiddenOffset}
          />
        </mask>
      </defs>
      <path
        d={SOLID_ARROW_PATH}
        pathLength={1}
        data-telestration-stroke="0"
        className="ava-telestration-stroke"
        strokeWidth={MARKER_STROKE_WIDTH}
        strokeDasharray="1"
        strokeDashoffset={hiddenOffset}
      />
      <path
        d={DOTTED_ARROW_PATH}
        className="ava-telestration-stroke"
        strokeWidth={MARKER_STROKE_WIDTH}
        strokeDasharray={`${MARKER_DOT_LENGTH} ${MARKER_DOT_GAP}`}
        mask={`url(#${dottedRevealMaskId})`}
      />
      <path
        d={CIRCLE_PATH}
        pathLength={1}
        data-telestration-stroke="2"
        className="ava-telestration-stroke"
        strokeWidth={MARKER_STROKE_WIDTH}
        strokeDasharray="1"
        strokeDashoffset={hiddenOffset}
      />
      <path
        d={SQUIGGLE_PATH}
        pathLength={1}
        data-telestration-stroke="3"
        className="ava-telestration-stroke"
        strokeWidth={MARKER_STROKE_WIDTH}
        strokeDasharray="1"
        strokeDashoffset={hiddenOffset}
      />
    </svg>
  );
}

const AvaTelestrationShot = () => {
  const shotRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<SVGSVGElement>(null);
  useTelestrationStrokeDraw(shotRef, overlayRef);

  return (
    <div className="ava-telestration-shot" ref={shotRef}>
      {/* TODO(camila): telestration screenshot */}
      <AvaModeShot media={TELESTRATION_SCREENSHOT} role="full" overlay={<TelestrationMarks overlayRef={overlayRef} />} />
    </div>
  );
};

export default AvaTelestrationShot;
