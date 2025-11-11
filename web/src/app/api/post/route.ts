import { NextRequest, NextResponse } from "next/server";
import { postVideoToTikTok, TikTokPostRequest } from "@/lib/tiktok";

export async function POST(req: NextRequest) {
  let body: TikTokPostRequest;
  try {
    body = (await req.json()) as TikTokPostRequest;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Safety: Require explicit enable flag
  if (process.env.ENABLE_TIKTOK_POSTING !== "true") {
    return NextResponse.json(
      {
        ok: false,
        error: "Posting disabled. This demo does not repost third-party TikToks.",
      },
      { status: 400 }
    );
  }

  try {
    const result = await postVideoToTikTok(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 400 });
  }
}
