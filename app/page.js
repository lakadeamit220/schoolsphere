import Link from "next/link";
import { GraduationCap, Users, CalendarCheck, CreditCard } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Navigation Bar */}
      <nav className="w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl tracking-tight">
          <GraduationCap size={28} />
          <span>SchoolSphere</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2 text-gray-600 font-medium hover:text-blue-600 transition-colors">
            Log In
          </Link>
          <Link href="/register" className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center text-center px-4 pt-20 pb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight max-w-4xl mb-6 leading-tight">
          The Modern Operating System for <span className="text-blue-600">Your School</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mb-10">
          SchoolSphere handles everything from student directories and daily attendance to fee tracking and role management. Beautiful, fast, and secure.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register" className="px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md text-lg">
            Get Started for Free
          </Link>
          <Link href="/login" className="px-8 py-3.5 bg-white text-gray-700 border border-gray-300 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-lg">
            Access Dashboard
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-20 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Everything you need to run your school</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Student & Teacher CRM</h3>
              <p className="text-gray-500 leading-relaxed">
                Maintain comprehensive profiles for students and teachers. Assign roles, subjects, and grades with ease.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <CalendarCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Attendance</h3>
              <p className="text-gray-500 leading-relaxed">
                Take daily attendance in seconds. Track who is present, absent, or late, and view reports over time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fee Management</h3>
              <p className="text-gray-500 leading-relaxed">
                Track pending, paid, and overdue school fees. Never let finances slip through the cracks again.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <GraduationCap size={20} />
            SchoolSphere
          </div>
          <p>© {new Date().getFullYear()} SchoolSphere. Built with Next.js & Prisma.</p>
        </div>
      </footer>

    </div>
  );
}
