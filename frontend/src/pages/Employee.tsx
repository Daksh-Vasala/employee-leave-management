import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import type { Employee } from "../types";
import { toast } from "react-toastify";
import { getEmployees } from "../services/employee.service";
import EmployeeForm from "../components/employees/EmployeeForm";

function Employee() {
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>();
  const [isOpen, setIsOpen] = useState(false);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await getEmployees();
      setEmployees(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, []);

  const onReset = () => {
    setIsOpen(false);
    fetchEmployees();
  }

  return (
    <Layout>
      <div className="space-y-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800">
          Employee Management
        </h2>
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          Add Employee
        </button>
      </div>

      <div className="space-y-3 mt-4">
        {isLoading ? (
          <p className="text-slate-500">Loading employees...</p>
        ) : (
          <div>
            {employees?.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                <p className="text-slate-500">No employees found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-6 py-4 font-semibold">ID</th>
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">Email</th>
                      <th className="px-6 py-4 font-semibold">Department</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {employees?.map((employee) => (
                      <tr key={employee.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-500">
                          #{employee.id}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {employee.name}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {employee.email}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {employee.department}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="w-1/2 mt-5">
          <EmployeeForm reset={onReset} />
        </div>
      )}
    </Layout>
  );
}
export default Employee;
