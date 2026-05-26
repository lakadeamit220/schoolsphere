"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// GET ALL FEES
export async function getFees() {
  try {
    const fees = await prisma.fee.findMany({
      include: {
        student: {
          include: {
            user: true, // Fetch student name
          }
        }
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    // Auto-update OVERDUE status for pending fees that passed their due date
    const today = new Date();
    for (const fee of fees) {
      if (fee.status === "PENDING" && new Date(fee.dueDate) < today) {
        await prisma.fee.update({
          where: { id: fee.id },
          data: { status: "OVERDUE" }
        });
        fee.status = "OVERDUE"; // Update local object for this request
      }
    }

    return { fees };
  } catch (error) {
    console.error("Failed to fetch fees:", error);
    return { error: "Failed to fetch fees" };
  }
}

// CREATE NEW FEE
export async function createFee(formData) {
  try {
    const studentId = formData.get("studentId");
    const amountStr = formData.get("amount");
    const dueDateStr = formData.get("dueDate");

    if (!studentId || !amountStr || !dueDateStr) {
      return { error: "All fields are required" };
    }

    const amount = parseFloat(amountStr);
    const dueDate = new Date(dueDateStr);

    if (isNaN(amount) || amount <= 0) {
      return { error: "Please enter a valid positive amount." };
    }

    await prisma.fee.create({
      data: {
        studentId,
        amount,
        dueDate,
        status: "PENDING"
      }
    });

    revalidatePath("/dashboard/fees");
    // Also revalidate students page because we are showing fee status there
    revalidatePath("/dashboard/students");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to assign fee:", error);
    return { error: "Failed to assign fee" };
  }
}

// MARK FEE AS PAID
export async function markFeeAsPaid(id) {
  try {
    await prisma.fee.update({
      where: { id },
      data: { status: "PAID" },
    });

    revalidatePath("/dashboard/fees");
    revalidatePath("/dashboard/students");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to mark fee as paid:", error);
    return { error: "Failed to mark fee as paid" };
  }
}
