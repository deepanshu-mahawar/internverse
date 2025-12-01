import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default function StudentLayout({ children }: { children: ReactNode }) {
  const user = { role: "admin" };

  if (user.role !== "admin") redirect("/");

  return (
    <div>
      <h2>Mentor Layout</h2>
      {children}
    </div>
  );
}
