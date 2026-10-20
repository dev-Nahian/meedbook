import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowRight, Calendar } from "lucide-react";

export default function BillingSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 mt-20">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 size={36} />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Confirmed!</h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Your dialysis treatment booking payment was successful. We have emailed your official confirmation and receipt.
        </p>

        {sessionId && (
          <div className="bg-gray-50 rounded-xl p-3 mb-6 text-xs text-gray-500 font-mono break-all">
            Ref: {sessionId}
          </div>
        )}

        <div className="space-y-3">
          <Link
            to="/user-account"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 shadow-md shadow-sky-200 transition-all"
          >
            <Calendar size={16} />
            View Booking in Account
          </Link>
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
          >
            Return to Home
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
