"use client";

import ReplayIcon from "@mui/icons-material/Replay";

export default function RetryButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="button rounded-full items-center text-blue-600 px-4 gap-3 flex p-1 border cursor-pointer bg-blue-50 border-blue-500 hover:bg-blue-100"
    >
      Retry fetch
      <ReplayIcon fontSize="small" />
    </button>
  );
}
