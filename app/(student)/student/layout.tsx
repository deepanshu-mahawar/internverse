"use client";

import { ReactNode, useState } from "react";

import {
  LayoutDashboard,
  FolderOpen,
  Upload,
  MessageSquare,
  User,
} from "lucide-react";

import { redirect } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Loader from "@/app/components/Loader";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";

interface StudentLayoutProps {
  children: ReactNode;
}

const StudentLayout = ({ children }: StudentLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen />;
  if (!user) redirect("/login/student");
  if (user.role !== "student") redirect(`/${user.role}/dashboard`);

  const menuItems = [
    { path: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/student/projects", label: "My Projects", icon: FolderOpen },
    { path: "/student/upload", label: "Upload Project", icon: Upload },
    { path: "/student/feedback", label: "Feedback", icon: MessageSquare },
    { path: "/student/profile", label: "Profile", icon: User },
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

export default StudentLayout;
