import { useEffect, useState } from "react";
import axios from "axios";
import { Search, User, X, Mail, Phone, Building2, QrCode, Plus, CheckCircle } from "lucide-react";
import OrganizerTabBar from "@/components/OrganizerTabBar";

const API_URL = import.meta.env.VITE_API_URL;

const OrganizerParticipants = () => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQrCode, setSelectedQrCode] = useState<{qr_code: string, name: string} | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    roles: ["participant"] as string[],
    title: "",
    company: "",
  });
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState("");
  const [checkingInId, setCheckingInId] = useState<number | null>(null);

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

  // Manual check-in using participant's QR code
  const handleManualCheckIn = async (participant: any) => {
    if (!participant?.qr_code) return;
    const token = localStorage.getItem("token");
    try {
      setCheckingInId(participant.id);
      await axios.post(
        `${API_URL}api/v1/organizers/checkin`,
        { participant_qr_code: participant.qr_code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh participants list to reflect checked-in state
      const res = await axios.get(`${API_URL}api/v1/organizers/participants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParticipants(res.data || []);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      const msg = err?.response?.data?.message || (Array.isArray(detail) ? detail[0]?.msg : "Manual check-in failed");
      alert(msg);
    } finally {
      setCheckingInId(null);
    }
  };

  // Print participant badge using the same layout as OrganizerDashboard's handlePrintBadge
  const handlePrint = (participant: any) => {
    if (!participant?.qr_code) return;
    try {
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(participant.qr_code)}`;
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        alert("Please allow popups to print badge");
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Badge - ${participant.name || ''}</title>
            <style>
              @page { 
                size: A4 portrait;
                margin: 0; 
              }
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body { 
                margin: 0; 
                padding: 0;
                font-family: 'Arial', 'Helvetica', sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background: #f0f0f0;
                overflow: hidden;
              }
              .badge-container {
                position: relative;
                width: 794px;
                height: 1123px;
                background-image: url('/badge.png');
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                page-break-inside: avoid;
                page-break-after: avoid;
              }
              .badge-content {
                position: absolute;
                top: 51%;
                left: 47%;
                transform: translate(-50%, -50%);
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 0 80px;
              }
              .text-container {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                margin-top: 50px;
                max-width: 450px;
                width: 100%;
              }
              .name {
                font-size: 40px;
                font-weight: bold;
                color: #1a1a1a;
                text-align: left;
                word-wrap: break-word;
                line-height: 1.2;
                margin-bottom: 15px;
              }
              .title {
                font-size: 30px;
                font-weight: 600;
                color: #333;
                text-align: left;
                word-wrap: break-word;
                line-height: 1.3;
                margin-bottom: 5px;
              }
              .company {
                font-size: 28px;
                font-weight: 500;
                color: #555;
                text-align: left;
                word-wrap: break-word;
                line-height: 1.3;
              }
              .qr-code {
                display: flex;
                justify-content: flex-end;
                margin-top: 30px;
                width: 100%;
                padding-right: 90px;
                position: relative;
                top: 110px;
              }
              .qr-code img {
                display: block;
                width: 280px;
                height: 280px;
                border: 6px solid white;
                border-radius: 10px;
              }
              @media print {
                @page {
                  size: B2 portrait;
                  margin: 0;
                }
                html, body { 
                  width: 210mm;
                  height: 297mm;
                  margin: 0;
                  padding: 0;
                  overflow: hidden;
                }
                body { 
                  background: white;
                }
                .badge-container {
                  width: 210mm;
                  height: 297mm;
                  page-break-after: avoid;
                  page-break-inside: avoid;
                  page-break-before: avoid;
                }
              }
            </style>
          </head>
          <body>
            <div class="badge-container">
              <div class="badge-content">
                <div class="text-container">
                  <div class="name">${participant.name || ''}</div>
                  ${participant.title ? `<div class="title">${participant.title}</div>` : ''}
                  ${participant.company ? `<div class="company">${participant.company}</div>` : ''}
                </div>
                <div class="qr-code">
                  <img src="${qrCodeUrl}" alt="QR Code" onload="window.qrLoaded=true" onerror="window.qrError=true" />
                </div>
              </div>
            </div>
          </body>
        </html>
      `);

      printWindow.document.close();

      // Wait for QR code to load before printing (same reliability behavior)
      const checkLoaded = setInterval(() => {
        if (printWindow.closed) {
          clearInterval(checkLoaded);
          return;
        }
        if ((printWindow as any).qrLoaded) {
          clearInterval(checkLoaded);
          setTimeout(() => {
            printWindow.print();
          }, 500);
        } else if ((printWindow as any).qrError) {
          clearInterval(checkLoaded);
          alert("Failed to load QR code image. Please try again.");
          printWindow.close();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkLoaded);
        if (!printWindow.closed && !(printWindow as any).qrLoaded) {
          alert("QR code loading timeout. Please try again.");
          printWindow.close();
        }
      }, 10000);
    } catch (error) {
      console.error("Print error:", error);
      alert("Failed to open print window. Please check your browser settings.");
    }
  };

  // Add new user via register API
  const openAddUserModal = () => {
    setNewUser({ name: "", email: "", password: "", roles: ["participant"], title: "", company: "" });
    setAddUserError("");
    setShowAddUserModal(true);
  };

  const handleAddUser = async () => {
    // Basic validation
    if (!newUser.name || !newUser.email || !newUser.password) {
      setAddUserError("Name, email, and password are required.");
      return;
    }
    setAddUserLoading(true);
    setAddUserError("");
    try {
      await axios.post(`${API_URL}api/v1/auth/register`, newUser);
      // Refresh participants list
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}api/v1/organizers/participants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParticipants(res.data);
      setShowAddUserModal(false);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      const msg = Array.isArray(detail)
        ? detail.map((d: any) => d?.msg || d).join("; ")
        : err?.response?.data?.message || "Failed to register user.";
      setAddUserError(msg);
    }
    setAddUserLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-blue-500">
            All Participants
          </h1>
          {/* Compact "Add New User" on mobile */}
          <button
            onClick={openAddUserModal}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors shadow-sm text-sm md:text-base md:px-4 md:py-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add New User</span>
            <span className="sm:hidden">Add</span>
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

      <main className="px-4 py-4">
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
            <div className="text-xs sm:text-sm text-gray-500 mb-4">
              Showing {filteredParticipants.length} of {participants.length} participants
            </div>
            {/* Changed: max-w-sm for narrower cards on mobile */}
            <div className="grid gap-3 max-w-sm mx-auto">
              {filteredParticipants.map((participant: any) => (
                <div
                  key={participant.id}
                  className="bg-white rounded-xl shadow border border-gray-100 p-3 sm:p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    {/* Avatar */}
                    <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-1 truncate">
                        {participant.name}
                      </h3>

                      {/* Email */}
                      {participant.email && (
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{participant.email}</span>
                        </div>
                      )}

                      {/* Phone */}
                      {participant.phone_number && (
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{participant.phone_number}</span>
                        </div>
                      )}

                      {/* Title / Company - allow 2 line wrap */}
                      {(participant.title || participant.company) && (
                        <div className="flex items-start gap-1 text-xs text-gray-600 mb-2">
                          <Building2 className="w-3 h-3 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">
                            {[participant.title, participant.company].filter(Boolean).join(" at ")}
                          </span>
                        </div>
                      )}

                      {/* Status + Points */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          participant.is_checked_in
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {participant.is_checked_in ? "Checked In" : "Not Checked In"}
                        </span>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700">
                          {participant.points ?? 0} Points
                        </span>
                      </div>

                      {/* Actions - horizontal layout (3 buttons side by side) */}
                      <div className="grid grid-cols-3 gap-1">
                        {/* Print */}
                        {participant.qr_code && (
                          <button
                            onClick={() => handlePrint(participant)}
                            className="px-1.5 py-1.5 rounded-lg text-[10px] font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors flex flex-col items-center justify-center gap-0.5"
                            title="Print Badge"
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 2a2 2 0 00-2 2v2h14V4a2 2 0 00-2-2H5zm12 6H3a2 2 0 00-2 2v3a2 2 0 002 2h2v3h10v-3h2a2 2 0 002-2v-3a2 2 0 00-2-2zm-4 8H7v-4h6v4z"/></svg>
                            <span>Print</span>
                          </button>
                        )}

                        {/* Check-in */}
                        {!participant.is_checked_in && participant.qr_code && (
                          <button
                            onClick={() => handleManualCheckIn(participant)}
                            disabled={checkingInId === participant.id}
                            className="px-1.5 py-1.5 rounded-lg text-[10px] font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors flex flex-col items-center justify-center gap-0.5 disabled:opacity-60"
                            title="Manual Check-in"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{checkingInId === participant.id ? "..." : "Check-in"}</span>
                          </button>
                        )}

                        {/* QR */}
                        {participant.qr_code && (
                          <button
                            onClick={() => setSelectedQrCode({ qr_code: participant.qr_code, name: participant.name })}
                            className="px-1.5 py-1.5 rounded-lg text-[10px] font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors flex flex-col items-center justify-center gap-0.5"
                            title="View QR Code"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>QR</span>
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

      {/* Add New User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add New User</h3>
            {addUserError && (<div className="mb-3 text-sm text-red-600">{addUserError}</div>)}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Title (optional)"
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                  value={newUser.title}
                  onChange={(e) => setNewUser({ ...newUser, title: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Company (optional)"
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                  value={newUser.company}
                  onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
                />
              </div>
              <div className="text-xs text-gray-500">Roles are fixed to participant for this action.</div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold"
                disabled={addUserLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                disabled={addUserLoading}
              >
                {addUserLoading ? "Adding..." : "Add User"}
              </button>
            </div>
          </div>
        </div>
      )}

      <OrganizerTabBar activeTab="participants" />
    </div>
  );
};

export default OrganizerParticipants;
