"use server";

import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function registerUser(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");

  if (!name || !email || !password || !role) {
    return { error: "All fields are required." };
  }

  try {
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User with this email already exists." };
    }

    // 2. Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Save the new user to the database
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong during registration." };
  }

  // 4. Redirect the user to the login page (must be outside try/catch)
  redirect("/login");
}

export async function loginUser(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    // 1. Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Invalid email or password." };
    }

    // 2. Verify the password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { error: "Invalid email or password." };
    }

    // 3. Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token expires in 1 day
    );

    // 4. Store the token in an HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("schoolsphere_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day in seconds
      path: "/",
    });

  } catch (error) {
    console.error("Login error:", error);
    return { error: "Something went wrong during login." };
  }

  // 5. Redirect to dashboard
  redirect("/dashboard");
}

export async function logoutUser() {
  const cookieStore = await cookies();
  
  // Invalidate and delete the authentication cookie
  cookieStore.delete("schoolsphere_token");
  
  // Redirect the user back to the login page (or homepage)
  redirect("/login");
}
