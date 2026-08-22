import express from "express";
import cors from "cors";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "globetrotter_jwt_secret_key_8f3a9b1c7d2e4f6a5b8c9d0e1f2a3b4c";

// Middleware
app.use(cors());
app.use(express.json());

// Auth Middleware Helper
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied. Token missing." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token." });
    req.user = user;
    next();
  });
};

// 1. Root Test Route
app.get("/", (req, res) => {
  res.json({ message: "GlobeTrotter Neon PostgreSQL API is running!", status: "healthy" });
});

// 2. Auth Endpoints
app.post("/api/auth/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, city, country } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "User with this email already exists." });

    const hashedPassword = await bcrypt.hash(password || "password123", 10);
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        city,
        country,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
      }
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid email or password." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid email or password." });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 1-Click Judge Demo Login
app.post("/api/auth/demo", async (req, res) => {
  try {
    const demoUser = await prisma.user.findFirst({ where: { email: "demo@globetrotter.com" } });
    if (!demoUser) return res.status(404).json({ error: "Demo user not found. Run seed script." });

    const token = jwt.sign({ userId: demoUser.id, email: demoUser.email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: demoUser.id, firstName: demoUser.firstName, lastName: demoUser.lastName, email: demoUser.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Master Cities Catalog API
app.get("/api/cities", async (req, res) => {
  try {
    const { region, search } = req.query;
    const where = {};
    if (region && region !== "All") where.region = region;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { country: { contains: search, mode: "insensitive" } }
      ];
    }

    const cities = await prisma.city.findMany({ where, orderBy: { popularity: "desc" } });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Activities Catalog API
app.get("/api/activities", async (req, res) => {
  try {
    const { cityId, category, search } = req.query;
    const where = {};
    if (cityId) where.cityId = cityId;
    if (category && category !== "All") where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ];
    }

    const activities = await prisma.activity.findMany({
      where,
      include: { city: true },
      orderBy: { estimatedCost: "asc" }
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Trip Management APIs
app.get("/api/trips", async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        stops: {
          include: {
            city: true,
            activities: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/trips/:id", async (req, res) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { firstName: true, lastName: true, avatarUrl: true } },
        stops: {
          include: {
            city: true,
            activities: true
          },
          orderBy: { stopOrder: "asc" }
        }
      }
    });
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Admin Analytics API
app.get("/api/admin/stats", async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalTrips = await prisma.trip.count();
    const totalCities = await prisma.city.count();
    const totalActivities = await prisma.activity.count();

    res.json({
      totalUsers,
      totalTrips,
      totalCities,
      totalActivities,
      database: "Neon PostgreSQL"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 GlobeTrotter Backend Server listening on http://localhost:${PORT}`);
});
