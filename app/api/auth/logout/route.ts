import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const nextResponse = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );

    nextResponse.cookies.delete("accessToken");

    nextResponse.cookies.delete("refreshToken");

    return nextResponse;
  } catch {
    return NextResponse.json(
      { message: "An error occurred during logout." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}