import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import Friends from "./pages/Friends";
import Quests from "./pages/Quests";
import Profile from "./pages/Profile";
import AuthGoogleCallback from "./pages/AuthGoogleCallback";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import OrganizerAgenda from "./pages/OrganizerAgenda";
import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/agenda" element={<Agenda />} />
      <Route path="/friends" element={<Friends />} />
      <Route path="/quests" element={<Quests />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/auth/google/callback" element={<AuthGoogleCallback />} />
      <Route path="/organizer" element={<OrganizerDashboard />} />
      <Route path="/organizer/agenda" element={<OrganizerAgenda />} />
    </Routes>
  </BrowserRouter>
);
