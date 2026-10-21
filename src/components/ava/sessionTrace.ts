/**
 * Decorative trace for the AVA session flow.
 * One real session does not walk the five steps in a line: import happens
 * once, then tagging, analysis, presenting, and export interleave.
 * Forward hops bow away from the labels; backward hops bow the other way.
 */

export const SESSION_TRACE_STEP_IDS = ["import", "tag", "analyze", "present", "export"] as const;

export type SessionTraceStepId = (typeof SESSION_TRACE_STEP_IDS)[number];

export type SessionTraceLayout = "horizontal" | "vertical";

export type SessionTracePoint = {
  x: number;
  y: number;
};

export type SessionTraceGutters = {
  outerPx: number;
  innerPx: number;
};

export type SessionTraceHop = {
  from: number;
  to: number;
};

/** Import once, then the session jumps. The last landing is Export. */
export const SESSION_TRACE_HOPS: readonly SessionTraceHop[] = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 1 },
  { from: 1, to: 3 },
  { from: 3, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 4 },
  { from: 4, to: 3 },
  { from: 3, to: 4 },
];

export const SESSION_TRACE_ADJACENT_DURATION_MS = 420;
export const SESSION_TRACE_SKIP_DURATION_MS = 500;
export const SESSION_TRACE_GAP_MS = 75;
export const SESSION_TRACE_HIGHLIGHT_MS = 240;
export const SESSION_TRACE_RESIDUE_MS = 320;
export const SESSION_TRACE_VISIBILITY_RATIO = 0.6;

export type SessionTraceArc = {
  fromIndex: number;
  toIndex: number;
  fromId: SessionTraceStepId;
  toId: SessionTraceStepId;
  path: string;
  delayMs: number;
  durationMs: number;
  terminal: boolean;
  endX: number;
  endY: number;
};

export function sessionTraceHopDurationMs(fromIndex: number, toIndex: number): number {
  const span = Math.abs(toIndex - fromIndex);
  return span <= 1 ? SESSION_TRACE_ADJACENT_DURATION_MS : SESSION_TRACE_SKIP_DURATION_MS;
}

export function sessionTraceStepOrder(): readonly SessionTraceStepId[] {
  const firstHop = SESSION_TRACE_HOPS[0];
  const order: SessionTraceStepId[] = [SESSION_TRACE_STEP_IDS[firstHop.from]];
  for (const hop of SESSION_TRACE_HOPS) {
    order.push(SESSION_TRACE_STEP_IDS[hop.to]);
  }
  return order;
}

export function sessionTraceDurationMs(): number {
  let cursorMs = 0;
  SESSION_TRACE_HOPS.forEach((hop, hopIndex) => {
    cursorMs += sessionTraceHopDurationMs(hop.from, hop.to);
    if (hopIndex < SESSION_TRACE_HOPS.length - 1) {
      cursorMs += SESSION_TRACE_GAP_MS;
    }
  });
  return cursorMs;
}

export function sessionTraceLayout(points: readonly SessionTracePoint[]): SessionTraceLayout {
  if (points.length < 2) return "vertical";
  const first = points[0];
  const last = points[points.length - 1];
  const deltaX = Math.abs(last.x - first.x);
  const deltaY = Math.abs(last.y - first.y);
  return deltaX > deltaY ? "horizontal" : "vertical";
}

export function isSessionTraceInView(entry: IntersectionObserverEntry): boolean {
  if (entry.intersectionRatio >= SESSION_TRACE_VISIBILITY_RATIO) return true;
  const viewportHeight = entry.rootBounds?.height || (typeof window !== "undefined" ? window.innerHeight : 0);
  if (viewportHeight <= 0) return false;
  const visibleFraction = entry.intersectionRect.height / viewportHeight;
  return entry.isIntersecting && visibleFraction >= SESSION_TRACE_VISIBILITY_RATIO;
}

function sketchUnit(hopIndex: number, channel: number): number {
  const raw = Math.sin(hopIndex * 127.1 + channel * 311.7) * 43758.5453123;
  return raw - Math.floor(raw);
}

function formatCoordinate(value: number): string {
  return value.toFixed(2);
}

function bowAmplitude(chordLength: number, gutterPx: number, hopIndex: number, occurrence: number): number {
  const room = Math.max(0, gutterPx - 5);
  if (room <= 0) return 0;
  const noise = sketchUnit(hopIndex, 3);
  const scaled = Math.min(room, Math.max(Math.min(11, room), chordLength * 0.22));
  const withSketch = scaled * (0.9 + noise * 0.1);
  const withRetrace = withSketch + (occurrence - 1) * 3;
  return Math.min(room, withRetrace);
}

/**
 * Unit bow for a hop. Horizontal forward arcs go up, backward arcs go down.
 * Vertical forward arcs go left, backward arcs go right.
 * The sign is tied to the rail, not the direction of travel, so a reversed
 * hop does not flip back onto the forward strokes.
 */
export function sessionTraceBowVector(
  layout: SessionTraceLayout,
  isForward: boolean,
  amplitude: number,
): SessionTracePoint {
  if (layout === "horizontal") {
    return { x: 0, y: isForward ? -amplitude : amplitude };
  }
  return { x: isForward ? -amplitude : amplitude, y: 0 };
}

function sketchedArcPath(
  from: SessionTracePoint,
  to: SessionTracePoint,
  bow: SessionTracePoint,
  hopIndex: number,
): string {
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  const firstNoise = sketchUnit(hopIndex, 1);
  const secondNoise = sketchUnit(hopIndex, 2);
  const firstAlong = 0.32 + (firstNoise - 0.5) * 0.08;
  const secondAlong = 0.68 + (secondNoise - 0.5) * 0.08;
  const firstAmplitude = 0.86 + firstNoise * 0.16;
  const secondAmplitude = 0.94 + secondNoise * 0.14;
  const firstX = from.x + deltaX * firstAlong + bow.x * firstAmplitude;
  const firstY = from.y + deltaY * firstAlong + bow.y * firstAmplitude;
  const secondX = from.x + deltaX * secondAlong + bow.x * secondAmplitude;
  const secondY = from.y + deltaY * secondAlong + bow.y * secondAmplitude;
  return [
    `M ${formatCoordinate(from.x)} ${formatCoordinate(from.y)}`,
    `C ${formatCoordinate(firstX)} ${formatCoordinate(firstY)}`,
    `${formatCoordinate(secondX)} ${formatCoordinate(secondY)}`,
    `${formatCoordinate(to.x)} ${formatCoordinate(to.y)}`,
  ].join(" ");
}

export function buildSessionTraceArcs(
  points: readonly SessionTracePoint[],
  gutters: SessionTraceGutters,
): SessionTraceArc[] {
  if (points.length !== SESSION_TRACE_STEP_IDS.length) return [];
  const layout = sessionTraceLayout(points);
  const occurrences = new Map<string, number>();
  let delayMs = 0;

  return SESSION_TRACE_HOPS.map((hop, hopIndex) => {
    const from = points[hop.from];
    const to = points[hop.to];
    const isForward = hop.to > hop.from;
    const pairKey = `${hop.from}>${hop.to}`;
    const occurrence = (occurrences.get(pairKey) ?? 0) + 1;
    occurrences.set(pairKey, occurrence);
    const chordLength = Math.hypot(to.x - from.x, to.y - from.y);
    const gutterPx = isForward ? gutters.outerPx : gutters.innerPx;
    const amplitude = bowAmplitude(chordLength, gutterPx, hopIndex, occurrence);
    const bow = sessionTraceBowVector(layout, isForward, amplitude);
    const durationMs = sessionTraceHopDurationMs(hop.from, hop.to);
    const arc: SessionTraceArc = {
      fromIndex: hop.from,
      toIndex: hop.to,
      fromId: SESSION_TRACE_STEP_IDS[hop.from],
      toId: SESSION_TRACE_STEP_IDS[hop.to],
      path: sketchedArcPath(from, to, bow, hopIndex),
      delayMs,
      durationMs,
      terminal: hopIndex === SESSION_TRACE_HOPS.length - 1,
      endX: to.x,
      endY: to.y,
    };
    delayMs += durationMs + SESSION_TRACE_GAP_MS;
    return arc;
  });
}

export function measureSessionTrace(
  frame: HTMLElement,
  list: HTMLElement,
): { width: number; height: number; arcs: SessionTraceArc[] } | null {
  const frameRect = frame.getBoundingClientRect();
  if (frameRect.width < 2 || frameRect.height < 2) return null;

  const markerElements = list.querySelectorAll<HTMLElement>(".ava-session-marker");
  if (markerElements.length !== SESSION_TRACE_STEP_IDS.length) return null;

  const points: SessionTracePoint[] = Array.from(markerElements, (marker) => {
    const markerRect = marker.getBoundingClientRect();
    return {
      x: markerRect.left - frameRect.left + markerRect.width / 2,
      y: markerRect.top - frameRect.top + markerRect.height / 2,
    };
  });

  const rail = frame.querySelector<HTMLElement>(".ava-session-rail");
  const label = list.querySelector<HTMLElement>(".ava-session-label");
  if (!rail || !label) return null;

  const railRect = rail.getBoundingClientRect();
  const labelRect = label.getBoundingClientRect();
  const layout = sessionTraceLayout(points);
  const gutters: SessionTraceGutters =
    layout === "horizontal"
      ? {
          outerPx: railRect.top - frameRect.top,
          innerPx: labelRect.top - railRect.bottom,
        }
      : {
          outerPx: railRect.left - frameRect.left,
          innerPx: labelRect.left - railRect.right,
        };

  return {
    width: frameRect.width,
    height: frameRect.height,
    arcs: buildSessionTraceArcs(points, gutters),
  };
}
