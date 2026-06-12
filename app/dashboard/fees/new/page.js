"use client";

import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createFee } from "@/app/actions/fee";
import { getStudentList } from "@/app/actions/student";

export default function AssignFeePage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);

  // Fetch students when component mounts
  useEffect(() => {
    async function loadStudents() {
      const res = await getStudentList();
      if (res.students) {
        setStudents(res.students);
      }
      setIsLoadingStudents(false);
    }
    loadStudents();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await createFee(formData);

    if (response?.error) {
      setError(response.error);
      setIsSubmitting(false);
    } else if (response?.success) {
      router.push("/dashboard/fees");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/dashboard/fees"
          className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assign New Fee</h2>
          <p className="text-gray-500 text-sm mt-1">Generate a fee record for a specific student.</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-5">
            
            {/* Student Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
              <select 
                name="studentId"
                required
                disabled={isLoadingStudents}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white disabled:bg-gray-100"
              >
                <option value="">{isLoadingStudents ? "Loading students..." : "Choose a student..."}</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.user.name} ({student.rollNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fee Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-gray-500">₹</span>
                <input 
                  name="amount"
                  type="number" 
                  step="0.01"
                  min="1"
                  required
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-mono"
                  placeholder="5000.00"
                />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input 
                name="dueDate"
                type="date" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end border-t border-gray-100 mt-6">
            <button 
              type="submit" 
              disabled={isSubmitting || isLoadingStudents}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
              {isSubmitting ? "Assigning..." : "Assign Fee"}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
