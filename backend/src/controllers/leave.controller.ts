import type { Request, Response } from "express";
import {
  leaveRequests,
  leaveStatusEnum,
  leaveTypeEnum,
} from "../db/schema/leave-request.schema";
import { db } from "../db";
import { employees } from "../db/schema/employee.schema";
import { and, desc, eq, gte, lte, ne } from "drizzle-orm";

const isValidDate = (date: string): boolean => {
  return (
    !isNaN(Date.parse(date)) &&
    new Date(date).toISOString().slice(0, 10) === date
  );
};

export const createLeaveRequest = async (req: Request, res: Response) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;

    // Check all required fields
    if (
      employeeId === undefined ||
      leaveType === undefined ||
      !startDate ||
      !endDate ||
      !reason
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const parsedEmployeeId = Number(employeeId);

    // Validate employee id
    if (!Number.isInteger(parsedEmployeeId) || parsedEmployeeId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee id",
      });
    }

    // Validate leave type
    if (!leaveTypeEnum.enumValues.includes(leaveType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid leave type",
      });
    }

    // Validate date regex
    if (
      typeof startDate !== "string" ||
      typeof endDate !== "string" ||
      !isValidDate(startDate) ||
      !isValidDate(endDate)
    ) {
      return res.status(400).json({
        success: false,
        message: "Date must be in YYYY-MM-DD format",
      });
    }

    // Validate date overlap
    if (endDate < startDate) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    // Validate reason
    if (typeof reason !== "string" || reason.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Reason must contain atleast 5 characters",
      });
    }

    // Check whether employee exists
    const [employee] = await db
      .select()
      .from(employees)
      .where(eq(employees.id, employeeId))
      .limit(1);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const overlappingLeave = await db
      .select()
      .from(leaveRequests)
      .where(
        and(
          eq(leaveRequests.employeeId, employeeId),
          ne(leaveRequests.status, "rejected"),
          lte(leaveRequests.startDate, endDate),
          gte(leaveRequests.endDate, startDate),
        ),
      );

    if (overlappingLeave.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Employee already has a pending or approved leave during these dates",
      });
    }

    const [newLeaveRequest] = await db
      .insert(leaveRequests)
      .values({
        employeeId: parsedEmployeeId,
        leaveType,
        startDate,
        endDate,
        reason: reason.trim(),
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Leave requests submitted successfully",
      data: newLeaveRequest,
    });
  } catch (error) {
    console.error("Error in submitting leave request: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getLeaveRequests = async (req: Request, res: Response) => {
  try {
    const { employeeId, status } = req.query;

    if (
      employeeId &&
      (!Number.isInteger(Number(employeeId)) || Number(employeeId) <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee id",
      });
    }

    if (
      status &&
      !leaveStatusEnum.enumValues.includes(
        status as "pending" | "approved" | "rejected",
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const filters = [];

    if (employeeId) {
      filters.push(eq(leaveRequests.employeeId, Number(employeeId)));
    }

    if (status) {
      filters.push(
        eq(leaveRequests.status, status as "pending" | "approved" | "rejected"),
      );
    }

    const allLeaveRequests = await db
      .select({
        id: leaveRequests.id,
        employeeId: leaveRequests.employeeId,
        employeeName: employees.name,
        employeeEmail: employees.email,
        department: employees.department,
        leaveType: leaveRequests.leaveType,
        startDate: leaveRequests.startDate,
        endDate: leaveRequests.endDate,
        reason: leaveRequests.reason,
        status: leaveRequests.status,
        createdAt: leaveRequests.createdAt,
      })
      .from(leaveRequests)
      .where(and(...filters))
      .innerJoin(employees, eq(leaveRequests.employeeId, employees.id))
      .orderBy(desc(leaveRequests.createdAt));

    return res.status(200).json({
      success: true,
      message: "Leave requests fetched successfully",
      data: allLeaveRequests,
    });
  } catch (error) {
    console.error("Error in fetching leave request: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateLeaveStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate leave request ID
    const leaveId = Number(id);

    if (!Number.isInteger(leaveId) || leaveId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid leave request ID",
      });
    }

    // Validate status
    if (status !== "approved" && status !== "rejected") {
      return res.status(400).json({
        success: false,
        message: "Status must be approved or rejected",
      });
    }

    // Check whether leave request exists
    const [leaveRequest] = await db
      .select()
      .from(leaveRequests)
      .where(eq(leaveRequests.id, leaveId))
      .limit(1);

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

     // Only pending requests can be updated
    if (leaveRequest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending leave requests can be updated",
      });
    }

     const [updatedLeave] = await db
      .update(leaveRequests)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(leaveRequests.id, leaveId))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Leave request status updated successfully",
      data: updatedLeave,
    });

  } catch (error) {
    console.error("Error in updating leave status: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
