"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import SideBar from "../layout/SideBar";
import OfflineBanner from "../components/OfflineBanner";
import Header from "../layout/Header";
import { useUser } from "../context/userContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LoadingProfile from "../components/loading/LoadingProfile";

export const iconStyle = {
  fontSize: "1.2rem",
};

export default function PagesLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { profile, loading } = useUser();
  const isOnline = useNetworkStatus();
  const [showOfflineStatus, setShowOfflineStatus] = useState(false);
  const [checksEnabled, setChecksEnabled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setChecksEnabled(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!checksEnabled || isOnline) return;

    const timer = setTimeout(() => {
      setShowOfflineStatus(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [checksEnabled, isOnline]);

  const shouldShowOfflineStatus =
    checksEnabled && !isOnline && showOfflineStatus;

  useEffect(() => {
    if (loading || profile) return;

    const searchString = searchParams.toString();
    const currentPageUrl = encodeURIComponent(
      searchString ? btoa(`${pathname}?${searchString}`) : btoa(pathname),
    );

    router.push(`/signin?to_url=${currentPageUrl}`);
  }, [loading, pathname, profile, router, searchParams]);

  if (loading) {
    return <LoadingProfile />;
  }
  if (!profile) {
    return <LoadingProfile />;
  }

  return (
    <div className="flex min-h-screen">
      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {isSidebarOpen && (
        <button
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          type="button"
        />
      )}

      <main className="relative flex h-screen overflow-y-auto min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        {shouldShowOfflineStatus ? <OfflineBanner /> : children}
      </main>
    </div>
  );
}
