"use client";

import { DataErrorState } from "@/app/components/DataErrorState";
import { useCallback, useEffect, useState } from "react";

export default function Http500TestPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHttp500 = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://dummyjson.com/http/500");

      if (!res.ok) {
        throw new Error(
          `HTTP Error ${res.status}: Server returned an internal server error response.`,
        );
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to complete the test request.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const res = await fetch("https://dummyjson.com/http/500");

        if (!res.ok) {
          throw new Error(
            `HTTP Error ${res.status}: Server returned an internal server error response.`,
          );
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to complete the test request.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

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
