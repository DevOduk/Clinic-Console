import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const myCookies = await cookies();
  const refreshToken = myCookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: "Authentication required." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }
  try {
    const response = await fetch("https://dummyjson.com/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: refreshToken,
        // expiresInMins: 30,
        expiresInMins: 1,
      }),
      credentials: "include",
    });
    const responseBody = await response.json().catch(() => null);
    const nextResponse = NextResponse.json(responseBody, {
      status: response.status,
      headers: { "Cache-Control": "no-store" },
    });

    if (response.ok && responseBody?.accessToken) {
      nextResponse.cookies.set("accessToken", responseBody.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60,
      });
    }

    return nextResponse;
  } catch {
    return NextResponse.json(
      { message: "The refresh service could not be reached.", retryable: true },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
