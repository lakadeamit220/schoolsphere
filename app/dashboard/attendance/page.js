import { getStudents } from "@/app/actions/student";
import AttendanceForm from "./AttendanceForm";

export default async function AttendancePage() {
  // Fetch all students on the server
  const { students, error } = await getStudents();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Take Attendance</h2>
        <p className="text-gray-500 text-sm mt-1">Select a date and mark students as Present, Absent, or Late.</p>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
          {error}
        </div>
      ) : (
        /* Render the interactive client form, passing the students data */
        <AttendanceForm students={students || []} />
      )}
    </div>
  );
}
