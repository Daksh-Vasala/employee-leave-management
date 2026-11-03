import { Router } from "express";
const router = Router();

import employeeRoutes from "./routes/employee.routes";
import leaveRoutes from "./routes/leave.routes";
import dashboardRoutes from "./routes/dashboard.routes";

router.use("/employees", employeeRoutes);
router.use("/leaves", leaveRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
