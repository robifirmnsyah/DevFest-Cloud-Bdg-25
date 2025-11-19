import { useEffect, useState } from "react";
import TabBar from "@/components/TabBar";
import axios from "axios";
import { LogOut, Pencil, RefreshCw } from "lucide-react";
const API_URL = (import.meta.env.VITE_API_URL ?? "https://devfest-api.cloudbandung.id/").replace(/\/?$/, "/");

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editLoading, setEditLoading] = useState(false);

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
    } catch {
      window.location.href = "/auth";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Generate new QR code
  const handleGenerateQr = async () => {
    setQrLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.get(
        `${API_URL}api/v1/participants/qr-code`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      await fetchProfile();
    } catch {}
    setQrLoading(false);
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
              window.location.href = "/auth";
            }}
            title="Logout"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-[#e0e0e0] flex items-center justify-center text-4xl font-bold text-primary mb-3">
            {profile.name?.charAt(0) || "?"}
          </div>
          <div className="text-2xl font-bold mb-1">{profile.name}</div>
          <div className="text-base text-[#666] mb-2">{profile.title || profile.role}</div>
          <div className="text-sm text-[#888] mb-4 text-center">{profile.bio || "No bio yet."}</div>
          <button
            className="w-full flex items-center justify-center gap-2 border border-[#e0e0e0] rounded-lg py-2 font-bold text-primary hover:bg-primary/10 transition mb-4"
            onClick={handleEditClick}
          >
            <Pencil className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
        <div className="bg-white rounded-xl shadow border border-[#e0e0e0] p-6 mb-6">
          <div className="font-bold text-lg mb-2 text-center">My QR Code</div>
          <div className="text-sm text-[#888] mb-4 text-center">
            Show this to booth staff and organizers to connect and participate in activities.
          </div>
          <div className="flex justify-center mb-2">
            <img
              src={profile.qr_code_image_url && profile.qr_code_image_url !== "" ? profile.qr_code_image_url : "/qr-placeholder.png"}
              alt="QR Code"
              className="w-40 h-40 bg-[#f6f8fa] rounded-lg border cursor-pointer"
              onClick={() => setQrOpen(true)}
            />
          </div>
          <div className="flex justify-center gap-4">
            <button
              className="text-center text-primary text-sm cursor-pointer flex items-center gap-2"
              onClick={() => setQrOpen(true)}
            >
              Tap to Enlarge
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow border border-[#e0e0e0] p-6 mb-6 text-center">
          <div className="font-bold text-lg mb-2">My Points</div>
          <div className="text-3xl font-bold text-primary">{profile.points ?? 0}</div>
        </div>
      </div>
      {/* QR Popup */}
      {qrOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center">
            <img
              src={profile.qr_code_image_url && profile.qr_code_image_url !== "" ? profile.qr_code_image_url : "/qr-placeholder.png"}
              alt="QR Code"
              className="w-64 h-64 bg-[#f6f8fa] rounded-lg border"
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
      <TabBar activeTab="profile" />
    </div>
  );
};

export default Profile;
