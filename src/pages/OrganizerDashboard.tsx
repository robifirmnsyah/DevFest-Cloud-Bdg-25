import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, User, BarChart2, Users, LogOut, QrCode, Award, Gift, DoorOpen, Target, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrganizerTabBar from "@/components/OrganizerTabBar";
import QrScanner from "@/components/QrScanner";

const API_URL = import.meta.env.VITE_API_URL;

const OrganizerDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
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
  const [questScanOpen, setQuestScanOpen] = useState(false);
  const [availableQuests, setAvailableQuests] = useState<any[]>([]);
  const [selectedQuestId, setSelectedQuestId] = useState<number | null>(null);
  const [scannedQrForQuest, setScannedQrForQuest] = useState<string>("");
  const [showQuestForm, setShowQuestForm] = useState(false);
  const [questLoading, setQuestLoading] = useState(false);
  const [questResult, setQuestResult] = useState("");
  const [questError, setQuestError] = useState("");
  const [showQuestSuccessModal, setShowQuestSuccessModal] = useState(false);
  const [showQuestErrorModal, setShowQuestErrorModal] = useState(false);
  const [questCompletionData, setQuestCompletionData] = useState<any>(null);
  const [redemptionScanOpen, setRedemptionScanOpen] = useState(false);
  const [redemptionLoading, setRedemptionLoading] = useState(false);
  const [showRedemptionSuccess, setShowRedemptionSuccess] = useState(false);
  const [redemptionMessage, setRedemptionMessage] = useState("");
  const [redemptionData, setRedemptionData] = useState<any>(null);
  const [redemptionError, setRedemptionError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token) {
      window.location.hash = "/auth";
      return;
    }
    if (role !== "organizer") {
      window.location.hash = "/dashboard";
      return;
    }
    
    // Fetch both stats and profile
    Promise.all([
      axios.get(`${API_URL}api/v1/organizers/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${API_URL}api/v1/organizers/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ])
      .then(([statsRes, profileRes]) => {
        setStats(statsRes.data);
        setProfile(profileRes.data);
      })
      .catch((err) => {
        console.error("Failed to fetch organizer data:", err);
        
        // If 401 or 403, redirect to auth
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("user_roles");
          window.location.hash = "/auth";
        } else {
          setStats(null);
          setProfile(null);
        }
      })
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

  // Auto-close quest success modal
  useEffect(() => {
    if (showQuestSuccessModal) {
      const timer = setTimeout(() => {
        setShowQuestSuccessModal(false);
        setQuestCompletionData(null);
        setQuestResult("");
        setQuestScanOpen(false);
        setSelectedQuestId(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showQuestSuccessModal]);

  // Auto-close quest error modal
  useEffect(() => {
    if (showQuestErrorModal) {
      const timer = setTimeout(() => {
        setShowQuestErrorModal(false);
        setQuestError("");
        setQuestScanOpen(false);
        setSelectedQuestId(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showQuestErrorModal]);

  // Auto-close redemption success modal
  useEffect(() => {
    if (showRedemptionSuccess) {
      const timer = setTimeout(() => {
        setShowRedemptionSuccess(false);
        setRedemptionMessage("");
        setRedemptionData(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showRedemptionSuccess]);

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

  // Fetch available quests when opening quest scan - filter for organizer_scan only
  const fetchAvailableQuests = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${API_URL}api/v1/organizers/quests`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          quest_type: "organizer_scan",
          include_inactive: false 
        }
      });
      setAvailableQuests(res.data || []);
    } catch (err) {
      console.error("Failed to fetch quests:", err);
      setAvailableQuests([]);
    }
  };

  // Handle quest scan - after selecting quest, scan QR
  const handleQuestScan = async (qr: string | null) => {
    if (!qr || !selectedQuestId) return;
    
    setQuestLoading(true);
    setQuestError("");
    setQuestResult("");
    
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${API_URL}api/v1/organizers/quests/complete`,
        { 
          participant_qr_code: qr,
          quest_id: selectedQuestId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Store completion data and show success modal
      setQuestCompletionData(res.data);
      setQuestResult(res.data.message || "Quest completed successfully!");
      setQuestScanOpen(false);
      setShowQuestSuccessModal(true);
      
    } catch (err: any) {
      console.error("Quest completion error:", err);
      const errorMessage = err?.response?.data?.detail?.[0]?.msg || 
                          err?.response?.data?.message || 
                          "Failed to complete quest. Please try again.";
      setQuestError(errorMessage);
      setQuestScanOpen(false);
      setShowQuestErrorModal(true);
    }
    setQuestLoading(false);
  };

  // Handle redemption code scan
  const handleRedemptionScan = async (qr: string | null) => {
    if (!qr) return;
    
    setRedemptionScanOpen(false);
    setRedemptionLoading(true);
    setRedemptionError("");
    
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${API_URL}api/v1/organizers/rewards/complete`,
        { 
          redemption_code: qr,
          notes: "Completed by organizer scan"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setRedemptionData(res.data);
      setRedemptionMessage(res.data.message || "Redemption completed successfully!");
      setShowRedemptionSuccess(true);
      
      // Refresh stats
      axios
        .get(`${API_URL}api/v1/organizers/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setStats(res.data))
        .catch(() => {});
    } catch (err: any) {
      console.error("Redemption error:", err);
      const errorMessage = err?.response?.data?.detail?.[0]?.msg || 
                          err?.response?.data?.message || 
                          "Failed to complete redemption.";
      setRedemptionError(errorMessage);
      alert(errorMessage);
    }
    setRedemptionLoading(false);
  };

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
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
            {profile?.name?.charAt(0) || "O"}
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Organizer Hub</h1>
        </div>
        <button
          className="text-gray-400 hover:text-red-500 p-2 transition-colors"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.hash = "/auth";
          }}
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="px-8 py-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Welcome, {profile?.name || "Organizer"}
          </h2>
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
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6 max-w-5xl mx-auto">
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

          {/* Reward Redeem - directly open scanner */}
          <button
            className="bg-white hover:bg-gray-50 rounded-xl p-5 flex flex-col items-center justify-center gap-2 shadow-sm border border-gray-100 transition-all aspect-square max-w-[140px] mx-auto"
            onClick={() => {
              setRedemptionScanOpen(true);
              setRedemptionError("");
            }}
          >
            <div className="bg-green-50 p-2 rounded-full">
              <Gift className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-center">
              <div className="font-bold text-sm text-green-500 mb-0.5">Reward Redeem</div>
              <div className="text-xs text-gray-400">Scan code</div>
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

          {/* Quest Scan - open quest selection first */}
          <button
            className="bg-white hover:bg-gray-50 rounded-xl p-5 flex flex-col items-center justify-center gap-2 shadow-sm border border-gray-100 transition-all aspect-square max-w-[140px] mx-auto"
            onClick={() => {
              fetchAvailableQuests();
              setSelectedQuestId(null);
              setQuestScanOpen(true);
              setQuestError("");
              setQuestResult("");
            }}
          >
            <div className="bg-orange-50 p-2 rounded-full">
              <Target className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-center">
              <div className="font-bold text-sm text-orange-500 mb-0.5">Quest Scan</div>
              <div className="text-xs text-gray-400">Complete quests</div>
            </div>
          </button>

          {/* NEW: Lucky Draw Button */}
          <button
            className="bg-white hover:bg-gray-50 rounded-xl p-5 flex flex-col items-center justify-center gap-2 shadow-sm border border-gray-100 transition-all aspect-square max-w-[140px] mx-auto"
            onClick={() => navigate("/organizer/lucky-draw")}
          >
            <div className="bg-yellow-50 p-2 rounded-full">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="text-center">
              <div className="font-bold text-sm text-yellow-500 mb-0.5">Lucky Draw</div>
              <div className="text-xs text-gray-400">Spin wheel</div>
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

      {/* Quest Scan Modal - Step 1: Select Quest, Step 2: Scan QR */}
      {questScanOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 shadow-lg w-full max-w-md text-center relative">
            {!selectedQuestId ? (
              /* Step 1: Quest Selection */
              <>
                <h3 className="text-xl font-bold mb-2">Select Quest to Complete</h3>
                <p className="text-sm text-gray-600 mb-4">Choose which quest to mark as complete</p>

                <div className="mb-4 max-h-96 overflow-y-auto">
                  {availableQuests.length === 0 ? (
                    <p className="text-gray-500 text-sm py-8">No organizer scan quests available</p>
                  ) : (
                    <div className="space-y-2">
                      {availableQuests.map((quest) => (
                        <button
                          key={quest.id}
                          onClick={() => setSelectedQuestId(quest.id)}
                          className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition"
                        >
                          <div className="font-semibold text-sm text-gray-900">{quest.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{quest.description}</div>
                          <div className="text-xs text-orange-600 font-semibold mt-2">
                            +{quest.points} points
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setQuestScanOpen(false);
                    setQuestError("");
                  }}
                  className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </>
            ) : (
              /* Step 2: QR Scanner */
              <>
                <h3 className="text-xl font-bold mb-2">Scan Participant QR</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {availableQuests.find(q => q.id === selectedQuestId)?.title}
                </p>

                <div className="mx-auto w-[86vw] max-w-[360px] md:w-[360px] md:h-[360px] h-[86vw] relative mb-4">
                  <div className="w-full h-full bg-[#000] rounded-lg overflow-hidden relative">
                    <QrScanner
                      key={`quest-scan-${selectedQuestId}`}
                      delay={300}
                      onError={(error) => setQuestError(error)}
                      onScan={handleQuestScan}
                      style={{ width: "100%", height: "100%" }}
                    />
                    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
                      <div className="absolute inset-0 bg-black/36" />
                      <span className="absolute left-4 top-4 w-6 h-6 border-t-4 border-l-4 border-white opacity-90" />
                      <span className="absolute right-4 top-4 w-6 h-6 border-t-4 border-r-4 border-white opacity-90" />
                      <span className="absolute left-4 bottom-4 w-6 h-6 border-b-4 border-l-4 border-white opacity-90" />
                      <span className="absolute right-4 bottom-4 w-6 h-6 border-b-4 border-r-4 border-white opacity-90" />
                    </div>
                  </div>
                </div>

                {/* Back button */}
                <button
                  onClick={() => setSelectedQuestId(null)}
                  className="mb-3 text-sm text-gray-600 hover:text-gray-800 font-medium"
                  disabled={questLoading}
                >
                  ← Back to Quest Selection
                </button>

                {/* Close button */}
                <button
                  onClick={() => {
                    setQuestScanOpen(false);
                    setSelectedQuestId(null);
                    setQuestError("");
                  }}
                  className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-red-100 text-red-600 hover:bg-red-50"
                  disabled={questLoading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                {/* Processing indicator */}
                {questLoading && <div className="text-blue-500 mt-2 font-semibold">Processing...</div>}
              </>
            )}
          </div>
        </div>
      )}

      {/* Quest Success Modal */}
      {showQuestSuccessModal && questCompletionData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Success Message */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Quest Completed!</h3>
            <p className="text-lg text-gray-700 mb-2">{questCompletionData.user?.name || "Participant"}</p>
            <p className="text-sm text-gray-600 mb-4">{questCompletionData.quest_title}</p>
            <div className="bg-green-50 rounded-lg p-3 mb-4">
              <p className="text-green-700 font-semibold">+{questCompletionData.points_awarded} points awarded</p>
            </div>

            <button
              onClick={() => {
                setShowQuestSuccessModal(false);
                setQuestCompletionData(null);
                setQuestResult("");
                setQuestScanOpen(false);
                setSelectedQuestId(null);
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold text-base transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Quest Error Modal */}
      {showQuestErrorModal && questError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            {/* Error Message */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Quest Failed</h3>
            <p className="text-base text-red-600 mb-6">{questError}</p>

            <button
              onClick={() => {
                setShowQuestErrorModal(false);
                setQuestError("");
                setQuestScanOpen(false);
                setSelectedQuestId(null);
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold text-base transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Redemption Code Scanner Modal */}
      {redemptionScanOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 shadow-lg w-full max-w-md text-center relative">
            <h3 className="text-xl font-bold mb-2">Scan Redemption Code</h3>
            <p className="text-sm text-gray-600 mb-4">Scan participant's redemption QR code</p>

            <div className="mx-auto w-[86vw] max-w-[360px] md:w-[360px] md:h-[360px] h-[86vw] relative mb-4">
              <div className="w-full h-full bg-[#000] rounded-lg overflow-hidden relative">
                <QrScanner
                  key="redemption-scan"
                  delay={300}
                  onError={(error) => setRedemptionError(error)}
                  onScan={handleRedemptionScan}
                  style={{ width: "100%", height: "100%" }}
                />
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
                  <div className="absolute inset-0 bg-black/36" />
                  <span className="absolute left-4 top-4 w-6 h-6 border-t-4 border-l-4 border-white opacity-90" />
                  <span className="absolute right-4 top-4 w-6 h-6 border-t-4 border-r-4 border-white opacity-90" />
                  <span className="absolute left-4 bottom-4 w-6 h-6 border-b-4 border-l-4 border-white opacity-90" />
                  <span className="absolute right-4 bottom-4 w-6 h-6 border-b-4 border-r-4 border-white opacity-90" />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setRedemptionScanOpen(false);
                setRedemptionError("");
              }}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-red-100 text-red-600 hover:bg-red-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            
            <div className="text-gray-500 text-sm mt-2">
              {redemptionLoading ? "Processing..." : "Point camera at redemption code"}
            </div>
            {redemptionError && <div className="text-red-500 mt-2 font-semibold">{redemptionError}</div>}
          </div>
        </div>
      )}

      {/* Redemption Success Modal */}
      {showRedemptionSuccess && redemptionData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Gift className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Redemption Completed!</h3>
            <p className="text-base text-gray-600 mb-6">{redemptionMessage}</p>
            
            {redemptionData.user && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                <div className="text-sm font-semibold text-gray-700 mb-1">Participant</div>
                <div className="text-base font-bold text-gray-900">{redemptionData.user.name}</div>
              </div>
            )}
            
            <button
              onClick={() => {
                setShowRedemptionSuccess(false);
                setRedemptionMessage("");
                setRedemptionData(null);
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold text-base transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <OrganizerTabBar activeTab="hub" />
    </div>
  );
};

export default OrganizerDashboard;
