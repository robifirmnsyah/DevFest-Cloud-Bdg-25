import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const AdminQuests = () => {
  const navigate = useNavigate();
  const [quests, setQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingQuest, setEditingQuest] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quest_type: "text_answer",
    points: 10,
    requires_approval: false,
    target_count: null as number | null,
    image_url: "",
    link_url: "",
    order: null as number | null,
    ref_id: null as number | null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token || role !== "admin") {
      window.location.href = "/auth";
      return;
    }
    
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${API_URL}api/v1/admin/quests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuests(res.data);
    } catch (err) {
      console.error("Failed to fetch quests:", err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      if (editingQuest) {
        await axios.put(
          `${API_URL}api/v1/admin/quests/${editingQuest.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API_URL}api/v1/admin/quests`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      setShowForm(false);
      setEditingQuest(null);
      resetForm();
      fetchQuests();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to save quest");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this quest?")) return;
    
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}api/v1/admin/quests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQuests();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete quest");
    }
  };

  const handleEdit = (quest: any) => {
    setEditingQuest(quest);
    setFormData({
      title: quest.title,
      description: quest.description,
      quest_type: quest.quest_type,
      points: quest.points,
      requires_approval: quest.requires_approval,
      target_count: quest.target_count,
      image_url: quest.image_url || "",
      link_url: quest.link_url || "",
      order: quest.order,
      ref_id: quest.ref_id,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      quest_type: "text_answer",
      points: 10,
      requires_approval: false,
      target_count: null,
      image_url: "",
      link_url: "",
      order: null,
      ref_id: null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate("/admin")} className="text-blue-500">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-blue-500">Manage Quests</h1>
        </div>
        
        <button
          onClick={() => { setShowForm(true); setEditingQuest(null); resetForm(); }}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Quest
        </button>
      </header>

      <main className="px-6 py-6">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : quests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No quests yet</div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {quests.map((quest) => (
              <div key={quest.id} className="bg-white rounded-xl p-5 shadow border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{quest.title}</h3>
                    <p className="text-sm text-gray-600">{quest.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(quest)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(quest.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-2 flex-wrap text-xs">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">
                    {quest.points} points
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {quest.quest_type}
                  </span>
                  {quest.requires_approval && (
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      Requires Approval
                    </span>
                  )}
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
            <h3 className="text-xl font-bold mb-4">{editingQuest ? "Edit Quest" : "Add New Quest"}</h3>
            
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
                placeholder="Description *"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
                required
              />
              
              <select
                value={formData.quest_type}
                onChange={e => setFormData({...formData, quest_type: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="text_answer">Text Answer</option>
                <option value="photo_upload">Photo Upload</option>
                <option value="scavenger_hunt">Scavenger Hunt</option>
                <option value="workshop_completion">Workshop Completion</option>
                <option value="networking">Networking</option>
                <option value="link_click">Link Click</option>
                <option value="url_submission">URL Submission</option>
                <option value="booth_scan">Booth Scan</option>
                <option value="organizer_scan">Organizer Scan</option>
              </select>
              
              <input
                type="number"
                placeholder="Points"
                value={formData.points}
                onChange={e => setFormData({...formData, points: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border rounded-lg"
                min="1"
              />
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.requires_approval}
                  onChange={e => setFormData({...formData, requires_approval: e.target.checked})}
                />
                <span>Requires Approval</span>
              </label>
              
              <input
                type="number"
                placeholder="Target Count (optional)"
                value={formData.target_count || ""}
                onChange={e => setFormData({...formData, target_count: e.target.value ? parseInt(e.target.value) : null})}
                className="w-full px-4 py-2 border rounded-lg"
              />
              
              <input
                type="url"
                placeholder="Image URL (optional)"
                value={formData.image_url}
                onChange={e => setFormData({...formData, image_url: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
              
              <input
                type="url"
                placeholder="Link URL (optional)"
                value={formData.link_url}
                onChange={e => setFormData({...formData, link_url: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
              
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingQuest(null); resetForm(); }}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-bold"
                >
                  {editingQuest ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuests;
