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

  // Group by day (assume start_time is ISO string)
  const sessionsByDay: Record<string, any[]> = {};
  displayedSessions.forEach((s) => {
    // Fix: Day 1 untuk tanggal lebih awal, Day 2 untuk tanggal lebih akhir
    const day = s.start_time?.includes("2025-11-20") ? "Day 2" : "Day 1";
    if (!sessionsByDay[day]) sessionsByDay[day] = [];
    sessionsByDay[day].push(s);
  });

  // Day label mapping (tanpa tanggal)
  const dayLabels: Record<string, string> = {
    "Day 1": "Day 1",
    "Day 2": "Day 2",
  };

  // Detect role for tab bar
  const role = localStorage.getItem("role");

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
          Object.entries(sessionsByDay).map(([day, items]) => (
            <div key={day} className="mb-8 flex flex-col items-center">
              <div className="mb-4 flex justify-center w-full">
                <span className="text-xl font-bold text-primary bg-white rounded-full px-6 py-2 shadow border border-[#e0e0e0]">
                  {dayLabels[day] || day}
                </span>
              </div>
              {items.map((session: any) => (
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
                    {/* Book Button - top right */}
                    {tab === "all" && (
                      <button
                        className={`rounded-full px-6 py-2 font-bold text-base shadow transition-all
                          ${session.is_booked
                            ? "bg-[#4285F4] text-white"
                            : session.is_full
                              ? "bg-[#e0e0e0] text-[#888] cursor-not-allowed"
                              : "bg-[#4285F4] text-white hover:bg-[#1a73e8]"}
                        `}
                        style={{ minWidth: 90 }}
                        disabled={session.is_full || session.is_booked}
                        onClick={() => {
                          if (!session.is_booked && !session.is_full) {
                            const token = localStorage.getItem("token");
                            axios.post(`${API_URL}api/v1/participants/sessions/book`, { session_id: session.id }, {
                              headers: { Authorization: `Bearer ${token}` },
                            }).then(() => window.location.reload());
                          }
                        }}
                      >
                        {session.is_booked ? "Booked" : session.is_full ? "Full" : "Book"}
                      </button>
                    )}
                  </div>
                  {/* Time, Location, Book Button in one row */}
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
                    <span className="bg-[#e0e0e0] text-[#222] px-3 py-1 rounded-full text-xs font-semibold">On YouTube</span>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
      {role === "organizer"
        ? <OrganizerTabBar activeTab="agenda" />
        : <TabBar activeTab="agenda" />
      }
    </div>
  );
};

export default Agenda;
