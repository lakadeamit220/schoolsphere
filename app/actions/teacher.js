"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// GET ALL TEACHERS
export async function getTeachers() {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: true, // Fetch the related User data (Name, Email)
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { teachers };
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
    return { error: "Failed to fetch teachers" };
  }
}

// CREATE NEW TEACHER
export async function createTeacher(formData) {
  try {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const subject = formData.get("subject");

    // Basic validation
    if (!name || !email || !password || !subject) {
      return { error: "All fields are required" };
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "Email is already in use" };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User AND Teacher in one transaction
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "TEACHER",
        teacher: {
          create: {
            subject,
          }
        }
      }
    });

    // Revalidate the path so the table updates instantly
    revalidatePath("/dashboard/teachers");
    return { success: true };

  } catch (error) {
    console.error("Failed to create teacher:", error);
    return { error: "Failed to create teacher" };
  }
}

// DELETE TEACHER
export async function deleteTeacher(id) {
  try {
    // Delete the Teacher profile
    const teacher = await prisma.teacher.delete({
      where: { id },
    });

    // Also delete the underlying User account
    await prisma.user.delete({
      where: { id: teacher.userId },
    });

    revalidatePath("/dashboard/teachers");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete teacher:", error);
    return { error: "Failed to delete teacher" };
  }
}
