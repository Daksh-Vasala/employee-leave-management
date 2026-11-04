import Sidebar from "./Sidebar";
import type { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1">

      <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
