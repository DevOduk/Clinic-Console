import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(`https://dummyjson.com/products/search`);
  new URL(request.url).searchParams.forEach((value, key) =>
    url.searchParams.set(key, value),
  );
  url.searchParams.set("delay", "0");

  try {
    const response = await fetch(url, { cache: "no-store" });
    const data = await response.json().catch(() => null);
    return NextResponse.json(data, {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { message: "The DummyJSON service could not be reached.", retryable: true },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
