import { Router } from "express";
import {
  createLeaveRequest,
  getLeaveRequests,
  updateLeaveStatus,
} from "../controllers/leave.controller";
const router = Router();

router.get("/", getLeaveRequests);
router.post("/", createLeaveRequest);
router.patch("/:id", updateLeaveStatus);

export default router;
