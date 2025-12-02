import { useEffect, useState } from "react";
import axios from "axios";
import { LogOut, Users, Building2, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BoothStaffTabBar from "@/components/BoothStaffTabBar";

const API_URL = import.meta.env.VITE_API_URL;

const BoothStaffDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [booth, setBooth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token) {
      window.location.href = "/auth";
      return;
    }
    
    if (role !== "booth_staff") {
      window.location.href = "/dashboard";
      return;
    }

    // Fetch booth info and stats
    Promise.all([
      axios.get(`${API_URL}api/v1/booth-staff/booth`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${API_URL}api/v1/booth-staff/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ])
      .then(([boothRes, statsRes]) => {
        setBooth(boothRes.data);
        setStats(statsRes.data);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-[#222]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
            B
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Booth Staff Hub</h1>
        </div>
        <button
          className="text-gray-400 hover:text-red-500 p-2 transition-colors"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user_roles");
            window.location.href = "/auth";
          }}
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="px-8 py-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Welcome to {booth?.name || "Your Booth"}!
          </h2>
          <p className="text-gray-500 text-sm">Manage your booth contacts and interactions.</p>
        </div>

        {/* Booth Info Card */}
        {booth && (
          <div className="bg-white rounded-xl p-6 border border-gray-100 mb-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-50 p-3 rounded-full">
                <Building2 className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{booth.name}</h3>
                {booth.description && (
                  <p className="text-sm text-gray-500">{booth.description}</p>
                )}
              </div>
            </div>
            {booth.location && (
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Location:</span> {booth.location}
              </p>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-500">Total Contacts</span>
            </div>
            <div className="text-3xl font-bold text-green-500">
              {stats?.total_contacts ?? 0}
            </div>
            <div className="text-xs text-gray-400 mt-1">Captured leads</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-blue-500">Today's Scans</span>
            </div>
            <div className="text-3xl font-bold text-blue-500">
              {stats?.scans_today ?? 0}
            </div>
            <div className="text-xs text-gray-400 mt-1">QR scans today</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/booth-staff/scan")}
            className="bg-green-500 hover:bg-green-600 text-white rounded-xl p-6 flex items-center justify-center gap-3 shadow-sm transition-all hover:scale-105"
          >
            <div className="bg-white/20 p-3 rounded-full">
              <QrCode className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-bold text-lg">Scan QR Code</div>
              <div className="text-sm opacity-90">Capture new leads</div>
            </div>
          </button>

          <button
            onClick={() => navigate("/booth-staff/contacts")}
            className="bg-white hover:bg-gray-50 rounded-xl p-6 flex items-center justify-center gap-3 shadow-sm border border-gray-100 transition-all hover:scale-105"
          >
            <div className="bg-blue-50 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-left">
              <div className="font-bold text-lg text-blue-500">View Contacts</div>
              <div className="text-sm text-gray-400">Manage your leads</div>
            </div>
          </button>
        </div>
      </main>

      <BoothStaffTabBar activeTab="hub" />
    </div>
  );
};

export default BoothStaffDashboard;
