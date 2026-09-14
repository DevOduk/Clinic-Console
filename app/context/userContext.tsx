// src/context/UserContext.tsx

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Profile } from "../data/profile";

interface UserContextType {
  profile: Profile | null;
  loading: boolean;
  logout: () => void;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultToast = {
  open: false,
  message: "",
  severity: "success" as "success" | "error",
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(defaultToast);

  const refreshingRef = useRef(false);

  // Keep track of latest path info via refs to avoid stale closures in background intervals
  const pathnameRef = useRef(pathname);
  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    pathnameRef.current = pathname;
    searchParamsRef.current = searchParams;
  }, [pathname, searchParams]);

  // Redirect to signin while preserving the current page safely
  const handleSessionExpired = useCallback(() => {
    setProfile(null);
    const searchString = searchParamsRef.current.toString();
    const currentPath = pathnameRef.current;

    const currentPageUrl = encodeURIComponent(
      btoa(searchString ? `${currentPath}?${searchString}` : currentPath),
    );

    setToast({
      open: true,
      message: "Your session has expired! Please sign in again.",
      severity: "error",
    });

    router.replace(`/signin?to_url=${currentPageUrl}`);
  }, [router]);

  // Refresh the access token once it expires
  const refreshSession = async () => {
    if (refreshingRef.current) return false;
    refreshingRef.current = true;

    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      return response.ok;
    } catch (err) {
      console.error("Session refresh failed:", err);
      return false;
    } finally {
      refreshingRef.current = false;
    }
  };

  // Check session and refresh only when the access token expires
  const revalidateUser = useCallback(async () => {
    try {
      let response = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          const data = await response.json();
          const user = data?.user ?? data;
          if (user?.id) {
            setProfile(user);
          }
        }
        return;
      }

      if (response.status !== 401) {
        if (response.status === 403) {
          handleSessionExpired();
        }
        return;
      }

      const refreshed = await refreshSession();
      if (!refreshed) {
        handleSessionExpired();
        return;
      }

      // Verify the newly issued access token
      response = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        handleSessionExpired();
        return;
      }

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const data = await response.json();
        const user = data?.user ?? data;
        if (user?.id) {
          setProfile(user);
        }
      }
    } catch (err) {
      console.error("Network error during session validation:", err);
    }
  }, [handleSessionExpired]);

  // Initial session check on mount
  useEffect(() => {
    async function checkSession() {
      try {
        setLoading(true);
        const response = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
        });
        const contentType = response.headers.get("content-type");

        if (response.ok && contentType?.includes("application/json")) {
          const data = await response.json();
          const user = data?.user ?? data;
          if (user?.id) {
            setProfile(user);
          } else {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Failed to restore session:", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  // Check session every minute in the background
  useEffect(() => {
    if (!profile) return;

    const intervalId = window.setInterval(() => {
      revalidateUser();
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, [profile, revalidateUser]);

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        setProfile(null);
        return { success: true };
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
    setProfile(null);
    return { success: false };
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") return;
    setToast(defaultToast);
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        loading,
        logout,
        setProfile,
      }}
    >
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
