"use client";

import { useEffect } from "react";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4 p-6">
        <h2 className="text-lg font-bold text-red-800">Something went wrong!</h2>
        <p className="text-sm text-red-600">
          There was a system error: {error.message || "An unexpected server or network error occurred."}
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <button
            onClick={() => reset()}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Try Again
          </button>
          <a
            href="/"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
