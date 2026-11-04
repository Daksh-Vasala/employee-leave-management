import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, CalendarDays } from "lucide-react";

function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
      isActive
        ? "bg-slate-800 text-white"
        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
    }`;

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 px-5 py-7 text-white">
      <div className="flex gap-3 items-center">
        <div className="bg-blue-800 px-2 py-1 rounded-lg font-semibold">LM</div>
        <h1 className="tracking-tighter">Leave management</h1>
      </div>

      <nav className="mt-6 flex flex-col gap-3">
        <NavLink to={"/"} className={linkClass}>
          <LayoutDashboard size={16} /> Dashboard
        </NavLink>

        <NavLink to={"/employees"} className={linkClass}>
          <Users size={16} /> Employees
        </NavLink>
        <NavLink to={"/leaves"} className={linkClass}>
          <CalendarDays size={16} /> Leaves
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
