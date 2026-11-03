import { Router } from "express";
const router = Router();

import employeeRoutes from "./routes/employee.routes";

router.use("/employees", employeeRoutes);

export default router;
