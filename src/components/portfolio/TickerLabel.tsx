import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  KIND_LABEL_KEY,
  ROLE_LABEL_KEY,
  canonicalCompanyLabel,
  instrumentByTicker,
  tickerForIsin,
} from "@/lib/tickerCatalog";
import { cn } from "@/lib/utils";
import { useTickerDetails } from "@/components/portfolio/TickerDetailsContext";
import type { ExposureBlock } from "@/types/portfolioAnalytics";

interface TickerLabelProps {
  ticker?: string;
  isin?: string;
  name?: string;
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
  const tooltipWidth = 240;
  const tooltipHeight = 92;
  const gap = 6;
  const fitsBelow = rect.bottom + gap + tooltipHeight <= window.innerHeight;
  const top = fitsBelow ? rect.bottom + gap : Math.max(8, rect.top - tooltipHeight - gap);
  const left = Math.min(Math.max(8, rect.left), Math.max(8, window.innerWidth - tooltipWidth - 8));
  return { top, left };
}

function heldViaSources(isin: string | undefined, exposure: ExposureBlock | null | undefined): string[] {
  if (isin === undefined || exposure == null) {
    return [];
  }
  const row = exposure.topExposures.find((candidate) => candidate.isin === isin);
  if (row === undefined) {
    return [];
  }
  return row.contributions
    .filter((contribution) => contribution.source !== "direct" && contribution.weight > 0)
    .map((contribution) => contribution.source);
}

const TickerLabel = ({ ticker, isin, name, className }: TickerLabelProps) => {
  const { t } = useLanguage();
  const details = useTickerDetails();
  const resolvedTicker = (ticker ?? (isin ? tickerForIsin(isin) : undefined))?.toUpperCase();
  const instrument = resolvedTicker ? instrumentByTicker(resolvedTicker) : undefined;
  const label = resolvedTicker ?? (isin ? canonicalCompanyLabel(isin, name ?? isin) : (name ?? ""));
  const tooltipId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [focused, setFocused] = useState(false);
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const closeTimer = useRef<number | null>(null);
  const visible = hovered || pinned || focused;
  const identityIsin = instrument?.isin ?? isin;

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      setHovered(false);
      setFocused(false);
    }, 140);
  };

  useEffect(() => cancelClose, []);

  useEffect(() => {
    if (!visible || !triggerRef.current) {
      return;
    }
    const updatePosition = () => {
      if (triggerRef.current) {
        setPosition(tooltipPosition(triggerRef.current));
      }
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
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      setHovered(false);
      setPinned(false);
      setFocused(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [visible]);

  if (label.length === 0) {
    return null;
  }

  const line1 = instrument?.name ?? name ?? label;
  const line2 = instrument
    ? [t(KIND_LABEL_KEY[instrument.kind]), instrument.exchange, instrument.issuer].filter((part) => part.length > 0).join(" · ")
    : "";
  const heldVia = instrument ? [] : heldViaSources(identityIsin, details?.exposure);
  const line3 = instrument
    ? t(ROLE_LABEL_KEY[instrument.role])
    : heldVia.length > 0
      ? `${t("portfolio.ticker.heldVia")} ${heldVia.join(", ")}`
      : "";

  const openDetails = () => {
    if (resolvedTicker) {
      details?.openDetails(resolvedTicker);
    }
    setHovered(false);
    setPinned(false);
    setFocused(false);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          "border-0 bg-transparent p-0 text-left text-xs text-inherit no-underline shadow-none transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          className,
        )}
        aria-label={line2.length > 0 ? `${label}, ${line1}, ${line2}` : `${label}, ${line1}`}
        aria-controls={visible ? tooltipId : undefined}
        aria-haspopup={resolvedTicker ? "dialog" : undefined}
        aria-expanded={details?.openTicker === resolvedTicker}
        onMouseEnter={() => {
          cancelClose();
          setHovered(true);
        }}
        onMouseLeave={scheduleClose}
        onFocus={() => setFocused(true)}
        onBlur={scheduleClose}
        onClick={(event) => {
          if (event.detail === 0 && resolvedTicker) {
            openDetails();
            return;
          }
          if (pointerSupportsHover()) {
            setHovered(true);
            return;
          }
          setHovered(false);
          setPinned((current) => !current);
        }}
      >
        {label}
      </button>
      {visible && position
        ? createPortal(
            <div
              id={tooltipId}
              style={{ top: position.top, left: position.left }}
              className="fixed z-50 w-max max-w-[16rem] border border-border bg-background px-2 py-1.5 text-left font-mono text-[11px] font-normal normal-case leading-snug tracking-normal text-foreground shadow-none"
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            >
              <span className="block text-foreground">{line1}</span>
              {line2.length > 0 ? <span className="mt-0.5 block text-muted-foreground">{line2}</span> : null}
              {line3.length > 0 ? <span className="mt-0.5 block text-muted-foreground">{line3}</span> : null}
              {resolvedTicker ? (
                <button
                  type="button"
                  className="mt-1.5 border-0 bg-transparent p-0 text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  onClick={openDetails}
                >
                  {t("portfolio.ticker.details")}
                </button>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </>
  );
};

export function TickerAxisTick({
  x = 0,
  y = 0,
  payload,
  labelWidth = 52,
}: {
  x?: number;
  y?: number;
  payload?: { value?: string };
  labelWidth?: number;
}) {
  const value = payload?.value ?? "";
  const known = instrumentByTicker(value) !== undefined;
  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x={-labelWidth} y={-11} width={labelWidth} height={22}>
        <div xmlns="http://www.w3.org/1999/xhtml" className="flex h-full items-center justify-end overflow-hidden">
          <TickerLabel
            ticker={known ? value : undefined}
            name={known ? undefined : value}
            className="max-w-full truncate font-mono text-[10px]"
          />
        </div>
      </foreignObject>
    </g>
  );
}

export default TickerLabel;
