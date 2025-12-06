import { useEffect, useState } from "react";
import axios from "axios";
import { Search, User, X, Pencil, MessageCircle } from "lucide-react";
import BoothStaffTabBar from "@/components/BoothStaffTabBar";

const API_URL = import.meta.env.VITE_API_URL;

const BoothStaffContacts = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // NEW: edit notes modal state
  const [editingContact, setEditingContact] = useState<any | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const fetchContacts = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}api/v1/booth-staff/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
      setContacts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filter contacts
  const filteredContacts = contacts.filter((contact) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      contact.participant.name?.toLowerCase().includes(query) ||
      contact.participant.title?.toLowerCase().includes(query) ||
      contact.participant.company?.toLowerCase().includes(query) ||
      contact.notes?.toLowerCase().includes(query)
    );
  });

  const openEditNotes = (contact: any) => {
    setEditingContact(contact);
    setEditNotes(contact.notes || "");
    setEditError("");
  };

  const saveEditNotes = async () => {
    if (!editingContact) return;
    setEditLoading(true);
    setEditError("");
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${API_URL}api/v1/booth-staff/contacts/${editingContact.contact_id}`,
        { notes: editNotes || "" },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      // Refresh list
      await fetchContacts();
      setEditingContact(null);
      setEditNotes("");
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail?.[0]?.msg ||
        err?.response?.data?.message ||
        "Failed to update notes";
      setEditError(msg);
    }
    setEditLoading(false);
  };

  // Helper function to format WhatsApp link
  const getWhatsAppLink = (phoneNumber: string | null | undefined) => {
    if (!phoneNumber) return null;
    // Remove all non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    // Add country code if not present (assuming Indonesia +62)
    const formattedNumber = cleanNumber.startsWith('62') ? cleanNumber : `62${cleanNumber.replace(/^0/, '')}`;
    return `https://wa.me/${formattedNumber}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <h1 className="text-2xl font-bold text-green-500 text-center mb-4">My Contacts</h1>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50"
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
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">
              {searchQuery ? "No contacts found" : "No contacts yet"}
            </p>
            <p className="text-sm">
              {searchQuery
                ? "Try adjusting your search"
                : "Scan participant QR codes to add contacts"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 max-w-2xl mx-auto">
            {filteredContacts.map((contact: any) => (
              <div
                key={contact.contact_id}
                className="bg-white rounded-xl shadow border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <User className="w-7 h-7 text-green-600" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {contact.participant.name}
                    </h3>
                    {contact.participant.title && (
                      <p className="text-sm text-gray-600 mb-1">
                        {contact.participant.title}
                      </p>
                    )}
                    {contact.participant.company && (
                      <p className="text-sm text-gray-500 mb-2">
                        {contact.participant.company}
                      </p>
                    )}
                    
                    {contact.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mt-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-gray-700">Notes</p>
                          <button
                            onClick={() => openEditNotes(contact)}
                            className="text-xs text-green-600 hover:text-green-700 font-semibold flex items-center gap-1"
                            title="Edit notes"
                          >
                            <Pencil className="w-3 h-3" /> Edit
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{contact.notes}</p>
                      </div>
                    )}
                    {!contact.notes && (
                      <button
                        onClick={() => openEditNotes(contact)}
                        className="mt-2 text-xs text-green-600 hover:text-green-700 font-semibold underline"
                      >
                        Add notes
                      </button>
                    )}
                    
                    <div className="mt-2 text-xs text-gray-400">
                      Added {new Date(contact.captured_at).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>

                  {/* WhatsApp Button - Right Side with Horizontal Layout */}
                  {contact.participant.phone_number && (
                    <a
                      href={getWhatsAppLink(contact.participant.phone_number) || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors flex-shrink-0"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-semibold">WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* NEW: Edit Notes Modal */}
      {editingContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => { setEditingContact(null); setEditNotes(""); setEditError(""); }}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-1">Edit Notes</h3>
            <p className="text-sm text-gray-600 mb-4">Contact: {editingContact.participant?.name}</p>

            <textarea
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
              rows={4}
              placeholder="Update notes..."
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              disabled={editLoading}
            />

            {editError && <div className="text-red-500 mt-2 text-sm">{editError}</div>}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setEditingContact(null); setEditNotes(""); setEditError(""); }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold"
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                onClick={saveEditNotes}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                disabled={editLoading}
              >
                {editLoading ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <BoothStaffTabBar activeTab="contacts" />
    </div>
  );
};

export default BoothStaffContacts;
