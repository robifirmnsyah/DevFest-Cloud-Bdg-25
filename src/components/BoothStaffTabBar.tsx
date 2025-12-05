import { useNavigate, useLocation } from "react-router-dom";
import { Home, QrCode, Users, User } from "lucide-react";

interface BoothStaffTabBarProps {
  activeTab: "hub" | "scan" | "contacts" | "profile";
}

const BoothStaffTabBar = ({ activeTab }: BoothStaffTabBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: "hub", label: "Hub", icon: Home, path: "/booth-staff" },
    { id: "scan", label: "Scan", icon: QrCode, path: "/booth-staff/scan" },
    { id: "contacts", label: "Contacts", icon: Users, path: "/booth-staff/contacts" },
    { id: "profile", label: "Profile", icon: User, path: "/booth-staff/profile" },
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

export default BoothStaffTabBar;
