import { useEffect, useState } from "react";
import axios from "axios";
import { Search, User, X, Mail, Phone, Building2 } from "lucide-react";
import OrganizerTabBar from "@/components/OrganizerTabBar";

const API_URL = import.meta.env.VITE_API_URL;

const OrganizerParticipants = () => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
      .get(`${API_URL}api/v1/organizers/participants`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setParticipants(res.data))
      .catch(() => setParticipants([]))
      .finally(() => setLoading(false));
  }, []);

  // Filter participants
  const filteredParticipants = participants.filter((participant) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      participant.name?.toLowerCase().includes(query) ||
      participant.email?.toLowerCase().includes(query) ||
      participant.company?.toLowerCase().includes(query) ||
      participant.title?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-500 text-center mb-4">
          All Participants
        </h1>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, company..."
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
      </header>

      <main className="px-6 py-6">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredParticipants.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">
              {searchQuery ? "No participants found" : "No participants yet"}
            </p>
            <p className="text-sm">
              {searchQuery && "Try adjusting your search"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-gray-500 mb-4">
              Showing {filteredParticipants.length} of {participants.length} participants
            </div>
            <div className="grid gap-4 max-w-2xl mx-auto">
              {filteredParticipants.map((participant: any) => (
                <div
                  key={participant.id}
                  className="bg-white rounded-xl shadow border border-gray-100 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                      <User className="w-7 h-7 text-blue-600" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {participant.name}
                      </h3>
                      
                      {participant.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{participant.email}</span>
                        </div>
                      )}
                      
                      {participant.phone_number && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{participant.phone_number}</span>
                        </div>
                      )}
                      
                      {(participant.title || participant.company) && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Building2 className="w-4 h-4 flex-shrink-0" />
                          <span>
                            {[participant.title, participant.company]
                              .filter(Boolean)
                              .join(" at ")}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          participant.is_checked_in
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {participant.is_checked_in ? "Checked In" : "Not Checked In"}
                        </span>
                        
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {participant.points ?? 0} Points
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <OrganizerTabBar activeTab="participants" />
    </div>
  );
};

export default OrganizerParticipants;
