import ProductDetailsView from "@/app/components/Pages/ProductPage";
import SimpleBreadCrumb from "@/app/components/SimpleBreadCrumb";
import type { Product } from "@/app/data/products";
import { headers } from "next/headers";
import Link from "next/link";
import { Metadata } from "next";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import RetryButton from "@/app/components/ui/RetryButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    productID: string;
  }>;
}): Promise<Metadata> {
  const { productID } = await params;
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  let title: string;

  const response = await fetch(
    `${protocol}://${host}/api/products/${productID}`,
    {
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) {
    title = "Product Not Found | Clinic - Inventory Management Solution";
  } else {
    const product: Product = await response.json();
    title = `${product ? `${product.title} #${productID}` : `"Product #${productID}`} | Clinic - Inventory Management Solution`;
  }

  return {
    title,
    description:
      "Manage your clinic stock inventory with ease. Update prices and stock count with one click!",
  };
}

async function ProductView({
  params,
}: {
  params: Promise<{
    productID: string;
  }>;
}) {
  const { productID } = await params;
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  if (!host) {
    throw new Error("Unable to determine the application host.");
  }

  const response = await fetch(
    `${protocol}://${host}/api/products/${productID}`,
    {
      next: { revalidate: 3600 },
    },
  );

  if (!response.ok) {
    return (
      <div className="w-full h-full! border flex flex-col justify-center items-center gap-4 px-4 py-3 animate-slide-in">
        <SearchOffIcon sx={{ fontSize: "5rem" }} className="text-red-500" />

        <p className="font-medium">Product not found</p>
        <p className="text-sm text-zinc-400 font-normal">
          No product found with this id <strong>{productID}</strong>! It as
          either deleted of moved.
        </p>
        <div className="flex gap-4 items-center">
          <Link
            href={"/items"}
            className="button gap-3 flex items-center rounded-full h-full bg-blue-500 px-4 p-1 border cursor-pointer text-white border-blue-500 hover:bg-blue-600"
          >
            <KeyboardBackspaceIcon fontSize="small" />
            Back to inventory
          </Link>
          <RetryButton />
        </div>
      </div>
    );
  }

  const ProductDetails: Product = await response.json();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-10 py-10 md:py-14">
      <header className="mb-8 flex items-end flex-col md:flex-row gap-3 justify-between">
        <div>
          <SimpleBreadCrumb
            items={[
              { label: "Inventory", url: "/items" },
              {
                label: ProductDetails.category,
                url: `/categories/${ProductDetails.category}`,
              },
            ]}
            title={ProductDetails.title}
          />
          <h1 className="mb-2.5 font-serif text-[clamp(32px,3.2vw,46px)] font-normal leading-[1.05] tracking-[-0.035em] text-[#20302d]">
            Update Inventory
          </h1>
          <p className="m-0 text-sm text-(--muted)">
            Manage the supplies and equipment your clinic relies on.
          </p>
        </div>
        <Link
          href={"/items?new=1"}
          className="inline-flex shrink-0 min-h-10 flex-nowrap items-center text-sm w-full mt-2 md:w-fit justify-center gap-2 rounded-md border border-transparent bg-(--teal) px-4 text-white transition hover:-translate-y-px hover:bg-(--teal-dark)"
          type="button"
        >
          + Add new item
        </Link>
      </header>

      <p>Product ID: {productID}</p>
      <div className="flex gap-3 items-center mt-3">
        Tags:{" "}
        {ProductDetails.tags.map((tag) => (
          <Link
            // strip the trailing s at the end for accurate results since searching for plural tags returns 0 results
            href={`/items?q=${tag.endsWith("s") ? tag.slice(0, -1) : tag}`}
            className="border border-gray-400 cursor-pointer py-1 px-3 bg-gray-300 rounded-full text-xs!"
            title={tag}
            key={tag}
          >
            {tag}
          </Link>
        ))}
      </div>

      <ProductDetailsView ProductDetails={ProductDetails} />
    </div>
  );
}

export default ProductView;
