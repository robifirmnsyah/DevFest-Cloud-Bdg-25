import { Home, Calendar, User, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

type OrganizerTab = "hub" | "agenda" | "profile" | "participants";

const OrganizerTabBar = ({ activeTab }: { activeTab: OrganizerTab }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Prevent logout if already on /profile
  const handleProfileClick = () => {
    if (location.pathname !== "/profile") {
      navigate("/profile");
    }
  };

  const tabs = [
    { id: "hub", label: "Organizer Hub", icon: Home, path: "/organizer" },
    { id: "agenda", label: "Agenda", icon: Calendar, path: "/organizer/agenda" },
    { id: "participants", label: "Participants", icon: Users, path: "/organizer/participants" },
    { id: "profile", label: "Profile", icon: User, path: "/organizer/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e0e0e0] flex justify-between px-2 py-2 z-10 shadow">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center flex-1 py-1 transition-colors ${
              isActive ? "text-primary" : "text-[#888] hover:text-[#555]"
            }`}
            style={{ minWidth: 0 }}
            type="button"
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className={`text-xs font-medium ${isActive ? "font-bold" : ""}`}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default OrganizerTabBar;
