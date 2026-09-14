import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis Client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  const cacheKey = "products:categories:all";
  // try redis cache first
  try {
    const cached = await redis.get(cacheKey);
    if (cached)
      return NextResponse.json(
        typeof cached === "string" ? JSON.parse(cached) : cached,
        { status: 200 },
      );
  } catch (e) {
    console.error("Redis read error on all categories:", e);
  }

  try {
    const response = await fetch(
      `https://dummyjson.com/products/categories?delay=0`,
      { next: { revalidate: 3600 } },
    );
    const data = await response.json().catch(() => null);

    if (data) {
      await redis.set(cacheKey, data);
    }
    return NextResponse.json(data, {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
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
