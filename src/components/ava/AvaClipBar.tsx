import {
  useEffect,
  useRef,
  useState,
  type AnimationEvent,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
} from "react";
import {
  AVA_CLIP_DEFAULT_LAG_MILLISECONDS,
  AVA_CLIP_DEFAULT_LEAD_MILLISECONDS,
} from "@/content/ava";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ariaSeconds,
  clipIntervalFromKeyboard,
  clipIntervalFromPointer,
  formatClipLengthLabel,
  formatLeadLagLabel,
  lagBoundsMilliseconds,
  leadBoundsMilliseconds,
  markOffsetMillisecondsFromPointer,
  percentFromMarkOffset,
  pickClipHandle,
  type ClipHandle,
  type ClipInterval,
} from "@/components/ava/clipTrim";

function readoutStyle(percent: number): CSSProperties {
  return { "--readout-position": `${percent}%` } as CSSProperties;
}

const INITIAL_CLIP_INTERVAL: ClipInterval = {
  leadMilliseconds: AVA_CLIP_DEFAULT_LEAD_MILLISECONDS,
  lagMilliseconds: AVA_CLIP_DEFAULT_LAG_MILLISECONDS,
};

type DragSession = {
  pointerId: number;
  handle: ClipHandle;
};

/** One ghost nudge per document load. The first pointer or keyboard use consumes it. */
let hasConsumedClipHandleNudge = false;

const CLIP_HANDLE_NUDGE_VISIBILITY_THRESHOLD = 0.6;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function useClipHandleNudge(diagramRef: RefObject<HTMLElement | null>) {
  const [isNudging, setIsNudging] = useState(false);

  useEffect(() => {
    if (hasConsumedClipHandleNudge) return undefined;
    if (typeof IntersectionObserver === "undefined") return undefined;
    if (prefersReducedMotion()) return undefined;

    const diagram = diagramRef.current;
    if (!diagram) return undefined;

    let hasStoppedObserving = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (hasStoppedObserving) return;
        const entry = entries[0];
        const isVisibleEnough =
          entry?.isIntersecting === true &&
          entry.intersectionRatio >= CLIP_HANDLE_NUDGE_VISIBILITY_THRESHOLD;
        if (!isVisibleEnough) return;
        if (hasConsumedClipHandleNudge) {
          observer.disconnect();
          return;
        }
        hasConsumedClipHandleNudge = true;
        setIsNudging(true);
        observer.disconnect();
      },
      { threshold: CLIP_HANDLE_NUDGE_VISIBILITY_THRESHOLD },
    );

    observer.observe(diagram);
    return () => {
      hasStoppedObserving = true;
      observer.disconnect();
    };
  }, [diagramRef]);

  function consumeClipHandleNudge() {
    hasConsumedClipHandleNudge = true;
    diagramRef.current?.removeAttribute("data-nudge");
    setIsNudging(false);
  }

  function onNudgeAnimationEnd(event: AnimationEvent<HTMLElement>) {
    if (event.animationName !== "ava-clip-nudge-lag") return;
    setIsNudging(false);
  }

  return { isNudging, consumeClipHandleNudge, onNudgeAnimationEnd };
}

const AvaClipBar = () => {
  const { t } = useLanguage();
  const [clipInterval, setClipInterval] = useState<ClipInterval>(INITIAL_CLIP_INTERVAL);
  const [activeHandle, setActiveHandle] = useState<ClipHandle | null>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const { isNudging, consumeClipHandleNudge, onNudgeAnimationEnd } = useClipHandleNudge(diagramRef);
  const trackRef = useRef<HTMLDivElement>(null);
  const leadHandleRef = useRef<HTMLButtonElement>(null);
  const lagHandleRef = useRef<HTMLButtonElement>(null);
  const clipIntervalRef = useRef(clipInterval);
  const dragSessionRef = useRef<DragSession | null>(null);
  clipIntervalRef.current = clipInterval;

  const leadPercent = percentFromMarkOffset(-clipInterval.leadMilliseconds);
  const lagPercent = percentFromMarkOffset(clipInterval.lagMilliseconds);
  const spanLeft = Math.min(leadPercent, lagPercent);
  const spanWidth = Math.abs(lagPercent - leadPercent);
  const leadBounds = leadBoundsMilliseconds(clipInterval.lagMilliseconds);
  const lagBounds = lagBoundsMilliseconds(clipInterval.leadMilliseconds);
  const leadLabel = formatLeadLagLabel(clipInterval.leadMilliseconds, "lead");
  const lagLabel = formatLeadLagLabel(clipInterval.lagMilliseconds, "lag");
  const clipLengthLabel = formatClipLengthLabel(clipInterval);

  function updateFromClientX(clientX: number) {
    const dragSession = dragSessionRef.current;
    const track = trackRef.current;
    if (!dragSession || !track) return;
    const bounds = track.getBoundingClientRect();
    const markOffsetMilliseconds = markOffsetMillisecondsFromPointer(
      clientX,
      bounds.left,
      bounds.width,
    );
    if (markOffsetMilliseconds === null) return;
    setClipInterval((current) =>
      clipIntervalFromPointer(current, dragSession.handle, markOffsetMilliseconds),
    );
  }

  function beginDrag(event: PointerEvent<HTMLButtonElement>, fallback: ClipHandle) {
    consumeClipHandleNudge();
    if (event.button !== 0 || dragSessionRef.current) return;
    const track = trackRef.current;
    if (!track) return;

    const bounds = track.getBoundingClientRect();
    const current = clipIntervalRef.current;
    const handle = pickClipHandle(
      event.clientX,
      bounds.left,
      bounds.width,
      percentFromMarkOffset(-current.leadMilliseconds),
      percentFromMarkOffset(current.lagMilliseconds),
      fallback,
    );

    dragSessionRef.current = { pointerId: event.pointerId, handle };
    setActiveHandle(handle);
    event.currentTarget.setPointerCapture(event.pointerId);
    const chosenHandle = handle === "lead" ? leadHandleRef.current : lagHandleRef.current;
    chosenHandle?.focus({ preventScroll: true });
    updateFromClientX(event.clientX);
  }

  function finishDrag(event: PointerEvent<HTMLButtonElement>) {
    const dragSession = dragSessionRef.current;
    if (!dragSession || dragSession.pointerId !== event.pointerId) return;
    updateFromClientX(event.clientX);
    dragSessionRef.current = null;
    setActiveHandle(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function onHandleKeyDown(event: KeyboardEvent<HTMLButtonElement>, handle: ClipHandle) {
    consumeClipHandleNudge();
    const nextInterval = clipIntervalFromKeyboard(
      clipIntervalRef.current,
      handle,
      event.key,
      event.shiftKey,
    );
    if (!nextInterval) return;
    event.preventDefault();
    setClipInterval(nextInterval);
  }

  return (
    <div
      ref={diagramRef}
      className="ava-clip-window"
      role="group"
      aria-label={t("ava.clip.kicker")}
      data-dragging={activeHandle ?? undefined}
      data-nudge={isNudging ? "play" : undefined}
      onAnimationEnd={onNudgeAnimationEnd}
    >
      <div className="ava-clip-track" ref={trackRef}>
        <div className="ava-clip-track-line" aria-hidden="true" />
        {spanWidth > 0 ? (
          <div
            className="ava-clip-span"
            style={{ left: `${spanLeft}%`, width: `${spanWidth}%` }}
            aria-hidden="true"
          />
        ) : null}
        <div
          className="ava-clip-mark"
          style={{ left: `${percentFromMarkOffset(0)}%` }}
          aria-hidden="true"
        />
        <button
          ref={leadHandleRef}
          type="button"
          className="ava-clip-handle"
          style={{ left: `${leadPercent}%` }}
          data-handle="lead"
          role="slider"
          aria-label={t("ava.clip.lead")}
          aria-orientation="horizontal"
          aria-valuemin={ariaSeconds(leadBounds.minimumMilliseconds)}
          aria-valuemax={ariaSeconds(leadBounds.maximumMilliseconds)}
          aria-valuenow={ariaSeconds(clipInterval.leadMilliseconds)}
          aria-valuetext={leadLabel}
          data-active={activeHandle === "lead" ? "true" : undefined}
          onFocus={consumeClipHandleNudge}
          onPointerDown={(event) => beginDrag(event, "lead")}
          onPointerMove={(event) => {
            if (dragSessionRef.current?.pointerId === event.pointerId) updateFromClientX(event.clientX);
          }}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          onLostPointerCapture={(event) => {
            const dragSession = dragSessionRef.current;
            if (!dragSession || dragSession.pointerId !== event.pointerId) return;
            dragSessionRef.current = null;
            setActiveHandle(null);
          }}
          onKeyDown={(event) => onHandleKeyDown(event, "lead")}
        />
        <button
          ref={lagHandleRef}
          type="button"
          className="ava-clip-handle"
          style={{ left: `${lagPercent}%` }}
          data-handle="lag"
          role="slider"
          aria-label={t("ava.clip.lag")}
          aria-orientation="horizontal"
          aria-valuemin={ariaSeconds(lagBounds.minimumMilliseconds)}
          aria-valuemax={ariaSeconds(lagBounds.maximumMilliseconds)}
          aria-valuenow={ariaSeconds(clipInterval.lagMilliseconds)}
          aria-valuetext={lagLabel}
          data-active={activeHandle === "lag" ? "true" : undefined}
          onFocus={consumeClipHandleNudge}
          onPointerDown={(event) => beginDrag(event, "lag")}
          onPointerMove={(event) => {
            if (dragSessionRef.current?.pointerId === event.pointerId) updateFromClientX(event.clientX);
          }}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          onLostPointerCapture={(event) => {
            const dragSession = dragSessionRef.current;
            if (!dragSession || dragSession.pointerId !== event.pointerId) return;
            dragSessionRef.current = null;
            setActiveHandle(null);
          }}
          onKeyDown={(event) => onHandleKeyDown(event, "lag")}
        />
      </div>
      <div className="ava-clip-readout" aria-hidden="true">
        <span style={readoutStyle(leadPercent)}>{leadLabel}</span>
        <span style={readoutStyle(lagPercent)}>{lagLabel}</span>
      </div>
      <div className="ava-clip-center" style={{ left: `${percentFromMarkOffset(0)}%` }}>
        <span>{t("ava.clip.mark")}</span>
        <span className="ava-clip-length">{clipLengthLabel}</span>
      </div>
    </div>
  );
};

export default AvaClipBar;
