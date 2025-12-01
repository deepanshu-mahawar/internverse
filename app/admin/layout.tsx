import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!user) {
    redirect("/login/admin");
  }

  if (user.role !== "admin") {
    redirect(`/${user.role}/dashboard`);
  }

  return <>{children}</>;
};

export default AdminLayout;
