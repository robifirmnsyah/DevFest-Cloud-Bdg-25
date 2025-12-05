import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, User, BarChart2, Users, LogOut, QrCode, Award, Gift, DoorOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrganizerTabBar from "@/components/OrganizerTabBar";
import QrScanner from "@/components/QrScanner";

const API_URL = import.meta.env.VITE_API_URL;

const OrganizerDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scanMode, setScanMode] = useState<"checkin" | "checkout" | null>(null);
  const [scanResult, setScanResult] = useState("");
  const [scanError, setScanError] = useState("");
  const [scanLoading, setScanLoading] = useState(false);
  // Quest review moved to its own page
  const [cameraActive, setCameraActive] = useState(false);
  const [printData, setPrintData] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [rewardScanOpen, setRewardScanOpen] = useState(false);
  const [rewardLoading, setRewardLoading] = useState(false);
  const [rewardResult, setRewardResult] = useState("");
  const [rewardError, setRewardError] = useState("");
  const [scannedQrForReward, setScannedQrForReward] = useState<string>("");
  const [availableRewards, setAvailableRewards] = useState<any[]>([]);
  const [selectedRewardId, setSelectedRewardId] = useState<number | null>(null);
  const [rewardQty, setRewardQty] = useState(1);
  const [rewardNotes, setRewardNotes] = useState("");
  const [showRewardForm, setShowRewardForm] = useState(false);
  // Already checked-in modal
  const [showAlreadyCheckedInModal, setShowAlreadyCheckedInModal] = useState(false);
  const [alreadyCheckedInData, setAlreadyCheckedInData] = useState<{ name?: string; title?: string; company?: string; message?: string } | null>(null);
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

  // Quest review logic moved to Organizer Quests page

  // Auto-close success modal shortly after showing (print moved to Participants)
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        closeSuccessModal();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  // Auto-close already-checked-in modal
  useEffect(() => {
    if (showAlreadyCheckedInModal) {
      const timer = setTimeout(() => {
        closeAlreadyCheckedInModal();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showAlreadyCheckedInModal]);

  // Handle scan QR for check-in/out
  const handleScan = async (qr: string | null) => {
    if (!qr || !scanMode) return;
    
    setScanLoading(true);
    setScanError("");
    setScanResult("");
    
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

      const data = res.data || {};

      // Handle special case: already checked-in returns success=false per OpenAPI spec
      if (scanMode === "checkin" && data.success === false) {
        const name = data.user?.name || "Unknown";
        const infoMessage = data.message || `${name} is already checked in.`;
        setAlreadyCheckedInData({
          name,
          title: data.user?.title || "",
          company: data.user?.company || "",
          message: infoMessage,
        });
        setScanMode(null);
        setCameraActive(false);
        setShowAlreadyCheckedInModal(true);
        setScanLoading(false);
        return;
      }

      // Show success message
      const successMessage = `${scanMode === "checkin" ? "Check-in" : "Check-out"} successful: ${data.user?.name || "Unknown"}`;
      setScanResult(successMessage);

      // If check-in, prepare print data and show success modal
      if (scanMode === "checkin" && data.user) {
        setPrintData({
          name: data.user.name,
          qr_code: qr,
          company: data.user.company || "",
          title: data.user.title || "",
          message: successMessage,
        });

        // Close scanner and show success modal
        setScanMode(null);
        setCameraActive(false);
        setShowSuccessModal(true);
      } else {
        // For check-out, auto close after 2 seconds
        setTimeout(() => {
          setScanMode(null);
          setScanResult("");
          setScanError("");
          setCameraActive(false);
        }, 2000);
      }

    } catch (err: any) {
      console.error("Scan error:", err);
      setScanError(
        err?.response?.data?.message ||
        err?.response?.data?.detail?.[0]?.msg ||
        `${scanMode === "checkin" ? "Check-in" : "Check-out"} failed. Please try again.`
      );
    }
    setScanLoading(false);
  };

  // Fetch available rewards when opening reward scan
  const fetchAvailableRewards = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${API_URL}api/v1/organizers/rewards`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableRewards(res.data || []);
    } catch (err) {
      console.error("Failed to fetch rewards:", err);
      setAvailableRewards([]);
    }
  };

  // Handle reward redemption scan - just capture QR, then show form
  const handleRewardScan = async (qr: string | null) => {
    if (!qr) return;
    
    setScannedQrForReward(qr);
    setShowRewardForm(true);
    setRewardScanOpen(false);
  };

  // Submit reward redemption with selected reward
  const handleSubmitRewardRedemption = async () => {
    if (!scannedQrForReward || !selectedRewardId) {
      alert("Please select a reward");
      return;
    }

    setRewardLoading(true);
    setRewardError("");
    setRewardResult("");
    
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${API_URL}api/v1/organizers/rewards/redeem`,
        { 
          participant_qr_code: scannedQrForReward,
          reward_id: selectedRewardId,
          qty: rewardQty,
          notes: rewardNotes || undefined
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setRewardResult(res.data.message || "Reward redeemed successfully!");
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setShowRewardForm(false);
        setScannedQrForReward("");
        setSelectedRewardId(null);
        setRewardQty(1);
        setRewardNotes("");
        setRewardResult("");
        setRewardError("");
      }, 2000);
    } catch (err: any) {
      console.error("Reward redemption error:", err);
      const errorMessage = err?.response?.data?.detail?.[0]?.msg || 
                          err?.response?.data?.message || 
                          "Failed to redeem reward. Please try again.";
      setRewardError(errorMessage);
    }
    setRewardLoading(false);
  };

  // After check-in, show success briefly without print action; printing moved to Participants page

  // Close success modal
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setPrintData(null);
    setScanResult("");
  };

  const closeAlreadyCheckedInModal = () => {
    setShowAlreadyCheckedInModal(false);
    setAlreadyCheckedInData(null);
    setScanResult("");
  };

  // Handle approve/reject quest
  // Quest review handlers removed from dashboard; handled in Organizer Quests page

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-[#222]">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">R</div>
          <h1 className="text-lg font-semibold text-gray-900">Organizer Hub</h1>
        </div>
        <button
          className="text-gray-400 hover:text-red-500 p-2 transition-colors"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/auth";
          }}
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="px-8 py-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome, Robi</h2>
          <p className="text-gray-500 text-sm">Here's your event overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-medium text-blue-500">Checked-in</span>
            </div>
            <div className="text-2xl font-bold text-blue-500 mb-0.5">
              {stats?.checked_in_participants ?? 0}
            </div>
            <div className="text-xs text-gray-400">
              of {stats?.total_participants ?? 0} total
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium text-green-500">Sessions</span>
            </div>
            <div className="text-2xl font-bold text-green-500">
              {stats?.total_sessions ?? 0}
            </div>
            <div className="text-xs text-gray-400">total sessions</div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-medium text-purple-500">Bookings</span>
            </div>
            <div className="text-2xl font-bold text-purple-500">
              {stats?.total_bookings ?? 0}
            </div>
            <div className="text-xs text-gray-400">session bookings</div>
          </div>

          {/* Swag Claims card removed as requested */}

          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-medium text-yellow-500">Quest Submissions</span>
            </div>
            <div className="text-2xl font-bold text-yellow-500">
              {stats?.total_quest_submissions ?? 0}
            </div>
            <div className="text-xs text-gray-400">submissions</div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-medium text-indigo-500">Total Participants</span>
            </div>
            <div className="text-2xl font-bold text-indigo-500">
              {stats?.total_participants ?? 0}
            </div>
            <div className="text-xs text-gray-400">registered users</div>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 max-w-3xl mx-auto">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-5 flex flex-col items-center justify-center gap-2 shadow-sm transition-all aspect-square max-w-[140px] mx-auto"
            onClick={() => { setScanMode("checkin"); setCameraActive(true); setScanResult(""); setScanError(""); }}
          >
            <div className="bg-white/20 p-2 rounded-full">
              <QrCode className="w-6 h-6" />
            </div>
            <div className="text-center">
              <div className="font-bold text-sm mb-0.5">Event Check-in</div>
              <div className="text-xs opacity-80">Scan tickets</div>
            </div>
          </button>

          <button
            className="bg-white hover:bg-gray-50 rounded-xl p-5 flex flex-col items-center justify-center gap-2 shadow-sm border border-gray-100 transition-all aspect-square max-w-[140px] mx-auto"
            onClick={() => navigate("/organizer/agenda")}
          >
            <div className="bg-red-50 p-2 rounded-full">
              <DoorOpen className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-center">
              <div className="font-bold text-sm text-red-500 mb-0.5">Session Scan</div>
              <div className="text-xs text-gray-400">Manage sessions</div>
            </div>
          </button>

          <button
            className="bg-white hover:bg-gray-50 rounded-xl p-5 flex flex-col items-center justify-center gap-2 shadow-sm border border-gray-100 transition-all aspect-square max-w-[140px] mx-auto"
            onClick={() => navigate("/organizer/rewards")}
          >
            <div className="bg-green-50 p-2 rounded-full">
              <Gift className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-center">
              <div className="font-bold text-sm text-green-500 mb-0.5">Reward Redeem</div>
              <div className="text-xs text-gray-400">Scan to redeem</div>
            </div>
          </button>

          <button
            className="bg-white hover:bg-gray-50 rounded-xl p-5 flex flex-col items-center justify-center gap-2 shadow-sm border border-gray-100 transition-all aspect-square max-w-[140px] mx-auto"
            onClick={() => navigate("/organizer/quests")}
          >
            <div className="bg-yellow-50 p-2 rounded-full">
              <Award className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="text-center">
              <div className="font-bold text-sm text-yellow-500 mb-0.5">Quest Review</div>
              <div className="text-xs text-gray-400">Verify completion</div>
            </div>
          </button>
        </div>

        {/* Remove the old Total Participants Card since it's now in the stats grid */}
      </main>

      {/* Scan Check-in/out Modal with mode switch */}
      {scanMode && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 shadow-lg w-full max-w-md text-center relative">
            <h3 className="text-xl font-bold mb-4">Event {scanMode === "checkin" ? "Check-in" : "Check-out"}</h3>

            {/* Square scanner container with corner guides */}
            <div className="mx-auto w-[86vw] max-w-[360px] md:w-[360px] md:h-[360px] h-[86vw] relative mb-4">
              <div className="w-full h-full bg-[#000] rounded-lg overflow-hidden relative">
              <QrScanner
                key={scanMode}
                delay={300}
                onError={(error) => setScanError(error)}
                onScan={handleScan}
                style={{ width: "100%", height: "100%" }}
              />

              {/* Dark overlay + corner guides only */}
              <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
                <div className="absolute inset-0 bg-black/36" />
                <span className="absolute left-4 top-4 w-6 h-6 border-t-4 border-l-4 border-white opacity-90" />
                <span className="absolute right-4 top-4 w-6 h-6 border-t-4 border-r-4 border-white opacity-90" />
                <span className="absolute left-4 bottom-4 w-6 h-6 border-b-4 border-l-4 border-white opacity-90" />
                <span className="absolute right-4 bottom-4 w-6 h-6 border-b-4 border-r-4 border-white opacity-90" />
              </div>
              </div>
            </div>

            {/* Mode Switch */}
            <div className="flex justify-center gap-2 mb-4">
              <button
                className={`px-6 py-2 rounded-full font-bold transition ${scanMode === "checkin" ? "bg-[#2563eb] text-white" : "bg-[#e0e0e0] text-[#222]"}`}
                onClick={() => setScanMode("checkin")}
                disabled={scanLoading}
              >
                Check-in
              </button>
              <button
                className={`px-6 py-2 rounded-full font-bold transition ${scanMode === "checkout" ? "bg-[#2563eb] text-white" : "bg-[#e0e0e0] text-[#222]"}`}
                onClick={() => setScanMode("checkout")}
                disabled={scanLoading}
              >
                Check-out
              </button>
            </div>

            {/* Close button */}
            <button
              aria-label="Close"
              onClick={() => { setScanMode(null); setScanResult(""); setScanError(""); setCameraActive(false); }}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-red-100 text-red-600 hover:bg-red-50"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="text-[#888] text-sm mt-2">Point your camera at a participant's QR code to scan.</div>
            {scanLoading && <div className="text-blue-500 mt-2 font-semibold">Processing...</div>}
            {scanError && <div className="text-red-500 mt-2 font-semibold">{scanError}</div>}
          </div>
        </div>
      )}

      {/* Success Modal (brief) */}
      {showSuccessModal && printData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Success Message */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Check-in Successful!</h3>
            <p className="text-lg text-gray-700 mb-2">{printData.name}</p>
            {printData.title && <p className="text-sm text-gray-500 mb-1">{printData.title}</p>}
            {printData.company && <p className="text-sm text-gray-500 mb-6">{printData.company}</p>}

            {/* Action Button (manual close in case timer doesn't fire) */}
            <div className="flex flex-col gap-3 mt-8">
              <button
                onClick={closeSuccessModal}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold text-base transition-colors"
              >
                Close
              </button>
            </div>

            {/* Hint Text */}
            <p className="text-xs text-gray-400 mt-6">You can print the badge from Participants page.</p>
          </div>
        </div>
      )}

      {/* Already Checked-in Modal (brief) */}
      {showAlreadyCheckedInModal && alreadyCheckedInData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md text-center">
            {/* Info Icon */}
            <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M12 19a7 7 0 100-14 7 7 0 000 14z" />
              </svg>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">Already Checked-in</h3>
            <p className="text-lg text-gray-700 mb-2">{alreadyCheckedInData.name}</p>
            {alreadyCheckedInData.title && <p className="text-sm text-gray-500 mb-1">{alreadyCheckedInData.title}</p>}
            {alreadyCheckedInData.company && <p className="text-sm text-gray-500 mb-6">{alreadyCheckedInData.company}</p>}
            {alreadyCheckedInData.message && <p className="text-sm text-yellow-700">{alreadyCheckedInData.message}</p>}

            <div className="flex flex-col gap-3 mt-8">
              <button
                onClick={closeAlreadyCheckedInModal}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold text-base transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quest review moved to its own page */}

      <OrganizerTabBar activeTab="hub" />
    </div>
  );
};

export default OrganizerDashboard;
