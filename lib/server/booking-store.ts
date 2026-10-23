import { Redis } from "@upstash/redis";
import { PENDING_HOLD_HOURS } from "@/lib/booking";

export type BookingStatus = "pending" | "confirmed" | "declined";

export type Booking = {
  id: string;
  date: string; // YYYY-MM-DD, Pakistan time
  name: string;
  email: string;
  whatsapp: string;
  topic: string;
  status: BookingStatus;
  createdAt: string;
};

// Slot state lives in Upstash Redis (add it from the Vercel Marketplace; it sets these env
// vars). Without it we fall back to process memory, which is fine for local development but
// is NOT shared between serverless instances, so production needs Redis.
const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

export const storeIsPersistent = redis !== null;

const memory = new Map<string, { value: string; expires: number | null }>();

const HOLD_SECONDS = PENDING_HOLD_HOURS * 60 * 60;
const KEEP_SECONDS = 90 * 24 * 60 * 60;

async function get(key: string): Promise<string | null> {
  if (redis) return (await redis.get<string>(key)) ?? null;
  const entry = memory.get(key);
  if (!entry) return null;
  if (entry.expires && entry.expires < Date.now()) {
    memory.delete(key);
    return null;
  }
  return entry.value;
}

async function set(key: string, value: string, seconds: number | null, onlyIfAbsent = false): Promise<boolean> {
  if (redis) {
    let result: unknown;
    if (onlyIfAbsent && seconds) result = await redis.set(key, value, { ex: seconds, nx: true });
    else if (onlyIfAbsent) result = await redis.set(key, value, { nx: true });
    else if (seconds) result = await redis.set(key, value, { ex: seconds });
    else result = await redis.set(key, value);
    return result === "OK";
  }
  if (onlyIfAbsent && (await get(key)) !== null) return false;
  memory.set(key, { value, expires: seconds ? Date.now() + seconds * 1000 : null });
  return true;
}

async function remove(key: string) {
  if (redis) await redis.del(key);
  else memory.delete(key);
}

const slotKey = (date: string) => `slot:${date}`;
const bookingKey = (id: string) => `booking:${id}`;

/** Dates (from `dates`) that are currently held or confirmed. */
export async function takenDates(dates: string[]): Promise<string[]> {
  const holders = await Promise.all(dates.map((d) => get(slotKey(d))));
  return dates.filter((_, i) => holders[i] !== null);
}

/** Atomically reserves the day. Returns false if someone else already holds it. */
export async function holdSlot(booking: Booking): Promise<boolean> {
  const won = await set(slotKey(booking.date), booking.id, HOLD_SECONDS, true);
  if (!won) return false;
  await set(bookingKey(booking.id), JSON.stringify(booking), KEEP_SECONDS);
  return true;
}

export async function getBooking(id: string): Promise<Booking | null> {
  const raw = await get(bookingKey(id));
  if (!raw) return null;
  return typeof raw === "string" ? (JSON.parse(raw) as Booking) : (raw as Booking);
}

export async function confirmBooking(booking: Booking) {
  const updated: Booking = { ...booking, status: "confirmed" };
  await set(bookingKey(booking.id), JSON.stringify(updated), KEEP_SECONDS);
  // Confirmed slots stay blocked until the day itself has passed.
  await set(slotKey(booking.date), booking.id, KEEP_SECONDS);
  return updated;
}

export async function declineBooking(booking: Booking) {
  const updated: Booking = { ...booking, status: "declined" };
  await set(bookingKey(booking.id), JSON.stringify(updated), KEEP_SECONDS);
  if ((await get(slotKey(booking.date))) === booking.id) await remove(slotKey(booking.date));
  return updated;
}

/** Simple fixed-window rate limit: true while the caller is under `limit` per hour. */
export async function underRateLimit(key: string, limit: number): Promise<boolean> {
  if (!redis) return true;
  const bucket = `rate:${key}`;
  const count = await redis.incr(bucket);
  if (count === 1) await redis.expire(bucket, 3600);
  return count <= limit;
}
