import Link from "next/link";
import { getTeachers, deleteTeacher } from "@/app/actions/teacher";
import { Plus, Trash2, Edit } from "lucide-react";

export default async function TeachersPage() {
  const { teachers, error } = await getTeachers();

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Teacher Directory</h2>
          <p className="text-gray-500 text-sm mt-1">Manage all faculty members in the school.</p>
        </div>
        <Link 
          href="/dashboard/teachers/new" 
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Teacher
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
          {error}
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Subject</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              
              {!teachers || teachers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                    No teachers found. Click "Add Teacher" to create one.
                  </td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{teacher.user.name}</td>
                    <td className="px-6 py-4 text-gray-500">{teacher.user.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                        {teacher.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded hover:bg-blue-50">
                        <Edit size={16} />
                      </button>
                      <form action={async () => {
                        "use server";
                        await deleteTeacher(teacher.id);
                      }} className="inline-block">
                        <button type="submit" className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
