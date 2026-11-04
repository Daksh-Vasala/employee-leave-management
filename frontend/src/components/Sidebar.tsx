import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, CalendarDays } from "lucide-react";

function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 justify-center lg:justify-start rounded-md px-3 py-2.5 text-sm transition-colors ${
      isActive
        ? "bg-slate-800 text-white"
        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
    }`;

  return (
    <aside className="flex min-h-screen w-16 shrink-0 flex-col border-r border-slate-800 bg-slate-950 px-2 py-7 text-white lg:w-64 lg:px-5">
      <div className="flex items-center justify-center gap-3 lg:justify-start">
        <div className="rounded-lg bg-blue-800 px-2 py-1 font-semibold">
          LM
        </div>
        <h1 className="hidden text-sm font-semibold tracking-tight lg:block">
          Leave Management
        </h1>
      </div>

      <nav className="mt-8 flex flex-col gap-3">
        <NavLink to="/" end className={linkClass} title="Dashboard">
          <LayoutDashboard size={18} />
          <span className="hidden lg:block">Dashboard</span>
        </NavLink>

        <NavLink to="/employees" className={linkClass} title="Employees">
          <Users size={18} />
          <span className="hidden lg:block">Employees</span>
        </NavLink>

        <NavLink to="/leaves" className={linkClass} title="Leaves">
          <CalendarDays size={18} />
          <span className="hidden lg:block">Leaves</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;