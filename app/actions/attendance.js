"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";

// SAVE BULK ATTENDANCE
export async function saveAttendance(dateStr, attendanceRecords) {
  try {
    const user = await getCurrentUser();
    if (!user || !["ADMIN", "TEACHER"].includes(user.role)) {
      return { error: "Unauthorized access" };
    }

    if (!dateStr || !attendanceRecords || attendanceRecords.length === 0) {
      return { error: "Date and attendance records are required." };
    }

    const date = new Date(dateStr);

    // We use a Prisma transaction to save all records reliably
    // We also use upsert: if attendance for this student on this date exists, update it. If not, create it.
    // Wait, prisma upsert requires a unique constraint. We don't have a unique constraint on (studentId, date).
    // Let's first delete any existing records for these students on this date to avoid duplicates, then create new ones.

    // Get all student IDs being updated
    const studentIds = attendanceRecords.map(record => record.studentId);

    // Define start and end of the chosen day to safely delete old records for that day
    const startDate = new Date(date.setHours(0, 0, 0, 0));
    const endDate = new Date(date.setHours(23, 59, 59, 999));

    await prisma.$transaction([
      // 1. Delete existing records for these students on this specific day
      prisma.attendance.deleteMany({
        where: {
          studentId: { in: studentIds },
          date: {
            gte: startDate,
            lte: endDate,
          }
        }
      }),
      
      // 2. Insert the new records
      prisma.attendance.createMany({
        data: attendanceRecords.map(record => ({
          studentId: record.studentId,
          status: record.status,
          date: startDate, // Save with the clean start-of-day date
        }))
      })
    ]);

    revalidatePath("/dashboard/attendance");
    return { success: true };

  } catch (error) {
    console.error("Failed to save attendance:", error);
    return { error: "Failed to save bulk attendance." };
  }
}
