import { useEffect, useState } from "react";
import axios from "axios";
import TabBar from "@/components/TabBar";
import { LogOut, Pencil } from "lucide-react";
const API_URL = (import.meta.env.VITE_API_URL ?? "https://devfest-api.cloudbandung.id/").replace(/\/?$/, "/");

const role = localStorage.getItem("role");

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [questsCompleted, setQuestsCompleted] = useState<number>(0);
  const [totalQuests, setTotalQuests] = useState<number>(0);
  const [qrOpen, setQrOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [currentRole, setCurrentRole] = useState<string>("");
  const [showEmailEdit, setShowEmailEdit] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailEditLoading, setEmailEditLoading] = useState(false);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.hash = "/auth";
      return;
    }
    try {
      const res = await axios.get(`${API_URL}api/v1/participants/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      
      // Load user roles from localStorage or API response
      const storedRoles = localStorage.getItem("user_roles");
      const roles = storedRoles ? JSON.parse(storedRoles) : (res.data?.roles || ["participant"]);
      setUserRoles(roles);
      setCurrentRole(localStorage.getItem("role") || "participant");
    } catch (err: any) {
      // Show error and logout if unauthorized
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

  // Fetch quests and submissions for progress
  const fetchProgress = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const [questsRes, submissionsRes] = await Promise.all([
        axios.get(`${API_URL}api/v1/participants/quests`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}api/v1/participants/quests/my-submissions`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setTotalQuests(Array.isArray(questsRes.data) ? questsRes.data.length : 0);
      const completed = Array.isArray(submissionsRes.data)
        ? submissionsRes.data.filter((q: any) => q.status === "approved").length
        : 0;
      setQuestsCompleted(completed);
    } catch {
      setTotalQuests(0);
      setQuestsCompleted(0);
    }
  };

  useEffect(() => {
    // Default: participant profile + progress
    fetchProfile();
    fetchProgress();
  }, []);

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

  // Open edit popup and fill current profile
  const handleEditClick = () => {
    setEditName(profile.name || "");
    setEditTitle(profile.title || "");
    setEditBio(profile.bio || "");
    setEditOpen(true);
  };

  // Save profile changes (demo: only update UI, not API)
  const handleEditSave = async () => {
    setEditLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${API_URL}api/v1/participants/profile`,
        {
          name: editName,
          title: editTitle,
          bio: editBio,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      await fetchProfile();
      setEditOpen(false);
    } catch {}
    setEditLoading(false);
  };

  // Handle email change
  const handleEmailChange = async () => {
    if (!newEmail || newEmail === profile.email) {
      alert("Please enter a different email");
      return;
    }
    
    setEmailEditLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${API_URL}api/v1/participants/email`,
        { new_email: newEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      await fetchProfile();
      setShowEmailEdit(false);
      setNewEmail("");
      alert("Email updated successfully!");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update email");
    }
    setEmailEditLoading(false);
  };

  // Generate QR code image URL from qr_code string
  const getQrCodeImageUrl = (qrCode: string) => {
    if (!qrCode) return null;
    // Use public QR code API - you can also use other services
    return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrCode)}`;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f6f8fa] text-[#222]">Loading...</div>;
  if (!profile) return null;

  const qrCodeImageUrl = profile.qr_code_image_url || getQrCodeImageUrl(profile.qr_code);

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
          <div className="w-24 h-24 rounded-full bg-[#e0e0e0] flex items-center justify-center text-4xl font-bold text-primary mb-3 border-4 border-[#4285F4]">
            {profile.name?.charAt(0) || "?"}
          </div>
          <div className="text-2xl font-bold mb-1">{profile.name}</div>
          <div className="text-base text-[#4285F4] mb-2">{profile.title}</div>
          <div className="text-sm text-[#888] mb-4 text-center">{profile.bio}</div>
          <button
            className="w-full flex items-center justify-center gap-2 border border-[#4285F4] rounded-lg py-2 font-bold text-[#4285F4] hover:bg-[#4285F4]/10 transition mb-4"
            disabled
          >
            <Pencil className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>
      {/* Bottom tab bar - participant only */}
      <TabBar activeTab="profile" />
    </div>
  );
};

export default Profile;
