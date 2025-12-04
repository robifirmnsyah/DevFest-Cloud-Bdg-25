import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Award, Gift } from "lucide-react";
import AdminTabBar from "@/components/AdminTabBar";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token) {
      window.location.href = "/auth";
      return;
    }
    
    if (role !== "admin") {
      window.location.href = "/dashboard";
      return;
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-500 text-center">Admin Dashboard</h1>
      </header>

      <main className="px-6 py-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome, Admin</h2>
          <p className="text-gray-500 text-sm">Manage event content and settings</p>
        </div>

        {/* Admin Action Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/admin/sessions")}
            className="bg-white hover:bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm border border-gray-100 transition-all aspect-square"
          >
            <div className="bg-blue-50 p-3 rounded-full">
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-center">
              <div className="font-bold text-base text-gray-900 mb-1">Sessions</div>
              <div className="text-xs text-gray-500">Manage agenda</div>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/quests")}
            className="bg-white hover:bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm border border-gray-100 transition-all aspect-square"
          >
            <div className="bg-yellow-50 p-3 rounded-full">
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="text-center">
              <div className="font-bold text-base text-gray-900 mb-1">Quests</div>
              <div className="text-xs text-gray-500">Manage challenges</div>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/rewards")}
            className="bg-white hover:bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center gap-3 shadow-sm border border-gray-100 transition-all aspect-square"
          >
            <div className="bg-green-50 p-3 rounded-full">
              <Gift className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-center">
              <div className="font-bold text-base text-gray-900 mb-1">Rewards</div>
              <div className="text-xs text-gray-500">Manage prizes</div>
            </div>
          </button>
        </div>
      </main>

      <AdminTabBar activeTab="hub" />
    </div>
  );
};

export default AdminDashboard;
