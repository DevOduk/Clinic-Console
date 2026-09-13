import { NextResponse } from "next/server";

const LOGIN_URL = `https://dummyjson.com/auth/login?delay=2000`;

export const dynamic = "force-dynamic";

export async function POST(request: Request) {

  try {
    const { username, password, expiresInMins } = await request.json();

    if (
      !password.trim() ||
      !username.trim()
    ) {
      return NextResponse.json(
        { message: "Username and password are required." },
        { status: 422, headers: { "Cache-Control": "no-store" } },
      );
    }

    const loginPayload = {
      username: username.trim(),
      password,
      expiresInMins
    };
    const accessTokenMaxAge =
      expiresInMins > 0
        ? Math.floor(expiresInMins * 60)
        : 3600;

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginPayload),
        cache: "no-store",
        next: { revalidate: 0 },
      });

      const responseBody = await response.json().catch(() => ({
        message: "DummyJSON returned an invalid response.",
      }));

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
          maxAge: accessTokenMaxAge,
        });

        if (responseBody.refreshToken) {
          nextResponse.cookies.set("refreshToken", responseBody.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
          });
        }
      }

      return nextResponse;
    } catch {
      return NextResponse.json(
        { message: "The login service could not be reached.", retryable: true },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

  } catch {
    return NextResponse.json(
      { message: "Request body must be valid JSON." },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }


}
