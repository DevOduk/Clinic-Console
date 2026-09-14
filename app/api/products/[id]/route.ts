import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return fetchProduct(request, id);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Request body must be valid JSON." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  return fetchProduct(request, id, "PUT", body);
}

async function fetchProduct(
  request: Request,
  id: string,
  method: "GET" | "PUT" = "GET",
  body?: unknown,
) {
  const url = new URL(
    `https://dummyjson.com/products/${encodeURIComponent(id)}`,
  );
  url.searchParams.set("delay", "2000");
  const headers = new Headers({ Accept: "application/json" });
  const authorization = request.headers.get("authorization");

  if (authorization) headers.set("Authorization", authorization);
  if (body !== undefined) headers.set("Content-Type", "application/json");

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      next: { revalidate: 3600 },
    });
    const data = await response.json().catch(() => null);
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
