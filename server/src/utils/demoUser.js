import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

/**
 * Guarantees that a Demo User exists in the database for hackathon evaluations & instant logins
 */
export const getOrCreateDemoUser = async () => {
  let demoUser = await prisma.user.findFirst({ where: { email: "demo@globetrotter.com" } });
  if (!demoUser) {
    const hashedPassword = await bcrypt.hash("demo123", 10);
    demoUser = await prisma.user.create({
      data: {
        firstName: "Alex",
        lastName: "Traveler",
        email: "demo@globetrotter.com",
        password: hashedPassword,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        bio: "Avid traveler & multi-city explorer."
      }
    });
  }
  return demoUser;
};
