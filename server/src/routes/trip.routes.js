import { Router } from "express";
import {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip
} from "../controllers/trip.controller.js";
import { addStop, deleteStop } from "../controllers/stop.controller.js";
import { addActivityToStop, deleteActivityFromStop } from "../controllers/activityItem.controller.js";
import { optionalAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Trip CRUD
router.get("/", getAllTrips);
router.get("/:id", getTripById);
router.post("/", optionalAuth, createTrip);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

// Stop Section Routes
router.post("/:id/stops", addStop);
router.delete("/:tripId/stops/:stopId", deleteStop);

// Activity Item Routes
router.post("/:tripId/stops/:stopId/activities", addActivityToStop);
router.delete("/:tripId/stops/:stopId/activities/:activityId", deleteActivityFromStop);

export default router;
