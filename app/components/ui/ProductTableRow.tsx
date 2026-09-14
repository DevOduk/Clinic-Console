"use client";

import { Product } from "@/app/data/products";
import { Star } from "@mui/icons-material";
import { Checkbox } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

function ProductTableRow({
  item,
  selected,
  setSelected,
}: {
  item: Product;
  selected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const router = useRouter();
  const isSelected = selected.includes(item.id);

  return (
    <tr
      className={`cursor-pointer hover:bg-gray-100 transition-all ${
        isSelected ? "bg-gray-50" : "bg-transparent"
      }`}
      onClick={() => router.push(`/items/${item.id}`)}
    >
      <td className="relative flex items-center gap-3 border-t border-[#edf1ef] px-5 py-3.5 text-sm text-[#65736f]">
        <Checkbox
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            if (isSelected) {
              setSelected(selected.filter((id) => id !== item.id));
            } else {
              setSelected([...selected, item.id]);
            }
          }}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 aspect-square"
        />
        <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded md:h-14 md:w-24">
          <Image
            src={item.thumbnail}
            alt={item.title}
            width={96}
            height={54}
            sizes="(max-width: 768px) 64px, 96px"
            className="h-full w-full object-cover object-center"
          />
        </div>
      </td>
      <td className="border-t text-nowrap border-[#edf1ef] px-5 py-3.5 text-xs text-[#65736f]">
        <strong className="block text-sm font-medium text-[#354440]">
          {item.title}
        </strong>
        <span className="mt-1 flex gap-1 items-center text-xs text-[#9aa8a4]">
          <Star className="text-(--orange)" fontSize="small" /> {item.rating} |{" "}
          {item.sku}
        </span>
      </td>
      <td className="whitespace-nowrap uppercase border-t border-[#edf1ef] px-5 py-3.5 text-xs text-[#65736f]">
        {item.category.replaceAll("-", " ")}
      </td>
      <td className="whitespace-nowrap border-t border-[#edf1ef] px-5 py-3.5 text-xs text-[#65736f]">
        <strong className="text-xs font-medium text-[#354440]">
          {item.stock}
        </strong>{" "}
        units
      </td>
      <td className="whitespace-nowrap border-t border-[#edf1ef] px-5 py-3.5 text-xs text-[#65736f]">
        $ {Number(item.price).toFixed(2)}
      </td>
      <td className="whitespace-nowrap border-t border-[#edf1ef] px-5 py-3.5 text-xs text-[#65736f]">
        <span
          className={`rounded px-2 py-1 text-xs ${
            item.availabilityStatus === "In Stock"
              ? "bg-[#e7f5ed] text-(--green)"
              : "bg-[#fbe9e7] text-(--red)"
          }`}
        >
          {item.availabilityStatus}
        </span>
      </td>
      <td className="whitespace-nowrap border-t border-[#edf1ef] px-5 py-3.5 text-xs text-[#65736f]">
        {new Date(item.meta.updatedAt).toLocaleString()}
      </td>
    </tr>
  );
}

export default ProductTableRow;
