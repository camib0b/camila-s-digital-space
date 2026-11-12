import { lazy, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/components/Footer";

const Home = lazy(() => import("./pages/Home"));
const CV = lazy(() => import("./pages/CV"));
const Ava = lazy(() => import("./pages/Ava"));
const Capital = lazy(() => import("./pages/Capital"));
const Concat = lazy(() => import("./pages/Concat"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function RouteFallback() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-background" aria-busy="true">
      <div
        className="portfolio-sync-track fixed inset-x-0 top-0 z-50 h-px overflow-hidden bg-border"
        aria-hidden="true"
      >
        <div className="portfolio-sync-bar h-full w-1/3 bg-foreground/70" />
      </div>
      <p className="sr-only" role="status">
        {t("route.loading")}
      </p>
    </main>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <LanguageProvider>
          <TooltipProvider>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cv" element={<CV />} />
                <Route path="/cv/growth" element={<CV />} />
                <Route path="/cv/hockey" element={<CV />} />
                <Route path="/ava" element={<Ava />} />
                <Route path="/ava/" element={<Ava />} />
                <Route path="/capital" element={<Capital />} />
                <Route path="/concat" element={<Concat />} />
                <Route path="/concat/" element={<Concat />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Footer />
          </TooltipProvider>
        </LanguageProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
