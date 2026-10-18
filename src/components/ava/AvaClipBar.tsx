import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
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

const AvaClipBar = () => {
  const { t } = useLanguage();
  const [clipInterval, setClipInterval] = useState<ClipInterval>(INITIAL_CLIP_INTERVAL);
  const [activeHandle, setActiveHandle] = useState<ClipHandle | null>(null);
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
      className="ava-clip-window"
      role="group"
      aria-label={t("ava.clip.kicker")}
      data-dragging={activeHandle ?? undefined}
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
          role="slider"
          aria-label={t("ava.clip.lead")}
          aria-orientation="horizontal"
          aria-valuemin={ariaSeconds(leadBounds.minimumMilliseconds)}
          aria-valuemax={ariaSeconds(leadBounds.maximumMilliseconds)}
          aria-valuenow={ariaSeconds(clipInterval.leadMilliseconds)}
          aria-valuetext={leadLabel}
          data-active={activeHandle === "lead" ? "true" : undefined}
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
          role="slider"
          aria-label={t("ava.clip.lag")}
          aria-orientation="horizontal"
          aria-valuemin={ariaSeconds(lagBounds.minimumMilliseconds)}
          aria-valuemax={ariaSeconds(lagBounds.maximumMilliseconds)}
          aria-valuenow={ariaSeconds(clipInterval.lagMilliseconds)}
          aria-valuetext={lagLabel}
          data-active={activeHandle === "lag" ? "true" : undefined}
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
