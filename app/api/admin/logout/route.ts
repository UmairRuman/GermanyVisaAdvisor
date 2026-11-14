import { clearedCookie } from "@/lib/server/admin-auth";

export async function POST() {
  return Response.json({ ok: true }, { headers: { "Set-Cookie": clearedCookie() } });
}
