import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Product } from "@/app/data/products";

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const incomingUrl = new URL(request.url);

  const limit = incomingUrl.searchParams.get("limit") || "10";
  const skip = incomingUrl.searchParams.get("skip") || "0";
  const sortBy = incomingUrl.searchParams.get("sortBy") as keyof Product | "";
  const order = incomingUrl.searchParams.get("order") || "asc";

  const cacheKey = `products:category:${slug}:limit:${limit}:skip:${skip}:sortBy:${sortBy}:order:${order}`;

  try {
    const cached = await Promise.race([
      redis.get(cacheKey),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 400),
      ),
    ]);

    if (cached) {
      return NextResponse.json(
        typeof cached === "string" ? JSON.parse(cached) : cached,
        {
          status: 200,
          headers: { "X-Cache": "HIT" },
        },
      );
    }
  } catch {
    // Cache failure should not block the request.
  }

  try {
    const upstreamUrl =
      `https://dummyjson.com/products/category/${encodeURIComponent(slug)}` +
      `?limit=${limit}&skip=${skip}`;

    const response = await fetch(upstreamUrl, {
      next: { revalidate: 3600 },
    });

    const data: ProductsResponse | null = await response
      .json()
      .catch(() => null);

    if (!response.ok || !data || !Array.isArray(data.products)) {
      return NextResponse.json(
        { message: "Failed to fetch category products." },
        { status: response.status || 500 },
      );
    }

    if (sortBy) {
      data.products.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];

        if (typeof aVal === "string" && typeof bVal === "string") {
          const comparison = aVal
            .toLowerCase()
            .localeCompare(bVal.toLowerCase());

          return order === "desc" ? -comparison : comparison;
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
          return order === "desc" ? bVal - aVal : aVal - bVal;
        }

        return 0;
      });
    }

    redis
      .set(cacheKey, data, { ex: 3600 })
      .catch((err: unknown) =>
        console.error("Background cache write failed:", err),
      );

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "X-Cache": "MISS",
      },
    });
  } catch {
    return NextResponse.json(
      {
        message: "The DummyJSON service could not be reached.",
        retryable: true,
      },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
