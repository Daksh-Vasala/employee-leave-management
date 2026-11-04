import { useState } from "react";
import { useForm } from "react-hook-form";
import { createEmployee } from "../../services/employee.service";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

interface EmployeeFormData {
  name: string;
  email: string;
  department: string;
}

function EmployeeForm({ reset }: { reset: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: EmployeeFormData) => {
    setIsLoading(true);
    try {
      const res = await createEmployee({
        name: data.name,
        email: data.email,
        department: data.department,
      });

      toast.success(res.message || "Employee added successfully");
      reset();
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data.message || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Name
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
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter employee's full name"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
        />
        {errors.name && (
          <p className="text-sm text-red-500">
            {errors.name.message as string}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          type="email"
          {...register("email", {
            required: "Name is required",
          })}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter employee's email"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
        />
        {errors.email && (
          <p className="text-sm text-red-500">
            {errors.email.message as string}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
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
          required
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="Enter employee's department"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
        />
        {errors.department && (
          <p className="text-sm text-red-500">
            {errors.department.message as string}
          </p>
        )}
      </div>

      <button
        disabled={isLoading}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

export default EmployeeForm;
