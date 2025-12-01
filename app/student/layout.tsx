import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default function StudentLayout({ children }: { children: ReactNode }) {
  const user = { role: "student" };

  if (user.role !== "student") redirect("/");

  return (
    <div>
      <h2>Student Layout</h2>
      {children}
    </div>
  );
}
