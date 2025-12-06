import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ArrowLeft, Trophy, RotateCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrganizerTabBar from "@/components/OrganizerTabBar";

const API_URL = import.meta.env.VITE_API_URL;

interface Reward {
  id: number;
  title: string;
  description: string;
  redemption_type: string;
  stock: number;
}

interface Redemption {
  id: number;
  user_name: string;
  user_id: number;
  redemption_code: string;
  status: string;
}

const OrganizerLuckyDraw = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [participants, setParticipants] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Redemption | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  
  // Wheel animation state
  const [rotation, setRotation] = useState(0);
  const spinDuration = 5000; // 5 seconds

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
      
      // Filter only instant rewards
      const instantRewards = (res.data || []).filter(
        (r: Reward) => r.redemption_type === "instant"
      );
      setRewards(instantRewards);
    } catch (err) {
      console.error("Failed to fetch rewards:", err);
      setRewards([]);
    }
    setLoading(false);
  };

  const fetchParticipants = async (rewardId: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${API_URL}api/v1/organizers/rewards/${rewardId}/redemptions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Filter only completed redemptions
      const completedRedemptions = (res.data || []).filter(
        (r: Redemption) => r.status === "completed"
      );
      setParticipants(completedRedemptions);
    } catch (err) {
      console.error("Failed to fetch participants:", err);
      setParticipants([]);
    }
  };

  const handleRewardSelect = async (reward: Reward) => {
    setSelectedReward(reward);
    setWinner(null);
    setRotation(0);
    await fetchParticipants(reward.id);
  };

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context state
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    const sliceAngle = (2 * Math.PI) / Math.max(participants.length, 1);
    const colors = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#9C27B0", "#00BCD4"];

    participants.forEach((participant, index) => {
      const startAngle = index * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      const color = colors[index % colors.length];

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px Arial";
      ctx.fillText(
        participant.user_name.length > 20
          ? participant.user_name.substring(0, 17) + "..."
          : participant.user_name,
        radius - 20,
        5
      );
      ctx.restore();
    });

    ctx.restore();

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#4285F4";
    ctx.lineWidth = 5;
    ctx.stroke();

    // Draw pointer (arrow at top)
    ctx.save();
    ctx.translate(centerX, 30);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-20, -40);
    ctx.lineTo(20, -40);
    ctx.closePath();
    ctx.fillStyle = "#EA4335";
    ctx.fill();
    ctx.restore();
  };

  useEffect(() => {
    if (participants.length > 0) {
      drawWheel();
    }
  }, [participants, rotation]);

  const spinWheel = () => {
    if (spinning || participants.length === 0) return;

    setSpinning(true);
    setWinner(null);

    // Select random winner
    const randomIndex = Math.floor(Math.random() * participants.length);
    const selectedWinner = participants[randomIndex];

    // Calculate target rotation
    const sliceAngle = 360 / participants.length;
    const targetAngle = 360 - (randomIndex * sliceAngle + sliceAngle / 2);
    const spinRotations = 5; // Number of full rotations
    const finalRotation = spinRotations * 360 + targetAngle;

    // Animate rotation
    const startTime = Date.now();
    const startRotation = rotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + finalRotation * easeOut;

      setRotation(currentRotation % 360);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setWinner(selectedWinner);
        setShowWinnerModal(true);
        setSpinning(false);
      }
    };

    animate();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/organizer")} className="text-blue-500">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-blue-500">Lucky Draw Spin Wheel</h1>
        </div>
      </header>

      <main className="px-6 py-6">
        {!selectedReward ? (
          /* Reward Selection */
          <>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Select Reward for Lucky Draw</h2>
            
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : rewards.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">No instant rewards available</p>
              </div>
            ) : (
              <div className="space-y-4 max-w-2xl mx-auto">
                {rewards.map((reward) => (
                  <button
                    key={reward.id}
                    onClick={() => handleRewardSelect(reward)}
                    className="w-full bg-white rounded-xl p-5 shadow border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition text-left"
                  >
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{reward.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Instant Reward
                      </span>
                      <span className="text-sm text-gray-500">Stock: {reward.stock}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Spin Wheel - Desktop Layout: Wheel (left) + Sidebar (right) */
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-xl border border-gray-100 mb-4 md:mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">{selectedReward.title}</h2>
                  <p className="text-sm md:text-base text-gray-600">{participants.length} participants</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedReward(null);
                    setParticipants([]);
                    setWinner(null);
                    setRotation(0);
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800 font-semibold"
                >
                  Change Reward
                </button>
              </div>
            </div>

            {participants.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-xl border border-gray-100 text-center text-gray-500">
                <p className="text-lg">No participants yet</p>
                <p className="text-sm">Wait for participants to redeem this reward</p>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                {/* Left: Spin Wheel (larger on desktop) */}
                <div className="flex-1 bg-white rounded-2xl p-4 md:p-8 shadow-xl border border-gray-100">
                  {/* Canvas Wheel - Responsive sizing */}
                  <div className="flex justify-center mb-6">
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={600}
                      className="border-4 border-gray-200 rounded-full shadow-lg max-w-full h-auto"
                      style={{ maxWidth: "600px", maxHeight: "600px" }}
                    />
                  </div>

                  {/* Spin Button */}
                  <button
                    onClick={spinWheel}
                    disabled={spinning}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-3 shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCw className={`w-5 h-5 md:w-6 md:h-6 ${spinning ? "animate-spin" : ""}`} />
                    {spinning ? "Spinning..." : "Spin the Wheel!"}
                  </button>

                  {winner && !showWinnerModal && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                      <p className="text-sm text-green-700 font-semibold">Winner Selected!</p>
                      <p className="text-lg font-bold text-green-900">{winner.user_name}</p>
                    </div>
                  )}
                </div>

                {/* Right: Participants Sidebar (compact on desktop) */}
                <div className="w-full lg:w-80 xl:w-96 bg-white rounded-2xl p-4 md:p-5 shadow-xl border border-gray-100 flex flex-col">
                  <h3 className="font-bold text-base md:text-lg text-gray-900 mb-3 flex items-center justify-between">
                    <span>Participants</span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {participants.length}
                    </span>
                  </h3>
                  
                  {/* Scrollable participants list */}
                  <div className="flex-1 overflow-y-auto space-y-2 max-h-[500px] lg:max-h-[700px]">
                    {participants.map((participant, index) => (
                      <div
                        key={participant.id}
                        className={`p-3 rounded-lg border transition-all ${
                          winner?.id === participant.id
                            ? "bg-green-50 border-green-300 shadow-md"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-gray-900 truncate">
                            {index + 1}. {participant.user_name}
                          </span>
                          {winner?.id === participant.id && (
                            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                              WINNER
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 font-mono">{participant.redemption_code}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Winner Modal */}
      {showWinnerModal && winner && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md text-center relative overflow-hidden">
            {/* Confetti effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" />
              <div className="absolute top-0 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              <div className="absolute top-0 left-1/3 w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>

            {/* Trophy Icon */}
            <div className="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-16 h-16 text-yellow-600" />
            </div>

            {/* Winner Info */}
            <h3 className="text-3xl font-bold text-gray-900 mb-2">🎉 We Have a Winner! 🎉</h3>
            <p className="text-2xl font-bold text-blue-600 mb-2">{winner.user_name}</p>
            <p className="text-sm text-gray-600 mb-6">
              Code: <span className="font-mono font-bold">{winner.redemption_code}</span>
            </p>

            {/* Reward Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Prize</p>
              <p className="font-bold text-gray-900">{selectedReward.title}</p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                setShowWinnerModal(false);
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-base transition-colors"
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

export default OrganizerLuckyDraw;
