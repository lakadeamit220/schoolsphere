import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * Reads the JWT cookie, verifies it, and returns the full user object.
 * Returns null if no valid session exists.
 * This function can ONLY be called from Server Components or Server Actions.
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("schoolsphere_token")?.value;

    if (!token) {
      return null;
    }

    // Decode and verify the JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    );

    // Fetch fresh user data from database (not just the stale JWT payload)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    // Token is invalid or expired
    console.error("getCurrentUser error:", error.message);
    return null;
  }
}
