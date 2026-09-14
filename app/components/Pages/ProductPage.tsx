"use client";

import Link from "next/link";
import { useState } from "react";
import { Product } from "@/app/data/products";
import { handleDeleteProducts } from "@/app/utils/DeleteProducts";
import { useRouter } from "next/navigation";
import { Backdrop, CircularProgress } from "@mui/material";
import Image from "next/image";

function ProductDetailsView({ ProductDetails }: { ProductDetails: Product }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product>(ProductDetails);
  const [count, setCount] = useState(Number(ProductDetails.stock));
  const [price, setPrice] = useState(Number(ProductDetails.price));
  const [currentImage, setCurrentImage] = useState(0);
  const [backDrop, setBackDrop] = useState(false);

  // updating item
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState<{
    success: string | null;
    data: Product | null;
    error: string | null;
  }>({ success: null, data: null, error: null });

  const handleUpdateProduct = async () => {
    setIsSubmitting(true);
    setSubmission({ success: null, data: null, error: null });

    try {
      const response = await fetch(
        `https://dummyjson.com/products/${ProductDetails.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...ProductDetails,
            stock: count,
            price: price,
          }),
        },
      );

      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { message: responseText };
      }

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      setProduct(data);

      setSubmission((prev) => ({
        ...prev,
        success: "Product has been updated successfully!",
      }));
    } catch (err: unknown) {
      console.error("Caught error:", err);
      setSubmission((prev) => ({
        ...prev,
        error:
          err instanceof Error
            ? err?.message
            : "Critical error when submitting product!",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setBackDrop(true);

    try {
      await handleDeleteProducts([ProductDetails.id]);

      alert("Product deleted successfully!");

      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/");
      }
    } catch {
      alert("Something went wrong while deleting.");
    } finally {
      setBackDrop(false);
    }
  };

  return (
    <main className="px-4 py-16 w-full">
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={backDrop}
        onClick={() => null}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {submission.error && (
        <div className="p-2 px-3 mb-4 bg-red-100 border border-red-300 text-red-700 rounded-lg shadow font-semibold text-center">
          {submission.error}
        </div>
      )}
      {submission.success && (
        <div className="p-2 px-3 mb-4 bg-green-100 border border-green-300 text-green-700 rounded-lg shadow font-semibold text-center">
          {submission.success}
        </div>
      )}
      <div className="grid items-start gap-10 md:grid-cols-2">
        <div className="relative">
          <div className="relative w-full h-100 overflow-hidden bg-gray-200 rounded-lg">
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-200/40 text-xs font-medium text-gray-400">
              <span>{ProductDetails.title}</span>
            </div>
            <span className="absolute top-3 right-3 z-10 flex gap-2">
              <span className="rounded-md bg-(--teal) px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                {ProductDetails.category}
              </span>
              <span className="rounded-md bg-green-500 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                {`${ProductDetails.discountPercentage}% Off`}
              </span>
            </span>
            <div className="absolute inset-0">
              <Image
                fill
                src={ProductDetails.images[currentImage]}
                alt={ProductDetails.title}
                className="rounded-lg p-2 object-cover transition-transform duration-300 group-hover:scale-105 brightness-90"
                sizes="(max-width: 1024px) 100vw, 50vw"
                preload
              />
            </div>
          </div>

          <div className="flex justify-center snap-proximity overflow-x-auto items-center gap-2 p-2 mt-3">
            <div className="flex justify-center snap-proximity overflow-x-auto items-center gap-2 p-2 mt-3">
              {ProductDetails.images.map((img, i) => (
                <Image
                  key={i}
                  width={80}
                  preload
                  height={80}
                  onClick={() => setCurrentImage(i)}
                  src={img || "/images/pizza.avif"}
                  alt={ProductDetails.title}
                  title={ProductDetails.title}
                  className={`border-2 scroll-smooth snap-x ${currentImage === i ? "border-green-500  brightness-100" : "border-transparent  brightness-60"} aspect-square w-20 cursor-pointer object-center rounded-lg bg-gray-200 object-cover transition-transform duration-300 group-hover:scale-105`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex mb-4 flex-wrap justify-between items-center">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-500">
              {ProductDetails.category}
              <span className="rounded-md bg-green-500 px-2 py-1 text-xs text-white">
                {ProductDetails.sku}
              </span>
            </div>
            <span
              className={`rounded-lg shadow px-2 py-1 text-sm ${ProductDetails.availabilityStatus === "In Stock" ? "bg-[#e7f5ed] text-(--green)" : "bg-[#fbe9e7] text-(--red)"}`}
            >
              {ProductDetails.availabilityStatus}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-black md:text-4xl">
            {ProductDetails.title}
          </h1>
          <p className="mt-4 text-gray-500">
            {ProductDetails.description ||
              "Fleetmster, we are passionate about providing exceptional car rental services that exceed our customers' expectations. With a commitment to quality, reliability, and customer satisfaction, we strive to be the preferred choice for all your car rental needs. Our extensive fleet of well-maintained vehicles, competitive pricing, and personalized service make us the go-to destination for travelers seeking convenience and comfort on the road."}
          </p>
          <div className="mt-6 flex items-baseline gap-2 border-y border-gray-200 py-4">
            <span className="text-xl font-semibold text-gray-400">$</span>
            <span className="text-3xl font-extrabold text-gray-900">
              <input
                value={price}
                type="number"
                disabled={isSubmitting}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full shadow-sm bg-gray-200 p-2 rounded-lg outline-0"
              />
            </span>
          </div>
          <section className="mt-6">
            <h3 className="text-lg font-bold text-gray-900">Features</h3>
            <ul className="mt-3 space-y-2">
              {[
                `${ProductDetails.shippingInformation}`,
                `${ProductDetails.returnPolicy}`,
                `Minimum Order Quantity ${ProductDetails.minimumOrderQuantity}`,
                `${ProductDetails.warrantyInformation}`,
              ]?.map((spec, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span className="mt-0.5 text-emerald-500">✓</span>
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="flex gap-3 items-center mt-3">
            Brand:{" "}
            <Link
              href={`/items?q=${encodeURIComponent(ProductDetails.brand)}`}
              className="cursor-pointer py-1 px-3 bg-gray-100 text-blue-500 shadow-sm rounded-full text-xs!"
              title={ProductDetails.brand}
            >
              {ProductDetails.brand}
            </Link>
          </div>
          <section className="mt-6">
            <h3 className="text-lg font-bold text-gray-900">Update Quantity</h3>
            <div className="mt-3 flex w-full items-center gap-4 justify-between">
              <div className="flex items-baseline gap-2 border-y border-gray-200 py-4">
                <span className="text-xl font-semibold text-gray-400">Qt.</span>
                <span className="text-3xl font-extrabold text-gray-900">
                  {Number(product.stock).toLocaleString()}
                </span>
              </div>

              <div className="flex w-fit items-center gap-3">
                <button
                  name="minus"
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setCount((e) => (e > 1 ? e - 1 : 1))}
                  className="w-12 aspect-square rounded-lg border border-gray-300 bg-[#176d64] text-white px-3 py-2 text-center cursor-pointer outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                >
                  {"-"}
                </button>
                <input
                  id="quantity"
                  name="quantity"
                  disabled={isSubmitting}
                  type="number"
                  min="1"
                  value={count}
                  onChange={(e) =>
                    setCount(
                      Number(e.target.value) < 1 ? 1 : Number(e.target.value),
                    )
                  }
                  className="w-28! shadow-lg shadow-gray-400 h-12 text-center border rounded-lg border-gray-300 bg-white appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <button
                  name="minus"
                  disabled={isSubmitting}
                  type="button"
                  onClick={() => setCount((e) => e + 1)}
                  className="w-12 aspect-square rounded-lg border border-gray-300 bg-[#176d64] text-white px-3 py-2 text-center cursor-pointer outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                >
                  {"+"}
                </button>
              </div>
            </div>
          </section>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleUpdateProduct()}
            className="mt-7 cursor-pointer inline-flex justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
          >
            {isSubmitting ? "Updating" : "Update Item"}
          </button>
          <Link
            href="/items"
            className="mt-4 text-center text-sm font-medium text-green-700 hover:underline"
          >
            Back to Items
          </Link>

          <div className="flex flex-col bg-red-50 mt-7 gap-2 rounded-2xl p-3 border border-red-400">
            <p className="text-red-500 font-bold">Delete</p>
            <p>Delete this product</p>
            <button
              type="button"
              onClick={() => {
                handleDelete();
              }}
              className="inline-flex shrink-0 w-fit text-nowrap button-primary text-white shadow-sm bg-red-800 p-2 px-5 rounded-lg cursor-pointer"
            >
              Delete item
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetailsView;
