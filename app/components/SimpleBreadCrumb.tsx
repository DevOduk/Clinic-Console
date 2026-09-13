import { ChevronRight } from "@mui/icons-material";
import Link from "next/link";
import React from "react";

interface Item {
  url: string;
  label: string;
}
function SimpleBreadCrumb({ items, title }: { items?: Item[]; title: string }) {
  return (
    <div>
      <p className="mb-4 md:mb-2.5 text-xs flex-wrap font-semibold uppercase tracking-[0.12em] text-[--teal] flex gap-1 items-center">
        <Link className="text-blue-500 hover:underline cursor-pointer" href={"/"}>
          Home
        </Link>{" "}
        {items &&
          items.map((item, i) => (
            <React.Fragment key={i}>
              <ChevronRight />
              <Link className="text-blue-500 cursor-pointer" key={i} href={item.url}>
                {item.label}
              </Link>
            </React.Fragment>
          ))}
        <ChevronRight />
        <span>{title}</span>
      </p>
    </div>
  );
}

export default SimpleBreadCrumb;
