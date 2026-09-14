"use client";

import { Avatar, IconButton } from "@mui/material";
import { LogoutOutlined, MenuOutlined } from "@mui/icons-material";
import { useUser } from "../context/userContext";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { profile } = useUser();

  return (
    <header className="flex w-full items-center justify-between gap-2.5 bg-(--teal-dark) px-3 py-4 md:hidden">
      <div className="flex items-center gap-2.5 justify-center">
        <IconButton
          aria-label="Open navigation menu"
          className="text-white!"
          onClick={onMenuClick}
        >
          <MenuOutlined />
        </IconButton>
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

      <div className="flex gap-2 items-center w-fit">
        <Avatar
          className="text-black!"
          src="https://dummyjson.com/icon/michaelw/128"
          sx={{ bgcolor: "var(--orange)" }}
        >
          AM
        </Avatar>
        <span className="text-sm text-white">
          {profile ? `Hi, ${profile.lastName}` : `Hello`}
        </span>
        <IconButton className="text-red-500">
          <LogoutOutlined className="text-red-500" />
        </IconButton>
      </div>
    </header>
  );
}
