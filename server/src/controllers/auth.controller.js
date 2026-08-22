import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { config } from "../config/env.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import { getOrCreateDemoUser } from "../utils/demoUser.js";

// Register New User
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, city, country } = req.body;
    if (!email || !password) {
      return sendError(res, "Email and password are required.", 400);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return sendError(res, "User with this email already exists.", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        firstName: firstName || "Traveler",
        lastName: lastName || "",
        email,
        password: hashedPassword,
        phone,
        city,
        country,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
      }
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, config.JWT_SECRET, { expiresIn: "7d" });
    return sendSuccess(res, {
      token,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, avatarUrl: user.avatarUrl }
    }, 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, "Email and password are required.", 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendError(res, "Invalid email or password.", 400);
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return sendError(res, "Invalid email or password.", 400);
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, config.JWT_SECRET, { expiresIn: "7d" });
    return sendSuccess(res, {
      token,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, avatarUrl: user.avatarUrl }
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// 1-Click Demo Login for Judges & Evaluators
export const demoLogin = async (req, res) => {
  try {
    const demoUser = await getOrCreateDemoUser();
    const token = jwt.sign({ userId: demoUser.id, email: demoUser.email }, config.JWT_SECRET, { expiresIn: "7d" });
    return sendSuccess(res, {
      token,
      user: { id: demoUser.id, firstName: demoUser.firstName, lastName: demoUser.lastName, email: demoUser.email, avatarUrl: demoUser.avatarUrl }
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// Get Current User Profile
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true, bio: true, city: true, country: true }
    });
    if (!user) return sendError(res, "User not found.", 404);
    return sendSuccess(res, user);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
