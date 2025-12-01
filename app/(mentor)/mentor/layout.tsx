"use client";

import { useState, ReactNode } from "react";

import {
  LayoutDashboard,
  FolderOpen,
  Users,
  MessageSquare,
  User,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";

interface MenuItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

interface MentorLayoutProps {
  children: ReactNode;
}

const MentorLayout: React.FC<MentorLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { path: "/mentor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/mentor/projects", label: "Review Projects", icon: FolderOpen },
    { path: "/mentor/students", label: "My Students", icon: Users },
    {
      path: "/mentor/feedback",
      label: "Feedback History",
      icon: MessageSquare,
    },
    { path: "/mentor/profile", label: "Profile", icon: User },
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

export default MentorLayout;
