"use client";

import Link from "next/link";
import { Avatar, IconButton } from "@mui/material";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import { usePathname } from "next/navigation";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { LogoutOutlined } from "@mui/icons-material";
import type { ReactNode } from "react";
import { useUser } from "../context/userContext";

interface NavItem {
  href: string;
  label: string;
  shortLabel: string;
  icon?: ReactNode;
}

export const iconStyle = {
  fontSize: "1.2rem",
};

const navigation: NavItem[] = [
  {
    href: "/",
    label: "Overview",
    shortLabel: "OV",
    icon: <DashboardCustomizeOutlinedIcon sx={iconStyle} />,
  },
  {
    href: "/items",
    label: "Inventory",
    shortLabel: "IN",
    icon: <LocalMallOutlinedIcon sx={iconStyle} />,
  },
  {
    href: "/categories",
    label: "Categories",
    shortLabel: "CA",
    icon: <CategoryOutlinedIcon sx={iconStyle} />,
  },
];

export default function SideBar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { profile, logout } = useUser();
  const pathname = usePathname();
  const isOnline = useNetworkStatus();

  const handleLogout = () => {
    if (
      confirm(
        "Are you sure you want to log out? You will be required to login again.",
      )
    ) {
      logout();
    }
  };
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-screen w-70 max-w-[85vw] flex-col bg-(--teal-dark) px-4.25 py-5.5 text-[#d9e7e3] shadow-2xl transition-transform duration-300 md:static md:z-auto md:h-screen md:min-h-screen md:max-w-none md:translate-x-0 md:shadow-none ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="mb-12 flex items-center gap-2.75 px-3">
        <div className="flex h-11 aspect-square items-center justify-center rounded-lg bg-(--orange) text-3xl font-bold text-(--teal-dark)">
          C
        </div>
        <div>
          <p className="m-0 text-2xl leading-none text-[#f7fbf8]">Clinic</p>
          <p className="mt-1 text-xs uppercase tracking-[0.08em] text-[#8eafaa]">
            Inventory console
          </p>
        </div>
      </div>

      <div className="px-3 pb-3 mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#769891]">
        Workspace
      </div>
      <nav className="grid gap-1" aria-label="Main navigation">
        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              className={`relative flex items-center gap-3 rounded-lg p-3 text-xs transition-colors hover:bg-[#28534e] hover:text-(--orange) ${isActive ? "bg-[#28534e] text-(--orange)" : "text-[#a9c2bd]"}`}
              href={item.href}
              key={item.href}
              onClick={onClose}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold ${isActive ? "text-(--orange)" : "text-[#afcbc5]"}`}
              >
                {item.icon}
              </span>
              <span
                className={`${isActive ? "text-(--orange)" : "text-[#afcbc5]"}`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-(--orange)" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto w-full">
        <div className="flex p-3 py-2 rounded-lg border-gray-500/40 gap-3 border items-center mb-5 bg-[#204641]">
          {isOnline ? (
            <div className="relative w-2 h-2">
              <div className="w-2 h-2 bg-green-500 rounded-full absolute top-0" />
              <div className="absolute top-0 left-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
            </div>
          ) : (
            <div className="relative w-2 h-2">
              <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0" />
              <div className="absolute top-0 left-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            </div>
          )}
          <div>
            <div className="text-sm">System Status</div>
            {isOnline ? (
              <span className="text-green-500 text-xs">Online</span>
            ) : (
              <span className="text-red-500 text-xs">
                Offline | Retry connection.
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 items-center w-full">
          <Avatar
            className="text-black!"
            src={profile.image}
            sx={{ bgcolor: "var(--orange)" }}
          >
            AM
          </Avatar>
          <div className="w-full">
            <div className="text-sm">
              {profile.firstName} {profile.lastName}{" "}
            </div>
            <span className="muted text-xs text-gray-400 uppercase">
              {profile.role}
            </span>
          </div>
          <IconButton onClick={() => handleLogout()} className="text-red-500">
            <LogoutOutlined className="text-red-500" />
          </IconButton>
        </div>
      </div>
    </aside>
  );
}
