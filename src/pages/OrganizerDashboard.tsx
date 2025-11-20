import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, User, BarChart2, Users, LogOut, QrCode, Award, Gift, DoorOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrganizerTabBar from "@/components/OrganizerTabBar";
import QrScanner from "react-qr-scanner";

const API_URL = import.meta.env.VITE_API_URL;

const OrganizerDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scanMode, setScanMode] = useState<"checkin" | "checkout" | null>(null);
  const [scanResult, setScanResult] = useState("");
  const [scanError, setScanError] = useState("");
  const [scanLoading, setScanLoading] = useState(false);
  const [questScanOpen, setQuestScanOpen] = useState(false);
  const [pendingQuests, setPendingQuests] = useState<any[]>([]);
  const [questLoading, setQuestLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      window.location.href = "/auth";
      return;
    }
    if (role !== "organizer") {
      window.location.href = "/dashboard";
      return;
    }
    axios
      .get(`${API_URL}api/v1/organizers/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  // Fetch pending quests for approval
  const fetchPendingQuests = async () => {
    setQuestLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${API_URL}api/v1/organizers/quests/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingQuests(res.data ?? []);
    } catch {
      setPendingQuests([]);
    }
    setQuestLoading(false);
  };

  // Handle scan QR for check-in/out
  const handleScan = async (qr: string) => {
    if (!qr || !scanMode) return;
    setScanLoading(true);
    setScanError("");
    const token = localStorage.getItem("token");
    try {
      const endpoint =
        scanMode === "checkin"
          ? `${API_URL}api/v1/organizers/checkin`
          : `${API_URL}api/v1/organizers/checkout`;
      const res = await axios.post(
        endpoint,
        { participant_qr_code: qr },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setScanResult(res.data.message || "Success");
    } catch (err: any) {
      setScanError(
        err?.response?.data?.message ||
        err?.response?.data?.detail?.[0]?.msg ||
        "Scan failed"
      );
    }
    setScanLoading(false);
  };

  // Handle approve/reject quest
  const handleReviewQuest = async (submissionId: number, status: "approved" | "rejected") => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${API_URL}api/v1/organizers/quests/${submissionId}/review`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchPendingQuests();
    } catch {}
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f6f8fa] text-[#222]">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#222] pb-16">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#a78bfa] flex items-center justify-center text-white font-bold text-xl">R</div>
          <h1 className="text-xl font-bold text-primary">Organizer Hub</h1>
        </div>
        <button
          className="text-[#4285F4] hover:text-[#1a73e8] p-2"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/auth";
          }}
          title="Logout"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </header>
      <main className="px-6 py-6">
        <h2 className="text-2xl font-bold mb-2">Welcome, Robi</h2>
        <p className="text-[#666] mb-6">Here's your event overview.</p>
        <div className="grid gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 flex flex-col gap-2 border border-[#e0e0e0]">
            <span className="text-sm text-[#6366f1]">Checked-in</span>
            <span className="text-3xl font-bold text-primary">{stats?.checked_in ?? 0}/{stats?.event_capacity ?? "-"}</span>
          </div>
          <div className="bg-white rounded-xl p-5 flex flex-col gap-2 border border-[#e0e0e0]">
            <span className="text-sm text-[#6366f1]">Active Session</span>
            <span className="text-xl font-bold text-primary">{stats?.active_session ?? "Keynote"}</span>
          </div>
          <div className="bg-white rounded-xl p-5 flex flex-col gap-2 border border-[#e0e0e0]">
            <span className="text-sm text-[#6366f1]">Event Progress</span>
            <span className="text-xl font-bold text-primary">{stats?.current_day_label ?? "Day 1"} of {stats?.total_days ?? 1}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl p-6 flex flex-col items-center gap-2 shadow transition col-span-2"
            onClick={() => { setScanMode("checkin"); setCameraActive(false); setScanResult(""); setScanError(""); }}
          >
            <QrCode className="w-8 h-8 mb-2" />
            <span className="font-bold text-lg">Event Check-in/Check-out</span>
            <span className="text-sm">Scan tickets</span>
          </button>
          <button
            className="bg-white text-[#ef4444] rounded-xl p-6 flex flex-col items-center gap-2 shadow border border-[#e0e0e0] transition"
            onClick={() => alert("Coming soon")}
          >
            <DoorOpen className="w-8 h-8 mb-2" />
            <span className="font-bold text-lg">Session Scan</span>
            <span className="text-sm text-[#888]">Track attendance</span>
          </button>
          <button
            className="bg-white text-[#22c55e] rounded-xl p-6 flex flex-col items-center gap-2 shadow border border-[#e0e0e0] transition"
            onClick={() => alert("Coming soon")}
          >
            <Gift className="w-8 h-8 mb-2" />
            <span className="font-bold text-lg">Swag Collection</span>
            <span className="text-sm text-[#888]">Distribute merch</span>
          </button>
          <button
            className="bg-white text-[#facc15] rounded-xl p-6 flex flex-col items-center gap-2 shadow border border-[#e0e0e0] transition"
            onClick={() => { setQuestScanOpen(true); fetchPendingQuests(); }}
          >
            <Award className="w-8 h-8 mb-2" />
            <span className="font-bold text-lg">Quest Scan</span>
            <span className="text-sm text-[#888]">Verify completion</span>
          </button>
        </div>
        <div className="bg-white rounded-xl shadow border border-[#e0e0e0] p-6 flex flex-col items-center">
          <Users className="w-8 h-8 text-primary mb-2" />
          <div className="font-bold text-lg mb-1">Total Participants</div>
          <div className="text-3xl font-bold text-primary">{stats?.total_attendees ?? 0}</div>
        </div>
      </main>

      {/* Scan Check-in/out Modal with mode switch */}
      {scanMode && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-md text-center">
            <h3 className="text-xl font-bold mb-4">Event Check-in</h3>
            <div className="w-64 h-64 mx-auto mb-4 bg-[#f6f8fa] rounded-xl flex items-center justify-center border-2 border-[#2563eb] relative">
              {!cameraActive ? (
                <button
                  className="bg-[#2563eb] text-white px-4 py-2 rounded font-bold shadow hover:bg-[#1d4ed8] transition"
                  onClick={() => { setCameraActive(true); setScanResult(""); setScanError(""); }}
                >
                  Start Camera Scan
                </button>
              ) : (
                <QrScanner
                  delay={300}
                  onError={() => setScanError("Camera error")}
                  onScan={(data) => {
                    if (data && typeof data === "string") {
                      setScanResult(data);
                      setCameraActive(false);
                      // Do not auto submit, let user choose mode and submit
                    }
                  }}
                  style={{ width: "100%", height: "100%" }}
                />
              )}
            </div>
            {/* Mode Switch */}
            <div className="flex justify-center gap-2 mb-4">
              <button
                className={`px-6 py-2 rounded-full font-bold transition
                  ${scanMode === "checkin" ? "bg-[#2563eb] text-white" : "bg-[#e0e0e0] text-[#222]"}
                `}
                onClick={() => setScanMode("checkin")}
                disabled={scanLoading}
              >
                Check-in
              </button>
              <button
                className={`px-6 py-2 rounded-full font-bold transition
                  ${scanMode === "checkout" ? "bg-[#2563eb] text-white" : "bg-[#e0e0e0] text-[#222]"}
                `}
                onClick={() => setScanMode("checkout")}
                disabled={scanLoading}
              >
                Check-out
              </button>
            </div>
            <input
              type="text"
              className="w-full px-4 py-2 rounded border mb-3"
              placeholder="Paste QR code value here"
              value={scanResult}
              onChange={e => setScanResult(e.target.value)}
              disabled={scanLoading}
            />
            <div className="flex gap-4 justify-center mb-2">
              <button
                className="bg-[#2563eb] text-white px-6 py-2 rounded font-bold shadow hover:bg-[#1d4ed8] transition"
                onClick={() => handleScan(scanResult)}
                disabled={scanLoading || !scanResult}
              >
                {scanMode === "checkin" ? "Check-in" : "Check-out"}
              </button>
              <button
                className="bg-[#e0e0e0] text-[#222] px-6 py-2 rounded font-bold shadow"
                onClick={() => { setScanMode(null); setScanResult(""); setScanError(""); setCameraActive(false); }}
                disabled={scanLoading}
              >
                Cancel
              </button>
            </div>
            <div className="text-[#888] text-sm mt-2">Point your camera at a participant's QR code to scan.</div>
            {scanError && <div className="text-red-500 mt-2">{scanError}</div>}
          </div>
        </div>
      )}

      {/* Quest Scan Modal */}
      {questScanOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-lg text-[#222]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Quest Submissions</h3>
              <button
                className="text-[#6366f1] hover:text-primary"
                onClick={fetchPendingQuests}
                title="Refresh"
              >
                <svg width="28" height="28" fill="none" stroke="currentColor"><path d="M4 4v6h6M20 20v-6h-6"/><path d="M4 20a8 8 0 0 1 8-8h4"/><path d="M20 4a8 8 0 0 0-8 8h-4"/></svg>
              </button>
              <button
                className="ml-2 text-[#6366f1] hover:text-primary"
                onClick={() => setQuestScanOpen(false)}
                title="Close"
              >
                &times;
              </button>
            </div>
            {questLoading ? (
              <div className="text-center py-8 text-[#6366f1]">Loading...</div>
            ) : pendingQuests.length === 0 ? (
              <div className="text-center py-8 text-[#6366f1]">No pending submissions.</div>
            ) : (
              pendingQuests.map((submission: any) => (
                <div key={submission.id} className="bg-[#f6f8fa] rounded-xl p-6 mb-6 border border-[#e0e0e0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg text-primary">{submission.quest?.title}</span>
                    <span className="bg-[#facc15]/10 text-[#facc15] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#facc15] inline-block"></span>
                      Pending
                    </span>
                  </div>
                  <div className="text-sm text-[#6366f1] mb-2">{submission.quest?.description}</div>
                  <div className="bg-white rounded-lg p-3 flex items-center gap-4 mb-2 border border-[#e0e0e0]">
                    <User className="w-5 h-5 text-primary" />
                    <span className="text-xs">User ID: {submission.user_id}</span>
                    <span className="text-xs flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-primary" />
                      {new Date(submission.submitted_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#facc15] text-[#23272f] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Award className="w-4 h-4" /> {submission.quest?.points} points
                    </span>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button
                      className="flex-1 bg-[#ef4444] text-white py-2 rounded font-bold"
                      onClick={() => handleReviewQuest(submission.id, "rejected")}
                    >
                      Reject
                    </button>
                    <button
                      className="flex-1 bg-[#22c55e] text-white py-2 rounded font-bold"
                      onClick={() => handleReviewQuest(submission.id, "approved")}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <OrganizerTabBar activeTab="hub" />
    </div>
  );
};

export default OrganizerDashboard;
