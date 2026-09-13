"use client";

import { useEffect } from "react";
import Button from "@mui/material/Button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4 rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-red-800">Something went wrong!</h2>
        <p className="text-sm text-red-600">
          {error.message || "An unexpected error occurred while loading this screen."}
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Button
            variant="contained"
            color="error"
            onClick={
              reset
            }
          >
            Try Again
          </Button>
          <Button variant="outlined" onClick={() => (window.location.href = "/")}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
