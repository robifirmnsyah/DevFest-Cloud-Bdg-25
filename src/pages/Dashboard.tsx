import { useEffect, useState } from "react";
import axios from "axios";
import { Megaphone, Bell } from "lucide-react";
import TabBar from "@/components/TabBar";
const API_URL = import.meta.env.VITE_API_URL;

const announcements = [
  { icon: <Megaphone className="w-6 h-6 text-primary" />, text: "Check-in opens at 9:00 AM" },
  { icon: <Megaphone className="w-6 h-6 text-primary" />, text: "Lunch break from 12:30 PM to 1:30 PM" },
];

const Dashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // Progress moved to Profile page

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth";
      return;
    }
    // Fetch profile
    axios
      .get(`${API_URL}api/v1/participants/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch(() => window.location.href = "/auth")
      .finally(() => setLoading(false));

    // Progress data removed here (now shown on Profile)
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f6f8fa] text-[#222]">Loading...</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#222] flex flex-col pb-16">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-primary">Cloud DevFest Bandung</h1>
        <Bell className="w-6 h-6 text-primary" />
      </header>

      <main className="flex-1 px-6 py-2">
        <h2 className="text-2xl font-bold mb-4">Welcome, {profile.name}</h2>
        {/* Announcements */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3">Announcements</h3>
          <div className="flex flex-col gap-3">
            {announcements.map((a, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow border border-[#e0e0e0]">
                <div className="bg-primary/10 p-2 rounded-lg">{a.icon}</div>
                <span className="text-base">{a.text}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Progress removed; use Profile page to view points and quests */}
      </main>

      {/* Tab Bar */}
  <TabBar activeTab="rewards" />
    </div>
  );
};

export default Dashboard;
