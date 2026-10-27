import { voiceLibrary } from "@/components/audio/config/voice-library";

export async function GET(request: Request) {
  const voice = voiceLibrary.find(item => item.id === new URL(request.url).searchParams.get("voice"));
  if (!voice) return new Response("Unknown voice", { status: 404 });
  try {
    const range = request.headers.get("range");
    const response = await fetch(voice.url, { headers: range ? { Range: range } : undefined, redirect: "error", signal: AbortSignal.any([request.signal, AbortSignal.timeout(15000)]) });
    if (!response.ok || !response.body) return new Response("Voice preview unavailable", { status: 502 });
    return new Response(response.body, { status: response.status, headers: {
      "Content-Type": response.headers.get("content-type") || "audio/mpeg",
      "Cache-Control": "public, max-age=3600",
      "Accept-Ranges": "bytes",
      "X-Content-Type-Options": "nosniff",
      ...(response.headers.get("content-range") ? { "Content-Range": response.headers.get("content-range")! } : {}),
      ...(!response.headers.get("content-encoding") && response.headers.get("content-length") ? { "Content-Length": response.headers.get("content-length")! } : {}),
    } });
  } catch { return new Response("Voice preview unavailable", { status: 502 }); }
}
