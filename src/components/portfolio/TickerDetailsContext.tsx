import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ExposureBlock } from "@/types/portfolioAnalytics";

interface TickerDetailsContextValue {
  weightsByTicker: Readonly<Record<string, string>>;
  exposure: ExposureBlock | null;
  openTicker: string | null;
  openDetails: (ticker: string) => void;
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

  const value = useMemo<TickerDetailsContextValue>(
    () => ({
      weightsByTicker,
      exposure,
      openTicker,
      openDetails: (ticker: string) => setOpenTicker(ticker),
      closeDetails: () => setOpenTicker(null),
      setExposure,
    }),
    [weightsByTicker, exposure, openTicker],
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
