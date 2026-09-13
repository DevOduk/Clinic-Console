import CategoriesView from "@/app/components/Pages/CategoriesPage";
import SimpleBreadCrumb from "@/app/components/SimpleBreadCrumb";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories | Clinic - Inventory Management Solution",
  description:
    "Manage your clinic stock inventory with ease. Update prices and stock count with one click!",
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-10 py-10 md:py-14">
      <header className="mb-8 flex items-end flex-col md:flex-row gap-3 justify-between">
        <div className="w-full">
          <SimpleBreadCrumb title="Categories" />
          <h1 className="mb-2.5 font-serif text-[clamp(32px,3.2vw,46px)] font-normal leading-[1.05] tracking-[-0.035em] text-[#20302d]">
            All Categories
          </h1>
          <p className="m-0 text-sm text-(--muted)">
            Keep your inventory easy to browse and report on.
          </p>
        </div>
        <Link
          className="flex shrink-0 min-h-10 flex-nowrap items-center w-full mt-2 md:w-fit justify-center gap-2 rounded-md border border-transparent bg-(--teal) px-4 text-white transition hover:-translate-y-px hover:bg-(--teal-dark)"
          href="/items"
        >
          <span>+</span> View Inventory
        </Link>
      </header>

      <CategoriesView />
    </div>
  );
}
