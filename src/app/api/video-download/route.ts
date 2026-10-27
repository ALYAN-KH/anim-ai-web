const MEDIA_HOSTS = new Set([
  "static-public-media.higgsfield.ai",
  "static.higgsfield.ai",
  "cdn.higgsfield.ai",
  "d8j0ntlcm91z4.cloudfront.net",
  "d2ol7oe51mr4n9.cloudfront.net",
]);

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  let source: URL;
  try {
    source = new URL(params.get("url") ?? "");
  } catch {
    return new Response("Invalid video URL", { status: 400 });
  }
  if (source.protocol !== "https:" || !MEDIA_HOSTS.has(source.hostname) || source.port || source.username || source.password) {
    return new Response("Unsupported video source", { status: 400 });
  }
  try {
    const inline = params.get("inline") === "1";
    const range = inline ? request.headers.get("range") : null;
    const response = await fetch(source, { redirect: "error", cache: "no-store", signal: request.signal, headers: range ? { Range: range } : undefined });
    if (!response.ok || !response.body) return new Response("Could not download video", { status: 502 });
    const filename = (params.get("name") || "video").replace(/[^a-z0-9_-]/gi, "-").slice(0, 100);
    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "video/mp4",
        "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${filename}.mp4"`,
        ...(response.headers.get("content-length") ? { "Content-Length": response.headers.get("content-length")! } : {}),
        ...(inline && response.headers.get("content-range") ? { "Content-Range": response.headers.get("content-range")! } : {}),
        ...(inline ? { "Accept-Ranges": "bytes" } : {}),
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Could not download video", { status: 502 });
  }
}
