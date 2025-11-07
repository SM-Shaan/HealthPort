import { Link, useLocation } from 'react-router-dom';

interface MenuItem {
  name: string;
  path: string;
  icon: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
  userRole: string;
}

const Sidebar = ({ menuItems, userRole }: SidebarProps) => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white h-[calc(100vh-4rem)] fixed left-0 top-16 shadow-lg border-r border-gray-100">
      {/* Menu Items */}
      <nav className="overflow-y-auto py-4 h-full">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm transition-colors ${
                isActive
                  ? 'bg-btnNice text-btnNiceText border-l-4 border-primary font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
