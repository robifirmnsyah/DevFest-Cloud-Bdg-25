import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Gift, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrganizerTabBar from "@/components/OrganizerTabBar";
import QrScanner from "@/components/QrScanner";

const API_URL = import.meta.env.VITE_API_URL;

const OrganizerRewards = () => {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [scanOpen, setScanOpen] = useState(false);
  const [scanError, setScanError] = useState("");
  const [scannedQr, setScannedQr] = useState("");
  const [showRedeemForm, setShowRedeemForm] = useState(false);
  const [rewardQty, setRewardQty] = useState(1);
  const [rewardNotes, setRewardNotes] = useState("");
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemResult, setRedeemResult] = useState("");
  const [redeemError, setRedeemError] = useState("");

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
      
      // Filter only organizer_scan type rewards
      const organizerScanRewards = (res.data || []).filter(
        (r: any) => r.redemption_type === "organizer_scan"
      );
      setRewards(organizerScanRewards);
    } catch (err) {
      console.error("Failed to fetch rewards:", err);
      setRewards([]);
    }
    setLoading(false);
  };

  const handleScan = async (qr: string | null) => {
    if (!qr) return;
    
    setScannedQr(qr);
    setScanOpen(false);
    setShowRedeemForm(true);
  };

  const handleSubmitRedemption = async () => {
    if (!scannedQr || !selectedReward) {
      alert("Please select a reward and scan QR");
      return;
    }

    setRedeemLoading(true);
    setRedeemError("");
    setRedeemResult("");
    
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${API_URL}api/v1/organizers/rewards/redeem`,
        { 
          participant_qr_code: scannedQr,
          reward_id: selectedReward.id,
          qty: rewardQty,
          notes: rewardNotes || undefined
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setRedeemResult(res.data.message || "Reward redeemed successfully!");
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setShowRedeemForm(false);
        setScannedQr("");
        setSelectedReward(null);
        setRewardQty(1);
        setRewardNotes("");
        setRedeemResult("");
        setRedeemError("");
        fetchRewards(); // Refresh list
      }, 2000);
    } catch (err: any) {
      console.error("Redemption error:", err);
      const errorMessage = err?.response?.data?.detail?.[0]?.msg || 
                          err?.response?.data?.message || 
                          "Failed to redeem reward. Please try again.";
      setRedeemError(errorMessage);
    }
    setRedeemLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate("/organizer")} className="text-blue-500">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-blue-500">Reward Redemption</h1>
        </div>
      </header>

      <main className="px-6 py-6">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : rewards.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Gift className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No rewards available for redemption</p>
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
                </div>

                {reward.exclusivity_group && (
                  <div className="mb-3">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      {reward.exclusivity_group}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => {
                    setSelectedReward(reward);
                    setScanOpen(true);
                    setScanError("");
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                  disabled={reward.stock <= 0}
                >
                  <QrCode className="w-5 h-5" />
                  {reward.stock <= 0 ? "Out of Stock" : "Scan to Redeem"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* QR Scanner Modal */}
      {scanOpen && selectedReward && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 shadow-lg w-full max-w-md text-center relative">
            <h3 className="text-xl font-bold mb-2">Scan Participant QR</h3>
            <p className="text-sm text-gray-600 mb-4">{selectedReward.title}</p>

            {/* Square scanner container */}
            <div className="mx-auto w-[86vw] max-w-[360px] md:w-[360px] md:h-[360px] h-[86vw] relative mb-4">
              <div className="w-full h-full bg-[#000] rounded-lg overflow-hidden relative">
                <QrScanner
                  key="reward-scan"
                  delay={300}
                  onError={(error) => setScanError(error)}
                  onScan={handleScan}
                  style={{ width: "100%", height: "100%" }}
                />

                {/* Corner guides */}
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
                  <div className="absolute inset-0 bg-black/36" />
                  <span className="absolute left-4 top-4 w-6 h-6 border-t-4 border-l-4 border-white opacity-90" />
                  <span className="absolute right-4 top-4 w-6 h-6 border-t-4 border-r-4 border-white opacity-90" />
                  <span className="absolute left-4 bottom-4 w-6 h-6 border-b-4 border-l-4 border-white opacity-90" />
                  <span className="absolute right-4 bottom-4 w-6 h-6 border-b-4 border-r-4 border-white opacity-90" />
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              aria-label="Close"
              onClick={() => {
                setScanOpen(false);
                setSelectedReward(null);
                setScanError("");
              }}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-red-100 text-red-600 hover:bg-red-50"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="text-gray-500 text-sm mt-2">Point camera at participant's QR code</div>
            {scanError && <div className="text-red-500 mt-2 font-semibold">{scanError}</div>}
          </div>
        </div>
      )}

      {/* Redemption Form Modal */}
      {showRedeemForm && selectedReward && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Confirm Redemption</h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900 mb-1">{selectedReward.title}</div>
              <div className="text-sm text-gray-600">{selectedReward.description}</div>
              <div className="text-sm text-green-600 font-semibold mt-2">
                {selectedReward.points_required} points
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Quantity *</label>
              <input
                type="number"
                min="1"
                max={selectedReward.max_per_user || undefined}
                value={rewardQty}
                onChange={(e) => setRewardQty(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Notes (Optional)</label>
              <input
                type="text"
                placeholder="e.g., color, size, etc."
                value={rewardNotes}
                onChange={(e) => setRewardNotes(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Status Messages */}
            {redeemLoading && <div className="text-blue-500 mb-3 font-semibold text-center">Processing...</div>}
            {redeemResult && <div className="text-green-600 mb-3 font-semibold text-center">{redeemResult}</div>}
            {redeemError && <div className="text-red-500 mb-3 font-semibold text-center">{redeemError}</div>}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRedeemForm(false);
                  setScannedQr("");
                  setSelectedReward(null);
                  setRewardQty(1);
                  setRewardNotes("");
                  setRedeemError("");
                }}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
                disabled={redeemLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRedemption}
                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                disabled={redeemLoading}
              >
                Confirm Redeem
              </button>
            </div>
          </div>
        </div>
      )}

      <OrganizerTabBar activeTab="hub" />
    </div>
  );
};

export default OrganizerRewards;
