import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AuthGoogleCallback from "./pages/AuthGoogleCallback";
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import Friends from "./pages/Friends";
import Quests from "./pages/Quests";
import Profile from "./pages/Profile";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import OrganizerAgenda from "./pages/OrganizerAgenda";
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/google/callback" element={<AuthGoogleCallback />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/quests" element={<Quests />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Organizer Routes */}
          <Route path="/organizer" element={<OrganizerDashboard />} />
          <Route path="/organizer/agenda" element={<OrganizerAgenda />} />
          
          {/* Booth Staff Routes */}
          <Route path="/booth-staff" element={<BoothStaffDashboard />} />
          <Route path="/booth-staff/scan" element={<BoothStaffScan />} />
          <Route path="/booth-staff/contacts" element={<BoothStaffContacts />} />
          
          {/* Catch-all route - MUST BE LAST */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
