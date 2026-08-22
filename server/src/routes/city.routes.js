import { Router } from "express";
import { getCities, getCityById, createCity } from "../controllers/city.controller.js";

const router = Router();

router.get("/", getCities);
router.get("/:id", getCityById);
router.post("/", createCity);

export default router;
