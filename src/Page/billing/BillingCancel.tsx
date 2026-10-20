import { Link } from "react-router-dom";
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";

export default function BillingCancel() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 mt-20">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <XCircle size={36} />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Your payment session was cancelled. No charges were made to your card. You can retry booking anytime.
        </p>

        <div className="space-y-3">
          <Link
            to="/see-all-clinic"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 shadow-md shadow-sky-200 transition-all"
          >
            <RotateCcw size={16} />
            Search Clinics Again
          </Link>
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
