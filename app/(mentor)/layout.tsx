import { ReactNode } from "react";
// import { redirect } from "next/navigation";
// import Loader from "../components/Loader";
// import { useAuth } from "../context/AuthContext";

interface MentorLayoutProps {
  children: ReactNode;
}

const MentorMainLayout = ({ children }: MentorLayoutProps) => {
  // const { user, loading } = useAuth();

  // if (loading) {
  //   return <Loader fullScreen />;
  // }

  // if (!user) {
  //   redirect("/login/student");
  // }

  // if (user.role !== "mentor") {
  //   redirect(`/${user.role}/dashboard`);
  // }

  return <>{children}</>;
};

export default MentorMainLayout;
