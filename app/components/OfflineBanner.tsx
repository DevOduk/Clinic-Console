"use client";

import { useEffect, useState } from "react";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import WifiOffOutlinedIcon from "@mui/icons-material/WifiOffOutlined";
import WifiOutlinedIcon from "@mui/icons-material/WifiOutlined";

export default function OfflineBanner() {
  const isOnline = useNetworkStatus();
  const [showRestored, setShowRestored] = useState(true);

  useEffect(() => {
    if (isOnline) {
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!isOnline) {
    return (
      <div className="w-full h-full! border flex flex-col justify-center items-center gap-3 px-4 py-3 animate-slide-in">
        <WifiOffOutlinedIcon
          sx={{ fontSize: "4rem" }}
          className="text-red-500 animate-pulse"
        />

        <p className="text-sm font-medium">No internet connection</p>
        <p className="text-xs text-zinc-400 font-normal">Changes might not be saved.</p>
        <button className="button rounded-full text-blue-600 px-3 p-1 border cursor-pointer bg-blue-50 border-blue-500 hover:bg-blue-200">Retry</button>
      </div>
    );
  }

  if (showRestored) {
    return (
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-zinc-900 text-white px-4 py-3 rounded-lg shadow-xl">
        <WifiOutlinedIcon className="h-5 w-5 text-emerald-500" />
        <p className="text-sm font-medium text-emerald-400">Connection restored</p>
      </div>
    );
  }

  return null;
}
