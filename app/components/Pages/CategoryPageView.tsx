"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "../Pagination";
import { Checkbox } from "@mui/material";
import { useEffect, useState, useTransition } from "react";
import { HourglassEmpty } from "@mui/icons-material";
import { Product, ProductsResponse } from "@/app/data/products";
import { LIMIT } from "./ItemsPage";
import ProductTableRow from "../ui/ProductTableRow";
import { handleDeleteProducts } from "@/app/utils/DeleteProducts";
import { Backdrop, CircularProgress } from "@mui/material";

function CategoryPageView({ category }: { category: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [, startTransition] = useTransition();

  // get search params from url
  const searchQuery = searchParams.get("q") || "";
  const selectedStatus = searchParams.get("status") || "all";
  const selectedSortBy = searchParams.get("sortBy") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const selectedOrder = searchParams.get("order") || "";

  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [totalResults, setTotalResults] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [exporting, setExporting] = useState<boolean>(false);
  const allProductsSelected =
    products.length > 0 && products.every((product) => selected.includes(product.id));
  const [backDrop, setBackDrop] = useState(false);

  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  // Debounce search query updates to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== searchQuery) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
          params.set("q", searchTerm);
        } else {
          params.delete("q");
        }
        params.delete("page"); // Reset to page 1 on search change
        startTransition(() => {
          router.push(`?${params.toString()}`);
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, searchQuery, searchParams, router]);

  useEffect(() => {
    const controller = new AbortController();
    const skip = (currentPage - 1) * LIMIT;

    const fetchProducts = async () => {
      setLoading(true);

      try {
        const hasFilters =
          Boolean(searchQuery) ||
          selectedStatus !== "all" ||
          Boolean(selectedSortBy) ||
          Boolean(selectedOrder);

        const needsLocalFiltering = selectedStatus !== "all";

        const query = new URLSearchParams({
          limit: String(needsLocalFiltering ? 0 : LIMIT),
          skip: String(needsLocalFiltering ? 0 : skip),
        });

        if (selectedSortBy) {
          query.set("sortBy", selectedSortBy);
        }
        if (selectedSortBy && selectedOrder) {
          query.set("order", selectedOrder?.trim() ?? "asc");
        }

        let endpoint = `/api/products?${query.toString()}`;

        if (searchQuery) {
          query.set("q", searchQuery);
          endpoint = `/api/products/search?${query.toString()}`;
        } else if (category) {
          endpoint = `/api/products/category/${category}?${query.toString()}`;
        }

        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) throw new Error("Failed to fetch products");

        const data: ProductsResponse = await response.json();

        const filtered = data.products.filter((product) => {
          const matchesCategory = product.category === category;
          const matchesStatus =
            selectedStatus === "all" ||
            product.availabilityStatus.toLowerCase() === selectedStatus.toLowerCase();

          return matchesCategory && matchesStatus;
        });

        const visibleProducts = hasFilters
          ? filtered.slice(skip, skip + LIMIT)
          : filtered;

        setProducts(visibleProducts);
        setTotalResults(hasFilters ? filtered.length : data.total);
        setStart(filtered.length > 0 ? skip + 1 : 0);
        setEnd(Math.min(skip + LIMIT, filtered.length));
        setLoading(false);
      } catch (err: unknown) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          console.error(err);
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [currentPage, searchQuery, category, selectedStatus, selectedSortBy, selectedOrder]);

  const updateQueryParam = (params: Record<string, string>) => {
    const current = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });

    startTransition(() => {
      router.push(`?${current.toString()}`);
    });
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await fetch(`https://dummyjson.com/products/category/${category}`);
      const data = await response.json();

      const fileContent = JSON.stringify(data, null, 2);
      const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "Clinic-" + category + ".txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export products:", error);
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete these selected products? Selected: ${selected.length} items`,
      )
    )
      return;

    try {
      const productIdsToDelete = selected;

      await handleDeleteProducts(productIdsToDelete);

      setSelected([]);

      setBackDrop(false);
      alert("Products deleted successfully!");
    } catch (error) {
      alert("Something went wrong while deleting.");

      setBackDrop(false);
    }
  };

  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={backDrop}
        onClick={() => null}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="mb-4.5 flex items-center md:items-end gap-3 flex-col md:flex-row">
        <label className="grid flex-1 gap-1.5 w-full md:w-auto">
          <span className="text-xs font-medium text-[#71817d]">Search</span>
          <input
            className="h-9.5 rounded border border-(--line) bg-white px-2.5 text-xs text-[#344440] outline-none focus:border-[#79a9a0] focus:ring-4 focus:ring-[#e0efec]"
            type="search"
            placeholder="Search by item name, category, or SKU"
            defaultValue={searchQuery}
            onChange={(e) => updateQueryParam({ q: e.target.value })}
          />
        </label>

        <label className="grid min-w-36 gap-1.5 w-full md:w-auto">
          <span className="text-xs font-medium text-[#71817d]">Status</span>
          <select
            className="h-9.5 rounded border border-(--line) bg-white px-2.5 text-xs text-[#344440] outline-none focus:border-[#79a9a0] focus:ring-4 focus:ring-[#e0efec]"
            value={selectedStatus}
            onChange={(e) => updateQueryParam({ status: e.target.value })}
          >
            <option value="all">All</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </label>

        <span className="whitespace-nowrap px-1 pb-3 text-xs text-[#87938f]">
          {totalResults} items found
        </span>
      </div>

      <section className="overflow-hidden rounded-lg border border-[#e3e9e6] bg-white">
        <div className="flex items-start justify-between px-6 pb-4.5 pt-6">
          <div>
            <span className="mb-2.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[#7a8a86]">
              Catalog
            </span>
            <h2 className="font-serif text-xl font-normal tracking-[-0.02em] text-[#263633]">
              All inventory items
            </h2>
          </div>
          <div className="flex items-center gap-5">
            <button
              disabled={exporting}
              onClick={handleExport}
              className="inline-flex cursor-pointer w-full md:w-auto bg-green-700 min-h-9.5 items-center justify-center gap-2 rounded-lg border text-xs border-(--line) px-4 text-white"
              type="button"
            >
              {exporting ? "Exporting ..." : "Export list"}
            </button>

            <label className="flex shrink-0 items-center gap-1 w-full md:w-auto ps-2 cursor-pointer">
              <span className="font-medium text-black">Sort By: </span>
              <select
                className="h-9.5 w-fit cursor-pointer rounded border-0 bg-white px-2.5 text-xs text-[#71817d] outline-none focus:border-[#79a9a0] focus:ring-4 focus:ring-[#e0efec]"
                value={`${selectedSortBy}:${selectedOrder}`}
                onChange={(e) => {
                  const value = e.target.value;

                  const [field, order] = value.split(":");
                  updateQueryParam({
                    sortBy: field,
                    order: field ? order : "",
                  });
                }}
              >
                <option value=":">(Recommended)</option>
                <option value="title:asc">Name (A - Z)</option>
                <option value="stock:asc">Stock (Low to high)</option>
                <option value="stock:desc">Stock (High to low)</option>
                <option value="rating:asc">Rating (Low to high)</option>
                <option value="rating:desc">Rating (High to low)</option>
                <option value="price:asc">Price (Low to high)</option>
                <option value="price:desc">Price (High to low)</option>
              </select>
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-200 border-collapse">
            <thead>
              <tr>
                <th className="bg-[#f8faf9] px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#7b8985]">
                  Item
                </th>
                <th className="bg-[#f8faf9] px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#7b8985]">
                  Item Name
                </th>
                <th className="bg-[#f8faf9] px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#7b8985]">
                  Category
                </th>
                <th className="bg-[#f8faf9] px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#7b8985]">
                  Quantity
                </th>
                <th className="bg-[#f8faf9] px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#7b8985]">
                  Price
                </th>
                <th className="bg-[#f8faf9] px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#7b8985]">
                  Status
                </th>
                <th className="bg-[#f8faf9] px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#7b8985]">
                  Last updated
                </th>
              </tr>
            </thead>
            <tbody>
              {!loading && products.length > 0 && (
                <tr
                  className="cursor-pointer hover:bg-gray-100 transition-all"
                  tabIndex={0}
                  role="link"
                >
                  <td colSpan={7}>
                    <div className="relative flex gap-3 px-5 py-2 text-sm text-[#65736f] items-center font-semibold justify-between">
                      <div className="flex gap-3 items-center">
                        <Checkbox
                          onChange={(e) => {
                            e.stopPropagation();
                            setSelected(
                              allProductsSelected
                                ? selected.filter(
                                    (id) =>
                                      !products.some((product) => product.id === id),
                                  )
                                : Array.from(
                                    new Set([
                                      ...selected,
                                      ...products.map((product) => product.id),
                                    ]),
                                  ),
                            );
                          }}
                          checked={allProductsSelected}
                          className="shrink-0 aspect-square"
                        />
                        <span>{allProductsSelected ? "Deselect All" : "Select All"}</span>
                      </div>

                      {selected.length > 0 && (
                        <div className="flex gap-3 items-center shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete();
                            }}
                            className="inline-flex shrink-0 text-nowrap button-primary text-red-500 shadow-sm bg-gray-100 p-2 px-3 rounded-lg cursor-pointer"
                          >
                            Delete{" "}
                            {allProductsSelected
                              ? `All (${selected.length})`
                              : selected.length > 1
                                ? `Selected (${selected.length})`
                                : ""}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={`loading-${index}`} className="h-20 animate-pulse">
                    <td colSpan={7} className="border-t border-[#edf1ef] px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded bg-[#e8eeeb]" />
                        <div className="h-12 w-30 rounded bg-[#e8eeeb]" />
                        <div className="h-3 w-1/3 rounded bg-[#e8eeeb]" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : products.length > 0 ? (
                products.map((item: Product, i) => (
                  <ProductTableRow
                    key={i}
                    item={item}
                    selected={selected}
                    setSelected={setSelected}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="h-55 border-t border-[#edf1ef] px-5 py-10 text-center"
                  >
                    <HourglassEmpty className="mb-4" fontSize="large" color="error" />
                    <p className="text-sm font-medium text-[#354440]">No items found</p>
                    <p className="mt-1 text-xs text-[#87938f]">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          onPageChange={(page) => updateQueryParam({ page: page.toString() })}
          totalPages={Math.ceil(totalResults / LIMIT)}
          startIndex={start}
          endIndex={end}
          totalResults={totalResults}
        />
      </section>
    </>
  );
}

export default CategoryPageView;
