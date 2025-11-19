import { useEffect, useState } from "react";
import axios from "axios";
import { User, QrCode, Camera } from "lucide-react";
import TabBar from "@/components/TabBar";
import QrScanner from "react-qr-scanner";

const API_URL = import.meta.env.VITE_API_URL;

const Friends = () => {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [scanError, setScanError] = useState("");
  const [scanResult, setScanResult] = useState("");
  const [friends, setFriends] = useState<any[]>([]);
  const [scanOpen, setScanOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth";
      return;
    }
    axios
      .get(`${API_URL}api/v1/participants/networking/friends`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFriends(res.data))
      .catch(() => setFriends([]));
  }, []);

  const handleScan = async (data: string | null) => {
    if (data) {
      setScanResult(data);
      setScanError("");
      setScanOpen(false);
      setCameraOpen(false);
      const token = localStorage.getItem("token");
      try {
        await axios.post(`${API_URL}api/v1/participants/networking/friends`, {
          receiver_qr_code: data,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Refresh friends list
        const res = await axios.get(`${API_URL}api/v1/participants/networking/friends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(res.data);
      } catch (err: any) {
        setScanError("Failed to add friend. Invalid QR or already added.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#222] pb-16">
      <div className="px-6 py-6">
        <h2 className="text-2xl font-bold mb-4">My Friends</h2>
        <div className="mb-4 flex justify-end gap-2">
          <button
            className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full font-bold shadow hover:bg-[#1a73e8] transition-all"
            onClick={() => setScanOpen(true)}
          >
            <QrCode className="w-5 h-5" />
            Scan QR (Manual)
          </button>
          <button
            className="flex items-center gap-2 bg-[#4285F4]/10 text-primary px-5 py-2 rounded-full font-bold shadow hover:bg-primary/10 transition-all"
            onClick={() => setCameraOpen(true)}
          >
            <Camera className="w-5 h-5" />
            Scan QR (Camera)
          </button>
        </div>
        {/* Manual QR Scan Popup */}
        {scanOpen && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 shadow-lg max-w-sm w-full text-center">
              <h3 className="font-bold text-lg mb-4">Scan Friend's QR Code</h3>
              <input
                type="text"
                placeholder="Paste QR code value here"
                className="border rounded px-4 py-3 w-full mb-5 text-lg text-[#888] bg-[#f6f8fa]"
                onChange={(e) => setScanResult(e.target.value)}
                style={{ fontWeight: 500 }}
              />
              <button
                className="bg-[#4285F4] text-white px-6 py-2 rounded font-bold text-lg shadow hover:bg-[#1a73e8] transition-all"
                onClick={() => handleScan(scanResult)}
              >
                Add Friend
              </button>
              <button
                className="ml-4 text-[#888] underline text-lg"
                onClick={() => { setScanOpen(false); setScanError(""); setScanResult(""); }}
              >
                Cancel
              </button>
              {scanError && <div className="text-red-500 mt-4">{scanError}</div>}
            </div>
          </div>
        )}
        {/* Camera QR Scan Popup (realtime) */}
        {cameraOpen && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 shadow-lg max-w-sm w-full text-center">
              <h3 className="font-bold text-lg mb-4">Scan QR via Camera</h3>
              <QrScanner
                delay={300}
                onError={() => setScanError("Camera error")}
                onScan={handleScan}
                style={{ width: "100%" }}
              />
              <button
                className="mt-4 text-[#888] underline text-lg"
                onClick={() => { setCameraOpen(false); setScanError(""); }}
              >
                Cancel
              </button>
              {scanError && <div className="text-red-500 mt-4">{scanError}</div>}
            </div>
          </div>
        )}
        <div className="grid gap-4 mt-6">
          {friends.length === 0 && (
            <div className="text-[#888] text-center">No friends yet.</div>
          )}
          {friends.map((friend: any) => (
            <div key={friend.friend_id} className="bg-white rounded-xl shadow border border-[#e0e0e0] p-4 flex items-center gap-4">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div>
                <div className="font-bold text-lg">{friend.user_profile?.name}</div>
                <div className="text-sm text-[#888]">{friend.user_profile?.title || ""}</div>
                <div className="text-xs text-[#888]">{friend.user_profile?.company || ""}</div>
              </div>
              <div className="ml-auto text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-bold">
                {friend.status}
              </div>
            </div>
          ))}
        </div>
      </div>
      <TabBar activeTab="friends" />
    </div>
  );
};

export default Friends;
