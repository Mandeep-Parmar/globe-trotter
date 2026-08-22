import { Router } from "express";
import authRoutes from "./auth.routes.js";
import cityRoutes from "./city.routes.js";
import activityRoutes from "./activity.routes.js";
import tripRoutes from "./trip.routes.js";
import adminRoutes from "./admin.routes.js";
import healthRoutes from "./health.routes.js";

const router = Router();

// Mount Sub-routers
router.use("/auth", authRoutes);
router.use("/cities", cityRoutes);
router.use("/activities", activityRoutes);
router.use("/trips", tripRoutes);
router.use("/admin", adminRoutes);
router.use("/", healthRoutes);

export default router;
