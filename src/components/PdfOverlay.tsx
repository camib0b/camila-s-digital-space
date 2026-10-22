import { useEffect, useRef, type MouseEvent } from "react";
import { createPortal } from "react-dom";

type PdfOverlayProps = {
  pdfUrl: string;
  title: string;
  closeLabel: string;
  downloadLabel: string;
  onClose: () => void;
};

const focusableSelector = "button:not([disabled]), a[href], iframe";

function listFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));
}

const PdfOverlay = ({ pdfUrl, title, closeLabel, downloadLabel, onClose }: PdfOverlayProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const inertBackground: Element[] = [];
    const overlay = overlayRef.current;
    for (const child of Array.from(document.body.children)) {
      if (child === overlay || child.hasAttribute("inert")) {
        continue;
      }
      child.setAttribute("inert", "");
      inertBackground.push(child);
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialog = dialogRef.current;
      if (dialog === null) {
        return;
      }

      const focusableElements = listFocusableElements(dialog);
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;
      const focusIsOutsideDialog = !(activeElement instanceof Node) || !dialog.contains(activeElement);

      if (event.shiftKey) {
        if (focusIsOutsideDialog || activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
        return;
      }

      if (focusIsOutsideDialog || activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.body.style.overflow = previousBodyOverflow;
      for (const element of inertBackground) {
        element.removeAttribute("inert");
      }
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, []);

  const closeFromBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }
    onClose();
  };

  const downloadFileName = pdfUrl.split("/").pop() ?? "document.pdf";

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-4"
      onClick={closeFromBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex h-[calc(100vh-2.5rem)] w-full max-w-5xl flex-col overflow-hidden border border-border bg-background text-foreground"
      >
        <div className="flex shrink-0 items-center gap-6 border-b border-border px-4 py-3">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="link-underline cursor-pointer border-0 bg-transparent p-0 font-medium text-foreground"
          >
            {closeLabel}
          </button>
          <a href={pdfUrl} download={downloadFileName} className="link-underline font-medium text-foreground">
            {downloadLabel}
          </a>
        </div>
        <iframe title={title} src={pdfUrl} className="min-h-0 w-full flex-1 border-0" />
      </div>
    </div>,
    document.body,
  );
};

export default PdfOverlay;
