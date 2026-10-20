import {
  AVA_CLIP_KEYBOARD_LARGE_STEP_MILLISECONDS,
  AVA_CLIP_KEYBOARD_STEP_MILLISECONDS,
  AVA_CLIP_MAXIMUM_LEAD_LAG_MILLISECONDS,
  AVA_CLIP_MINIMUM_DURATION_MILLISECONDS,
  AVA_CLIP_MINIMUM_LEAD_LAG_MILLISECONDS,
  AVA_CLIP_WINDOW_HALF_MILLISECONDS,
} from "@/content/ava";

export type ClipHandle = "lead" | "lag";

export type ClipInterval = {
  leadMilliseconds: number;
  lagMilliseconds: number;
};

/** Invisible handle target is 44px, so half of that measured from the center. */
export const CLIP_HANDLE_HIT_HALF_WIDTH_PIXELS = 22;

type MillisecondBounds = {
  minimumMilliseconds: number;
  maximumMilliseconds: number;
};

function clampMilliseconds(
  proposedMilliseconds: number,
  bounds: MillisecondBounds,
  currentMilliseconds: number,
): number {
  if (bounds.maximumMilliseconds < bounds.minimumMilliseconds) return currentMilliseconds;
  const roundedMilliseconds = Math.round(proposedMilliseconds);
  if (roundedMilliseconds < bounds.minimumMilliseconds) return bounds.minimumMilliseconds;
  if (roundedMilliseconds > bounds.maximumMilliseconds) return bounds.maximumMilliseconds;
  return roundedMilliseconds;
}

export function leadBoundsMilliseconds(lagMilliseconds: number): MillisecondBounds {
  return {
    minimumMilliseconds: Math.max(
      AVA_CLIP_MINIMUM_LEAD_LAG_MILLISECONDS,
      AVA_CLIP_MINIMUM_DURATION_MILLISECONDS - lagMilliseconds,
    ),
    maximumMilliseconds: Math.min(
      AVA_CLIP_MAXIMUM_LEAD_LAG_MILLISECONDS,
      AVA_CLIP_WINDOW_HALF_MILLISECONDS,
    ),
  };
}

export function lagBoundsMilliseconds(leadMilliseconds: number): MillisecondBounds {
  return {
    minimumMilliseconds: Math.max(
      AVA_CLIP_MINIMUM_LEAD_LAG_MILLISECONDS,
      AVA_CLIP_MINIMUM_DURATION_MILLISECONDS - leadMilliseconds,
    ),
    maximumMilliseconds: Math.min(
      AVA_CLIP_MAXIMUM_LEAD_LAG_MILLISECONDS,
      AVA_CLIP_WINDOW_HALF_MILLISECONDS,
    ),
  };
}

export function clampLeadMilliseconds(
  proposedLeadMilliseconds: number,
  lagMilliseconds: number,
  currentLeadMilliseconds: number,
): number {
  return clampMilliseconds(
    proposedLeadMilliseconds,
    leadBoundsMilliseconds(lagMilliseconds),
    currentLeadMilliseconds,
  );
}

export function clampLagMilliseconds(
  proposedLagMilliseconds: number,
  leadMilliseconds: number,
  currentLagMilliseconds: number,
): number {
  return clampMilliseconds(
    proposedLagMilliseconds,
    lagBoundsMilliseconds(leadMilliseconds),
    currentLagMilliseconds,
  );
}

/**
 * Pointer x → milliseconds relative to the mark.
 * Fraction is clamped to the track, then rounded, matching ClipTrimBar::xToMs.
 * Returns null when the track has no width.
 */
export function markOffsetMillisecondsFromPointer(
  clientX: number,
  trackLeft: number,
  trackWidth: number,
): number | null {
  if (trackWidth <= 0) return null;
  const fraction = (clientX - trackLeft) / trackWidth;
  const clampedFraction = Math.min(1, Math.max(0, fraction));
  const windowStartMilliseconds = -AVA_CLIP_WINDOW_HALF_MILLISECONDS;
  const windowDurationMilliseconds = AVA_CLIP_WINDOW_HALF_MILLISECONDS * 2;
  return Math.round(windowStartMilliseconds + clampedFraction * windowDurationMilliseconds);
}

export function percentFromMarkOffset(markOffsetMilliseconds: number): number {
  const windowDurationMilliseconds = AVA_CLIP_WINDOW_HALF_MILLISECONDS * 2;
  const fraction =
    (markOffsetMilliseconds + AVA_CLIP_WINDOW_HALF_MILLISECONDS) / windowDurationMilliseconds;
  return Math.min(1, Math.max(0, fraction)) * 100;
}

export function clipIntervalFromPointer(
  current: ClipInterval,
  handle: ClipHandle,
  markOffsetMilliseconds: number,
): ClipInterval {
  if (handle === "lead") {
    const leadMilliseconds = clampLeadMilliseconds(
      -markOffsetMilliseconds,
      current.lagMilliseconds,
      current.leadMilliseconds,
    );
    if (leadMilliseconds === current.leadMilliseconds) return current;
    return { leadMilliseconds, lagMilliseconds: current.lagMilliseconds };
  }

  const lagMilliseconds = clampLagMilliseconds(
    markOffsetMilliseconds,
    current.leadMilliseconds,
    current.lagMilliseconds,
  );
  if (lagMilliseconds === current.lagMilliseconds) return current;
  return { leadMilliseconds: current.leadMilliseconds, lagMilliseconds };
}

export function clipIntervalFromKeyboard(
  current: ClipInterval,
  handle: ClipHandle,
  key: string,
  shiftKey: boolean,
): ClipInterval | null {
  const stepMilliseconds = shiftKey
    ? AVA_CLIP_KEYBOARD_LARGE_STEP_MILLISECONDS
    : AVA_CLIP_KEYBOARD_STEP_MILLISECONDS;
  let deltaMilliseconds = 0;

  if (key === "ArrowRight" || key === "ArrowUp") deltaMilliseconds = stepMilliseconds;
  else if (key === "ArrowLeft" || key === "ArrowDown") deltaMilliseconds = -stepMilliseconds;
  else if (key === "PageUp") deltaMilliseconds = AVA_CLIP_KEYBOARD_LARGE_STEP_MILLISECONDS;
  else if (key === "PageDown") deltaMilliseconds = -AVA_CLIP_KEYBOARD_LARGE_STEP_MILLISECONDS;
  else if (key === "Home") deltaMilliseconds = -AVA_CLIP_MAXIMUM_LEAD_LAG_MILLISECONDS;
  else if (key === "End") deltaMilliseconds = AVA_CLIP_MAXIMUM_LEAD_LAG_MILLISECONDS;
  else return null;

  if (handle === "lead") {
    return clipIntervalFromPointer(
      current,
      handle,
      -(current.leadMilliseconds + deltaMilliseconds),
    );
  }

  return clipIntervalFromPointer(current, handle, current.lagMilliseconds + deltaMilliseconds);
}

/**
 * Overlapping handles: the nearer center wins, and a tie prefers lead
 * (ClipTrimBar prefers the start handle when distances are equal).
 */
export function pickClipHandle(
  clientX: number,
  trackLeft: number,
  trackWidth: number,
  leadPercent: number,
  lagPercent: number,
  fallback: ClipHandle,
): ClipHandle {
  if (trackWidth <= 0) return fallback;
  const leadCenter = trackLeft + (leadPercent / 100) * trackWidth;
  const lagCenter = trackLeft + (lagPercent / 100) * trackWidth;
  const leadDistance = Math.abs(clientX - leadCenter);
  const lagDistance = Math.abs(clientX - lagCenter);
  const hitsLead = leadDistance <= CLIP_HANDLE_HIT_HALF_WIDTH_PIXELS;
  const hitsLag = lagDistance <= CLIP_HANDLE_HIT_HALF_WIDTH_PIXELS;

  if (hitsLead && hitsLag) return leadDistance <= lagDistance ? "lead" : "lag";
  if (hitsLead) return "lead";
  if (hitsLag) return "lag";
  return fallback;
}

function secondsText(milliseconds: number): string {
  const tenths = Math.round(milliseconds / 100);
  return (tenths / 10).toFixed(1);
}

/** Spin-box suffix (" s"), one decimal. Lead is before the mark, lag is after it. */
export function formatLeadLagLabel(milliseconds: number, handle: ClipHandle): string {
  if (Math.round(milliseconds / 100) === 0) return "0.0 s";
  const sign = handle === "lead" ? "-" : "+";
  return `${sign}${secondsText(milliseconds)} s`;
}

/** Clip length, same one-decimal seconds as the desktop duration total. */
export function formatClipLengthLabel(interval: ClipInterval): string {
  return `${secondsText(interval.leadMilliseconds + interval.lagMilliseconds)} s`;
}

export function ariaSeconds(milliseconds: number): number {
  return Math.round(milliseconds / 100) / 10;
}

const READOUT_GAP_PIXELS = 8;

export type ClipReadoutPlacement = {
  leadCenterPercent: number;
  lagCenterPercent: number;
  leadAbove: boolean;
};

/**
 * Keep the two nowrap readouts inside the track. When the handles are close,
 * push the labels apart. When the row is too narrow for both, lift lead above
 * the track so the strings stay readable at the drag extremes.
 */
export function placeClipReadouts(
  trackWidthPixels: number,
  leadPercent: number,
  lagPercent: number,
  leadLabelWidthPixels: number,
  lagLabelWidthPixels: number,
): ClipReadoutPlacement {
  if (trackWidthPixels <= 0 || leadLabelWidthPixels <= 0 || lagLabelWidthPixels <= 0) {
    return {
      leadCenterPercent: leadPercent,
      lagCenterPercent: lagPercent,
      leadAbove: false,
    };
  }

  const toPercent = (pixels: number) => (pixels / trackWidthPixels) * 100;
  const leadHalfPercent = toPercent(leadLabelWidthPixels / 2);
  const lagHalfPercent = toPercent(lagLabelWidthPixels / 2);
  const gapPercent = toPercent(READOUT_GAP_PIXELS);

  const clampCenter = (percent: number, halfPercent: number) => {
    const safeHalfPercent = Math.min(halfPercent, 50);
    return Math.min(100 - safeHalfPercent, Math.max(safeHalfPercent, percent));
  };

  const labelsShareTheRow =
    leadLabelWidthPixels + lagLabelWidthPixels + READOUT_GAP_PIXELS <= trackWidthPixels;

  if (!labelsShareTheRow) {
    return {
      leadCenterPercent: clampCenter(leadPercent, leadHalfPercent),
      lagCenterPercent: clampCenter(lagPercent, lagHalfPercent),
      leadAbove: true,
    };
  }

  let leadCenterPercent = clampCenter(leadPercent, leadHalfPercent);
  let lagCenterPercent = clampCenter(lagPercent, lagHalfPercent);

  if (leadCenterPercent > lagCenterPercent) {
    const midpoint = (leadCenterPercent + lagCenterPercent) / 2;
    leadCenterPercent = midpoint;
    lagCenterPercent = midpoint;
  }

  const minimumSeparation = leadHalfPercent + lagHalfPercent + gapPercent;
  if (lagCenterPercent - leadCenterPercent < minimumSeparation) {
    const midpoint = (leadCenterPercent + lagCenterPercent) / 2;
    let separatedLead = midpoint - minimumSeparation / 2;
    let separatedLag = midpoint + minimumSeparation / 2;
    const leadMinimum = Math.min(leadHalfPercent, 50);
    const lagMaximum = 100 - Math.min(lagHalfPercent, 50);

    if (separatedLead < leadMinimum) {
      const shift = leadMinimum - separatedLead;
      separatedLead += shift;
      separatedLag += shift;
    }
    if (separatedLag > lagMaximum) {
      const shift = separatedLag - lagMaximum;
      separatedLead -= shift;
      separatedLag -= shift;
    }

    const leadFits = separatedLead >= leadMinimum - 0.01;
    const lagFits = separatedLag <= lagMaximum + 0.01;
    if (!leadFits || !lagFits || separatedLag - separatedLead < minimumSeparation - 0.01) {
      return {
        leadCenterPercent: clampCenter(leadPercent, leadHalfPercent),
        lagCenterPercent: clampCenter(lagPercent, lagHalfPercent),
        leadAbove: true,
      };
    }
    leadCenterPercent = separatedLead;
    lagCenterPercent = separatedLag;
  }

  return { leadCenterPercent, lagCenterPercent, leadAbove: false };
}
