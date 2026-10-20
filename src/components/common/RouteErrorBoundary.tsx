import { useRouteError, Link } from "react-router-dom";

export default function RouteErrorBoundary() {
  const error = useRouteError();
  console.error("Route Error Boundary caught error:", error);

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : (error as any)?.statusText || (error as any)?.message || "An unexpected error occurred.";

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6 gap-4 mt-28">
      <h1 className="text-3xl font-bold text-red-600">
        Something went wrong 🚨
      </h1>
      <p className="text-sm text-gray-600 max-w-md bg-red-50 text-red-700 p-3 rounded-xl border border-red-100">
        {errorMessage}
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer"
        >
          Reload Page
        </button>
        <Link
          to="/"
          className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all cursor-pointer"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
