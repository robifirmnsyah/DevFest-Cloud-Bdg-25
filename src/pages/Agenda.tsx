import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, MapPin, Clock, User } from "lucide-react";
import TabBar from "@/components/TabBar";
const API_URL = (import.meta.env.VITE_API_URL ?? "https://devfest-api.cloudbandung.id/").replace(/\/?$/, "/");

const Agenda = () => {
  const [tab, setTab] = useState<"all" | "my">("all");
  const [sessions, setSessions] = useState<any[]>([]);
  const [myAgenda, setMyAgenda] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const displayedSessions = tab === "all" ? sessions : myAgenda.map(a => a.session);

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
      </header>
      <div className="px-4 pt-2">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
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
      <TabBar activeTab="agenda" />
    </div>
  );
};

export default Agenda;
