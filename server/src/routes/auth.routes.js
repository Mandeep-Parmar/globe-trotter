import { Router } from "express";
import { register, login, demoLogin, getMe, updateProfile } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/demo", demoLogin);
router.get("/me", authenticateToken, getMe);
router.put("/me", authenticateToken, updateProfile);

export default router;
