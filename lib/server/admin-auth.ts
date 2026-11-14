import { createHmac, timingSafeEqual } from "node:crypto";

// Simple single-admin login: one shared password (ADMIN_PASSWORD) and a signed, expiring,
// HttpOnly cookie. No user database is needed for this small site.

export const ADMIN_COOKIE = "gc_admin";
const SESSION_SECONDS = 12 * 60 * 60;

function secret() {
  const value = process.env.BOOKING_SECRET;
  if (!value) throw new Error("BOOKING_SECRET is not set");
  return value;
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

export const adminIsConfigured = Boolean(
  process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.BOOKING_SECRET,
);

const digest = (value: string) => createHmac("sha256", "admin-login").update(value).digest();

/** Checks username and password together, in constant time, without revealing which was wrong. */
export function credentialsMatch(username: string, password: string): boolean {
  const expectedUser = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!expectedUser || !expectedPassword) return false;
  const userOk = timingSafeEqual(digest(username.trim().toLowerCase()), digest(expectedUser));
  const passOk = timingSafeEqual(digest(password), digest(expectedPassword));
  return userOk && passOk;
}

export function sessionCookie(): string {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const value = `${expires}.${sign(String(expires))}`;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${ADMIN_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_SECONDS}${secure}`;
}

export function clearedCookie(): string {
  return `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}

export function isAdmin(request: Request): boolean {
  if (!adminIsConfigured) return false;
  const header = request.headers.get("cookie") ?? "";
  const match = header.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${ADMIN_COOKIE}=`));
  if (!match) return false;
  const [expires, signature] = match.slice(ADMIN_COOKIE.length + 1).split(".");
  if (!expires || !signature || Number(expires) < Date.now() / 1000) return false;
  const expected = Buffer.from(sign(expires));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
