import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

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
  const sortBy = incomingUrl.searchParams.get("sortBy") || "";
  const order = incomingUrl.searchParams.get("order") || "asc";

  const cacheKey = `products:category:${slug}:limit:${limit}:skip:${skip}:sortBy:${sortBy}:order:${order}`;

  try {
    const cached = await Promise.race([
      redis.get(cacheKey),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 400),
      ),
    ]);

    if (cached) {
      return NextResponse.json(
        typeof cached === "string" ? JSON.parse(cached) : cached,
        { status: 200, headers: { "X-Cache": "HIT" } },
      );
    }
  } catch (e) {
    // silent fail
  }

  try {
    const upstreamUrl = `https://dummyjson.com/products/category/${encodeURIComponent(slug)}?limit=${limit}&skip=${skip}`;
    const response = await fetch(upstreamUrl, { next: { revalidate: 3600 } });
    const data = await response.json().catch(() => null);

    if (!response.ok || !data || !data.products) {
      return NextResponse.json(
        { message: "Failed to fetch category products." },
        { status: response.status || 500 },
      );
    }

    // Sort the products array if sortBy is provided
    if (sortBy && Array.isArray(data.products)) {
      data.products.sort((a: any, b: any) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        // Handle string comparison case-insensitively
        if (typeof aVal === "string" && typeof bVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) return order === "desc" ? 1 : -1;
        if (aVal > bVal) return order === "desc" ? -1 : 1;
        return 0;
      });
    }

    // Cache the modified response data
    redis
      .set(cacheKey, data, { ex: 3600 })
      .catch((err) => console.error("Background cache write failed:", err));

    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "no-store", "X-Cache": "MISS" },
    });
  } catch {
    return NextResponse.json(
      {
        message: "The DummyJSON service could not be reached.",
        retryable: true,
      },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
