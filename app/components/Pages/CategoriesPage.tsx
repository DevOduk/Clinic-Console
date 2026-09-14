"use client";

import { Category } from "@/app/data/products";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import Pagination from "../Pagination";
import { HourglassEmpty } from "@mui/icons-material";

const LIMIT = 10;

const tones = ["blue", "purple", "green", "orange", "red"];

function CategoriesView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [categories, setCategories] = useState<
    (Category & { count: number; value: number })[]
  >([]);
  const [, startTransition] = useTransition();
  const start = (currentPage - 1) * LIMIT;
  const end = Math.min(start + LIMIT, categories.length);
  const paginatedCategories = categories.slice(start, end);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch categories on mount
  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/products/categories");
        const data: Category[] = await response.json();

        const enriched =
          data?.map((item) => ({
            ...item,
            count: 0,
            value: 0,
          })) || [];

        // initialise with 0 values as soon as ctegpries are available (we will ad caching later)
        setCategories(enriched);
        setLoading(false);
        const categoriesWithTotals = await Promise.all(
          data.map(async (category) => {
            const productsResponse = await fetch(
              `/api/products/category/${category.slug}`,
            );
            const products = await productsResponse.json();

            return {
              ...category,
              count: products.total,
              value: products?.products.reduce(
                (total: number, product: { price?: number | string }) =>
                  total + Number(product.price || 0),
                0,
              ),
            };
          }),
        );

        setCategories(categoriesWithTotals);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    getCategories();
  }, []);

  // 2. Helper function to update URL search params cleanly
  const updateQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset to page 1 on filter/search change to prevent empty results pagination bug
    if (key !== "page") {
      params.delete("page");
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.7fr)]">
      <div className="rounded-lg border border-(--line) bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a8a86]">
              Your catalog
            </p>
            <h2 className="font-serif text-xl font-normal tracking-[-0.02em] text-[#263633]">
              All categories ({categories?.length || 0})
            </h2>
          </div>
          <span className="flex aspect-square w-12 items-center justify-center rounded-full bg-[#fbe9e7] text-[#bc5a56]">
            {categories.length}
          </span>
        </div>
        <div className="w-full overflow-y-auto min-h-150">
          <table className="mt-5 w-full table-fixed">
            <colgroup>
              <col className="w-[55%]" />
              <col className="w-[15%]" />
              <col className="w-[30%]" />
            </colgroup>
            <tbody className="w-full">
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={`loading-${index}`} className="h-20 animate-pulse">
                    <td
                      colSpan={7}
                      className="border-t border-[#edf1ef] px-5 py-5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded bg-[#e8eeeb]" />
                        <div className="h-12 w-30 rounded bg-[#e8eeeb]" />
                        <div className="h-3 w-1/3 rounded bg-[#e8eeeb]" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : paginatedCategories.length > 0 ? (
                paginatedCategories.map((category) => {
                  const tone = tones[Math.floor(Math.random() * tones.length)];

                  return (
                    <tr
                      className="cursor-pointer hover:bg-gray-100"
                      key={category.name}
                      onClick={() =>
                        router.push(`/categories/${category.slug}`)
                      }
                    >
                      <td className="rounded-l-lg p-4 align-middle">
                        <div className="flex gap-4 items-center">
                          <div
                            className={`flex h-11 aspect-square shrink-0 items-center justify-center rounded-md text-lg ${tone === "blue" ? "bg-[#eaf2fb] text-(--blue)" : tone === "purple" ? "bg-[#f0ebf8] text-(--purple)" : tone === "green" ? "bg-[#e7f5ed] text-(--green)" : tone === "orange" ? "bg-[#fff2df] text-(--orange)" : "bg-[#fbe9e7] text-(--red)"}`}
                          >
                            {category.name.slice(0, 1)}
                          </div>

                          <div>
                            <strong className="block font-medium text-[#354440]">
                              {category.name}
                            </strong>
                            <span className="mt-1 block text-xs text-(--muted)">
                              slug: {category.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <strong className="block text-xs font-medium text-[#354440]">
                          {category.count}+
                        </strong>
                        <span className="mt-1 block text-xs text-(--muted)">
                          items
                        </span>
                      </td>

                      <td className="rounded-r-lg p-4 text-right align-middle">
                        <strong className="block text-xs font-medium text-[#354440]">
                          {category.value.toLocaleString(undefined, {
                            style: "currency",
                            currency: "USD",
                          })}
                        </strong>
                        <span className="mt-1 block text-xs text-(--muted)">
                          total value
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="h-full">
                  <td
                    colSpan={7}
                    className="h-full border-t border-[#edf1ef] px-5 py-10 text-center"
                  >
                    <HourglassEmpty
                      className="mb-4"
                      fontSize="large"
                      color="error"
                    />
                    <p className="text-sm font-medium text-[#354440]">
                      No categories found
                    </p>
                    <p className="mt-1 text-xs text-[#87938f]">
                      Check your conncetion & try again.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          onPageChange={(page) => updateQueryParam("page", page.toString())}
          totalPages={Math.ceil(categories.length / LIMIT)}
          startIndex={categories.length > 1 ? start + 1 : start}
          endIndex={end}
          totalResults={categories.length}
        />
      </div>
      <aside className="self-start rounded-lg border border-[#d4e5de] bg-[#e6f0ec] p-6">
        <span className="mb-7 flex h-8 w-8 items-center justify-center rounded-full bg-[#cae4d9] text-(--teal)">
          i
        </span>
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a8a86]">
          A little clarity
        </p>
        <h2 className="mb-3 font-serif text-2xl font-normal leading-tight tracking-[-0.02em] text-[#263633]">
          Good organization compounds.
        </h2>
        <p className="mb-6 text-xs leading-relaxed text-[#60756f]">
          Categories make it easier to find supplies quickly, spot trends, and
          keep every team member working from the same catalog.
        </p>
        <Link
          href={"/items"}
          className="inline-flex gap-3 min-h-9.5 w-full items-center justify-center rounded-md border border-transparent bg-(--teal) px-4 text-white transition hover:-translate-y-px hover:bg-(--teal-dark) text-sm"
          type="button"
        >
          View inventory
        </Link>
      </aside>
    </section>
  );
}

export default CategoriesView;
