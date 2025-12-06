import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Gift, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrganizerTabBar from "@/components/OrganizerTabBar";
import QrScanner from "@/components/QrScanner";

const API_URL = import.meta.env.VITE_API_URL;

const OrganizerRewards = () => {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [redemptionScanOpen, setRedemptionScanOpen] = useState(false);
  const [scanError, setScanError] = useState("");
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [showCompletionSuccess, setShowCompletionSuccess] = useState(false);
  const [completionMessage, setCompletionMessage] = useState("");
  const [completionData, setCompletionData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token || role !== "organizer") {
      window.location.href = "/auth";
      return;
    }

    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${API_URL}api/v1/organizers/rewards`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setRewards(res.data || []);
    } catch (err) {
      console.error("Failed to fetch rewards:", err);
      setRewards([]);
    }
    setLoading(false);
  };

  // Handle redemption code scan (complete redemption)
  const handleRedemptionScan = async (qr: string | null) => {
    if (!qr) return;
    
    setRedemptionScanOpen(false);
    setRedeemLoading(true);
    setScanError("");
    
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
      
      setCompletionData(res.data);
      setCompletionMessage(res.data.message || "Redemption completed successfully!");
      setShowCompletionSuccess(true);
      
      fetchRewards();
    } catch (err: any) {
      console.error("Completion error:", err);
      const errorMessage = err?.response?.data?.detail?.[0]?.msg || 
                          err?.response?.data?.message || 
                          "Failed to complete redemption.";
      alert(errorMessage);
    }
    setRedeemLoading(false);
  };

  // Auto-close success modal
  useEffect(() => {
    if (showCompletionSuccess) {
      const timer = setTimeout(() => {
        setShowCompletionSuccess(false);
        setCompletionMessage("");
        setCompletionData(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showCompletionSuccess]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/organizer")} className="text-blue-500">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-blue-500">Reward Management</h1>
          </div>
        </div>
        
        {/* Main Action: Scan Redemption Code */}
        <button
          onClick={() => setRedemptionScanOpen(true)}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white px-6 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-3 shadow-lg transition-colors"
        >
          <CheckCircle className="w-6 h-6" />
          Scan Redemption Code
        </button>
        
        <p className="text-center text-sm text-gray-500 mt-2">
          Scan participant's redemption QR code to complete reward claim
        </p>
      </header>

      <main className="px-6 py-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Available Rewards</h2>
        
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : rewards.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Gift className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No rewards available</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-white rounded-xl p-5 shadow border border-gray-100"
              >
                {reward.image_url && (
                  <img
                    src={reward.image_url}
                    alt={reward.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900">{reward.title}</h3>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {reward.points_required} points
                  </span>
                </div>

                {reward.description && (
                  <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                )}

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Stock:</span>
                    <span className="font-semibold text-gray-900">{reward.stock}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Max per user:</span>
                    <span className="font-semibold text-gray-900">{reward.max_per_user || "Unlimited"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {reward.redemption_type?.replace('_', ' ') || 'N/A'}
                    </span>
                  </div>
                </div>

                {reward.exclusivity_group && (
                  <div className="mb-3">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      {reward.exclusivity_group}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Redemption Code Scanner Modal */}
      {redemptionScanOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 shadow-lg w-full max-w-md text-center relative">
            <h3 className="text-xl font-bold mb-2">Scan Redemption Code</h3>
            <p className="text-sm text-gray-600 mb-4">Scan the participant's redemption QR code</p>

            <div className="mx-auto w-[86vw] max-w-[360px] md:w-[360px] md:h-[360px] h-[86vw] relative mb-4">
              <div className="w-full h-full bg-[#000] rounded-lg overflow-hidden relative">
                <QrScanner
                  key="redemption-scan"
                  delay={300}
                  onError={(error) => setScanError(error)}
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
                setScanError("");
              }}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-red-100 text-red-600 hover:bg-red-50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            
            <div className="text-gray-500 text-sm mt-2">
              {redeemLoading ? "Processing..." : "Point camera at redemption QR code"}
            </div>
            {scanError && <div className="text-red-500 mt-2 font-semibold">{scanError}</div>}
          </div>
        </div>
      )}

      {/* Completion Success Modal */}
      {showCompletionSuccess && completionData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Redemption Completed!</h3>
            <p className="text-base text-gray-600 mb-6">{completionMessage}</p>
            
            {completionData.user && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                <div className="text-sm font-semibold text-gray-700 mb-1">Participant</div>
                <div className="text-base font-bold text-gray-900">{completionData.user.name}</div>
              </div>
            )}
            
            <button
              onClick={() => {
                setShowCompletionSuccess(false);
                setCompletionMessage("");
                setCompletionData(null);
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

export default OrganizerRewards;
