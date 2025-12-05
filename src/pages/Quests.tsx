import { useEffect, useState } from "react";
import axios from "axios";
import TabBar from "@/components/TabBar";
import { Camera } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

const Quests = () => {
  const [quests, setQuests] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"available" | "my">("available");
  const [activeQuest, setActiveQuest] = useState<any>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth";
      return;
    }
    setLoading(true);
    axios
      .get(`${API_URL}api/v1/participants/quests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Adjust to new response: QuestWithProgress { quest: {...}, is_completed, current_count, target_count, progress_percentage }
        const data = Array.isArray(res.data) ? res.data : [];
        const flattened = data.map((qwp: any) => ({
          // flatten quest fields to top-level for UI
          ...qwp.quest,
          // keep progress fields
          is_completed: qwp.is_completed,
          current_count: qwp.current_count,
          target_count: qwp.target_count,
          progress_percentage: qwp.progress_percentage,
        }));
        setQuests(flattened);
      })
      .catch(() => setQuests([]));

    axios
      .get(`${API_URL}api/v1/participants/quests/my-submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSubmissions(res.data))
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  }, []);

  // Map quest id to submission status
  const submissionMap: Record<number, any> = {};
  submissions.forEach((s: any) => {
    submissionMap[s.quest_id] = s;
  });

  // Filter for "My Submissions" tab
  const mySubmittedQuests = quests.filter((q: any) => submissionMap[q.id]);

  // Handle photo upload (just show "Coming soon" for now)
  const handlePhotoClick = () => {
    setComingSoon(true);
    setTimeout(() => setComingSoon(false), 2000);
  };

  // Handle answer change
  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
  };

  // Submit quest (text type)
  const handleSubmitTextQuest = async () => {
    if (!activeQuest || !answer) return;
    setSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${API_URL}api/v1/participants/quests/submit`, {
        quest_id: activeQuest.id,
        answer_text: answer,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActiveQuest(null);
      setAnswer("");
      // Refresh submissions
      const res = await axios.get(`${API_URL}api/v1/participants/quests/my-submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmissions(res.data);
    } catch {
      // handle error
    }
    setSubmitting(false);
  };

  // Submit quest (photo type only for demo)
  const handleSubmitQuest = async () => {
    if (!activeQuest || !photo) return;
    setSubmitting(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("quest_id", activeQuest.id);
    formData.append("photo", photo);
    try {
      await axios.post(`${API_URL}api/v1/participants/quests/submit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setActiveQuest(null);
      setPhoto(null);
      // Refresh submissions
      const res = await axios.get(`${API_URL}api/v1/participants/quests/my-submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmissions(res.data);
    } catch {
      // handle error
    }
    setSubmitting(false);
  };

  // Click LINK_CLICK quest: open link and notify server
  const handleClickLinkQuest = async (quest: any) => {
    if (!quest?.id || !quest?.link_url) return;
    const token = localStorage.getItem("token");
    try {
      // open link in new tab
      window.open(quest.link_url, "_blank", "noopener,noreferrer");
      // record click
      await axios.post(
        `${API_URL}api/v1/participants/quests/${quest.id}/click`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // refresh submissions to reflect completion
      const res = await axios.get(`${API_URL}api/v1/participants/quests/my-submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmissions(res.data);
    } catch {
      // silently fail to avoid blocking UX
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#222] pb-16">
      <div className="px-6 py-6">
        <h2 className="text-2xl font-bold mb-4">Quests</h2>
        {/* Tabs */}
        <div className="flex gap-8 mb-6 border-b border-[#e0e0e0]">
          <button
            className={`pb-2 text-lg font-bold border-b-2 transition-all ${tab === "available" ? "border-primary text-primary" : "border-transparent text-[#888]"}`}
            onClick={() => setTab("available")}
          >
            Available Quests
          </button>
          <button
            className={`pb-2 text-lg font-bold border-b-2 transition-all ${tab === "my" ? "border-primary text-primary" : "border-transparent text-[#888]"}`}
            onClick={() => setTab("my")}
          >
            My Submissions
          </button>
        </div>
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : tab === "available" ? (
          quests.length === 0 ? (
            <div className="text-[#888] text-center">No quests available.</div>
          ) : (
            <div className="grid gap-6 max-w-2xl mx-auto">
              {quests.map((quest: any) => {
                const submission = submissionMap[quest.id];
                const type = quest.quest_type;

                // helper flags
                const isAutoByScan = type === "booth_scan" || type === "organizer_scan";
                const isNetworking = type === "networking";
                const isLinkClick = type === "link_click";
                const isUrlSubmission = type === "url_submission";
                const isText = type === "text_answer";
                const isPhoto = type === "photo_upload";

                return (
                  <div
                    key={quest.id}
                    className="bg-white border border-[#e0e0e0] rounded-xl shadow p-5 flex flex-col"
                  >
                    {/* Optional image/banner */}
                    {quest.image_url && (
                      <img src={quest.image_url} alt="" className="rounded-xl mb-3 max-h-40 object-cover w-full" />
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-lg text-primary">{quest.title}</span>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                        +{quest.points} Points
                      </span>
                    </div>
                    <div className="text-sm text-[#666] mb-2">{quest.description}</div>
                    <div className="flex items-center gap-2 mb-2">
                      {quest.requires_approval && (
                        <span className="bg-[#EA4335]/10 text-[#EA4335] px-3 py-1 rounded-full text-xs font-semibold">
                          Needs Approval
                        </span>
                      )}
                      {/* progress chip for networking */}
                      {isNetworking && typeof quest.progress_percentage === "number" && (
                        <span className="bg-[#34A853]/10 text-[#34A853] px-3 py-1 rounded-full text-xs font-semibold">
                          {quest.current_count ?? 0}/{quest.target_count ?? 0}
                        </span>
                      )}
                    </div>

                    {/* Link URL display */}
                    {isLinkClick && quest.link_url && (
                      <div className="text-xs text-blue-500 mb-3 break-all flex items-center gap-1">
                        <span className="text-gray-400">Link:</span>
                        {quest.link_url}
                      </div>
                    )}

                    {/* Networking progress bar */}
                    {isNetworking && (
                      <div className="mb-3">
                        <div className="h-2 bg-[#eee] rounded">
                          <div
                            className="h-2 bg-primary rounded"
                            style={{ width: `${Math.min(100, quest.progress_percentage ?? 0)}%` }}
                          />
                        </div>
                        <div className="text-xs text-[#888] mt-1">
                          Progress: {quest.progress_percentage ?? 0}%
                        </div>
                      </div>
                    )}

                    {/* Hint for scan-based quests */}
                    {isAutoByScan && (
                      <div className="text-xs text-[#888] mb-2">
                        Show your QR to {type === "booth_scan" ? "booth staff" : "organizer"} to complete.
                      </div>
                    )}

                    {/* Link click CTA */}
                    {isLinkClick && quest.link_url && !submission && (
                      <div className="flex justify-end">
                        <button
                          className="bg-primary text-white px-5 py-2 rounded font-bold shadow hover:bg-[#1a73e8] transition-all"
                          onClick={() => handleClickLinkQuest(quest)}
                        >
                          Open & Complete
                        </button>
                      </div>
                    )}

                    {/* Start/Status */}
                    <div className="flex justify-end">
                      {!submission && !isAutoByScan && !isNetworking && !isLinkClick && (
                        <button
                          className="bg-primary text-white px-5 py-2 rounded font-bold shadow hover:bg-[#1a73e8] transition-all"
                          onClick={() => setActiveQuest(quest)}
                        >
                          Start Quest
                        </button>
                      )}
                      {submission && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold
                          ${submission.status === "approved"
                            ? "bg-[#34A853]/10 text-[#34A853]"
                            : submission.status === "pending"
                              ? "bg-[#FBBC05]/10 text-[#FBBC05]"
                              : "bg-[#EA4335]/10 text-[#EA4335]"
                          }`}>
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <div className="grid gap-6 max-w-2xl mx-auto">
            {mySubmittedQuests.length === 0 ? (
              <div className="text-[#888] text-center">No submissions yet.</div>
            ) : (
              mySubmittedQuests.map((quest: any) => {
                const submission = submissionMap[quest.id];
                return (
                  <div
                    key={quest.id}
                    className="bg-white border border-[#e0e0e0] rounded-xl shadow p-5 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-lg text-primary">{quest.title}</span>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                        +{quest.points} Points
                      </span>
                    </div>
                    <div className="text-sm text-[#666] mb-2">{quest.description}</div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-[#e0e0e0] text-[#222] px-3 py-1 rounded-full text-xs font-semibold">
                        {quest.quest_type.replace(/_/g, " ")}
                      </span>
                      {quest.requires_approval && (
                        <span className="bg-[#EA4335]/10 text-[#EA4335] px-3 py-1 rounded-full text-xs font-semibold">
                          Needs Approval
                        </span>
                      )}
                    </div>
                    {submission && (
                      <div className="mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold
                          ${submission.status === "approved"
                            ? "bg-[#34A853]/10 text-[#34A853]"
                            : submission.status === "pending"
                              ? "bg-[#FBBC05]/10 text-[#FBBC05]"
                              : "bg-[#EA4335]/10 text-[#EA4335]"
                          }`}>
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </span>
                        {submission.answer_text && (
                          <div className="mt-2 text-xs text-[#888]">
                            <span className="font-semibold">Answer:</span> {submission.answer_text}
                          </div>
                        )}
                        {submission.photo_url && (
                          <div className="mt-2">
                            <img src={submission.photo_url} alt="Quest Submission" className="max-h-32 rounded-lg border" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Popup for Start Quest */}
      {activeQuest && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-[#f6f8fa] rounded-2xl shadow-xl p-8 max-w-xs w-full text-center border border-[#e0e0e0]">
            <h3 className="text-2xl font-bold mb-2">{activeQuest.title}</h3>
            <div className="mb-2 text-[#222]">{activeQuest.description}</div>
            <div className="mb-2 font-bold text-[#FBBC05]">Points: {activeQuest.points}</div>
            {/* Render by quest type */}
            {activeQuest.quest_type === "photo_upload" ? (
              <>
                <div className="mb-4 text-[#222]">Take a photo to complete this quest</div>
                <label className="flex flex-col items-center mb-4">
                  <button
                    type="button"
                    className="flex items-center gap-2 bg-white border border-[#e0e0e0] px-6 py-3 rounded-full font-bold shadow hover:bg-[#f6f8fa] transition-all"
                    onClick={handlePhotoClick}
                    id="take-photo-btn"
                  >
                    <Camera className="w-5 h-5 text-primary" />
                    Take Photo
                  </button>
                  {comingSoon && (
                    <span className="mt-3 text-[#888] font-semibold">Coming soon...</span>
                  )}
                </label>
                <div className="flex justify-between mt-6">
                  <button
                    className="text-[#4285F4] font-bold px-4 py-2 rounded"
                    onClick={() => { setActiveQuest(null); setPhoto(null); setComingSoon(false); }}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-primary text-white font-bold px-6 py-2 rounded-full shadow hover:bg-[#1a73e8] transition-all"
                    disabled
                  >
                    Submit
                  </button>
                </div>
              </>
            ) : activeQuest.quest_type === "text_answer" ? (
              <>
                <div className="mb-4 text-[#222]">Enter your answer below</div>
                <textarea
                  className="w-full rounded-xl border border-[#e0e0e0] p-4 text-base mb-4"
                  rows={4}
                  placeholder="Your Answer"
                  value={answer}
                  onChange={handleAnswerChange}
                />
                <div className="flex justify-between mt-2">
                  <button
                    className="text-[#4285F4] font-bold px-4 py-2 rounded"
                    onClick={() => { setActiveQuest(null); setAnswer(""); }}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-primary text-white font-bold px-6 py-2 rounded-full shadow hover:bg-[#1a73e8] transition-all"
                    onClick={handleSubmitTextQuest}
                    disabled={!answer}
                  >
                    Submit
                  </button>
                </div>
              </>
            ) : activeQuest.quest_type === "url_submission" ? (
              <>
                <div className="mb-4 text-[#222]">Submit your post URL below</div>
                <textarea
                  className="w-full rounded-xl border border-[#e0e0e0] p-4 text-base mb-4"
                  rows={3}
                  placeholder="https://example.com/your-post"
                  value={answer}
                  onChange={handleAnswerChange}
                />
                <div className="flex justify-between mt-2">
                  <button
                    className="text-[#4285F4] font-bold px-4 py-2 rounded"
                    onClick={() => { setActiveQuest(null); setAnswer(""); }}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-primary text-white font-bold px-6 py-2 rounded-full shadow hover:bg-[#1a73e8] transition-all"
                    onClick={handleSubmitTextQuest}
                    disabled={!answer}
                  >
                    Submit
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Fallback for unsupported manual types */}
                <div className="mb-4 text-[#888]">
                  This quest is completed via scanning or link click.
                </div>
                <button
                  className="mt-2 text-[#4285F4] font-bold px-4 py-2 rounded"
                  onClick={() => { setActiveQuest(null); setAnswer(""); setPhoto(null); }}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <TabBar activeTab="quests" />
    </div>
  );
};

export default Quests;