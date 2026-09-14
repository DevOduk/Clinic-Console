"use client";

import { useEffect, useState } from "react";

export function useNetworkStatus(pingUrl = "/api/ping") {
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true,
  );

  useEffect(() => {
    let cancelled = false;

    const verifyConnection = async () => {
      if (!navigator.onLine) {
        if (!cancelled) {
          setIsOnline(false);
        }
        return;
      }

      try {
        await fetch(`${pingUrl}?t=${Date.now()}`, {
          method: "HEAD",
          cache: "no-store",
        });

        if (!cancelled) {
          setIsOnline(true);
        }
      } catch {
        if (!cancelled) {
          setIsOnline(false);
        }
      }
    };

    const handleOnline = () => {
      void verifyConnection();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const interval = setInterval(() => {
      void verifyConnection();
    }, 30000);

    void verifyConnection();

    return () => {
      cancelled = true;
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, [pingUrl]);

  return isOnline;
}
