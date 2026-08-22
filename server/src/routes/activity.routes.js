import { Router } from "express";
import { getActivities, getActivityById, createActivity } from "../controllers/activity.controller.js";

const router = Router();

router.get("/", getActivities);
router.get("/:id", getActivityById);
router.post("/", createActivity);

export default router;
