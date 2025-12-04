import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminTabBar from "@/components/AdminTabBar";

const API_URL = import.meta.env.VITE_API_URL;

const AdminSessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    speaker: "",
    location: "",
    track: "",
    start_time: "",
    end_time: "",
    capacity: 100,
    is_hybrid: false,
    live_url: "",
    is_bookable: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token || role !== "admin") {
      window.location.href = "/auth";
      return;
    }
    
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${API_URL}api/v1/admin/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(res.data);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      if (editingSession) {
        await axios.put(
          `${API_URL}api/v1/admin/sessions/${editingSession.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API_URL}api/v1/admin/sessions`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      setShowForm(false);
      setEditingSession(null);
      resetForm();
      fetchSessions();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to save session");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this session?")) return;
    
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}api/v1/admin/sessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSessions();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete session");
    }
  };

  const handleEdit = (session: any) => {
    setEditingSession(session);
    setFormData({
      title: session.title,
      description: session.description || "",
      speaker: session.speaker || "",
      location: session.location,
      track: session.track || "",
      start_time: session.start_time,
      end_time: session.end_time,
      capacity: session.capacity,
      is_hybrid: session.is_hybrid,
      live_url: session.live_url || "",
      is_bookable: session.is_bookable,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      speaker: "",
      location: "",
      track: "",
      start_time: "",
      end_time: "",
      capacity: 100,
      is_hybrid: false,
      live_url: "",
      is_bookable: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-500 text-center mb-4">Manage Sessions</h1>
      </header>

      <main className="px-6 py-6">
        <div className="flex justify-end mb-4 max-w-2xl mx-auto">
          <button
            onClick={() => { setShowForm(true); setEditingSession(null); resetForm(); }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Session
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No sessions yet</div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {sessions.map((session) => (
              <div key={session.id} className="bg-white rounded-xl p-5 shadow border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{session.title}</h3>
                    <p className="text-sm text-gray-600">{session.speaker}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(session)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(session.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{session.description}</p>
                <div className="text-xs text-gray-500">
                  <div>📍 {session.location}</div>
                  <div>🕒 {new Date(session.start_time).toLocaleString()} - {new Date(session.end_time).toLocaleTimeString()}</div>
                  <div>👥 {session.booked_count}/{session.capacity} booked</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md my-8">
            <h3 className="text-xl font-bold mb-4">{editingSession ? "Edit Session" : "Add New Session"}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Title *"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
              />
              
              <input
                type="text"
                placeholder="Speaker"
                value={formData.speaker}
                onChange={e => setFormData({...formData, speaker: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
              
              <input
                type="text"
                placeholder="Location *"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              
              <input
                type="text"
                placeholder="Track"
                value={formData.track}
                onChange={e => setFormData({...formData, track: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
              
              <input
                type="datetime-local"
                value={formData.start_time}
                onChange={e => setFormData({...formData, start_time: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              
              <input
                type="datetime-local"
                value={formData.end_time}
                onChange={e => setFormData({...formData, end_time: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              
              <input
                type="number"
                placeholder="Capacity"
                value={formData.capacity}
                onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border rounded-lg"
                min="1"
              />
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_hybrid}
                  onChange={e => setFormData({...formData, is_hybrid: e.target.checked})}
                />
                <span>Hybrid Session</span>
              </label>
              
              {formData.is_hybrid && (
                <input
                  type="url"
                  placeholder="Live URL"
                  value={formData.live_url}
                  onChange={e => setFormData({...formData, live_url: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              )}
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_bookable}
                  onChange={e => setFormData({...formData, is_bookable: e.target.checked})}
                />
                <span>Bookable</span>
              </label>
              
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingSession(null); resetForm(); }}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-bold"
                >
                  {editingSession ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminTabBar activeTab="sessions" />
    </div>
  );
};

export default AdminSessions;
