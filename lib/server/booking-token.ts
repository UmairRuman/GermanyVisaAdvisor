import { createHmac, timingSafeEqual } from "node:crypto";

export type BookingAction = "confirm" | "decline";

function secret() {
  const value = process.env.BOOKING_SECRET;
  if (!value) throw new Error("BOOKING_SECRET is not set");
  return value;
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

/** A link token that proves the advisor's email — nobody else can forge confirm/decline links. */
export function createToken(id: string, action: BookingAction) {
  const payload = `${id}.${action}`;
  return Buffer.from(`${payload}.${sign(payload)}`).toString("base64url");
}

export function readToken(token: string): { id: string; action: BookingAction } | null {
  try {
    const [id, action, signature] = Buffer.from(token, "base64url").toString().split(".");
    if (!id || (action !== "confirm" && action !== "decline") || !signature) return null;
    const expected = Buffer.from(sign(`${id}.${action}`));
    const given = Buffer.from(signature);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
    return { id, action };
  } catch {
    return null;
  }
}
