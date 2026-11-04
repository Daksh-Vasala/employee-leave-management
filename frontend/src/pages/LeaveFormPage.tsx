import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { LeaveType, Employee } from "../types";
import { getEmployees } from "../services/employee.service";
import { createLeaveRequest } from "../services/leave.service";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

interface LeaveFormData {
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

function LeaveFormPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<LeaveFormData>();

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
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

    fetchEmployees();
  }, []);

  const onSubmit = async (data: LeaveFormData) => {
    setIsSubmitLoading(true);

    try {
      await createLeaveRequest({
        employeeId: Number(data.employeeId),
        leaveType: data.leaveType,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason.trim(),
      });

      toast.success("Leave request submitted successfully");
      reset();
    } catch (error) {
      console.error(error);

      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

  return (
    <Layout>
      <div className="mb-4">
        <Link
          to="/leaves"
          className="text-sm text-slate-500 cursor-pointer hover:text-slate-700 transition-colors"
        >
          ← Back
        </Link>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-500">Loading form...</p>
        </div>
      ) : (
        <div className="max-w-2xl space-y-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-800">
              Submit Leave Request
            </h2>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 rounded-xl border border-slate-200 bg-white p-7 shadow-sm"
          >
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-semibold text-slate-800">
                Leave Information
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                All fields are required
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Employee
              </label>

              <select
                {...register("employeeId", {
                  required: "Please select an employee",
                })}
                className={inputClass}
              >
                <option value="">Select employee</option>

                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>

              {errors.employeeId && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.employeeId.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Leave Type
              </label>

              <select
                {...register("leaveType", {
                  required: "Please select a leave type",
                })}
                defaultValue=""
                className={inputClass}
              >
                <option value="" disabled>
                  Select leave type
                </option>
                <option value="casual">Casual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="earned">Earned Leave</option>
              </select>

              {errors.leaveType && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.leaveType.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Start Date
                </label>

                <input
                  type="date"
                  {...register("startDate", {
                    required: "Start date is required",
                  })}
                  min={today}
                  max={endDate || undefined}
                  className={inputClass}
                />

                {errors.startDate && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  End Date
                </label>

                <input
                  type="date"
                  min={startDate || today}
                  {...register("endDate", {
                    required: "End date is required",
                  })}
                  className={inputClass}
                />

                {errors.endDate && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Reason
              </label>

              <textarea
                {...register("reason", {
                  required: "Reason is required",
                  minLength: {
                    value: 5,
                    message: "Reason must contain at least 5 characters",
                  },
                })}
                placeholder="Enter reason for leave"
                rows={4}
                className={inputClass}
              />

              {errors.reason && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.reason.message}
                </p>
              )}
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-4">
              <button
                type="submit"
                disabled={isSubmitLoading || employees.length === 0}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitLoading ? "Submitting..." : "Submit Leave Request"}
              </button>
            </div>

            {employees.length === 0 && (
              <p className="text-xs text-amber-600">
                Add an employee before submitting a leave request.
              </p>
            )}
          </form>
        </div>
      )}
    </Layout>
  );
}

export default LeaveFormPage;
