import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar - Fixed to the left */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Top Header - Fixed at the top of the content area */}
        <TopHeader />

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
