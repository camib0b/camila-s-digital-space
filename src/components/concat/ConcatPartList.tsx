import { useState } from "react";
import { moveItem } from "@/components/ava/concatReorder";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  fillTemplate,
  formatByteCount,
  formatDuration,
  formatPartIndex,
  splitFileName,
  sumKnownBytes,
  sumKnownDuration,
} from "@/lib/concat/format";
import type { ConcatPartView } from "@/lib/concat/types";

type ConcatPartListProps = {
  parts: readonly ConcatPartView[];
  disabled: boolean;
  onMove: (fromIndex: number, toIndex: number) => void;
  onRemove: (id: string) => void;
};

const rowButtonClassName =
  "shrink-0 border border-border px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40";

const ConcatPartList = ({ parts, disabled, onMove, onRemove }: ConcatPartListProps) => {
  const { language, t } = useLanguage();
  const [announcement, setAnnouncement] = useState("");
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const totalBytes = sumKnownBytes(parts);
  const totalDuration = sumKnownDuration(parts);
  const countLabel = fillTemplate(parts.length === 1 ? t("concat.parts.one") : t("concat.parts.other"), {
    count: new Intl.NumberFormat(language).format(parts.length),
  });

  const movePart = (fromIndex: number, toIndex: number) => {
    if (disabled || fromIndex === toIndex || toIndex < 0 || toIndex >= parts.length) {
      return;
    }
    const moving = parts[fromIndex];
    if (!moving) {
      return;
    }
    const next = moveItem(parts, fromIndex, toIndex);
    const position = next.findIndex((part) => part.id === moving.id) + 1;
    setAnnouncement(
      fillTemplate(t("concat.part.moved"), {
        name: moving.name.trim() || t("concat.part.untitled"),
        position,
        total: parts.length,
      }),
    );
    onMove(fromIndex, toIndex);
  };

  return (
    <section aria-labelledby="concat-parts-heading">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="concat-parts-heading" className="text-sm font-medium uppercase tracking-wider text-foreground">
          {t("concat.parts.label")}
        </h2>
        <p className="font-mono text-xs tabular-nums text-muted-foreground">{countLabel}</p>
      </div>
      <p className="mb-3 font-mono text-xs tabular-nums text-muted-foreground">
        <span className="uppercase tracking-[0.14em]">{t("concat.total")}</span>{" "}
        <span title={totalBytes === null ? t("concat.part.sizeUnknown") : formatByteCount(totalBytes, language)}>
          {totalBytes === null ? "—" : formatByteCount(totalBytes, language)}
        </span>
        <span aria-hidden="true"> · </span>
        <span title={totalDuration === null ? t("concat.part.durationUnknown") : formatDuration(totalDuration)}>
          {totalDuration === null ? "—" : formatDuration(totalDuration)}
        </span>
      </p>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      {parts.length === 0 ? (
        <p className="border-y border-border py-6 text-sm text-muted-foreground">{t("concat.parts.empty")}</p>
      ) : (
        <ul className="max-h-[min(32rem,70vh)] overflow-auto border-y border-border" aria-label={t("concat.parts.label")}>
          {parts.map((part, index) => {
            const fileName = splitFileName(part.name);
            const sizeLabel = part.sizeBytes === null ? "—" : formatByteCount(part.sizeBytes, language);
            const durationLabel = part.durationSeconds === null ? "—" : formatDuration(part.durationSeconds);
            const positionLabel = fillTemplate(t("concat.part.position"), {
              name: part.name.trim() || t("concat.part.untitled"),
              position: index + 1,
              total: parts.length,
            });
            return (
              <li
                key={part.id}
                className="border-b border-border py-3 last:border-b-0"
                aria-label={positionLabel}
                onDragOver={(event) => {
                  if (disabled || draggingIndex === null) {
                    return;
                  }
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const fromIndex = Number(event.dataTransfer.getData("text/plain"));
                  if (Number.isInteger(fromIndex)) {
                    movePart(fromIndex, index);
                  }
                  setDraggingIndex(null);
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="w-10 shrink-0 pt-0.5 font-mono text-xs tabular-nums text-muted-foreground">
                    {formatPartIndex(index)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="flex min-w-0 items-baseline leading-5" dir="auto" title={fileName.title}>
                      <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-foreground">
                        {fileName.stem}
                      </span>
                      {fileName.extension ? (
                        <span className="shrink-0 text-sm text-foreground">{fileName.extension}</span>
                      ) : null}
                    </span>
                    {part.state === "reading" ? (
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{t("concat.part.reading")}</p>
                    ) : null}
                    {part.state === "unreadable" ? (
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{t("concat.part.unreadable")}</p>
                    ) : null}
                    <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs leading-5 tabular-nums text-muted-foreground">
                      <span
                        className="shrink-0 whitespace-nowrap"
                        title={part.sizeBytes === null ? t("concat.part.sizeUnknown") : sizeLabel}
                      >
                        {sizeLabel}
                      </span>
                      <span
                        className="shrink-0 whitespace-nowrap"
                        title={part.durationSeconds === null ? t("concat.part.durationUnknown") : durationLabel}
                      >
                        {durationLabel}
                      </span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span
                        draggable={!disabled}
                        aria-hidden="true"
                        className="flex shrink-0 cursor-grab items-center px-1 font-mono text-xs text-muted-foreground"
                        onDragStart={(event) => {
                          event.dataTransfer.effectAllowed = "move";
                          event.dataTransfer.setData("text/plain", String(index));
                          setDraggingIndex(index);
                        }}
                        onDragEnd={() => setDraggingIndex(null)}
                      >
                        ::
                      </span>
                      <button
                        type="button"
                        className={rowButtonClassName}
                        disabled={disabled || index === 0}
                        onClick={() => movePart(index, index - 1)}
                      >
                        {t("concat.moveUp")}
                      </button>
                      <button
                        type="button"
                        className={rowButtonClassName}
                        disabled={disabled || index === parts.length - 1}
                        onClick={() => movePart(index, index + 1)}
                      >
                        {t("concat.moveDown")}
                      </button>
                      <button
                        type="button"
                        className={rowButtonClassName}
                        disabled={disabled}
                        onClick={() => onRemove(part.id)}
                      >
                        {t("concat.remove")}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default ConcatPartList;
