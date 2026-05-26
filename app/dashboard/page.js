export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Welcome to your Dashboard!</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
          Your secure backend authentication is perfectly integrated with the new visual layout. Use the navigation sidebar on the left to start managing your school.
        </p>
      </div>
    </div>
  );
}
