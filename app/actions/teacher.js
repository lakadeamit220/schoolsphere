"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/auth";

// GET ALL TEACHERS
export async function getTeachers() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { error: "Unauthorized access" };
    }

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
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { error: "Unauthorized access" };
    }

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
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return { error: "Unauthorized access" };
    }

    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) {
      return { error: "Teacher not found" };
    }

    await prisma.$transaction([
      prisma.teacher.delete({ where: { id } }),
      prisma.user.delete({ where: { id: teacher.userId } }),
    ]);

    revalidatePath("/dashboard/teachers");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete teacher:", error);
    return { error: "Failed to delete teacher" };
  }
}
