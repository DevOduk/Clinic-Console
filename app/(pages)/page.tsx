import {
  ChevronRightOutlined,
  ErrorOutlineOutlined,
} from "@mui/icons-material";
import Link from "next/link";
import { headers } from "next/headers";
import type { ProductsResponse } from "@/app/data/products";
import { formatedValue } from "../data/formating";
import Greeting from "../components/ui/Greeting";
import { Metadata } from "next";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

export const metadata: Metadata = {
  title: "Home | Clinic - Inventory Management Solution",
  description:
    "Manage your clinic stock inventory with ease. Update prices and stock count with one click!",
};

interface Metric {
  label: string;
  value: string;
  detail: string;
  tone: string;
  icon?: any;
}
export default async function Home() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  if (!host) {
    throw new Error("Unable to determine the application host.");
  }

  const response = await fetch(`${protocol}://${host}/api/products?limit=0`);

  if (!response.ok) {
    throw new Error("Unable to load inventory metrics.");
  }

  const products: ProductsResponse = await response.json();

  const inventoryValue =
    products.products?.reduce(
      (total, product) => total + product.price * product.stock,
      0,
    ) || 0;

  // take first 15 sorted by last updated
  const recentProducts = products?.products
    ?.sort(
      (a, b) =>
        new Date(b.meta.updatedAt).getTime() -
        new Date(a.meta.updatedAt).getTime(),
    )
    .slice(0, 15);

  const outOfStock = products.products?.filter(
    (product) => product.availabilityStatus.toLowerCase() === "out of stock",
  );

  const lowStock = products.products.filter(
    (product) => product.availabilityStatus.toLowerCase() === "low stock",
  );

  const metrics: Metric[] = [
    {
      label: "Total items",
      value: `${products.total}`,
      detail: "Your total general stock count.",
      tone: "blue",
    },
    {
      label: "Out of stock",
      value: `${outOfStock.length}`,
      detail: "Out of stock items (Critical)",
      tone: "red",
      icon: <ReportGmailerrorredIcon color="error" />,
    },
    {
      label: "Low stock",
      value: `${lowStock.length}`,
      detail: "Low stock items (Needs attention)",
      tone: "orange",
      icon: <HelpOutlineOutlinedIcon color="action" />,
    },
    {
      label: "Inventory value",
      value: `$${formatedValue(inventoryValue)}`,
      detail: "Total value of available stock",
      tone: "green",
    },
  ];

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-10 py-10 md:py-14">
      <header className="mb-8 flex items-end flex-col md:flex-row gap-3 justify-between">
        <div className="w-full">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a8a86]">
            {formattedDate}
          </p>
          <Greeting />
          <p className="m-0 text-sm text-(--muted)">
            Here is what is happening across your clinic inventory.
          </p>
        </div>
        <Link
          className="inline-flex cursor-pointer shrink-0 min-h-10 flex-nowrap items-center w-full mt-2 md:w-fit justify-center gap-2 rounded-md border border-transparent bg-(--teal) px-4 text-white transition hover:-translate-y-px hover:bg-(--teal-dark) text-sm"
          href="/items?new=1"
        >
          <span>+</span> Add inventory item
        </Link>
      </header>

      <section
        className="mb-5 gap-4 grid grid-cols-1 md:grid-cols-4"
        aria-label="Inventory summary"
      >
        {metrics.map((metric) => (
          <article
            className="relative shadow-lg overflow-hidden rounded-2xl border border-(--line) bg-white p-5"
            key={metric.label}
          >
            <div
              className={`absolute -right-10 -top-15 h-34 aspect-square rounded-full opacity-[0.1] ${metric.tone === "red" ? "bg-(--red)" : metric.tone === "blue" ? "bg-(--blue)" : metric.tone === "orange" ? "bg-(--orange)" : "bg-(--green)"}`}
            />
            <h2 className="mb-3 font-semibold tracking-wide  text-sm text-(--muted)">
              {metric.label}
            </h2>
            <p className="flex gap-1 items-center text-3xl tracking-[-0.03em] text-[#263633]">
              {metric.value} {metric.icon && metric.icon}
            </p>
            <span
              className={`mt-2 block text-xs ${metric.tone === "red" ? "text-red-400" : metric.tone === "blue" ? "text-(--blue)" : metric.tone === "orange" ? "text-(--orange)" : "text-(--green)"}`}
            >
              {metric.detail}
            </span>
          </article>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)] items-start">
        <section className="rounded-2xl border border-(--line) bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a8a86]">
                Recent activity
              </p>
              <h2 className="font-serif text-xl font-normal tracking-[-0.02em] text-[#263633]">
                Latest inventory activity
              </h2>
            </div>
          </div>
          <div className="mt-5">
            {recentProducts.map((item) => (
              <div
                className="flex w-full items-center gap-3 border-t border-[#edf1ef] py-3.5"
                key={item.title}
              >
                <div
                  className={`flex h-10 shrink-0 w-10 items-center justify-center rounded-md text-xs bg-(--teal) text-white`}
                >
                  {item.title.slice(0, 1)}
                </div>
                <div className="w-full">
                  <strong className="block text-sm font-medium text-[#354440]">
                    {item.title}
                  </strong>
                  <span className="mt-1 block text-xs text-(--muted)">
                    {item.sku} | {item.stock} items
                  </span>
                </div>

                <div className="flex gap-3 items-end md:items-center flex-col md:flex-row">
                  <span
                    className={`whitespace-nowrap rounded px-2 py-1 text-xs ${item.availabilityStatus.toLowerCase() === "in stock" ? "bg-[#e7f5ed] text-(--green)" : "bg-red-100 text-red-400"}`}
                  >
                    {item.availabilityStatus}
                  </span>
                  <time className="whitespace-nowrap text-xs text-[#9ba8a4]">
                    {new Date(item.meta.updatedAt).toLocaleDateString() || "-"}
                  </time>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-3">
          <section className="rounded-2xl border border-(--line) bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a8a86]">
                  Critical
                </p>
                <h2 className="font-serif text-xl font-normal tracking-[-0.02em] text-[#263633]">
                  Out of stock items
                </h2>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fbe9e7] text-xs text-[#bc5a56]">
                {outOfStock.length}
              </span>
            </div>
            <div className="my-4">
              {outOfStock.slice(0, 5).map((alert) => (
                <div
                  className="grid grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-2.5 border-t border-[#edf1ef] py-3.5"
                  key={alert.title}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fbe9e7] font-extrabold border  text-[#bc5a56]">
                    !
                  </div>
                  <div>
                    <strong className="block text-xs font-medium text-[#354440]">
                      {alert.title}
                    </strong>
                    <span className="mt-1 block text-xs text-(--muted)">
                      {alert.stock} units left
                    </span>
                  </div>

                  <span
                    className={`whitespace-nowrap rounded shadow px-2 flex gap-1 items-center py-1 text-xs bg-red-100 text-red-600`}
                  >
                    <ErrorOutlineOutlined fontSize="inherit" />
                    {alert.availabilityStatus}
                  </span>
                </div>
              ))}
            </div>
            <Link
              className="inline-flex min-h-10 px-3 items-center justify-between w-full gap-2 rounded-md border border-transparent bg-(--teal) text-xs text-white! transition hover:-translate-y-px hover:bg-(--teal-dark)"
              href="/items?status=Out+of+Stock"
            >
              View More
              <ChevronRightOutlined />
            </Link>
          </section>
          <section className="rounded-2xl border border-(--line) bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a8a86]">
                  Attention needed
                </p>
                <h2 className="font-serif text-xl font-normal tracking-[-0.02em] text-[#263633]">
                  Low stock items
                </h2>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fbe9e7] text-xs text-[#bc5a56]">
                {lowStock.length}
              </span>
            </div>
            <div className="my-4">
              {lowStock.slice(0, 5).map((alert) => (
                <div
                  className="grid grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-2.5 border-t border-[#edf1ef] py-3.5"
                  key={alert.title}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 font-extrabold border  text-orange-600">
                    ?
                  </div>
                  <div>
                    <strong className="block text-xs font-medium text-[#354440]">
                      {alert.title}
                    </strong>
                    <span className="mt-1 block text-xs text-(--muted)">
                      {alert.stock} units left
                    </span>
                  </div>

                  <span
                    className={`whitespace-nowrap rounded shadow px-2 flex gap-1 items-center py-1 text-xs bg-orange-100 text-orange-600`}
                  >
                    <ErrorOutlineOutlined fontSize="inherit" />
                    {alert.availabilityStatus}
                  </span>
                </div>
              ))}
            </div>
            <Link
              className="inline-flex min-h-10 px-3 items-center justify-between w-full gap-2 rounded-md border border-transparent bg-(--teal) text-xs text-white! transition hover:-translate-y-px hover:bg-(--teal-dark)"
              href="/items?status=Low+Stock"
            >
              View More
              <ChevronRightOutlined />
            </Link>
          </section>
        </div>
      </div>

      <section className="mt-7">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#7a8a86]">
          Quick actions
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <Link
            href="/items?new=1"
            className="group flex items-center gap-3 rounded-lg border border-(--line) bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#a9c9c3] hover:bg-(--teal)"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#edf5f3] text-lg text-(--blue) group-hover:text-white">
              +
            </span>
            <span>
              <strong className="block text-xs font-medium text-[#354440] group-hover:text-white">
                Add new item
              </strong>
              <small className="mt-1 block text-xs text-(--muted) group-hover:text-white">
                Create an inventory record
              </small>
            </span>
            <ChevronRightOutlined className="ms-auto group-hover:text-white" />{" "}
          </Link>
          <Link
            href="/categories"
            className="group flex items-center gap-3 rounded-lg border border-(--line) bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#a9c9c3] hover:bg-(--teal)"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#edf5f3] text-lg text-(--purple) group-hover:text-white">
              #
            </span>
            <span>
              <strong className="block text-xs font-medium text-[#354440] group-hover:text-white">
                Manage categories
              </strong>
              <small className="mt-1 block text-xs text-(--muted) group-hover:text-white">
                Organize your inventory
              </small>
            </span>
            <ChevronRightOutlined className="ms-auto group-hover:text-white" />{" "}
          </Link>
        </div>
      </section>
    </div>
  );
}
