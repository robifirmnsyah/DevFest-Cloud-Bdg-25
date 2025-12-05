import { Calendar, Users, MapPin, User, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Tab = "rewards" | "agenda" | "friends" | "quests" | "profile";

interface TabBarProps {
  activeTab: Tab;
  onTabChange?: (tab: Tab) => void;
}

const TabBar = ({ activeTab, onTabChange }: TabBarProps) => {
  const navigate = useNavigate();

  const handleTab = (tab: Tab, to?: string) => {
    if (onTabChange) onTabChange(tab);
    if (to) navigate(to);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e0e0e0] flex justify-between px-2 py-2 z-10 shadow">
      <TabItem icon={<Calendar className="w-6 h-6" />} label="Agenda" active={activeTab === "agenda"} onClick={() => handleTab("agenda", "/agenda")} />
      <TabItem icon={<Users className="w-6 h-6" />} label="Friends" active={activeTab === "friends"} onClick={() => handleTab("friends", "/friends")} />
      <TabItem icon={<MapPin className="w-6 h-6" />} label="Quests" active={activeTab === "quests"} onClick={() => handleTab("quests", "/quests")} />
      <TabItem icon={<Gift className="w-6 h-6" />} label="Rewards" active={activeTab === "rewards"} onClick={() => handleTab("rewards", "/rewards")} />
      <TabItem icon={<User className="w-6 h-6" />} label="Profile" active={activeTab === "profile"} onClick={() => handleTab("profile", "/profile")} />
    </nav>
  );
};

function TabItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      className={`flex flex-col items-center flex-1 py-1 ${active ? "text-primary" : "text-[#888]"} bg-transparent`}
      style={{ minWidth: 0 }}
      onClick={onClick}
    >
      {icon}
      <span className={`text-xs mt-1 font-medium ${active ? "font-bold" : ""}`}>{label}</span>
    </button>
  );
}

export default TabBar;
