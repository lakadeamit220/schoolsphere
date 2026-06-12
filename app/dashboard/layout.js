import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();

  // If no valid user session, redirect to login
  // (This is a backup safety net in addition to middleware)
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar role={user.role} />

      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <TopHeader userName={user.name} userRole={user.role} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
