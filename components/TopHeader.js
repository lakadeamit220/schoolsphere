"use client";

import { LogOut, Bell, Search } from "lucide-react";
import { logoutUser } from "@/app/actions/auth";
import { usePathname } from "next/navigation";

export default function TopHeader({ userName, userRole }) {
  const pathname = usePathname();
  
  // Create a nice title from the pathname (e.g., "/dashboard/students" -> "Students")
  const pathSegments = pathname.split("/").filter(Boolean);
  const rawTitle = pathSegments.length > 1 ? pathSegments[1] : "Dashboard";
  const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-20 w-full">
      
      {/* Left side: Page Title */}
      <div className="flex items-center pl-10 md:pl-0"> {/* Padding left on mobile to avoid menu button */}
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h1>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* Search Icon (Placeholder) */}
        <button className="text-gray-400 hover:text-gray-600 transition-colors hidden sm:block">
          <Search size={20} />
        </button>

        {/* Notifications (Placeholder) */}
        <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

        {/* Profile / Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              {userName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-800 leading-tight">{userName}</p>
              <p className="text-xs text-gray-400">{userRole}</p>
            </div>
          </div>
          
          <form action={logoutUser}>
            <button 
              type="submit" 
              className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </form>
        </div>

      </div>
    </header>
  );
}
