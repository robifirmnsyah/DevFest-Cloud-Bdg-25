import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import BoothStaffTabBar from "@/components/BoothStaffTabBar";
import QrScanner from "@/components/QrScanner";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const BoothStaffScan = () => {
  const [scanError, setScanError] = useState("");
  const [scannedProfile, setScannedProfile] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleScan = async (qr: string | null) => {
    if (!qr) return;

    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${API_URL}api/v1/booth-staff/profile/view`,
        { qr_code: qr },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setScannedProfile(res.data);
      setScanError("");
    } catch (err: any) {
      setScanError(
        err?.response?.data?.message ||
        err?.response?.data?.detail?.[0]?.msg ||
        "Failed to scan QR code"
      );
    }
  };

  const handleAddContact = async () => {
    if (!scannedProfile?.user) return;

    setSaving(true);
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${API_URL}api/v1/booth-staff/contacts/add`,
        {
          participant_qr_code: scannedProfile.user.qr_code,
          notes: notes || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Show success and navigate to contacts
      alert(`Contact added: ${scannedProfile.user.name}`);
      navigate("/booth-staff/contacts");
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
        err?.response?.data?.detail?.[0]?.msg ||
        "Failed to add contact"
      );
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <h1 className="text-2xl font-bold text-green-500 text-center">Scan Participant QR</h1>
      </header>

      <main className="px-6 py-6">
        {!scannedProfile ? (
          <>
            {/* Scanner */}
            <div className="mx-auto w-[86vw] max-w-[400px] md:w-[400px] md:h-[400px] h-[86vw] relative mb-4">
              <div className="w-full h-full bg-black rounded-lg overflow-hidden relative">
                <QrScanner
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
            </div>

            <div className="text-center text-gray-600 mb-2">
              Point camera at participant's QR code
            </div>
            
            {scanError && (
              <div className="text-center text-red-500 font-semibold">
                {scanError}
              </div>
            )}
          </>
        ) : (
          /* Profile View */
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              {/* Profile Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Participant Profile</h3>
                <button
                  onClick={() => {
                    setScannedProfile(null);
                    setNotes("");
                    setScanError("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-3xl font-bold text-green-600 mb-3">
                  {scannedProfile.user.name?.charAt(0) || "?"}
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-1">
                  {scannedProfile.user.name}
                </h4>
                {scannedProfile.user.title && (
                  <p className="text-sm text-gray-600 mb-1">{scannedProfile.user.title}</p>
                )}
                {scannedProfile.user.company && (
                  <p className="text-sm text-gray-500">{scannedProfile.user.company}</p>
                )}
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Notes (Optional)
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
                  rows={3}
                  placeholder="Add notes about this contact..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={saving}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAddContact}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-lg transition-colors shadow-lg disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? "Adding..." : "Add to Contacts"}
                </button>
                
                <button
                  onClick={() => {
                    setScannedProfile(null);
                    setNotes("");
                    setScanError("");
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold text-base transition-colors"
                  disabled={saving}
                >
                  Scan Another
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <BoothStaffTabBar activeTab="scan" />
    </div>
  );
};

export default BoothStaffScan;
