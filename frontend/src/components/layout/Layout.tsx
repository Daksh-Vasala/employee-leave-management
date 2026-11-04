import Sidebar from "./Sidebar";
import type { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen gb-slate-50">
      <Sidebar />

      <main className="p-8">{children}</main>
    </div>
  );
}

export default Layout;
