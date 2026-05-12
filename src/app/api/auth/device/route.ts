import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 },
    );
  }

  const apiToken = (session as any)?.user?.apiToken;
  if (!apiToken) {
    return NextResponse.json(
      { success: false, error: "No API token in session" },
      { status: 401 },
    );
  }

  let body: { user_code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  if (!body.user_code || typeof body.user_code !== "string") {
    return NextResponse.json(
      { success: false, error: "user_code is required" },
      { status: 400 },
    );
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  try {
    const res = await fetch(`${apiUrl}/api/v1/auth/device/authorize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({ user_code: body.user_code }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Authorization failed" },
        { status: res.status },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to reach API server" },
      { status: 502 },
    );
  }
}
