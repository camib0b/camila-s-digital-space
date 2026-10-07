import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { ExposureBlock } from "@/types/portfolioAnalytics";

interface TickerDetailsContextValue {
  weightsByTicker: Readonly<Record<string, string>>;
  exposure: ExposureBlock | null;
  openTicker: string | null;
  openDetails: (ticker: string, returnFocus?: HTMLElement | null) => void;
  closeDetails: () => void;
  setExposure: (exposure: ExposureBlock | null) => void;
}

const TickerDetailsContext = createContext<TickerDetailsContextValue | null>(null);

export function TickerDetailsProvider({
  weightsByTicker,
  children,
}: {
  weightsByTicker: Readonly<Record<string, string>>;
  children: ReactNode;
}) {
  const [exposure, setExposure] = useState<ExposureBlock | null>(null);
  const [openTicker, setOpenTicker] = useState<string | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const openDetails = useCallback((ticker: string, returnFocus?: HTMLElement | null) => {
    if (returnFocusRef.current === null && returnFocus) {
      returnFocusRef.current = returnFocus;
    }
    setOpenTicker(ticker);
  }, []);

  const closeDetails = useCallback(() => {
    setOpenTicker(null);
    const returnFocus = returnFocusRef.current;
    returnFocusRef.current = null;
    window.requestAnimationFrame(() => {
      returnFocus?.focus();
    });
  }, []);

  const value = useMemo<TickerDetailsContextValue>(
    () => ({
      weightsByTicker,
      exposure,
      openTicker,
      openDetails,
      closeDetails,
      setExposure,
    }),
    [weightsByTicker, exposure, openTicker, openDetails, closeDetails],
  );

  return <TickerDetailsContext.Provider value={value}>{children}</TickerDetailsContext.Provider>;
}

export function useTickerDetails(): TickerDetailsContextValue | null {
  return useContext(TickerDetailsContext);
}

export function useRegisterExposure(exposure: ExposureBlock | null) {
  const context = useContext(TickerDetailsContext);
  useEffect(() => {
    context?.setExposure(exposure);
  }, [context, exposure]);
}
