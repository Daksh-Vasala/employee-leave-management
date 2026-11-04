import { Request, Response } from "express";
import { db } from "../db";
import { employees } from "../db/schema/employee.schema";
import { eq } from "drizzle-orm";

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { name, email, department } = req.body;

    // Checked required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof department !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and department must be string",
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedDepartment = department.trim();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must be in between 2 and 100 characters",
      });
    }

    const nameRegex = /^[\p{L}][\p{L}\p{M}\s.'-]*$/u;
    if (!nameRegex.test(trimmedName)) {
      return res.status(400).json({
        success: false,
        message: "Name contains invalid characters",
      });
    }

    // Department validation
    if (trimmedDepartment.length < 2 || trimmedDepartment.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Department must be between 2 and 100 characters",
      });
    }

    const departmentRegex = /^[\p{L}][\p{L}\p{M}\s&().'-]*$/u;

    if (!departmentRegex.test(trimmedDepartment)) {
      return res.status(400).json({
        success: false,
        message: "Department contains invalid characters",
      });
    }

    // duplicate check
    const [existingEmail] = await db
      .select({ id: employees.id })
      .from(employees)
      .where(eq(employees.email, trimmedEmail))
      .limit(1);

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "An employee already exists with this email",
      });
    }

    //Insert emplpoyee
    const [newEmployee] = await db
      .insert(employees)
      .values({
        name: trimmedName,
        email: trimmedEmail,
        department: trimmedDepartment,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: newEmployee,
    });
  } catch (error) {
    console.error("Error in creating employee: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const allEmployees = await db.select().from(employees);

    return res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      data: allEmployees,
    });
  } catch (error) {
    console.error("Error in fetching employees: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
