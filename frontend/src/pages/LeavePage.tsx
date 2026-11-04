import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { getLeaveRequests, updateLeaveStatus } from "../services/leave.service";
import type { LeaveRequest, LeaveStatus, Employee } from "../types";
import { AxiosError } from "axios";
import { getEmployees } from "../services/employee.service";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

function LeavePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const onStatusUpdate = async (
    id: number,
    status: "approved" | "rejected",
  ) => {
    try {
      setUpdatingId(id);
      const res = await updateLeaveStatus(id, status);
      toast.success(res.message || "Status updated successfully");
      await fetchLeaves();
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const fetchLeaves = async () => {
    setIsLoading(true);
    try {
      const res = await getLeaveRequests({
        employeeId: employeeFilter ? Number(employeeFilter) : undefined,
        status: statusFilter ? (statusFilter as LeaveStatus) : undefined,
      });
      setLeaves(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load leave requests");
    } finally {
      setIsLoading(false);
    }
  };

  const statusStyle = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getEmployees();
        setEmployees(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load employees");
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [employeeFilter, statusFilter]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page heading */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-800">
              Leave Requests
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review and manage employee leave applications.
            </p>
          </div>

          <Link
            to="/leaves/add"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 active:bg-blue-800"
          >
            <Plus size={17} />
            Submit Leave
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          >
            <option value="">All Employees</option>

            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Leave table */}
        <div className="space-y-3">
          <div>
            <h3 className="text-base font-semibold text-slate-800">
              All Requests
            </h3>
          </div>

          {isLoading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-sm text-slate-500">
                Loading leave requests...
              </p>
            </div>
          ) : leaves.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
              <p className="mt-3 font-medium text-slate-700">
                No leave requests found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Leave requests will appear here once submitted.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">Employee</th>
                    <th className="px-5 py-4 font-medium">Leave Type</th>
                    <th className="px-5 py-4 font-medium">Start Date</th>
                    <th className="px-5 py-4 font-medium">End Date</th>
                    <th className="px-5 py-4 font-medium">Reason</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {leaves.map((leave) => (
                    <tr
                      key={leave.id}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-800">
                          {leave.employeeName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {leave.employeeEmail}
                        </p>
                      </td>

                      <td className="px-5 py-4 capitalize text-slate-600">
                        {leave.leaveType}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {leave.startDate}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {leave.endDate}
                      </td>

                      <td className="max-w-48 px-5 py-4 text-slate-600">
                        {leave.reason}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyle[leave.status]}`}
                        >
                          {leave.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {leave.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                onStatusUpdate(leave.id, "approved")
                              }
                              disabled={updatingId === leave.id}
                              className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() =>
                                onStatusUpdate(leave.id, "rejected")
                              }
                              disabled={updatingId === leave.id}
                              className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            No actions available
                          </span>
                        )}
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

export default LeavePage;
