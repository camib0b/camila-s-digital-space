import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { AVA_CONCAT_FILES, AVA_CONCAT_TOTAL_LABEL } from "@/content/ava";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  displayedIndex,
  fillReorderTemplate,
  moveItem,
  previewIndexForPointer,
  slotGeometry,
  slotShift,
  type SlotGeometry,
} from "@/components/ava/concatReorder";
import { duration, ease } from "@/lib/motion";

const DRAG_START_THRESHOLD_PX = 4;
const DRAG_LIFT_PX = 4;
const SETTLED_SHIFT_DURATION_MS = duration.base;
const SETTLED_SHIFT_EASING = ease.out;
const BODY_DRAGGING_CLASS = "ava-concat-is-dragging";

type ConcatFileId = (typeof AVA_CONCAT_FILES)[number]["id"];

type DragSession = {
  pointerId: number;
  fileId: ConcatFileId;
  originIndex: number;
  startClientX: number;
  startClientY: number;
  active: boolean;
  previewIndex: number;
};

type ActiveDrag = {
  fileId: ConcatFileId;
  originIndex: number;
  previewIndex: number;
  slotStride: number;
};

const CONCAT_FILES_BY_ID = new Map(AVA_CONCAT_FILES.map((file) => [file.id, file]));

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readSlotGeometry(container: HTMLElement, count: number): SlotGeometry | null {
  const bounds = container.getBoundingClientRect();
  const parsedGap = Number.parseFloat(getComputedStyle(container).columnGap);
  const gap = Number.isFinite(parsedGap) ? parsedGap : 0;
  return slotGeometry(bounds.width, bounds.left, gap, count);
}

function applyDragTransform(
  button: HTMLButtonElement,
  deltaX: number,
  deltaY: number,
  reducedMotion: boolean,
) {
  const lift = reducedMotion ? 0 : DRAG_LIFT_PX;
  button.style.transform = `translate3d(${deltaX}px, ${deltaY - lift}px, 0)`;
}

function cancelButtonAnimations(button: HTMLButtonElement) {
  button.getAnimations().forEach((animation) => animation.cancel());
}

const DragHandle = () => {
  return (
    <span className="ava-concat-handle" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <span key={index} />
      ))}
    </span>
  );
};

const AvaConcatGraphic = () => {
  const { t } = useLanguage();
  const reorderHintId = useId();
  const fileListRef = useRef<HTMLUListElement>(null);
  const fileButtonRefs = useRef(new Map<ConcatFileId, HTMLButtonElement>());
  const dragSessionRef = useRef<DragSession | null>(null);
  const activeDragRef = useRef<ActiveDrag | null>(null);
  const pendingRectsRef = useRef<Map<ConcatFileId, DOMRect> | null>(null);
  const userHasArrangedRef = useRef(false);

  const [orderedFileIds, setOrderedFileIds] = useState<ConcatFileId[]>(() =>
    AVA_CONCAT_FILES.map((file) => file.id),
  );
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null);
  const [suppressShiftTransition, setSuppressShiftTransition] = useState(false);
  const [userHasArranged, setUserHasArranged] = useState(false);
  const [reorderAnnouncement, setReorderAnnouncement] = useState("");

  const orderedFileIdsRef = useRef(orderedFileIds);
  orderedFileIdsRef.current = orderedFileIds;
  activeDragRef.current = activeDrag;
  const isDragging = activeDrag !== null;

  const displayedFileIds = activeDrag
    ? moveItem(orderedFileIds, activeDrag.originIndex, activeDrag.previewIndex)
    : orderedFileIds;

  useEffect(() => {
    const fileList = fileListRef.current;
    if (!fileList) return;
    // Registered for the life of the diagram. React's root touch listeners are passive,
    // so this is what actually cancels scrolling once a press starts on a file.
    const blockScrollWhileArranging = (event: TouchEvent) => {
      if (!dragSessionRef.current || !event.cancelable) return;
      event.preventDefault();
    };
    fileList.addEventListener("touchmove", blockScrollWhileArranging, { passive: false });
    return () => fileList.removeEventListener("touchmove", blockScrollWhileArranging);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    document.body.classList.add(BODY_DRAGGING_CLASS);
    return () => document.body.classList.remove(BODY_DRAGGING_CLASS);
  }, [isDragging]);

  useLayoutEffect(() => {
    const previousRects = pendingRectsRef.current;
    pendingRectsRef.current = null;
    if (!previousRects || prefersReducedMotion()) return;

    fileButtonRefs.current.forEach((button) => cancelButtonAnimations(button));
    previousRects.forEach((firstRect, fileId) => {
      const button = fileButtonRefs.current.get(fileId);
      if (!button) return;
      const lastRect = button.getBoundingClientRect();
      const deltaX = firstRect.left - lastRect.left;
      const deltaY = firstRect.top - lastRect.top;
      if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) return;
      button.animate(
        [
          { transform: `translate3d(${deltaX}px, ${deltaY}px, 0)` },
          { transform: "translate3d(0, 0, 0)" },
        ],
        { duration: SETTLED_SHIFT_DURATION_MS, easing: SETTLED_SHIFT_EASING },
      );
    });
  }, [orderedFileIds]);

  useLayoutEffect(() => {
    if (!suppressShiftTransition) return;
    const frame = requestAnimationFrame(() => setSuppressShiftTransition(false));
    return () => cancelAnimationFrame(frame);
  }, [suppressShiftTransition]);

  function markArranged() {
    if (userHasArrangedRef.current) return;
    userHasArrangedRef.current = true;
    setUserHasArranged(true);
  }

  function captureButtonRects(): Map<ConcatFileId, DOMRect> {
    const rects = new Map<ConcatFileId, DOMRect>();
    fileButtonRefs.current.forEach((button, fileId) => {
      rects.set(fileId, button.getBoundingClientRect());
    });
    return rects;
  }

  function announceMove(fileId: ConcatFileId, position: number, total: number) {
    const file = CONCAT_FILES_BY_ID.get(fileId);
    if (!file) return;
    setReorderAnnouncement(
      fillReorderTemplate(t("ava.concat.reorder.moved"), {
        name: file.name,
        position,
        total,
      }),
    );
  }

  function commitFileOrder(fromIndex: number, toIndex: number) {
    const currentIds = orderedFileIdsRef.current;
    const movedFileId = currentIds[fromIndex];
    if (!movedFileId || fromIndex === toIndex) return;
    pendingRectsRef.current = captureButtonRects();
    fileButtonRefs.current.forEach((button) => cancelButtonAnimations(button));
    setSuppressShiftTransition(true);
    setActiveDrag(null);
    setOrderedFileIds(moveItem(currentIds, fromIndex, toIndex));
    announceMove(movedFileId, toIndex + 1, currentIds.length);
  }

  function finishDrag(commit: boolean) {
    const session = dragSessionRef.current;
    if (!session) return;
    dragSessionRef.current = null;

    const button = fileButtonRefs.current.get(session.fileId);
    const shouldCommit = commit && session.active && session.previewIndex !== session.originIndex;
    if (shouldCommit) {
      pendingRectsRef.current = captureButtonRects();
    }

    if (button) {
      const transform = button.style.transform;
      button.style.transform = "";
      if (!shouldCommit && session.active && transform && !prefersReducedMotion()) {
        button.animate(
          [{ transform }, { transform: "translate3d(0, 0, 0)" }],
          { duration: SETTLED_SHIFT_DURATION_MS, easing: SETTLED_SHIFT_EASING },
        );
      }
    }

    if (!shouldCommit) {
      setActiveDrag(null);
      return;
    }

    const currentIds = orderedFileIdsRef.current;
    const movedFileId = currentIds[session.originIndex];
    setSuppressShiftTransition(true);
    setActiveDrag(null);
    setOrderedFileIds(moveItem(currentIds, session.originIndex, session.previewIndex));
    if (movedFileId) announceMove(movedFileId, session.previewIndex + 1, currentIds.length);
  }

  function releasePointer(button: HTMLButtonElement, pointerId: number) {
    if (button.hasPointerCapture(pointerId)) button.releasePointerCapture(pointerId);
  }

  function onFilePointerDown(event: PointerEvent<HTMLButtonElement>, index: number) {
    if (event.button !== 0 || dragSessionRef.current) return;
    const fileList = fileListRef.current;
    const fileId = orderedFileIdsRef.current[index];
    if (!fileList || !fileId || !readSlotGeometry(fileList, orderedFileIdsRef.current.length)) return;

    markArranged();
    dragSessionRef.current = {
      pointerId: event.pointerId,
      fileId,
      originIndex: index,
      startClientX: event.clientX,
      startClientY: event.clientY,
      active: false,
      previewIndex: index,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onFilePointerMove(event: PointerEvent<HTMLButtonElement>) {
    const session = dragSessionRef.current;
    const fileList = fileListRef.current;
    if (!session || !fileList || session.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - session.startClientX;
    const deltaY = event.clientY - session.startClientY;
    if (!session.active && Math.hypot(deltaX, deltaY) < DRAG_START_THRESHOLD_PX) return;

    session.active = true;
    if (event.cancelable) event.preventDefault();

    const geometry = readSlotGeometry(fileList, orderedFileIdsRef.current.length);
    const originCenter = geometry?.centers[session.originIndex];
    if (!geometry || originCenter === undefined) return;

    applyDragTransform(event.currentTarget, deltaX, deltaY, prefersReducedMotion());
    const previewIndex = previewIndexForPointer(originCenter + deltaX, geometry.centers);
    session.previewIndex = previewIndex;

    const currentDrag = activeDragRef.current;
    const strideChanged = !currentDrag || Math.abs(currentDrag.slotStride - geometry.stride) > 0.5;
    const previewChanged = !currentDrag || currentDrag.previewIndex !== previewIndex;
    if (!currentDrag || currentDrag.fileId !== session.fileId || previewChanged || strideChanged) {
      const nextDrag: ActiveDrag = {
        fileId: session.fileId,
        originIndex: session.originIndex,
        previewIndex,
        slotStride: geometry.stride,
      };
      activeDragRef.current = nextDrag;
      setActiveDrag(nextDrag);
    }
  }

  function onFilePointerUp(event: PointerEvent<HTMLButtonElement>) {
    const session = dragSessionRef.current;
    if (!session || session.pointerId !== event.pointerId) return;
    finishDrag(true);
    releasePointer(event.currentTarget, event.pointerId);
  }

  function onFilePointerCancel(event: PointerEvent<HTMLButtonElement>) {
    const session = dragSessionRef.current;
    if (!session || session.pointerId !== event.pointerId) return;
    finishDrag(false);
    releasePointer(event.currentTarget, event.pointerId);
  }

  function onFileLostPointerCapture(event: PointerEvent<HTMLButtonElement>) {
    const session = dragSessionRef.current;
    if (!session || session.pointerId !== event.pointerId) return;
    finishDrag(true);
  }

  function onFileKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (dragSessionRef.current) return;
    const lastIndex = orderedFileIdsRef.current.length - 1;
    let targetIndex = index;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") targetIndex = index - 1;
    else if (event.key === "ArrowRight" || event.key === "ArrowDown") targetIndex = index + 1;
    else if (event.key === "Home") targetIndex = 0;
    else if (event.key === "End") targetIndex = lastIndex;
    else return;

    event.preventDefault();
    markArranged();
    if (targetIndex < 0 || targetIndex > lastIndex || targetIndex === index) return;
    commitFileOrder(index, targetIndex);
  }

  return (
    <figure className="ava-concat-panel" data-arranged={userHasArranged ? "true" : undefined}>
      <div className="ava-concat-chrome">
        <span className="ava-concat-select">{t("ava.concat.select")}</span>
        <span>{t("ava.concat.formats")}</span>
      </div>

      <p className="ava-concat-dialog" id={reorderHintId}>
        {t("ava.concat.arrange")}
      </p>

      <ul
        ref={fileListRef}
        className="ava-concat-files"
        aria-labelledby={reorderHintId}
        data-dragging={activeDrag ? "true" : undefined}
        data-suppress-transition={suppressShiftTransition ? "true" : undefined}
      >
        {orderedFileIds.map((fileId, index) => {
          const file = CONCAT_FILES_BY_ID.get(fileId);
          if (!file) return null;
          const isDragging = activeDrag?.fileId === fileId;
          const positionIndex = activeDrag
            ? displayedIndex(index, activeDrag.originIndex, activeDrag.previewIndex)
            : index;
          const shift = activeDrag ? slotShift(index, activeDrag.originIndex, activeDrag.previewIndex) : 0;
          const slotStyle: CSSProperties | undefined =
            activeDrag && shift !== 0
              ? { transform: `translate3d(${shift * activeDrag.slotStride}px, 0, 0)` }
              : undefined;
          const position = positionIndex + 1;
          const label = fillReorderTemplate(t("ava.concat.reorder.item"), {
            name: file.name,
            position,
            total: orderedFileIds.length,
          });

          return (
            <li key={file.id} className="ava-concat-file-slot" style={slotStyle}>
              <button
                ref={(node) => {
                  if (node) fileButtonRefs.current.set(file.id, node);
                  else fileButtonRefs.current.delete(file.id);
                }}
                type="button"
                className="ava-concat-file"
                aria-roledescription={t("ava.concat.reorder.role")}
                aria-label={label}
                aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Home End"
                data-dragging={isDragging ? "true" : undefined}
                onPointerDown={(event) => onFilePointerDown(event, index)}
                onPointerMove={onFilePointerMove}
                onPointerUp={onFilePointerUp}
                onPointerCancel={onFilePointerCancel}
                onLostPointerCapture={onFileLostPointerCapture}
                onKeyDown={(event) => onFileKeyDown(event, index)}
              >
                <span className="ava-concat-file-head">
                  <span>{String(position).padStart(2, "0")}</span>
                  <DragHandle />
                </span>
                <span className="ava-concat-file-name">{file.name}</span>
                <span className="ava-concat-file-rail" />
                <span className="ava-concat-file-time">{file.duration}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {reorderAnnouncement}
      </div>

      <div className="ava-concat-join" aria-hidden="true">
        <div className="ava-concat-stems">
          {displayedFileIds.map((fileId) => (
            <span key={fileId} />
          ))}
        </div>
        <p className="ava-concat-progress">{t("ava.concat.progress")}</p>
      </div>

      <div className="ava-concat-match">
        <div className="ava-concat-match-rail">
          <div className="ava-playhead" />
          {displayedFileIds.map((fileId) => {
            const file = CONCAT_FILES_BY_ID.get(fileId);
            if (!file) return null;
            return (
              <div className="ava-concat-segment" key={file.id} style={{ flex: file.seconds }}>
                <span className="ava-concat-segment-tick" />
                <span className="ava-concat-segment-label">{file.quarter}</span>
              </div>
            );
          })}
          <span className="ava-concat-segment-tick is-end" />
        </div>
        <div className="ava-concat-match-ends">
          <span>00:00</span>
          <span>{AVA_CONCAT_TOTAL_LABEL}</span>
        </div>
      </div>

    </figure>
  );
};

export default AvaConcatGraphic;
