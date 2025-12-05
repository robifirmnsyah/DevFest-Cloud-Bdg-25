import { useEffect, useState } from "react";
import axios from "axios";
import TabBar from "@/components/TabBar";
import OrganizerTabBar from "@/components/OrganizerTabBar";
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
      window.location.href = "/auth";
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
        window.location.href = "/auth";
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
    if (role === "organizer") {
      setLoading(false);
      setProfile({
        name: "Robi Firmansyah",
        title: "Lead Organizer, GDG Bandung",
        bio: "Passionate about building communities and empowering developers with cloud technologies. Coffee enthusiast and a proud dog parent.",
      });
      const storedRoles = localStorage.getItem("user_roles");
      const roles = storedRoles ? JSON.parse(storedRoles) : ["organizer"];
      setUserRoles(roles);
      setCurrentRole("organizer");
      return;
    }
    fetchProfile();
    fetchProgress();
  }, []);

  // Switch role handler
  const handleRoleSwitch = (newRole: string) => {
    localStorage.setItem("role", newRole);
    
    // Redirect based on new role
    if (newRole === "admin") {
      window.location.href = "/admin";
    } else if (newRole === "organizer") {
      window.location.href = "/organizer";
    } else if (newRole === "booth_staff") {
      window.location.href = "/booth-staff";
    } else {
      window.location.href = "/dashboard";
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

  if (role === "organizer") {
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
                window.location.href = "/auth";
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
        <OrganizerTabBar activeTab="profile" />
      </div>
    );
  }

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
              window.location.href = "/auth";
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
          
          {/* Show email with edit option if has_duplicate_email */}
          {profile.has_duplicate_email && (
            <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
              <div className="text-sm text-yellow-800 mb-2">
                <strong>Email:</strong> {profile.email}
              </div>
              <button
                onClick={() => setShowEmailEdit(true)}
                className="text-sm text-yellow-700 hover:text-yellow-900 font-semibold underline"
              >
                Change Email (Duplicate Detected)
              </button>
            </div>
          )}
          
          <div className="text-sm text-[#888] mb-4 text-center">{profile.bio || "No bio yet."}</div>
          <button
            className="w-full flex items-center justify-center gap-2 border border-[#e0e0e0] rounded-lg py-2 font-bold text-primary hover:bg-primary/10 transition mb-4"
            onClick={handleEditClick}
          >
            <Pencil className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
        {/* QR code display only, no generate button */}
        <div className="bg-white rounded-xl shadow border border-[#e0e0e0] p-6 mb-6">
          <div className="font-bold text-lg mb-2 text-center">My QR Code</div>
          <div className="text-sm text-[#888] mb-4 text-center">
            Show this to booth staff and organizers to connect and participate in activities.
          </div>
          <div className="flex justify-center mb-2">
            {qrCodeImageUrl ? (
              <img
                src={qrCodeImageUrl}
                alt="QR Code"
                className="w-40 h-40 bg-[#f6f8fa] rounded-lg border cursor-pointer"
                onClick={() => setQrOpen(true)}
                onError={(e) => {
                  console.error("QR image load error");
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Crect fill='%23e0e0e0' width='160' height='160'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23888' font-size='14'%3ENo QR Code%3C/text%3E%3C/svg%3E";
                }}
              />
            ) : (
              <div className="w-40 h-40 bg-[#f6f8fa] rounded-lg border flex items-center justify-center">
                <span className="text-[#888] text-sm">No QR Code</span>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4">
            <button
              className="text-center text-primary text-sm cursor-pointer flex items-center gap-2"
              onClick={() => {
                if (qrCodeImageUrl) {
                  setQrOpen(true);
                } else {
                  console.warn("No QR code available");
                }
              }}
              disabled={!qrCodeImageUrl}
            >
              {qrCodeImageUrl ? "Tap to Enlarge" : "QR Not Available"}
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow border border-[#e0e0e0] p-6 mb-6">
          <div className="font-bold text-lg mb-4">Your Progress</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex-1 border border-[#e0e0e0] bg-white rounded-xl p-5 flex flex-col items-start shadow">
              <span className="text-sm mb-1">Points</span>
              <span className="text-2xl font-bold text-primary">{profile.points ?? 0}</span>
            </div>
            <div className="flex-1 border border-[#e0e0e0] bg-white rounded-xl p-5 flex flex-col items-start shadow">
              <span className="text-sm mb-1">Quests Completed</span>
              <span className="text-2xl font-bold text-primary">{questsCompleted}/{totalQuests}</span>
            </div>
          </div>
          <a href="/rewards" className="block mt-4">
            <button className="w-full bg-gradient-to-r from-[#4285F4] to-[#34A853] hover:from-[#1a73e8] hover:to-[#2d8a47] text-white rounded-xl py-3 px-6 font-bold text-base shadow-lg hover:shadow-xl transition-all">View Rewards</button>
          </a>
        </div>
      </div>
      {/* QR Popup */}
      {qrOpen && qrCodeImageUrl && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center">
            <img
              src={qrCodeImageUrl}
              alt="QR Code"
              className="w-64 h-64 bg-[#f6f8fa] rounded-lg border"
              onError={(e) => {
                console.error("QR popup image load error");
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Crect fill='%23e0e0e0' width='256' height='256'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23888' font-size='16'%3ENo QR Code%3C/text%3E%3C/svg%3E";
              }}
            />
            <button
              className="mt-6 px-6 py-2 rounded-full bg-primary text-white font-bold"
              onClick={() => setQrOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Edit Profile Popup */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center max-w-xs w-full">
            <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
            <input
              className="w-full mb-3 px-4 py-2 border rounded text-base"
              placeholder="Name"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              disabled={editLoading}
            />
            <input
              className="w-full mb-3 px-4 py-2 border rounded text-base"
              placeholder="Title"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              disabled={editLoading}
            />
            <textarea
              className="w-full mb-3 px-4 py-2 border rounded text-base"
              placeholder="Bio"
              rows={3}
              value={editBio}
              onChange={e => setEditBio(e.target.value)}
              disabled={editLoading}
            />
            <div className="flex gap-4 mt-2 w-full">
              <button
                className="flex-1 px-4 py-2 rounded bg-[#e0e0e0] text-[#222] font-bold"
                onClick={() => setEditOpen(false)}
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 rounded bg-primary text-white font-bold"
                onClick={handleEditSave}
                disabled={editLoading || !editName}
              >
                {editLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Email Edit Modal */}
      {showEmailEdit && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center max-w-xs w-full">
            <h3 className="text-xl font-bold mb-4">Change Email</h3>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Enter your new email address to resolve duplicate account issue
            </p>
            <input
              className="w-full mb-3 px-4 py-2 border rounded text-base"
              placeholder="New Email"
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              disabled={emailEditLoading}
            />
            <div className="flex gap-4 mt-2 w-full">
              <button
                className="flex-1 px-4 py-2 rounded bg-[#e0e0e0] text-[#222] font-bold"
                onClick={() => { setShowEmailEdit(false); setNewEmail(""); }}
                disabled={emailEditLoading}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 rounded bg-primary text-white font-bold"
                onClick={handleEmailChange}
                disabled={emailEditLoading || !newEmail}
              >
                {emailEditLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
      {role === "organizer"
        ? <OrganizerTabBar activeTab="profile" />
        : <TabBar activeTab="profile" />
      }
    </div>
  );
};

export default Profile;
