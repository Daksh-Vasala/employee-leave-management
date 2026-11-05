export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export type LeaveType = "casual" | "sick" | "earned";

export type LeaveStatus = "pending" | "approved" | "rejected";

export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
}

export interface DashboardStats {
  totalEmployees: number;
  pending: number;
  approved: number;
  rejected: number;
}
