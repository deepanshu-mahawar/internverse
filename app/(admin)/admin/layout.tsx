'use client';

import { useState, ReactNode } from 'react';

import { LayoutDashboard, Users, FolderOpen, Settings, User } from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import Sidebar from '@/app/components/Sidebar';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Manage Users', icon: Users },
    { path: '/admin/projects', label: 'All Projects', icon: FolderOpen },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
    { path: '/admin/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex">
        <Sidebar
          menuItems={menuItems}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
