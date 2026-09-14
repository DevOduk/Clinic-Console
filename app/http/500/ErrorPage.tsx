"use client";

import { DataErrorState } from "@/app/components/DataErrorState";
import { useEffect, useState, useCallback } from "react";

export default function Http500TestPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHttp500 = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // getting an error response
      const res = await fetch("https://dummyjson.com/http/500");

      if (!res.ok) {
        throw new Error(
          `HTTP Error ${res.status}: Server returned an internal server error response.`,
        );
      }

    } catch (err: any) {
      setError(err.message || "Failed to complete the test request.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHttp500();
  }, [fetchHttp500]);

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center text-sm text-gray-500">
        Simulating HTTP 500 request against DummyJSON...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-4">
        <DataErrorState message={error} onRetry={fetchHttp500} />
      </div>
    );
  }

  return null;
}
