import Link from "next/link";
import { getFees, markFeeAsPaid } from "@/app/actions/fee";
import { Plus, CheckCircle } from "lucide-react";

export default async function FeesPage() {
  const { fees, error } = await getFees();

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Ledger</h2>
          <p className="text-gray-500 text-sm mt-1">Track all student fees, payments, and overdue balances.</p>
        </div>
        <Link 
          href="/dashboard/fees/new" 
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Assign Fee
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
                <th className="px-6 py-4 font-semibold">Student Name</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Due Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              
              {!fees || fees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No fees have been recorded yet. Click &quot;Assign Fee&quot; to create one.
                  </td>
                </tr>
              ) : (
                fees.map((fee) => {
                  const isPaid = fee.status === "PAID";
                  const isOverdue = fee.status === "OVERDUE";
                  const isPending = fee.status === "PENDING";

                  return (
                    <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {fee.student.user.name}
                        <div className="text-xs text-gray-400 font-normal">Roll: {fee.student.rollNumber}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">₹{fee.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        {new Date(fee.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                          isPaid ? "bg-green-100 text-green-700" :
                          isOverdue ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {fee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!isPaid ? (
                          <form action={async () => {
                            "use server";
                            await markFeeAsPaid(fee.id);
                          }}>
                            <button 
                              type="submit" 
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-semibold rounded hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors"
                            >
                              <CheckCircle size={14} />
                              Mark Paid
                            </button>
                          </form>
                        ) : (
                          <span className="text-gray-400 text-xs font-medium italic">Settled</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
