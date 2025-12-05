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
import { useAuth } from "@/app/context/AuthContext";
import Loader from "@/app/components/Loader";
import { redirect } from "next/navigation";

interface MentorLayoutProps {
  children: ReactNode;
}

const MentorLayout = ({ children }: MentorLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen />;
  if (!user) redirect("/login/mentor");
  if (user.role !== "mentor") redirect(`/${user.role}/dashboard`);

  const menuItems = [
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
