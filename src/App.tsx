
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ThemeSelector from "@/components/ThemeSelector";
import LandingPage from "@/components/LandingPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [showMainApp, setShowMainApp] = useState(false);

  const handleGetStarted = () => {
    setShowMainApp(true);
  };

  const handleGoToLanding = () => {
    setShowMainApp(false);
  };

  // Show landing page initially
  if (!showMainApp) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <LandingPage onGetStarted={handleGetStarted} />
            <ThemeSelector />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  // Show main app after getting started
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ThemeSelector />
          <HashRouter> {/* ⬅️ use HashRouter */}
            <Routes>
              <Route path="/" element={<Index onGoToLanding={handleGoToLanding} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
