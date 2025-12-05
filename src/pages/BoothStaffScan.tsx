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
  const [scannedQrCode, setScannedQrCode] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // NEW
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
      setScannedQrCode(qr); // Save the QR code
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
    if (!scannedProfile?.user || !scannedQrCode) return;

    setSaving(true);
    const token = localStorage.getItem("token");
    try {
      const payload: any = { participant_qr_code: scannedQrCode };
      if (notes && notes.trim()) payload.notes = notes.trim();

      await axios.post(
        `${API_URL}api/v1/booth-staff/contacts/add`,
        payload,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      // NEW: Show custom success modal
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error('Add contact error:', err);
      console.error('Error response:', err?.response);
      console.error('Error data:', err?.response?.data);
      console.error('Error detail:', err?.response?.data?.detail);
      
      const errorMsg = err?.response?.data?.detail 
        ? JSON.stringify(err.response.data.detail, null, 2)
        : err?.response?.data?.message || "Failed to add contact";
      
      alert(`Error: ${errorMsg}`);
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
                    setScannedQrCode("");
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
                    setScannedQrCode("");
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

      {/* NEW: Success Modal */}
      {showSuccessModal && scannedProfile?.user && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md text-center relative">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Contact Added</h3>
            <p className="text-sm text-gray-600 mb-4">{scannedProfile.user.name}</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/booth-staff/contacts");
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-base transition-colors"
              >
                View Contacts
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setScannedProfile(null);
                  setScannedQrCode("");
                  setNotes("");
                  setScanError("");
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold text-base transition-colors"
              >
                Scan Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoothStaffScan;
