import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const USER_DETAILS_URL = `https://dummyjson.com/auth/me?delay=0`;

export const dynamic = "force-dynamic";

export async function GET() {
  const myCookies = await cookies();
  const accessToken = myCookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: "Authentication required." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const response = await fetch(USER_DETAILS_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      next: { revalidate: 3600 },
    });
    const responseBody = await response.json().catch(() => ({
      message: "DummyJSON returned an invalid response.",
    }));

    return NextResponse.json(responseBody, {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { message: "The user details service could not be reached.", retryable: true },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
