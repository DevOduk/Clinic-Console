import React from "react";

function LoadingProfile() {
  return (
    <div className="flex min-h-screen">
      <div
        className={`fixed inset-y-0 left-0 z-50 hidden h-screen w-70 max-w-[85vw] flex-col bg-gray-200 px-4.25 py-5.5 text-[#d9e7e3] shadow-2xl transition-transform duration-300 md:flex md:z-auto md:h-screen md:min-h-screen md:max-w-none md:translate-x-0 md:shadow-none`}
      >
        <div className="flex items-center gap-3 mb-5 border-b border-gray-400 py-3">
          <div className="h-10 aspect-square bg-gray-400 rounded-lg shrink-0" />
          <div className="w-full flex flex-col gap-1">
            <div className="w-[45%] rounded h-3 bg-gray-300" />
            <div className="w-[15%] h-2 rounded bg-gray-300" />
          </div>
        </div>

        <nav className="grid gap-2" aria-label="Main navigation">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2 animate-pulse">
              <div className="h-10 aspect-square bg-gray-300 rounded-lg shrink-0" />
              <div className="w-full flex flex-col gap-1">
                <div className="w-[45%] rounded h-3 bg-gray-300" />
                <div className="w-[10%] h-2 rounded bg-gray-300" />
              </div>
              <div className="w-3 shrink-0 aspect-square rounded-full bg-gray-300" />
            </div>
          ))}
        </nav>

        <div className="flex mt-auto w-full items-center gap-3 border-b border-gray-400 py-3 animate-pulse">
          <div className="h-10 aspect-square bg-gray-400 rounded-full shrink-0" />
          <div className="w-full flex flex-col gap-1">
            <div className="w-[45%] rounded h-3 bg-gray-300" />
            <div className="w-[15%] h-2 rounded bg-gray-300" />
          </div>
        </div>
      </div>

      <main className="relative flex h-full max-h-screen min-w-0 flex-1 flex-col items-start overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-10 py-10 md:py-14">
          <div className="w-[15%] rounded h-4 mb-3 bg-gray-300 animate-pulse" />
          <div className="w-[35%] rounded h-12 mb-5 bg-gray-300 animate-pulse" />
          <div className="w-[25%] rounded h-3 mt-3 mb-3 bg-gray-300 animate-pulse" />

          <div className="w-full mt-12 rounded h-12 mb-5 bg-gray-300 animate-pulse" />
        </div>
      </main>
    </div>
  );
}

export default LoadingProfile;
