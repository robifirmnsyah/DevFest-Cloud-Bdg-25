import { useEffect, useState } from "react";
import axios from "axios";
import { Search, User, X, Mail, Phone, Building2, QrCode, Download } from "lucide-react";
import OrganizerTabBar from "@/components/OrganizerTabBar";

const API_URL = import.meta.env.VITE_API_URL;

const OrganizerParticipants = () => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQrCode, setSelectedQrCode] = useState<{qr_code: string, name: string} | null>(null);

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

  // Generate QR code image URL
  const getQrCodeImageUrl = (qrCode: string) => {
    if (!qrCode) return null;
    return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrCode)}`;
  };

  // Export to Excel
  const handleExportExcel = () => {
    // Prepare data for export
    const exportData = filteredParticipants.map(p => ({
      'Name': p.name || '',
      'Email': p.email || '',
      'Phone': p.phone_number || '',
      'Title': p.title || '',
      'Company': p.company || '',
      'Points': p.points || 0,
      'Check-in Status': p.is_checked_in ? 'Checked In' : 'Not Checked In',
      'QR Code': p.qr_code || ''
    }));

    // Convert to CSV
    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          // Escape values containing commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `participants_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-blue-500">
            All Participants
          </h1>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm"
            disabled={loading || participants.length === 0}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
        
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

                        {/* QR Code Button */}
                        {participant.qr_code && (
                          <button
                            onClick={() => setSelectedQrCode({ qr_code: participant.qr_code, name: participant.name })}
                            className="ml-auto px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors flex items-center gap-1"
                            title="View QR Code"
                          >
                            <QrCode className="w-3 h-3" />
                            QR
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* QR Code Modal */}
      {selectedQrCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedQrCode.name}</h3>
            <p className="text-sm text-gray-500 mb-6">Participant QR Code</p>
            
            <div className="flex justify-center mb-6">
              <img
                src={getQrCodeImageUrl(selectedQrCode.qr_code) || ''}
                alt="QR Code"
                className="w-64 h-64 bg-gray-50 rounded-lg border border-gray-200"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Crect fill='%23e0e0e0' width='256' height='256'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23888' font-size='16'%3ENo QR Code%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>

            <button
              onClick={() => setSelectedQrCode(null)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <OrganizerTabBar activeTab="participants" />
    </div>
  );
};

export default OrganizerParticipants;
