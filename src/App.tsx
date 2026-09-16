import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Home from "./pages/Home";
import CV from "./pages/CV";
import Ava from "./pages/Ava";
import Capital from "./pages/Capital";
import NotFound from "./pages/NotFound";
import Tomorrow from "./pages/Tomorrow";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <BrowserRouter>
        <LanguageProvider>
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cv" element={<CV />} />
              <Route path="/ava" element={<Ava />} />
              <Route path="/ava/" element={<Ava />} />
              <Route path="/capital" element={<Capital />} />
              <Route path="/tomorrow" element={<Tomorrow />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </LanguageProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
