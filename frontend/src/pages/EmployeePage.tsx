import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import type { Employee } from "../types";
import { toast } from "react-toastify";
import { getEmployees } from "../services/employee.service";
import { Link } from "react-router-dom";
import { Plus, Users } from "lucide-react";

function EmployeePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const fetchEmployees = async () => {
    setIsLoading(true);

    try {
      const res = await getEmployees();
      setEmployees(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load employees");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page heading */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-800">
              Employees
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              View and manage your organization's employees.
            </p>
          </div>

          <Link
            to="/employees/add"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 active:bg-blue-800"
          >
            <Plus size={17} />
            Add Employee
          </Link>
        </div>

        {/* Employee count */}
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-5 py-4">
          <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
            <Users size={20} />
          </div>

          <div>
            <p className="text-xs text-slate-500">Total Employees</p>
            <p className="text-lg font-semibold text-slate-800">
              {isLoading ? "..." : employees.length}
            </p>
          </div>
        </div>

        {/* Employee table */}
        <div className="space-y-3">
          <div>
            <h3 className="text-base font-semibold text-slate-800">
              All Employees
            </h3>
          </div>

          {isLoading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-sm text-slate-500">Loading employees...</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
              <p className="mt-3 font-medium text-slate-700">
                No employees yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">ID</th>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Department</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {employees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      <td className="px-6 py-4 text-slate-400">
                        #{employee.id}
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-800">
                        {employee.name}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {employee.email}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {employee.department}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default EmployeePage;
