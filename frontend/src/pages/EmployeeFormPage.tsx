import { useState } from "react";
import { useForm } from "react-hook-form";
import { createEmployee } from "../services/employee.service";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import Layout from "../components/Layout";
import { Link, useNavigate } from "react-router";

interface EmployeeFormData {
  name: string;
  email: string;
  department: string;
}

function EmployeeFormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>();

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: EmployeeFormData) => {
    setIsLoading(true);

    try {
      const res = await createEmployee({
        name: data.name.trim(),
        email: data.email.trim(),
        department: data.department.trim(),
      });

      toast.success(res.message || "Employee added successfully");
      navigate("/employees");
    } catch (error) {
      console.error(error);

      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10";

  return (
    <Layout>
      <div className="mb-4">
        <Link
          to={"/employees"}
          className="text-sm text-slate-500 cursor-pointer hover:text-slate-700 transition-colors"
        >
          {"← Back"}
        </Link>
      </div>
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-800">
            Add Employee
          </h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 rounded-xl border border-slate-200 bg-white p-7 shadow-sm"
        >
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-semibold text-slate-800">
              Employee Information
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              All fields are required.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must contain at least 2 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Name must contain at most 100 characters",
                },
              })}
              placeholder="Enter employee's full name"
              className={inputClass}
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              placeholder="Enter employee's email"
              className={inputClass}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Department
            </label>
            <input
              type="text"
              {...register("department", {
                required: "Department is required",
                minLength: {
                  value: 2,
                  message: "Department must contain at least 2 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Department must contain at most 100 characters",
                },
              })}
              placeholder="Enter employee's department"
              className={inputClass}
            />
            {errors.department && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.department.message}
              </p>
            )}
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
            >
              {isLoading ? "Adding Employee..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default EmployeeFormPage;
