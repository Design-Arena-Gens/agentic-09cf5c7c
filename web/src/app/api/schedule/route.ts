import { NextResponse } from "next/server";

// Called by Vercel Cron daily to refresh content and log status.
export async function GET() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.BASE_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/daily`, { cache: "no-store" });
    const json = await res.json();

    return NextResponse.json({ ok: true, refreshed: json.items?.length ?? 0 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
