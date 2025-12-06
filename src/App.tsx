import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AuthGoogleCallback from "./pages/AuthGoogleCallback";
import Agenda from "./pages/Agenda";
import Friends from "./pages/Friends";
import Quests from "./pages/Quests";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import OrganizerAgenda from "./pages/OrganizerAgenda";
import OrganizerParticipants from "./pages/OrganizerParticipants";
import OrganizerRewards from "./pages/OrganizerRewards";
import OrganizerQuests from "./pages/OrganizerQuests";
import BoothStaffDashboard from "./pages/BoothStaffDashboard";
import BoothStaffScan from "./pages/BoothStaffScan";
import BoothStaffContacts from "./pages/BoothStaffContacts";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSessions from "./pages/AdminSessions";
import AdminQuests from "./pages/AdminQuests";
import AdminRewards from "./pages/AdminRewards";
import OrganizerProfile from "./pages/OrganizerProfile";
import BoothStaffProfile from "./pages/BoothStaffProfile";
import OrganizerLuckyDraw from "./pages/OrganizerLuckyDraw";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <SonnerToaster />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/google/callback" element={<AuthGoogleCallback />} />
          <Route path="/dashboard" element={<Profile />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/quests" element={<Quests />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Organizer Routes */}
          <Route path="/organizer" element={<OrganizerDashboard />} />
          <Route path="/organizer/agenda" element={<OrganizerAgenda />} />
          <Route path="/organizer/participants" element={<OrganizerParticipants />} />
          <Route path="/organizer/rewards" element={<OrganizerRewards />} />
          <Route path="/organizer/quests" element={<OrganizerQuests />} />
          <Route path="/organizer/profile" element={<OrganizerProfile />} />
          <Route path="/organizer/lucky-draw" element={<OrganizerLuckyDraw />} />
          
          {/* Booth Staff Routes */}
          <Route path="/booth-staff" element={<BoothStaffDashboard />} />
          <Route path="/booth-staff/scan" element={<BoothStaffScan />} />
          <Route path="/booth-staff/contacts" element={<BoothStaffContacts />} />
          <Route path="/booth-staff/profile" element={<BoothStaffProfile />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/sessions" element={<AdminSessions />} />
          <Route path="/admin/quests" element={<AdminQuests />} />
          <Route path="/admin/rewards" element={<AdminRewards />} />
          
          {/* Catch-all route - MUST BE LAST */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
