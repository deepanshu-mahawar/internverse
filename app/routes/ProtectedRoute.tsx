// "use client";

// import { ReactNode, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "../context/AuthContext";
// import Loader from "../components/Loader";

// interface ProtectedRouteProps {
//   children: ReactNode;
//   allowedRoles?: string[];
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
//   children,
//   allowedRoles,
// }) => {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading) {
//       if (!user) {
//         router.replace("/login/student");
//       } else if (allowedRoles && !allowedRoles.includes(user.role)) {
//         router.replace(`/${user.role}/dashboard`);
//       }
//     }
//   }, [user, loading, allowedRoles, router]);

//   if (loading || !user) {
//     return <Loader fullScreen />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;
