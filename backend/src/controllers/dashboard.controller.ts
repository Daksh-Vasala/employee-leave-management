import type { Request, Response } from "express";
import { db } from "../db";
import { count } from "drizzle-orm";
import { employees } from "../db/schema/employee.schema";
import { leaveRequests } from "../db/schema/leave-request.schema";

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const [employeeCount, leaveCount] = await Promise.all([
      db.select({ total: count() }).from(employees),
      db
        .select({ status: leaveRequests.status, total: count() })
        .from(leaveRequests)
        .groupBy(leaveRequests.status),
    ]);

    const pending =
      leaveCount.find((item) => item.status === "pending")?.total ?? 0;

    const approved =
      leaveCount.find((item) => item.status === "approved")?.total ?? 0;

    const rejected =
      leaveCount.find((item) => item.status === "rejected")?.total ?? 0;

    return res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: {
        totalEmployees: employeeCount[0].total,
        pending,
        approved,
        rejected,
      },
    });
  } catch (error) {
    console.error("Error in fetching dashboard stats: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
