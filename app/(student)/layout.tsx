import { ReactNode } from "react";
import { redirect } from "next/navigation";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

interface StudentLayoutProps {
  children: ReactNode;
}

const StudentMainLayout = ({ children }: StudentLayoutProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!user) {
    redirect("/login/student");
  }

  if (user.role !== "student") {
    redirect(`/${user.role}/dashboard`);
  }

  return <>{children}</>;
};

export default StudentMainLayout;
