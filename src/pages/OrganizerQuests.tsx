import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, User, Award } from "lucide-react";
import OrganizerTabBar from "@/components/OrganizerTabBar";

const API_URL = import.meta.env.VITE_API_URL;

const OrganizerQuests = () => {
  const [pendingQuests, setPendingQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    fetchPendingQuests();
  }, []);

  const fetchPendingQuests = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${API_URL}api/v1/organizers/quests/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingQuests(res.data ?? []);
    } catch (err) {
      console.error("Failed to fetch pending quests:", err);
      setError("Failed to fetch quests. Please try again.");
      setPendingQuests([]);
    }
    setLoading(false);
  };

  const handleReviewQuest = async (
    submissionId: number,
    status: "approved" | "rejected" | "pending",
    reviewNotes?: string
  ) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${API_URL}api/v1/organizers/quests/${submissionId}/review`,
        { status, review_notes: reviewNotes || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchPendingQuests();
    } catch (err) {
      console.error("Failed to review quest:", err);
      alert("Failed to review quest. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">R</div>
          <h1 className="text-lg font-semibold text-gray-900">Organizer: Quest Review</h1>
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </header>

      <main className="px-6 py-6 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Pending Quest Submissions</h2>
          <button
            className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
            onClick={fetchPendingQuests}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-blue-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : pendingQuests.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No pending submissions.</div>
        ) : (
          pendingQuests.map((submission: any) => (
            <div key={submission.id} className="bg-white rounded-xl p-6 mb-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg text-gray-900">{submission.quest?.title}</span>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>
                  Pending
                </span>
              </div>
              {submission.quest?.description && (
                <div className="text-sm text-gray-600 mb-2">{submission.quest.description}</div>
              )}
              {/* Answer text (URL or plain text). Show link if looks like URL; else show text. If missing, show a placeholder */}
              <div className="rounded-lg p-3 mb-3 border border-gray-100 bg-gray-50">
                <div className="text-xs font-semibold text-gray-500 mb-1">Answer</div>
                {submission.answer_text ? (
                  /^https?:\/\//.test(submission.answer_text) ? (
                    <a href={submission.answer_text} target="_blank" rel="noopener noreferrer" className="text-blue-600 break-all">
                      {submission.answer_text}
                    </a>
                  ) : (
                    <div className="text-gray-800 break-words">{submission.answer_text}</div>
                  )
                ) : (
                  <div className="text-gray-400">No answer provided</div>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-4 mb-2 border border-gray-100">
                <User className="w-5 h-5 text-blue-500" />
                <span className="text-xs">User ID: {submission.user_id}</span>
                <span className="text-xs flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  {new Date(submission.submitted_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-yellow-300 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Award className="w-4 h-4" /> {submission.quest?.points} points
                </span>
              </div>
              {/* Review notes input */}
              <div className="mt-3">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Review Notes (optional)</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  rows={3}
                  placeholder="Add a note for this review..."
                  defaultValue={submission.review_notes || ""}
                  onChange={(e) => {
                    submission._review_notes = e.target.value;
                  }}
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded font-bold"
                  onClick={() => handleReviewQuest(submission.id, "pending", submission._review_notes)}
                  title="Mark as pending"
                >
                  Mark Pending
                </button>
                <button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded font-bold"
                  onClick={() => handleReviewQuest(submission.id, "rejected", submission._review_notes)}
                >
                  Reject
                </button>
                <button
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded font-bold"
                  onClick={() => handleReviewQuest(submission.id, "approved", submission._review_notes)}
                >
                  Approve
                </button>
              </div>
            </div>
          ))
        )}
      </main>

      <OrganizerTabBar activeTab="hub" />
    </div>
  );
};

export default OrganizerQuests;
