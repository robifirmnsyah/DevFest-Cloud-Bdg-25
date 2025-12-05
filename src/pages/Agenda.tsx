import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, MapPin, Clock, User, Search, Filter, X } from "lucide-react";
import TabBar from "@/components/TabBar";
import OrganizerTabBar from "@/components/OrganizerTabBar";
const API_URL = import.meta.env.VITE_API_URL;

const Agenda = () => {
  const [tab, setTab] = useState<"all" | "my">("all");
  const [sessions, setSessions] = useState<any[]>([]);
  const [myAgenda, setMyAgenda] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [sessionToCancel, setSessionToCancel] = useState<any>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth";
      return;
    }
    setLoading(true);
    axios
      .get(`${API_URL}api/v1/participants/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSessions(res.data))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));

    axios
      .get(`${API_URL}api/v1/participants/sessions/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMyAgenda(res.data))
      .catch(() => setMyAgenda([]));
  }, []);

  // Get unique tracks for filter
  const allTracks = [...new Set(sessions.map(s => s.track).filter(Boolean))];

  // Filter and search logic
  let displayedSessions = tab === "all" ? sessions : myAgenda.map(a => a.session);
  
  // Apply search filter
  if (searchQuery) {
    displayedSessions = displayedSessions.filter(s => 
      s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.speaker?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Apply track filter
  if (selectedTrack !== "all") {
    displayedSessions = displayedSessions.filter(s => s.track === selectedTrack);
  }

  // No more day grouping - just show all sessions in chronological order
  // Sort by start_time
  displayedSessions.sort((a, b) => 
    new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  // Detect role for tab bar
  const role = localStorage.getItem("role");

  // Handle cancel booking
  const handleCancelBooking = async (sessionId: number) => {
    const token = localStorage.getItem("token");
    setCancelLoading(true);
    try {
      const response = await axios.delete(`${API_URL}api/v1/participants/sessions/${sessionId}/cancel`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      console.log('Cancel response:', response.data);
      
      // Refresh data after cancellation
      const sessionsRes = await axios.get(`${API_URL}api/v1/participants/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(sessionsRes.data);
      
      const agendaRes = await axios.get(`${API_URL}api/v1/participants/sessions/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyAgenda(agendaRes.data);
      
      // Close modal and show success
      setCancelModalOpen(false);
      setSessionToCancel(null);
      
    } catch (err: any) {
      console.error('Cancel booking error:', err);
      const errorMessage = err?.response?.data?.message || 
                          err?.response?.data?.detail?.[0]?.msg || 
                          `Failed to cancel booking (${err?.response?.status || 'Unknown error'})`;
      alert(errorMessage);
    }
    setCancelLoading(false);
  };

  // Handle book session
  const handleBookSession = async (sessionId: number) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${API_URL}api/v1/participants/sessions/book`, { session_id: sessionId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Refresh data
      const [sessionsRes, agendaRes] = await Promise.all([
        axios.get(`${API_URL}api/v1/participants/sessions`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}api/v1/participants/sessions/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);
      
      setSessions(sessionsRes.data);
      setMyAgenda(agendaRes.data);
    } catch (err: any) {
      console.error("Booking failed", err);
      alert(err?.response?.data?.detail || "Failed to book session");
    }
  };

  const openCancelModal = (session: any) => {
    setSessionToCancel(session);
    setCancelModalOpen(true);
  };

  // Check if session has started or can be cancelled
  const canCancelSession = (session: any) => {
    const now = new Date();
    const sessionStart = new Date(session.start_time);
    return now < sessionStart;
  };

  // Get session status message
  const getSessionStatus = (session: any) => {
    const now = new Date();
    const sessionStart = new Date(session.start_time);
    const sessionEnd = new Date(session.end_time);
    
    if (now >= sessionEnd) {
      return { status: 'completed', message: 'This session has already completed.', color: 'gray' };
    } else if (now >= sessionStart) {
      return { status: 'started', message: 'This session has already started and cannot be cancelled.', color: 'red' };
    } else {
      return { status: 'upcoming', message: 'You can cancel this booking until the session starts.', color: 'green' };
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#222] pb-16">
      <header className="bg-white shadow-sm px-6 py-4">
        <h1 className="text-2xl font-bold text-primary text-center">Agenda</h1>
        <div className="flex justify-center mt-6 mb-2 gap-8">
          <button
            className={`text-lg font-bold pb-2 border-b-2 ${tab === "my" ? "border-primary text-primary" : "border-transparent text-[#888]"}`}
            onClick={() => setTab("my")}
          >
            My Agenda
          </button>
          <button
            className={`text-lg font-bold pb-2 border-b-2 ${tab === "all" ? "border-primary text-primary" : "border-transparent text-[#888]"}`}
            onClick={() => setTab("all")}
          >
            All Sessions
          </button>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="mt-4 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sessions, speakers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
            {selectedTrack !== "all" && (
              <span className="ml-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">1</span>
            )}
          </button>
          
          {/* Filter Options */}
          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Track</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTrack("all")}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedTrack === "all"
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All Tracks
                  </button>
                  {allTracks.map((track) => (
                    <button
                      key={track}
                      onClick={() => setSelectedTrack(track)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedTrack === track
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {track}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Clear Filters Button */}
              {(selectedTrack !== "all" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedTrack("all");
                    setSearchQuery("");
                  }}
                  className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </header>
      
      <div className="px-4 pt-2">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : displayedSessions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No sessions found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {displayedSessions.map((session: any) => (
              <div
                key={session.id}
                className="bg-white border border-[#e0e0e0] rounded-xl shadow mb-6 p-5 max-w-2xl w-full flex flex-col relative"
                style={{ minWidth: 0 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                    <User className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg">{session.speaker || "No Speaker"}</div>
                    <div className="text-sm text-[#888]">{session.track || session.description}</div>
                  </div>
                  {/* Book/Cancel Button - top right */}
                  {tab === "all" ? (
                    session.is_bookable ? (
                      session.is_booked ? (
                        <span className="text-[#4285F4] font-bold text-base px-4 py-2" style={{ minWidth: 90, textAlign: 'center' }}>
                          Booked
                        </span>
                      ) : (
                        <button
                          className={`rounded-full px-6 py-2 font-bold text-base shadow transition-all
                            ${session.is_full
                                ? "bg-[#e0e0e0] text-[#888] cursor-not-allowed"
                                : "bg-[#4285F4] text-white hover:bg-[#1a73e8]"}
                          `}
                          style={{ minWidth: 90 }}
                          disabled={session.is_full}
                          onClick={() => {
                            if (!session.is_full) {
                              handleBookSession(session.id);
                            }
                          }}
                        >
                          {session.is_full ? "Full" : "Book"}
                        </button>
                      )
                    ) : null
                  ) : (
                    /* Cancel Button for My Agenda */
                    <button
                      className="rounded-full px-6 py-2 font-bold text-base shadow transition-all bg-red-500 hover:bg-red-600 text-white"
                      style={{ minWidth: 90 }}
                      onClick={() => openCancelModal(session)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
                {/* Time, Location */}
                <div className="flex items-center gap-4 text-sm mb-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>
                    {new Date(session.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {new Date(session.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{session.location}</span>
                </div>
                <div className="font-bold text-lg mb-1">{session.title}</div>
                <div className="text-sm text-[#666] mb-2">{session.description}</div>
                <div className="flex gap-2 flex-wrap mb-2">
                  {session.track && (
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">{session.track}</span>
                  )}
                  {session.is_hybrid && (
                    session.live_url ? (
                      <a
                        href={session.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-semibold hover:bg-red-100 transition-colors"
                      >
                        📺 Watch on YouTube
                      </a>
                    ) : (
                      <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">On YouTube</span>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && sessionToCancel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md relative">
            {(() => {
              const sessionStatus = getSessionStatus(sessionToCancel);
              const canCancel = canCancelSession(sessionToCancel);
              
              return (
                <>
            {/* Close button */}
            <button
              onClick={() => { setCancelModalOpen(false); setSessionToCancel(null); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={cancelLoading}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                canCancel ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                {canCancel ? (
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {canCancel ? 'Cancel Session Booking' : 'Cannot Cancel Booking'}
              </h3>
              <p className="text-gray-600">
                {canCancel 
                  ? 'Are you sure you want to cancel your booking for this session?' 
                  : 'This session booking cannot be cancelled.'
                }
              </p>
            </div>

            {/* Session Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 mb-1">{sessionToCancel.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{sessionToCancel.speaker}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(sessionToCancel.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {sessionToCancel.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className={`border rounded-lg p-3 mb-6 ${
              sessionStatus.color === 'red' ? 'bg-red-50 border-red-200' :
              sessionStatus.color === 'gray' ? 'bg-gray-50 border-gray-200' :
              'bg-amber-50 border-amber-200'
            }`}>
              <p className={`text-sm ${
                sessionStatus.color === 'red' ? 'text-red-700' :
                sessionStatus.color === 'gray' ? 'text-gray-700' :
                'text-amber-700'
              }`}>
                <strong>
                  {sessionStatus.status === 'started' ? 'Session Started:' :
                   sessionStatus.status === 'completed' ? 'Session Completed:' :
                   'Note:'}
                </strong> {sessionStatus.message}
                {canCancel && ' Once cancelled, you may not be able to book this session again if it becomes full.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {canCancel ? (
                <>
                  <button
                    onClick={() => { setCancelModalOpen(false); setSessionToCancel(null); }}
                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
                    disabled={cancelLoading}
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={() => handleCancelBooking(sessionToCancel.id)}
                    className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={cancelLoading}
                  >
                    {cancelLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cancelling...
                      </>
                    ) : (
                      'Yes, Cancel Booking'
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setCancelModalOpen(false); setSessionToCancel(null); }}
                  className="w-full px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
                >
                  Close
                </button>
              )}
      </div>
          </>
        );
      })()}
    </div>
  </div>
)}

      {role === "organizer"
        ? <OrganizerTabBar activeTab="agenda" />
        : <TabBar activeTab="agenda" />
      }
    </div>
  );
};

export default Agenda;
