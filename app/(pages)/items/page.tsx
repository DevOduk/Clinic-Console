import ItemsPage from "@/app/components/Pages/ItemsPage";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory | Clinic - Inventory Management Solution",
  description:
    "Manage your clinic stock inventory with ease. Update prices and stock count with one click!",
};

export default function Products() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-10 py-10 md:py-14">
      <ItemsPage />

      <p className="mt-4 text-xs text-[#74817e]">
        Need to organize your catalog?{" "}
        <Link className="text-[#176d64]" href="/categories">
          Manage categories -&gt;
        </Link>
      </p>
    </div>
  );
}
