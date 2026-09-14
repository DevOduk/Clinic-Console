"use client";

import { useState, useEffect, useCallback } from "react";

export function useNetworkStatus(pingUrl = "/api/ping") {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof window !== "undefined" ? navigator.onLine : true,
  );
  // default to isOnline on initial load

  const verifyActualConnection = useCallback(async () => {
    if (!navigator.onLine) {
      setIsOnline(false);
      return;
    }

    try {
      await fetch(`${pingUrl}?t=${Date.now()}`, {
        method: "HEAD",
        cache: "no-store",
      });
      setIsOnline(true);
    } catch (error) {
      setIsOnline(false);
    }
  }, [pingUrl]);

  useEffect(() => {
    // Initial verification on mount
    verifyActualConnection();

    const handleOnline = () => verifyActualConnection();
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const interval = setInterval(verifyActualConnection, 30000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, [verifyActualConnection]);

  return isOnline;
}
