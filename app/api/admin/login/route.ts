import { adminIsConfigured, credentialsMatch, sessionCookie } from "@/lib/server/admin-auth";
import { underRateLimit } from "@/lib/server/booking-store";

export async function POST(request: Request) {
  if (!adminIsConfigured) return Response.json({ error: "Admin is not set up yet." }, { status: 503 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await underRateLimit(`admin-login:${ip}`, 10))) {
    return Response.json({ error: "Too many attempts. Try again in an hour." }, { status: 429 });
  }

  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string };
  if (!credentialsMatch(String(body.email ?? ""), String(body.password ?? ""))) {
    return Response.json({ error: "Wrong email or password." }, { status: 401 });
  }
  return Response.json({ ok: true }, { headers: { "Set-Cookie": sessionCookie() } });
}

export const dynamic = "force-dynamic";
