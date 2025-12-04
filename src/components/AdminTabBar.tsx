import { useNavigate } from "react-router-dom";
import { Home, Calendar, Award, Gift, User } from "lucide-react";

interface AdminTabBarProps {
  activeTab: "hub" | "sessions" | "quests" | "rewards" | "profile";
}

const AdminTabBar = ({ activeTab }: AdminTabBarProps) => {
  const navigate = useNavigate();

  const tabs = [
    { id: "hub", label: "Hub", icon: Home, path: "/admin" },
    { id: "sessions", label: "Sessions", icon: Calendar, path: "/admin/sessions" },
    { id: "quests", label: "Quests", icon: Award, path: "/admin/quests" },
    { id: "rewards", label: "Rewards", icon: Gift, path: "/admin/rewards" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e0e0e0] shadow-lg z-40">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? "text-[#4285F4]" : "text-[#888] hover:text-[#4285F4]"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "stroke-[2.5]" : ""}`} />
              <span className={`text-xs mt-1 ${isActive ? "font-bold" : "font-medium"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default AdminTabBar;
