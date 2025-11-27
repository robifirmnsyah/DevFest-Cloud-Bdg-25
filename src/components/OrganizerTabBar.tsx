import { Home, Calendar, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type OrganizerTab = "hub" | "agenda" | "profile";

const OrganizerTabBar = ({ activeTab }: { activeTab: OrganizerTab }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Prevent logout if already on /profile
  const handleProfileClick = () => {
    if (location.pathname !== "/profile") {
      navigate("/profile");
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e0e0e0] flex justify-between px-2 py-2 z-10 shadow">
      <TabItem
        icon={<Home className="w-6 h-6" />}
        label="Organizer Hub"
        active={activeTab === "hub"}
        onClick={() => navigate("/organizer")}
      />
      <TabItem
        icon={<Calendar className="w-6 h-6" />}
        label="Agenda"
        active={activeTab === "agenda"}
        onClick={() => navigate("/organizer/agenda")}
      />
      <TabItem
        icon={<User className="w-6 h-6" />}
        label="Profile"
        active={activeTab === "profile"}
        onClick={handleProfileClick}
      />
    </nav>
  );
};

function TabItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      className={`flex flex-col items-center flex-1 py-1 ${active ? "text-primary" : "text-[#888]"} bg-transparent`}
      style={{ minWidth: 0 }}
      onClick={onClick}
      type="button"
    >
      {icon}
      <span className={`text-xs mt-1 font-medium ${active ? "font-bold" : ""}`}>{label}</span>
    </button>
  );
}

export default OrganizerTabBar;
