import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const AdminRewards = () => {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReward, setEditingReward] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    points_required: 0,
    stock: 0,
    image_url: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token || role !== "admin") {
      window.location.href = "/auth";
      return;
    }
    
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${API_URL}api/v1/admin/rewards`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRewards(res.data);
    } catch (err) {
      console.error("Failed to fetch rewards:", err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      if (editingReward) {
        await axios.put(
          `${API_URL}api/v1/admin/rewards/${editingReward.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API_URL}api/v1/admin/rewards`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      setShowForm(false);
      setEditingReward(null);
      resetForm();
      fetchRewards();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to save reward");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this reward?")) return;
    
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}api/v1/admin/rewards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRewards();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete reward");
    }
  };

  const handleEdit = (reward: any) => {
    setEditingReward(reward);
    setFormData({
      name: reward.name,
      description: reward.description || "",
      points_required: reward.points_required,
      stock: reward.stock,
      image_url: reward.image_url || "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      points_required: 0,
      stock: 0,
      image_url: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate("/admin")} className="text-blue-500">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-blue-500">Manage Rewards</h1>
        </div>
        
        <button
          onClick={() => { setShowForm(true); setEditingReward(null); resetForm(); }}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Reward
        </button>
      </header>

      <main className="px-6 py-6">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : rewards.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No rewards yet</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {rewards.map((reward) => (
              <div key={reward.id} className="bg-white rounded-xl p-5 shadow border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{reward.name}</h3>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(reward)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(reward.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {reward.image_url && (
                  <img src={reward.image_url} alt={reward.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                )}
                
                <div className="flex gap-2 flex-wrap text-xs">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                    {reward.points_required} points
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    Stock: {reward.stock}
                  </span>
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    Redeemed: {reward.redeemed_count || 0}
                  </span>
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
            <h3 className="text-xl font-bold mb-4">{editingReward ? "Edit Reward" : "Add New Reward"}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Name *"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
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
                type="number"
                placeholder="Points Required *"
                value={formData.points_required}
                onChange={e => setFormData({...formData, points_required: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
                required
              />
              
              <input
                type="number"
                placeholder="Stock *"
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
                required
              />
              
              <input
                type="url"
                placeholder="Image URL (optional)"
                value={formData.image_url}
                onChange={e => setFormData({...formData, image_url: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
              
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingReward(null); resetForm(); }}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-bold"
                >
                  {editingReward ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRewards;
