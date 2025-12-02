import { useEffect, useState } from "react";
import axios from "axios";
import { Search, User, X } from "lucide-react";
import BoothStaffTabBar from "@/components/BoothStaffTabBar";

const API_URL = import.meta.env.VITE_API_URL;

const BoothStaffContacts = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
                        <p className="text-xs font-semibold text-gray-700 mb-1">Notes:</p>
                        <p className="text-sm text-gray-600">{contact.notes}</p>
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs text-gray-400">
                      Added {new Date(contact.captured_at).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BoothStaffTabBar activeTab="contacts" />
    </div>
  );
};

export default BoothStaffContacts;
