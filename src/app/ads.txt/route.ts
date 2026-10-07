export const dynamic = "force-dynamic";

export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  if (!client || !/^ca-pub-\d{16}$/.test(client)) {
    return new Response("Publisher ID has not been configured.\n", { status: 404 });
  }
  return new Response(`google.com, ${client.replace("ca-", "")}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
