import api from "./api";
import type { Employee } from "../types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await api.get<ApiResponse<Employee[]>>("/employees");

  return response.data.data;
};

export const createEmployee = async (employeeData: {
  name: string;
  email: string;
  department: string;
}): Promise<Employee> => {
  const response = await api.post<ApiResponse<Employee>>(
    "/employees",
    employeeData
  );

  return response.data.data;
};