import { NextResponse } from "next/server";

// A compliance-friendly daily curation endpoint that lists public TikTok links.
// No scraping or downloading. Embeds should use TikTok's official oEmbed.

function getConfiguredUrls(): string[] {
  const raw = process.env.CURATED_TIKTOK_URLS?.trim();
  if (!raw) {
    return [
      // Default placeholders; replace via CURATED_TIKTOK_URLS env var
      "https://www.tiktok.com/@uefa/video/7338863285720102190",
      "https://www.tiktok.com/@433/video/7371972147433420037",
      "https://www.tiktok.com/@fifaworldcup/video/7348347714099981611",
      "https://www.tiktok.com/@skysports/video/7291958923140490529",
      "https://www.tiktok.com/@espnfc/video/7310469473218129178",
      "https://www.tiktok.com/@goals/video/7251122142199880987",
    ];
  }
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);
}

export async function GET() {
  const urls = getConfiguredUrls();

  // Prepare lightweight metadata via TikTok oEmbed (no view counts guaranteed)
  const results = await Promise.all(
    urls.map(async (url) => {
      try {
        const oembed = await fetch(
          `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
          { next: { revalidate: 3600 } }
        );
        if (!oembed.ok) throw new Error("oEmbed fetch failed");
        const data = (await oembed.json()) as {
          author_name?: string;
          author_url?: string;
          html?: string;
          thumbnail_url?: string;
          title?: string;
        };
        return {
          url,
          title: data.title ?? "",
          authorName: data.author_name ?? "",
          authorUrl: data.author_url ?? "",
          thumbnailUrl: data.thumbnail_url ?? "",
          embedHtml: data.html ?? "",
        };
      } catch (err) {
        return { url, title: "", authorName: "", authorUrl: "", thumbnailUrl: "", embedHtml: "" };
      }
    })
  );

  return NextResponse.json({ items: results.slice(0, 6) });
}
