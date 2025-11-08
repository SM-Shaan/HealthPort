import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import AuthNavbar from './AuthNavbar';

interface MenuItem {
  name: string;
  path: string;
  icon: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  menuItems: MenuItem[];
  title?: string;
}

const DashboardLayout = ({ children, menuItems, title }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <AuthNavbar />

      {/* Main Layout with Sidebar */}
      <div className="flex">
        <Sidebar menuItems={menuItems} />
        <div className="ml-64 flex-1">
          {title && (
            <div className="bg-white shadow-sm px-8 py-4 border-b">
              <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            </div>
          )}
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
