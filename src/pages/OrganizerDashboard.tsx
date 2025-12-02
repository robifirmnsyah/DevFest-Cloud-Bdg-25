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
  const [questScanOpen, setQuestScanOpen] = useState(false);
  const [pendingQuests, setPendingQuests] = useState<any[]>([]);
  const [questLoading, setQuestLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [printData, setPrintData] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
      
      // Show success message
      const successMessage = `${scanMode === "checkin" ? "Check-in" : "Check-out"} successful: ${res.data.user?.name || "Unknown"}`;
      setScanResult(successMessage);
      
      // If check-in, prepare print data and show success modal
      if (scanMode === "checkin" && res.data.user) {
        setPrintData({
          name: res.data.user.name,
          qr_code: qr,
          company: res.data.user.company || "",
          title: res.data.user.title || "",
          message: successMessage
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

  // Print badge with improved reliability
  const handlePrintBadge = () => {
    if (!printData) {
      alert("No data available for printing");
      return;
    }
    
    try {
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(printData.qr_code)}`;
      
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        alert("Please allow popups to print badge");
        return;
      }
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Badge - ${printData.name}</title>
            <style>
              @page { 
                size: B4 portrait;
                margin: 0; 
              }
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body { 
                margin: 0; 
                padding: 30px; 
                font-family: 'Arial', 'Helvetica', sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: #f0f0f0;
              }
              .badge {
                text-align: center;
                border: 4px solid #4285F4;
                padding: 50px 40px;
                border-radius: 24px;
                background: white;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                max-width: 600px;
              }
              .name {
                font-size: 42px;
                font-weight: bold;
                margin-bottom: 12px;
                color: #222;
                word-wrap: break-word;
              }
              .info {
                font-size: 24px;
                color: #666;
                margin-bottom: 10px;
              }
              .qr-code {
                margin: 30px auto;
                padding: 20px;
                background: white;
                border-radius: 16px;
                display: inline-block;
              }
              .qr-code img {
                display: block;
                width: 300px;
                height: 300px;
              }
              .footer {
                margin-top: 25px;
                font-size: 18px;
                color: #999;
              }
              @media print {
                body { 
                  background: white;
                  padding: 0;
                }
                .badge {
                  box-shadow: none;
                  border: 4px solid #4285F4;
                }
              }
            </style>
          </head>
          <body>
            <div class="badge">
              <div class="name">${printData.name}</div>
              ${printData.title ? `<div class="info">${printData.title}</div>` : ''}
              ${printData.company ? `<div class="info">${printData.company}</div>` : ''}
              <div class="qr-code">
                <img src="${qrCodeUrl}" alt="QR Code" onload="window.qrLoaded=true" onerror="window.qrError=true" />
              </div>
              <div class="footer">Cloud DevFest Bandung 2025</div>
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Wait for QR code to load before printing
      const checkLoaded = setInterval(() => {
        if (printWindow.closed) {
          clearInterval(checkLoaded);
          return;
        }
        
        if ((printWindow as any).qrLoaded) {
          clearInterval(checkLoaded);
          setTimeout(() => {
            printWindow.print();
          }, 300);
        } else if ((printWindow as any).qrError) {
          clearInterval(checkLoaded);
          alert("Failed to load QR code image. Please try again.");
          printWindow.close();
        }
      }, 100);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkLoaded);
        if (!printWindow.closed && !(printWindow as any).qrLoaded) {
          alert("QR code loading timeout. Please try again.");
          printWindow.close();
        }
      }, 10000);
      
    } catch (error) {
      console.error("Print error:", error);
      alert("Failed to open print window. Please check your browser settings.");
    }
  };

  // Close success modal
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setPrintData(null);
    setScanResult("");
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
    } catch (err) {
      console.error("Failed to review quest:", err);
      alert("Failed to review quest. Please try again.");
    }
  };

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
            <div className="text-2xl font-bold text-blue-500 mb-0.5">{stats?.checked_in_participants ?? 0}</div>
            <div className="text-xs text-gray-400">of {stats?.total_participants ?? "-"} total</div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium text-green-500">Sessions</span>
            </div>
            <div className="text-2xl font-bold text-green-500">{stats?.total_sessions ?? 0}</div>
            <div className="text-xs text-gray-400">total sessions</div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-medium text-purple-500">Bookings</span>
            </div>
            <div className="text-2xl font-bold text-purple-500">{stats?.total_bookings ?? 0}</div>
            <div className="text-xs text-gray-400">session bookings</div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <Gift className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-medium text-orange-500">Swag Claims</span>
            </div>
            <div className="text-2xl font-bold text-orange-500">{stats?.total_swag_claims ?? 0}</div>
            <div className="text-xs text-gray-400">items claimed</div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-medium text-yellow-500">Quest Submissions</span>
            </div>
            <div className="text-2xl font-bold text-yellow-500">{stats?.total_quest_submissions ?? 0}</div>
            <div className="text-xs text-gray-400">submissions</div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-medium text-indigo-500">Total Participants</span>
            </div>
            <div className="text-2xl font-bold text-indigo-500">{stats?.total_participants ?? 0}</div>
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
              <div className="font-bold text-sm mb-0.5">Event Check-in/Check-out</div>
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
            onClick={() => alert("Coming soon")}
          >
            <div className="bg-green-50 p-2 rounded-full">
              <Gift className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-center">
              <div className="font-bold text-sm text-green-500 mb-0.5">Swag Collection</div>
              <div className="text-xs text-gray-400">Coming soon</div>
            </div>
          </button>

          <button
            className="bg-white hover:bg-gray-50 rounded-xl p-5 flex flex-col items-center justify-center gap-2 shadow-sm border border-gray-100 transition-all aspect-square max-w-[140px] mx-auto"
            onClick={() => { setQuestScanOpen(true); fetchPendingQuests(); }}
          >
            <div className="bg-yellow-50 p-2 rounded-full">
              <Award className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="text-center">
              <div className="font-bold text-sm text-yellow-500 mb-0.5">Quest Scan</div>
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

      {/* Success Modal with Print Button */}
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

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-8">
              <button
                onClick={handlePrintBadge}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Badge
              </button>
              
              <button
                onClick={closeSuccessModal}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold text-base transition-colors"
              >
                Close
              </button>
            </div>

            {/* Hint Text */}
            <p className="text-xs text-gray-400 mt-6">
              You can print the badge now or close this window
            </p>
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
