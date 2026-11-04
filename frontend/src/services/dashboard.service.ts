import api from "./api";
import type { DashboardStats } from "../types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getDashboardStats = async (): Promise<
  ApiResponse<DashboardStats>
> => {
  const response = await api.get<ApiResponse<DashboardStats>>("/dashboard");

  return response.data;
};
