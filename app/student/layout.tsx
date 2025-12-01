import { redirect } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";


export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen />;

  if (!user) redirect("/login/student");

  if (user.role !== "student") redirect(`/${user.role}/dashboard`);

  return (
    <div>
      {/* Your Student Sidebar / Navbar etc. */}
      {children}
    </div>
  );
}
