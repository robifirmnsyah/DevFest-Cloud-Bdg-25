import { useEffect, useState } from "react";
import axios from "axios";
import TabBar from "@/components/TabBar";
import { Gift, Award } from "lucide-react";

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth";
      return;
    }

    setLoading(true);
    
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

    // Fetch my redemptions
    axios
      .get(`${API_URL}api/v1/participants/rewards/my-redemptions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Redemptions response:", res.data);
        setMyRedemptions(res.data);
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
  }, []);

  const handleShowQrForRedeem = (reward: any, pointsRequired: number) => {
    if (userPoints < pointsRequired) {
      alert("Not enough points to redeem this reward!");
      return;
    }

    setSelectedReward(reward);
    setShowQrModal(true);
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
            <div className="grid gap-4 max-w-2xl mx-auto">
              {rewards.map((item: any) => {
                const reward = item.reward;
                const isEligible = item.is_eligible;
                const ineligibleReason = item.ineligible_reason;
                const userRedeemedCount = item.user_redeemed_count || 0;
                const availableStock = reward.stock || 0;
                
                return (
                  <div
                    key={reward.id}
                    className="bg-white border border-[#e0e0e0] rounded-xl shadow p-5"
                  >
                    {reward.image_url && (
                      <img
                        src={reward.image_url}
                        alt={reward.title}
                        className="w-full h-40 object-cover rounded-lg mb-3"
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
                        onClick={() => handleShowQrForRedeem(reward, reward.points_required)}
                        disabled={!isEligible || userPoints < reward.points_required || availableStock <= 0}
                        className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 ${
                          !isEligible || userPoints < reward.points_required || availableStock <= 0
                            ? "bg-[#e0e0e0] text-[#888] cursor-not-allowed"
                            : "bg-primary text-white hover:bg-[#1a73e8]"
                        }`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm15 0h3v3h-3v-3zm-2 2h2v2h-2v-2zm-2-2h2v2h-2v-2zm4 4h2v2h-2v-2zm-2 0h2v2h-2v-2z"/>
                        </svg>
                        {availableStock <= 0
                          ? "Out of Stock"
                          : !isEligible
                          ? ineligibleReason || "Not Eligible"
                          : userPoints < reward.points_required
                          ? "Not Enough Points"
                          : "Redeem"}
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
          )
        ) : myRedemptions.length === 0 ? (
          <div className="text-[#888] text-center py-12">No redemptions yet.</div>
        ) : (
          <div className="grid gap-4 max-w-2xl mx-auto">
            {myRedemptions.map((redemption: any) => (
              <div
                key={redemption.id}
                className="bg-white border border-[#e0e0e0] rounded-xl shadow p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-primary">
                    {redemption.reward?.title || "Reward"}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      redemption.is_claimed
                        ? "bg-[#34A853]/10 text-[#34A853]"
                        : "bg-[#FBBC05]/10 text-[#FBBC05]"
                    }`}
                  >
                    {redemption.is_claimed ? "Claimed" : "Pending"}
                  </span>
                </div>

                {redemption.reward?.description && (
                  <p className="text-sm text-[#666] mb-2">
                    {redemption.reward.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs text-[#888]">
                  <span>Redeemed: {new Date(redemption.redeemed_at).toLocaleDateString()}</span>
                  {redemption.is_claimed && redemption.claimed_at && (
                    <span>• Claimed: {new Date(redemption.claimed_at).toLocaleDateString()}</span>
                  )}
                </div>

                {!redemption.is_claimed && (
                  <div className="mt-3">
                    <div className="p-3 bg-[#FBBC05]/10 rounded-lg mb-3">
                      <p className="text-xs text-[#FBBC05] font-semibold mb-2">
                        Show your QR code to organizer to claim this reward
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedReward(redemption.reward);
                        setShowQrModal(true);
                      }}
                      className="w-full bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#1a73e8] transition"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm15 0h3v3h-3v-3zm-2 2h2v2h-2v-2zm-2-2h2v2h-2v-2zm4 4h2v2h-2v-2zm-2 0h2v2h-2v-2z"/>
                      </svg>
                      Show My QR Code
                    </button>
                  </div>
                )}
              </div>
            ))}
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

      <TabBar activeTab="quests" />
    </div>
  );
};

export default Rewards;
