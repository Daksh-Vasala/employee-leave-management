import { db } from "./index";
import { employees } from "./schema/employee.schema";
import { leaveRequests } from "./schema/leave-request.schema";
import { and, eq } from "drizzle-orm";

const seed = async () => {
  try {
    console.log("Starting database seeding...");

    // 1. Insert sample employees
    const sampleEmployees = [
      {
        name: "Rahul Sharma",
        email: "rahul@example.com",
        department: "Engineering",
      },
      {
        name: "Priya Patel",
        email: "priya@example.com",
        department: "HR",
      },
      {
        name: "Amit Shah",
        email: "amit@example.com",
        department: "Marketing",
      },
    ];

    for (const employee of sampleEmployees) {
      await db.insert(employees).values(employee);
    }

    // 2. Fetch employees to get their database IDs
    const allEmployees = await db.select().from(employees);

    const rahul = allEmployees.find(
      (employee) => employee.email === "rahul@example.com",
    );

    const priya = allEmployees.find(
      (employee) => employee.email === "priya@example.com",
    );

    const amit = allEmployees.find(
      (employee) => employee.email === "amit@example.com",
    );

    if (!rahul || !priya || !amit) {
      throw new Error("Could not find sample employees.");
    }

    // 3. Prepare sample leave requests
    const sampleLeaves = [
      {
        employeeId: rahul.id,
        leaveType: "casual" as const,
        startDate: "2026-11-10",
        endDate: "2026-11-12",
        reason: "Personal work",
        status: "pending" as const,
      },
      {
        employeeId: rahul.id,
        leaveType: "sick" as const,
        startDate: "2026-11-20",
        endDate: "2026-11-21",
        reason: "Medical rest",
        status: "approved" as const,
      },
      {
        employeeId: priya.id,
        leaveType: "earned" as const,
        startDate: "2026-11-12",
        endDate: "2026-11-14",
        reason: "Family function",
        status: "rejected" as const,
      },
      {
        employeeId: amit.id,
        leaveType: "casual" as const,
        startDate: "2026-11-16",
        endDate: "2026-11-18",
        reason: "Personal reasons",
        status: "pending" as const,
      },
    ];

    // 4. Insert leaves only if they don't already exist
    for (const leave of sampleLeaves) {
      const existingLeave = await db
        .select()
        .from(leaveRequests)
        .where(
          and(
            eq(leaveRequests.employeeId, leave.employeeId),
            eq(leaveRequests.startDate, leave.startDate),
            eq(leaveRequests.endDate, leave.endDate),
          ),
        )
        .limit(1);

      if (existingLeave.length === 0) {
        await db.insert(leaveRequests).values(leave);
      }
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exitCode = 1;
  }
};

seed();
