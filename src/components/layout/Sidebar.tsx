
import {
  LayoutDashboard,
  Layers3,
  Network,
  FlaskConical,
  BookOpen,
  Presentation,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Sorting Lab", icon: Layers3 },
  { name: "Graph Lab", icon: Network },
  { name: "Structures Lab", icon: Layers3 },
  { name: "Search Lab", icon: BookOpen },
  { name: "Complexity Lab", icon: FlaskConical },
  { name: "Algorithm Library", icon: BookOpen },
  { name: "Experiments", icon: Presentation },
];

type SidebarProps = {
  activePage: string;
  onNavigate: (page: string) => void;
};

function Sidebar({ activePage, onNavigate }: SidebarProps) {

  return (
    <aside className="sidebar">
      <div className="brand">
        <h2>ALGOLAB</h2>
        <span>ALGORITHM EXPLORATION</span>
      </div>

      <nav className="navigation">
        <div className="nav-label">MAIN MENU</div>

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              type="button"
              className={`nav-item ${activePage === item.name ? "active" : ""}`}
              aria-current={activePage === item.name ? "page" : undefined}
              onClick={() => onNavigate(item.name)}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;

