import { useEffect, useState } from "react";
import axios from "axios";
import BoothStaffTabBar from "@/components/BoothStaffTabBar";
import { LogOut, Pencil } from "lucide-react";

const API_URL = (import.meta.env.VITE_API_URL ?? "https://devfest-api.cloudbandung.id/").replace(/\/?$/, "/");

const BoothStaffProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [currentRole, setCurrentRole] = useState<string>("booth_staff");

  const fetchBoothStaffProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.hash = "/auth";
      return;
    }
    try {
      const res = await axios.get(`${API_URL}api/v1/booth-staff/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);

      // Load user roles from localStorage
      const storedRoles = localStorage.getItem("user_roles");
      const roles = storedRoles ? JSON.parse(storedRoles) : ["booth_staff"];
      setUserRoles(roles);
      setCurrentRole("booth_staff");
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user_roles");
        window.location.hash = "/auth";
      } else {
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Switch role handler
  const handleRoleSwitch = (newRole: string) => {
    localStorage.setItem("role", newRole);
    if (newRole === "admin") {
      window.location.hash = "/admin";
    } else if (newRole === "organizer") {
      window.location.hash = "/organizer";
    } else if (newRole === "booth_staff") {
      window.location.hash = "/booth-staff";
    } else {
      window.location.hash = "/dashboard";
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "booth_staff") {
      window.location.hash = "/dashboard";
      return;
    }
    fetchBoothStaffProfile();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f6f8fa] text-[#222]">Loading...</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#222] pb-16">
      <div className="px-6 py-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-center flex-1">My Profile</h2>
          <button
            className="ml-2 text-[#4285F4] hover:text-[#1a73e8] p-2"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              localStorage.removeItem("user_roles");
              window.location.hash = "/auth";
            }}
            title="Logout"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>

        {/* Role Switcher - Only show if user has multiple roles */}
        {userRoles.length > 1 && (
          <div className="bg-white rounded-xl shadow border border-[#e0e0e0] p-4 mb-6">
            <div className="font-bold text-sm mb-3 text-gray-700">Switch Role</div>
            <div className="flex flex-wrap gap-2">
              {userRoles.map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleSwitch(r)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    currentRole === r
                      ? "bg-[#4285F4] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {r === "participant" ? "Participant" : r === "organizer" ? "Organizer" : r === "booth_staff" ? "Booth Staff" : "Admin"}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-[#e0e0e0] flex items-center justify-center text-4xl font-bold text-primary mb-3">
            {profile.name?.charAt(0) || "?"}
          </div>
          <div className="text-2xl font-bold mb-1">{profile.name}</div>
          <div className="text-base text-[#666] mb-2">{profile.title || profile.role}</div>
          <div className="text-sm text-[#888] mb-4 text-center">{profile.bio || "No bio yet."}</div>
          <button
            className="w-full flex items-center justify-center gap-2 border border-[#e0e0e0] rounded-lg py-2 font-bold text-primary hover:bg-primary/10 transition mb-4"
            disabled
          >
            <Pencil className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>
      <BoothStaffTabBar activeTab="profile" />
    </div>
  );
};

export default BoothStaffProfile;
