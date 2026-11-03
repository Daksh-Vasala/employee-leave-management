import {
  check,
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";
import { employees } from "./employee.schema";

export const leaveStatusEnum = pgEnum("leave_status", [
  "pending",
  "approved",
  "rejected",
]);

export const leaveTypeEnum = pgEnum("leave_type", ["casual", "sick", "earned"]);

export const leaveRequests = pgTable(
  "leave_requests",
  {
    id: serial("id").primaryKey(),

    employeeId: integer("employee_id")
      .notNull()
      .references(() => employees.id),

    leaveType: leaveTypeEnum("leave_type").notNull(),

    startDate: date("start_date", { mode: "string" }).notNull(),

    endDate: date("end_date", { mode: "string" }).notNull(),

    reason: text("reason").notNull(),

    status: leaveStatusEnum("status").default("pending").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    check("leave_date_check", sql`${table.endDate} >= ${table.startDate}`),
  ],
);
