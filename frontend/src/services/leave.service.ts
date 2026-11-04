import api from "./api";
import type { LeaveRequest, LeaveStatus, LeaveType } from "../types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface CreateLeaveData {
  employeeId: number;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

interface LeaveFilters {
  employeeId?: number;
  status?: LeaveStatus;
}

// Get all leave requests with optional filters
export const getLeaveRequests = async (
  filters?: LeaveFilters,
): Promise<ApiResponse<LeaveRequest[]>> => {
  const response = await api.get<ApiResponse<LeaveRequest[]>>("/leaves", {
    params: filters,
  });

  return response.data;
};

// Submit a leave request
export const createLeaveRequest = async (
  leaveData: CreateLeaveData,
): Promise<ApiResponse<LeaveRequest>> => {
  const response = await api.post<ApiResponse<LeaveRequest>>(
    "/leaves",
    leaveData,
  );

  return response.data;
};

// Approve or reject a leave request
export const updateLeaveStatus = async (
  id: number,
  status: "approved" | "rejected",
): Promise<ApiResponse<LeaveRequest>> => {
  const response = await api.patch<ApiResponse<LeaveRequest>>(`/leaves/${id}`, {
    status,
  });

  return response.data;
};
