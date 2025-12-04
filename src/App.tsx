import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
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
import OrganizerParticipants from "./pages/OrganizerParticipants";
import BoothStaffDashboard from "./pages/BoothStaffDashboard";
import BoothStaffScan from "./pages/BoothStaffScan";
import BoothStaffContacts from "./pages/BoothStaffContacts";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSessions from "./pages/AdminSessions";
import AdminQuests from "./pages/AdminQuests";
import AdminRewards from "./pages/AdminRewards";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <SonnerToaster />
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
          <Route path="/organizer/participants" element={<OrganizerParticipants />} />
          
          {/* Booth Staff Routes */}
          <Route path="/booth-staff" element={<BoothStaffDashboard />} />
          <Route path="/booth-staff/scan" element={<BoothStaffScan />} />
          <Route path="/booth-staff/contacts" element={<BoothStaffContacts />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/sessions" element={<AdminSessions />} />
          <Route path="/admin/quests" element={<AdminQuests />} />
          <Route path="/admin/rewards" element={<AdminRewards />} />
          
          {/* Catch-all route - MUST BE LAST */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
