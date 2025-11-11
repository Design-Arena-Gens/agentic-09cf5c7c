import { headers } from "next/headers";

export default async function Home() {
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") || hdrs.get("host") || "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const origin = `${proto}://${host}`;
  const res = await fetch(`${origin}/api/daily`, { cache: "no-store" });
  const data = (await res.json()) as {
    items: Array<{
      url: string;
      title: string;
      authorName: string;
      authorUrl: string;
      thumbnailUrl: string;
      embedHtml: string;
    }>;
  };

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 px-4 py-10 font-sans dark:bg-black">
      <main className="w-full max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Daily Football Edits (Curated Links)
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            This page lists public TikTok links for football edits selected for discovery.
            We do not download or repost others? videos. Embeds use TikTok oEmbed.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {data.items.map((item) => (
            <article key={item.url} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="mb-2 line-clamp-2 text-base font-medium text-zinc-900 dark:text-zinc-100">
                {item.title || "TikTok Video"}
              </h2>
              <div className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                by{" "}
                {item.authorUrl ? (
                  <a className="underline" href={item.authorUrl} target="_blank" rel="noreferrer">
                    {item.authorName || "Creator"}
                  </a>
                ) : (
                  <span>{item.authorName || "Creator"}</span>
                )}
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {item.thumbnailUrl ? (
                <a href={item.url} target="_blank" rel="noreferrer">
                  <img src={item.thumbnailUrl} alt={item.title || "Video thumbnail"} className="mb-3 w-full rounded" />
                </a>
              ) : null}
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
              >
                View on TikTok
                <span aria-hidden>?</span>
              </a>
            </article>
          ))}
        </section>

        <footer className="mt-10 text-xs text-zinc-500 dark:text-zinc-500">
          Curate your own list by setting the <code>CURATED_TIKTOK_URLS</code> env var (comma-separated).
        </footer>
      </main>
    </div>
  );
}
