import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, MapPin, Clock, User, QrCode, UserCheck, UserX, Users, Search, Filter, X } from "lucide-react";
import OrganizerTabBar from "@/components/OrganizerTabBar";
import QrScanner from "@/components/QrScanner";

const API_URL = import.meta.env.VITE_API_URL;

const OrganizerAgenda = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanMode, setScanMode] = useState<"checkin" | "checkin-waiting" | "checkout" | null>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [scanResult, setScanResult] = useState("");
  const [scanError, setScanError] = useState("");
  const [scanLoading, setScanLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

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
    
    setLoading(true);
    axios
      .get(`${API_URL}api/v1/organizers/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSessions(res.data))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  // Get unique tracks for filter
  const allTracks = [...new Set(sessions.map(s => s.track).filter(Boolean))];

  // Filter and search logic
  let filteredSessions = sessions;
  
  // Apply search filter
  if (searchQuery) {
    filteredSessions = filteredSessions.filter(s => 
      s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.speaker?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Apply track filter
  if (selectedTrack !== "all") {
    filteredSessions = filteredSessions.filter(s => s.track === selectedTrack);
  }

  // Group by day
  const sessionsByDay: Record<string, any[]> = {};
  filteredSessions.forEach((s) => {
    const day = s.start_time?.includes("2025-11-20") ? "Day 2" : "Day 1";
    if (!sessionsByDay[day]) sessionsByDay[day] = [];
    sessionsByDay[day].push(s);
  });

  const dayLabels: Record<string, string> = {
    "Day 1": "Day 1",
    "Day 2": "Day 2",
  };

  const handleScanAction = (session: any, action: "checkin" | "checkin-waiting" | "checkout") => {
    setSelectedSession(session);
    setScanMode(action);
    setCameraActive(true);
    setScanResult("");
    setScanError("");
  };

  const handleScan = async (qr: string | null) => {
    if (!qr || !scanMode || !selectedSession) return;
    setScanLoading(true);
    setScanError("");
    const token = localStorage.getItem("token");
    
    try {
      let endpoint = "";
      const requestData = {
        participant_qr_code: qr,
        session_id: selectedSession.id,
      };

      switch (scanMode) {
        case "checkin":
          endpoint = `${API_URL}api/v1/organizers/sessions/checkin`;
          break;
        case "checkin-waiting":
          endpoint = `${API_URL}api/v1/organizers/sessions/checkin-waiting-list`;
          break;
        case "checkout":
          endpoint = `${API_URL}api/v1/organizers/sessions/checkout`;
          break;
      }

      const res = await axios.post(endpoint, requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setScanResult(res.data.message || "Success");
      setTimeout(() => {
        setScanMode(null);
        setSelectedSession(null);
        setCameraActive(false);
        setScanResult("");
      }, 2000);
    } catch (err: any) {
      setScanError(
        err?.response?.data?.message ||
        err?.response?.data?.detail?.[0]?.msg ||
        "Scan failed"
      );
    }
    setScanLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-16">
      <header className="bg-white shadow-sm px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-500 text-center">Session Management</h1>
        
        {/* Search and Filter Bar */}
        <div className="mt-4 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sessions, speakers, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
              <span className="ml-1 px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-full text-xs">1</span>
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
                        ? "bg-blue-500 text-white"
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
                          ? "bg-blue-500 text-white"
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
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No sessions found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          Object.entries(sessionsByDay).map(([day, items]) => (
            <div key={day} className="mb-8 flex flex-col items-center">
              <div className="mb-4 flex justify-center w-full">
                <span className="text-xl font-bold text-blue-500 bg-white rounded-full px-6 py-2 shadow border border-gray-100">
                  {dayLabels[day] || day}
                </span>
              </div>
              
              {items.map((session: any) => (
                <div
                  key={session.id}
                  className="bg-white border border-gray-100 rounded-xl shadow-sm mb-6 p-5 max-w-2xl w-full flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-gray-900">{session.speaker || "No Speaker"}</div>
                      <div className="text-sm text-gray-500">{session.track || session.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Capacity</div>
                      <div className="font-bold text-blue-500">{session.booked_count}/{session.capacity}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm mb-3 text-gray-600">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>
                      {new Date(session.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {new Date(session.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>{session.location}</span>
                  </div>
                  
                  <div className="font-bold text-lg mb-2 text-gray-900">{session.title}</div>
                  <div className="text-sm text-gray-600 mb-3">{session.description}</div>
                  
                  <div className="flex gap-2 flex-wrap mb-4">
                    {session.track && (
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">{session.track}</span>
                    )}
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">On YouTube</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      className="flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-colors"
                      onClick={() => handleScanAction(session, "checkin")}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span className="hidden sm:inline">Check-in</span>
                      <span className="sm:hidden">In</span>
                    </button>
                    <button
                      className="flex items-center justify-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-colors"
                      onClick={() => handleScanAction(session, "checkin-waiting")}
                    >
                      <Users className="w-4 h-4" />
                      <span className="hidden sm:inline">Waiting List</span>
                      <span className="sm:hidden">Wait</span>
                    </button>
                    <button
                      className="flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-colors"
                      onClick={() => handleScanAction(session, "checkout")}
                    >
                      <UserX className="w-4 h-4" />
                      <span className="hidden sm:inline">Check-out</span>
                      <span className="sm:hidden">Out</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* QR Scanner Modal */}
      {scanMode && selectedSession && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 shadow-lg w-full max-w-md text-center relative">
            <h3 className="text-xl font-bold mb-2">
              {scanMode === "checkin" ? "Session Check-in" : 
               scanMode === "checkin-waiting" ? "Waiting List Check-in" : 
               "Session Check-out"}
            </h3>
            <p className="text-sm text-gray-600 mb-4">{selectedSession.title}</p>

            {/* Square scanner container */}
            <div className="mx-auto w-[86vw] max-w-[360px] md:w-[360px] md:h-[360px] h-[86vw] bg-black rounded-lg overflow-hidden relative mb-20">
              <QrScanner
                key={`${scanMode}-${selectedSession?.id}`} // Force remount when scan mode or session changes
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

            {/* Close button */}
            <button
              aria-label="Close"
              onClick={() => { setScanMode(null); setSelectedSession(null); setScanResult(""); setScanError(""); setCameraActive(false); }}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-red-100 text-red-600 hover:bg-red-50"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="text-gray-500 text-sm mt-2">Point camera at participant's QR code</div>
            {scanResult && <div className="text-green-600 mt-2 font-semibold">{scanResult}</div>}
            {scanError && <div className="text-red-500 mt-2">{scanError}</div>}
          </div>
        </div>
      )}

      <OrganizerTabBar activeTab="agenda" />
    </div>
  );
};

export default OrganizerAgenda;
