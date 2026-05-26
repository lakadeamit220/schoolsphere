"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// GET ALL STUDENTS
export async function getStudents() {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: true, // Fetch the related User data (Name, Email)
        fees: true, // Fetch related Fees data
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { students };
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return { error: "Failed to fetch students" };
  }
}

// CREATE NEW STUDENT
export async function createStudent(formData) {
  try {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const grade = formData.get("grade");
    const rollNumber = formData.get("rollNumber");

    // Basic validation
    if (!name || !email || !password || !grade || !rollNumber) {
      return { error: "All fields are required" };
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "Email is already in use" };
    }

    // Check if roll number already exists
    const existingRoll = await prisma.student.findUnique({ where: { rollNumber } });
    if (existingRoll) {
      return { error: "Roll number is already in use" };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User AND Student in one transaction
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT",
        student: {
          create: {
            grade,
            rollNumber,
          }
        }
      }
    });

    // Revalidate the path so the table updates instantly
    revalidatePath("/dashboard/students");
    return { success: true };

  } catch (error) {
    console.error("Failed to create student:", error);
    return { error: "Failed to create student" };
  }
}

// DELETE STUDENT
export async function deleteStudent(id) {
  try {
    // Delete the Student profile
    const student = await prisma.student.delete({
      where: { id },
    });

    // Also delete the underlying User account
    await prisma.user.delete({
      where: { id: student.userId },
    });

    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete student:", error);
    return { error: "Failed to delete student" };
  }
}
