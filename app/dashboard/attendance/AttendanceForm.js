"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { saveAttendance } from "@/app/actions/attendance";

export default function AttendanceForm({ students }) {
  // Default to today's date (YYYY-MM-DD format for HTML date input)
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  
  // State to hold attendance for each student. { studentId: "PRESENT" | "ABSENT" | "LATE" }
  // We initialize everyone as "PRESENT" by default to save time!
  const [attendanceData, setAttendanceData] = useState(() => {
    const initialData = {};
    students.forEach((s) => {
      initialData[s.id] = "PRESENT";
    });
    return initialData;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle clicking a status button
  const handleStatusChange = (studentId, status) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Handle final submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    // Format data for the server action
    const records = Object.keys(attendanceData).map((studentId) => ({
      studentId,
      status: attendanceData[studentId],
    }));

    const response = await saveAttendance(date, records);

    if (response?.error) {
      setMessage({ type: "error", text: response.error });
    } else {
      setMessage({ type: "success", text: "Attendance successfully saved!" });
      // Hide success message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
    
    setIsSubmitting(false);
  };

  if (students.length === 0) {
    return (
      <div className="bg-white p-10 rounded-xl border border-gray-200 text-center text-gray-500">
        No students found. Please add students in the directory first.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Date Picker Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Attendance Date</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
        >
          <Save size={18} />
          {isSubmitting ? "Saving..." : "Save Bulk Attendance"}
        </button>
      </div>

      {/* Status Message */}
      {message.text && (
        <div className={`px-6 py-3 border-b ${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
          {message.text}
        </div>
      )}

      {/* Student Roster Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-white border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Roll No.</th>
              <th className="px-6 py-4 font-semibold">Student Name</th>
              <th className="px-6 py-4 font-semibold text-right">Mark Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((student) => {
              const currentStatus = attendanceData[student.id];

              return (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-500">{student.rollNumber}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{student.user.name}</td>
                  <td className="px-6 py-4 text-right">
                    
                    {/* Toggle Buttons */}
                    <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white">
                      <button
                        onClick={() => handleStatusChange(student.id, "PRESENT")}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                          currentStatus === "PRESENT" 
                            ? "bg-green-100 text-green-700 shadow-sm" 
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        PRESENT
                      </button>
                      <button
                        onClick={() => handleStatusChange(student.id, "LATE")}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                          currentStatus === "LATE" 
                            ? "bg-yellow-100 text-yellow-700 shadow-sm" 
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        LATE
                      </button>
                      <button
                        onClick={() => handleStatusChange(student.id, "ABSENT")}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                          currentStatus === "ABSENT" 
                            ? "bg-red-100 text-red-700 shadow-sm" 
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        ABSENT
                      </button>
                    </div>

                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
