import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BoothStaffDashboard from "./pages/BoothStaffDashboard";
import BoothStaffScan from "./pages/BoothStaffScan";
import BoothStaffContacts from "./pages/BoothStaffContacts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />

          {/* Booth Staff Routes */}
          <Route path="/booth-staff" element={<BoothStaffDashboard />} />
          <Route path="/booth-staff/scan" element={<BoothStaffScan />} />
          <Route path="/booth-staff/contacts" element={<BoothStaffContacts />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
