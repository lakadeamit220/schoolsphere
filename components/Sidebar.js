"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  CreditCard, 
  Settings,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/dashboard/students", icon: GraduationCap },
  { name: "Teachers", href: "/dashboard/teachers", icon: Users },
  { name: "Attendance", href: "/dashboard/attendance", icon: CalendarCheck },
  { name: "Fees", href: "/dashboard/fees", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-sm text-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:flex md:w-64 md:flex-col ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200 px-6">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xl tracking-tight">
            <GraduationCap size={28} />
            <span>SchoolSphere</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsOpen(false)} // Close on mobile click
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={20} className={isActive ? "text-blue-600" : "text-gray-400"} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Area (e.g., App version) */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-center text-gray-400 font-medium">SchoolSphere v1.0</p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
