// app/profile/layout.tsx
import type { ReactNode } from "react";
import Sidebar from "@/util/sidebar";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen overflow-hidden bg-[#0b0b0c]">
      <Sidebar />
      <div className="h-full pl-[92px]">{children}</div>
    </div>
  );
}