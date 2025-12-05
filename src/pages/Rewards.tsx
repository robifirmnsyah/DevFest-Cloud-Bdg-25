import { useEffect, useState } from "react";
import axios from "axios";
import TabBar from "@/components/TabBar";
import { Gift, Award, Check, AlertTriangle, X, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const Rewards = () => {
  const [rewards, setRewards] = useState<any[]>([]);
  const [myRedemptions, setMyRedemptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"available" | "my">("available");
  const [userPoints, setUserPoints] = useState(0);
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [userQrCode, setUserQrCode] = useState<string>("");
  const [showRedemptionQrModal, setShowRedemptionQrModal] = useState(false);
  const [currentRedemptionCode, setCurrentRedemptionCode] = useState("");
  const [currentRedemptionRewardTitle, setCurrentRedemptionRewardTitle] = useState("");
  
  // New states for improved UX
  const [confirmModal, setConfirmModal] = useState<{open: boolean, reward: any | null}>({open: false, reward: null});
  const [successModal, setSuccessModal] = useState<{open: boolean, type: 'success' | 'error', message: string, reward?: any, redemptionCode?: string}>({open: false, type: 'success', message: ''});
  const [isRedeeming, setIsRedeeming] = useState(false);

  const fetchData = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Fetch available rewards
    axios
      .get(`${API_URL}api/v1/participants/rewards`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Rewards response:", res.data);
        setRewards(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch rewards:", err);
        setRewards([]);
      });

    // Fetch my redemptions - langsung dari API
    axios
      .get(`${API_URL}api/v1/participants/rewards/my-redemptions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Redemptions response:", res.data);
        // API returns array of redemption objects directly
        setMyRedemptions(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch redemptions:", err);
        setMyRedemptions([]);
      });

    // Fetch user points and profile (for QR code)
    Promise.all([
      axios.get(`${API_URL}api/v1/participants/points`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${API_URL}api/v1/participants/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ])
      .then(([pointsRes, profileRes]) => {
        setUserPoints(pointsRes.data?.points || 0);
        setUserQrCode(profileRes.data?.qr_code || "");
      })
      .catch(() => {
        setUserPoints(0);
        setUserQrCode("");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth";
      return;
    }

    setLoading(true);
    fetchData();
  }, []);

  const handleRedeemClick = (reward: any) => {
    if (userPoints < reward.points_required) {
      setSuccessModal({
        open: true, 
        type: 'error', 
        message: "Not enough points to redeem this reward!"
      });
      return;
    }

    if (reward.redemption_type === 'organizer_scan') {
      setSelectedReward(reward);
      setShowQrModal(true);
    } else {
      // Open confirmation modal for self_redeem and instant
      setConfirmModal({open: true, reward});
    }
  };

  const processRedemption = async () => {
    const reward = confirmModal.reward;
    if (!reward) return;
    
    setIsRedeeming(true);
    const token = localStorage.getItem("token");
    
    try {
      const res = await axios.post(`${API_URL}api/v1/participants/rewards/self-redeem`, {
          reward_id: reward.id,
          qty: 1
      }, { headers: { Authorization: `Bearer ${token}` }});
      
      setConfirmModal({open: false, reward: null});
      
      if (reward.redemption_type === 'self_redeem') {
          setSuccessModal({
              open: true, 
              type: 'success', 
              message: 'Reward redeemed successfully!', 
              reward: reward,
              redemptionCode: res.data.redemption.redemption_code
          });
          // Switch to My Redemptions tab after short delay or immediately
          setTimeout(() => setTab("my"), 1500);
      } else {
          setSuccessModal({
              open: true, 
              type: 'success', 
              message: 'Reward redeemed successfully!'
          });
          // For instant rewards, also switch to my redemptions
          setTimeout(() => setTab("my"), 1500);
      }
      fetchData();
    } catch (err: any) {
      console.error("Redemption error:", err);
      setConfirmModal({open: false, reward: null});
      setSuccessModal({
          open: true, 
          type: 'error', 
          message: err?.response?.data?.detail || "Redemption failed"
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  // Generate QR code image URL
  const getQrCodeImageUrl = (qrCode: string) => {
    if (!qrCode) return null;
    return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrCode)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8fa] text-[#222]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#222] pb-16">
      <div className="px-6 py-6">
        <h2 className="text-2xl font-bold mb-4">Rewards</h2>

        {/* User Points Display */}
        <div className="bg-white rounded-xl shadow border border-[#e0e0e0] p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-full">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-[#888]">Your Points</div>
                <div className="text-2xl font-bold text-primary">{userPoints}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-6 border-b border-[#e0e0e0]">
          <button
            className={`pb-2 text-lg font-bold border-b-2 transition-all ${
              tab === "available"
                ? "border-primary text-primary"
                : "border-transparent text-[#888]"
            }`}
            onClick={() => setTab("available")}
          >
            Available Rewards
          </button>
          <button
            className={`pb-2 text-lg font-bold border-b-2 transition-all ${
              tab === "my"
                ? "border-primary text-primary"
                : "border-transparent text-[#888]"
            }`}
            onClick={() => setTab("my")}
          >
            My Redemptions
          </button>
        </div>

        {/* Content */}
        {tab === "available" ? (
          rewards.length === 0 ? (
            <div className="text-[#888] text-center py-12">No rewards available.</div>
          ) : (
            <div className="grid gap-8 max-w-2xl mx-auto">
              {(() => {
                // Group rewards by exclusivity_group
                const groupedRewards = rewards.reduce((acc: any, item: any) => {
                  const group = item.reward.exclusivity_group || "General";
                  if (!acc[group]) acc[group] = [];
                  acc[group].push(item);
                  return acc;
                }, {});

                // Sort groups: General last, others alphabetically
                const sortedGroups = Object.keys(groupedRewards).sort((a, b) => {
                  if (a === "General") return 1;
                  if (b === "General") return -1;
                  return a.localeCompare(b);
                });

                return sortedGroups.map((group) => (
                  <div key={group} className="space-y-4">
                    {group !== "General" && (
                      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                        <h3 className="font-bold text-purple-800 text-lg mb-1">{group} Rewards</h3>
                        <p className="text-sm text-purple-600 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          You can only choose one reward from this group.
                        </p>
                      </div>
                    )}
                    
                    {groupedRewards[group].map((item: any) => {
                      const reward = item.reward;
                      const isEligible = item.is_eligible;
                      const ineligibleReason = item.ineligible_reason;
                      const userRedeemedCount = item.user_redeemed_count || 0;
                      const availableStock = reward.stock || 0;
                      
                      return (
                        <div
                          key={reward.id}
                          className={`bg-white border rounded-xl shadow p-5 relative overflow-hidden ${
                            !isEligible ? 'border-gray-200 opacity-90' : 'border-[#e0e0e0]'
                          }`}
                        >
                          {/* Ineligible Overlay/Banner */}
                          {!isEligible && (
                            <div className="absolute top-0 right-0 bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                              {ineligibleReason || "Not Eligible"}
                            </div>
                          )}

                          {reward.image_url && (
                            <img
                              src={reward.image_url}
                              alt={reward.title}
                              className={`w-full h-40 object-cover rounded-lg mb-3 ${!isEligible ? 'grayscale' : ''}`}
                            />
                          )}
                          
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-lg text-primary">{reward.title}</h3>
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                              {reward.points_required} Points
                            </span>
                          </div>

                          {reward.description && (
                            <p className="text-sm text-[#666] mb-3">{reward.description}</p>
                          )}

                          <div className="flex items-center justify-between mb-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-[#888]">
                                Stock: {availableStock}
                              </span>
                              {reward.max_per_user && (
                                <span className="text-xs text-[#888]">
                                  You redeemed: {userRedeemedCount} / {reward.max_per_user}
                                </span>
                              )}
                            </div>
                            
                            <button
                              onClick={() => handleRedeemClick(reward)}
                              disabled={!isEligible || userPoints < reward.points_required || availableStock <= 0}
                              className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 ${
                                !isEligible || userPoints < reward.points_required || availableStock <= 0
                                  ? "bg-[#e0e0e0] text-[#888] cursor-not-allowed"
                                  : "bg-primary text-white hover:bg-[#1a73e8]"
                              }`}
                            >
                              {reward.redemption_type === 'organizer_scan' ? (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm15 0h3v3h-3v-3zm-2 2h2v2h-2v-2zm-2-2h2v2h-2v-2zm4 4h2v2h-2v-2zm-2 0h2v2h-2v-2z"/>
                                </svg>
                              ) : (
                                <Gift className="w-4 h-4" />
                              )}
                              {availableStock <= 0
                                ? "Out of Stock"
                                : !isEligible
                                ? "Unavailable"
                                : userPoints < reward.points_required
                                ? "Not Enough Points"
                                : reward.redemption_type === 'organizer_scan'
                                ? "Show QR"
                                : "Claim"}
                            </button>
                          </div>
                          
                          {/* Show additional info if available */}
                          {reward.exclusivity_group && (
                            <div className="mt-2">
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                {reward.exclusivity_group}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ));
              })()}
            </div>
          )
        ) : myRedemptions.length === 0 ? (
          <div className="text-[#888] text-center py-12">No redemptions yet.</div>
        ) : (
          <div className="grid gap-4 max-w-2xl mx-auto">
            {myRedemptions.map((redemption: any) => {
              // Map status to display
              const statusConfig = {
                completed: { bg: "bg-[#34A853]/10", text: "text-[#34A853]", label: "Completed" },
                pending: { bg: "bg-[#FBBC05]/10", text: "text-[#FBBC05]", label: "Pending" },
                cancelled: { bg: "bg-[#EA4335]/10", text: "text-[#EA4335]", label: "Cancelled" },
              };
              
              const status = statusConfig[redemption.status as keyof typeof statusConfig] || statusConfig.pending;
              const rewardTitle = redemption.reward?.title || `Reward #${redemption.reward_id}`;
              
              return (
                <div
                  key={redemption.id}
                  className="bg-white border border-[#e0e0e0] rounded-xl shadow p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg text-primary">
                      {rewardTitle}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    {redemption.redemption_code && (
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-3">
                        <div className="text-xs text-gray-500 mb-1">Redemption Code</div>
                        <div className="font-mono font-bold text-lg text-gray-800 tracking-wider">
                          {redemption.redemption_code}
                        </div>
                      </div>
                    )}

                    {redemption.status === 'pending' && (
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mb-3 text-amber-800 text-xs">
                        <p className="font-semibold mb-1">Action Required:</p>
                        Please go to the redemption booth and show your redemption code to claim this reward.
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-[#888]">Quantity:</span>
                      <span className="font-semibold text-[#222]">{redemption.qty}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[#888]">Points Spent:</span>
                      <span className="font-semibold text-primary">{redemption.points_spent}</span>
                    </div>
                    
                    {redemption.notes && (
                      <div className="pt-2 border-t border-gray-100">
                        <span className="text-[#888] text-xs">Notes:</span>
                        <p className="text-[#222] mt-1">{redemption.notes}</p>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t border-gray-100 text-xs text-[#888]">
                      <div>Redeemed: {new Date(redemption.redeemed_at).toLocaleString()}</div>
                      {redemption.completed_at && (
                        <div>Completed: {new Date(redemption.completed_at).toLocaleString()}</div>
                      )}
                      {redemption.status === 'pending' && redemption.redemption_code && (
                        <button 
                          onClick={() => {
                            setCurrentRedemptionCode(redemption.redemption_code);
                            setCurrentRedemptionRewardTitle(rewardTitle);
                            setShowRedemptionQrModal(true);
                          }}
                          className="mt-3 w-full py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm15 0h3v3h-3v-3zm-2 2h2v2h-2v-2zm-2-2h2v2h-2v-2zm4 4h2v2h-2v-2zm-2 0h2v2h-2v-2z"/>
                          </svg>
                          Show QR Code
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQrModal && userQrCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md text-center">
            {/* Reward Info */}
            {selectedReward && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedReward.title}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-semibold">
                    {selectedReward.points_required} Points
                  </span>
                </div>
              </div>
            )}

            {/* Instructions */}
            <p className="text-sm text-gray-600 mb-6">
              Show this QR code to the organizer to redeem your reward
            </p>

            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <img
                src={getQrCodeImageUrl(userQrCode) || ''}
                alt="Your QR Code"
                className="w-64 h-64 bg-gray-50 rounded-lg border-2 border-gray-200"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Crect fill='%23e0e0e0' width='256' height='256'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23888' font-size='16'%3ENo QR Code%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                setShowQrModal(false);
                setSelectedReward(null);
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Close
            </button>

            {/* Note */}
            <p className="text-xs text-gray-400 mt-4">
              The organizer will scan this code to complete your redemption
            </p>
          </div>
        </div>
      )}

      {/* Redemption QR Code Modal - Only for My Redemptions list */}
      {showRedemptionQrModal && currentRedemptionCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md text-center">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {currentRedemptionRewardTitle}
              </h3>
              <div className="text-sm text-gray-500">Redemption Code</div>
            </div>

            <div className="flex justify-center mb-6">
              <img
                src={getQrCodeImageUrl(currentRedemptionCode) || ''}
                alt="Redemption QR Code"
                className="w-64 h-64 bg-gray-50 rounded-lg border-2 border-gray-200"
              />
            </div>

            <button
              onClick={() => {
                setShowRedemptionQrModal(false);
                setCurrentRedemptionCode("");
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Close
            </button>

            <p className="text-xs text-gray-400 mt-4">
              Show this code to the organizer to complete your redemption
            </p>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.open && confirmModal.reward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm transform transition-all scale-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Redemption</h3>
              <p className="text-gray-600">
                Redeem <span className="font-bold text-gray-900">{confirmModal.reward.title}</span> for <span className="font-bold text-primary">{confirmModal.reward.points_required} points</span>?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal({open: false, reward: null})}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
                disabled={isRedeeming}
              >
                Cancel
              </button>
              <button
                onClick={processRedemption}
                className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                disabled={isRedeeming}
              >
                {isRedeeming ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Modal */}
      {successModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm relative">
            <button 
              onClick={() => setSuccessModal({open: false, type: 'success', message: ''})}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                successModal.type === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {successModal.type === 'success' ? (
                  <Check className="w-8 h-8 text-green-600" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {successModal.type === 'success' ? 'Success!' : 'Error'}
              </h3>
              <p className="text-gray-600 mb-4">{successModal.message}</p>

              {/* Show QR Code if available (for self_redeem) */}
              {successModal.type === 'success' && successModal.redemptionCode && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Show this code to organizer:
                  </p>
                  <div className="flex justify-center bg-white p-2 rounded-lg border border-gray-200 mb-2">
                    <img
                      src={getQrCodeImageUrl(successModal.redemptionCode) || ''}
                      alt="Redemption QR"
                      className="w-48 h-48"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    You can also find this later in "My Redemptions"
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSuccessModal({open: false, type: 'success', message: ''})}
              className={`w-full px-4 py-3 rounded-xl font-semibold transition-colors ${
                successModal.type === 'success' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}

  <TabBar activeTab="rewards" />
    </div>
  );
};

export default Rewards;
