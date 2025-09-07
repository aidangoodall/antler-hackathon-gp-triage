import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DemoPatient from "./pages/DemoPatient";
import DemoFull from "./pages/DemoFull";
import DemoTriage from "./pages/DemoTriage";
import DemoWellbeing from "./pages/DemoWellbeing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/demo-patient" element={<DemoPatient />} />
          <Route path="/demo-triage" element={<DemoTriage />} />
          <Route path="/demo-wellbeing" element={<DemoWellbeing />} />
          <Route path="/demo-full" element={<DemoFull />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
