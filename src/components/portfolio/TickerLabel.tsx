import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { fundNameForTicker } from "@/lib/tickerNames";
import { cn } from "@/lib/utils";

interface TickerLabelProps {
  ticker: string;
  className?: string;
}

interface TooltipPosition {
  top: number;
  left: number;
}

function pointerSupportsHover(): boolean {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function tooltipPosition(trigger: HTMLElement): TooltipPosition {
  const rect = trigger.getBoundingClientRect();
  const tooltipWidth = 220;
  const tooltipHeight = 36;
  const gap = 6;
  const fitsBelow = rect.bottom + gap + tooltipHeight <= window.innerHeight;
  const top = fitsBelow ? rect.bottom + gap : Math.max(8, rect.top - tooltipHeight - gap);
  const left = Math.min(
    Math.max(8, rect.left),
    Math.max(8, window.innerWidth - tooltipWidth - 8)
  );
  return { top, left };
}

const TickerLabel = ({ ticker, className }: TickerLabelProps) => {
  const fundName = fundNameForTicker(ticker);
  const tooltipId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pinnedByTouch = useRef(false);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<TooltipPosition | null>(null);

  useEffect(() => {
    if (!visible || !triggerRef.current) {
      return;
    }

    const updatePosition = () => {
      if (!triggerRef.current) {
        return;
      }
      setPosition(tooltipPosition(triggerRef.current));
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || triggerRef.current?.contains(target)) {
        return;
      }
      pinnedByTouch.current = false;
      setVisible(false);
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      pinnedByTouch.current = false;
      setVisible(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [visible]);

  if (!fundName) {
    return <span className={cn("font-medium text-xs", className)}>{ticker}</span>;
  }

  const showFromHover = () => {
    if (pointerSupportsHover()) {
      setVisible(true);
    }
  };

  const hideFromHover = () => {
    if (pointerSupportsHover() && !pinnedByTouch.current) {
      setVisible(false);
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          "border-0 bg-transparent p-0 text-left font-medium text-xs text-inherit shadow-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm",
          className
        )}
        aria-label={`${ticker}, ${fundName}`}
        aria-describedby={visible ? tooltipId : undefined}
        onMouseEnter={showFromHover}
        onMouseLeave={hideFromHover}
        onFocus={() => setVisible(true)}
        onBlur={() => {
          if (!pinnedByTouch.current) {
            setVisible(false);
          }
        }}
        onClick={() => {
          if (pointerSupportsHover()) {
            setVisible(true);
            return;
          }
          pinnedByTouch.current = !pinnedByTouch.current;
          setVisible(pinnedByTouch.current);
        }}
      >
        {ticker}
      </button>
      {visible && position
        ? createPortal(
            <span
              id={tooltipId}
              role="tooltip"
              style={{ top: position.top, left: position.left }}
              className="pointer-events-none fixed z-50 w-max max-w-[14rem] rounded-md bg-popover px-2 py-1 text-[10px] font-normal normal-case leading-snug tracking-normal text-popover-foreground shadow-sm ring-1 ring-border"
            >
              {fundName}
            </span>,
            document.body
          )
        : null}
    </>
  );
};

export default TickerLabel;
