import { Redis } from "@upstash/redis";
import { BOOKING_TIMES, DEFAULT_BOOKING_TIME, PENDING_HOLD_MINUTES } from "@/lib/booking";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = {
  id: string;
  date: string; // YYYY-MM-DD, Pakistan time
  time: string; // "HH:MM", Pakistan time
  name: string;
  email: string;
  phone: string;
  city: string;
  qualification: string;
  score: string;
  degree: string;
  fieldOfStudy: string;
  languageTest: string;
  languageScore: string;
  intake: string;
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
const memoryIndex: string[] = [];

const HOLD_SECONDS = PENDING_HOLD_MINUTES * 60;
const KEEP_SECONDS = 180 * 24 * 60 * 60;
const BLOCKED = "blocked";

async function get(key: string): Promise<string | null> {
  if (redis) {
    const value = await redis.get<unknown>(key);
    if (value === null || value === undefined) return null;
    return typeof value === "string" ? value : JSON.stringify(value);
  }
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

const slotKey = (date: string, time: string) => `slot:${date}:${time}`;
const bookingKey = (id: string) => `booking:${id}`;
const INDEX_KEY = "bookings:index";

/** Who holds each date/time: a booking id, "blocked", or null when free. */
export async function slotHolders(dates: string[]): Promise<Record<string, Record<string, string | null>>> {
  const pairs = dates.flatMap((d) => BOOKING_TIMES.map((t) => [d, t] as const));
  const keys = pairs.map(([d, t]) => slotKey(d, t));
  // One round trip for all slots instead of one request each.
  const holders: (string | null)[] = redis
    ? (await redis.mget<unknown[]>(...keys)).map((v) => (v === null || v === undefined ? null : String(v)))
    : await Promise.all(keys.map((k) => get(k)));
  const result: Record<string, Record<string, string | null>> = {};
  pairs.forEach(([d, t], i) => {
    (result[d] ??= {})[t] = holders[i];
  });
  return result;
}

/** Atomically reserves the slot for 15 minutes. Returns false if someone else already holds it. */
export async function holdSlot(booking: Booking): Promise<boolean> {
  const won = await set(slotKey(booking.date, booking.time), booking.id, HOLD_SECONDS, true);
  if (!won) return false;
  await set(bookingKey(booking.id), JSON.stringify(booking), KEEP_SECONDS);
  if (redis) {
    await redis.lpush(INDEX_KEY, booking.id);
    await redis.ltrim(INDEX_KEY, 0, 499);
  } else {
    memoryIndex.unshift(booking.id);
  }
  return true;
}

export async function getBooking(id: string): Promise<Booking | null> {
  const raw = await get(bookingKey(id));
  if (!raw) return null;
  const booking = JSON.parse(raw) as Booking;
  return { ...booking, time: booking.time ?? DEFAULT_BOOKING_TIME };
}

/** Newest first. */
export async function listBookings(): Promise<Booking[]> {
  const ids = redis ? await redis.lrange<string>(INDEX_KEY, 0, 199) : memoryIndex.slice(0, 200);
  const found = await Promise.all(ids.map((id) => getBooking(String(id))));
  return found.filter((b): b is Booking => b !== null);
}

async function save(booking: Booking) {
  await set(bookingKey(booking.id), JSON.stringify(booking), KEEP_SECONDS);
}

export type ConfirmResult = { ok: true; booking: Booking } | { ok: false; reason: "taken" | "cancelled" };

/**
 * Admin confirms after the payment arrived. If the 15-minute hold already ran out we try to
 * claim the day again; if somebody else got it in the meantime, the confirmation is refused.
 */
export async function confirmBooking(booking: Booking): Promise<ConfirmResult> {
  if (booking.status === "cancelled") return { ok: false, reason: "cancelled" };
  const holder = await get(slotKey(booking.date, booking.time));
  if (holder === booking.id) {
    await set(slotKey(booking.date, booking.time), booking.id, KEEP_SECONDS);
  } else if (holder === null) {
    if (!(await set(slotKey(booking.date, booking.time), booking.id, KEEP_SECONDS, true))) return { ok: false, reason: "taken" };
  } else {
    return { ok: false, reason: "taken" };
  }
  const updated: Booking = { ...booking, status: "confirmed" };
  await save(updated);
  return { ok: true, booking: updated };
}

export async function cancelBooking(booking: Booking): Promise<Booking> {
  const updated: Booking = { ...booking, status: "cancelled" };
  await save(updated);
  if ((await get(slotKey(booking.date, booking.time))) === booking.id) await remove(slotKey(booking.date, booking.time));
  return updated;
}

/** Admin closes a free slot. Fails if it is already held or blocked. */
export async function blockSlot(date: string, time: string): Promise<boolean> {
  return set(slotKey(date, time), BLOCKED, null, true);
}

export async function unblockSlot(date: string, time: string): Promise<boolean> {
  if ((await get(slotKey(date, time))) !== BLOCKED) return false;
  await remove(slotKey(date, time));
  return true;
}

export const BLOCKED_MARKER = BLOCKED;

/** Simple fixed-window rate limit: true while the caller is under `limit` per hour. */
export async function underRateLimit(key: string, limit: number): Promise<boolean> {
  if (!redis) return true;
  const bucket = `rate:${key}`;
  const count = await redis.incr(bucket);
  if (count === 1) await redis.expire(bucket, 3600);
  return count <= limit;
}
