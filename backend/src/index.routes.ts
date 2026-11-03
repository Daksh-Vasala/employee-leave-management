import { Router } from "express";
const router = Router();

import employeeRoutes from "./routes/employee.routes";
import leaveRoutes from "./routes/leave.routes";

router.use("/employees", employeeRoutes);
router.use("/leaves", leaveRoutes);

export default router;
