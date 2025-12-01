import { ReactNode } from "react";
import { redirect } from "next/navigation";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminMainLayout = ({ children }: AdminLayoutProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!user) {
    redirect("/login/student");
  }

  if (user.role !== "admin") {
    redirect(`/${user.role}/dashboard`);
  }

  return <>{children}</>;
};

export default AdminMainLayout;
