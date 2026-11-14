"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarCheck, Check, Lock, LogOut, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { BOOKING_TIME_LABEL, BOOKING_TIME_ZONE_LABEL, CONSULTATION_FEE_EUR, describeDate } from "@/lib/booking";
import type { AdminBooking, AdminDay } from "@/app/api/admin/bookings/route";

type Data = { bookings: AdminBooking[]; days: AdminDay[] };

const BADGE: Record<AdminBooking["display"], { label: string; className: string }> = {
  "awaiting-payment": { label: "Awaiting payment", className: "bg-gold/15 text-[#8a6212]" },
  expired: { label: "Hold expired", className: "bg-ink/10 text-ink-muted" },
  confirmed: { label: "Confirmed", className: "bg-[#1fae54]/15 text-[#157a3b]" },
  cancelled: { label: "Cancelled", className: "bg-brick/10 text-brick" },
};

const card = "rounded-2xl border border-line bg-paper-raised p-5";
const btn =
  "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors disabled:opacity-50";

function Login({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).catch(() => null);
    if (response?.ok) return onDone();
    const data = (await response?.json().catch(() => ({}))) as { error?: string } | undefined;
    setError(data?.error ?? "Could not sign in.");
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className={cn(card, "mx-auto mt-24 max-w-sm space-y-4")}>
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-ink">
        <Lock size={20} /> Admin sign in
      </h1>
      <input
        type="text"
        autoComplete="username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-ink"
      />
      <input
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-ink"
      />
      {error && <p role="alert" className="text-sm font-semibold text-brick">{error}</p>}
      <button type="submit" disabled={busy || !password || !email} className={cn(btn, "w-full bg-charcoal py-3 text-paper hover:bg-ink")}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

function when(date: string) {
  return `${describeDate(date).full}, ${BOOKING_TIME_LABEL} ${BOOKING_TIME_ZONE_LABEL}`;
}

export function AdminPanel() {
  const [data, setData] = useState<Data | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [tab, setTab] = useState<"bookings" | "slots">("bookings");
  const [filter, setFilter] = useState<"open" | "all">("open");

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/bookings", { cache: "no-store" }).catch(() => null);
    if (!response) return;
    if (response.status === 401) {
      setAuthed(false);
      return;
    }
    setData((await response.json()) as Data);
    setAuthed(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (!cancelled) void load();
    };
    run();
    const timer = setInterval(run, 30_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [load]);

  async function act(key: string, body: Record<string, string>, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusyKey(key);
    setNotice(null);
    const response = await fetch("/api/admin/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => null);
    const result = (await response?.json().catch(() => ({}))) as { error?: string; warning?: string } | undefined;
    if (response?.ok) setNotice({ kind: result?.warning ? "error" : "ok", text: result?.warning ?? "Done." });
    else setNotice({ kind: "error", text: result?.error ?? "Something went wrong." });
    setBusyKey(null);
    await load();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setData(null);
    setAuthed(false);
  }

  if (authed === null) return <p className="pt-32 text-center text-sm text-ink-muted">Loading…</p>;
  if (!authed) return <Login onDone={() => void load()} />;

  const bookings = (data?.bookings ?? []).filter(
    (b) => filter === "all" || b.display === "awaiting-payment" || b.display === "expired" || b.display === "confirmed",
  );
  const pendingCount = (data?.bookings ?? []).filter((b) => b.display === "awaiting-payment").length;

  return (
    <main className="mx-auto max-w-5xl px-5 pb-24 pt-28">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold text-ink">Bookings admin</h1>
        <div className="flex gap-2">
          <button type="button" onClick={() => void load()} className={cn(btn, "border border-line text-ink hover:border-ink")}>
            <RefreshCw size={13} /> Refresh
          </button>
          <button type="button" onClick={() => void logout()} className={cn(btn, "border border-line text-ink hover:border-ink")}>
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </div>

      <div role="tablist" className="mt-6 flex gap-2">
        {(["bookings", "slots"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full border px-5 py-2 text-sm font-bold",
              tab === t ? "border-brick bg-brick text-paper" : "border-line bg-paper-raised text-ink hover:border-ink",
            )}
          >
            {t === "bookings" ? `Bookings${pendingCount ? ` (${pendingCount} waiting)` : ""}` : "Manage slots"}
          </button>
        ))}
      </div>

      {notice && (
        <p
          role="status"
          className={cn(
            "mt-4 rounded-2xl px-4 py-3 text-sm font-semibold",
            notice.kind === "ok" ? "bg-[#1fae54]/10 text-[#157a3b]" : "bg-brick/10 text-brick",
          )}
        >
          {notice.text}
        </p>
      )}

      {tab === "bookings" ? (
        <section className="mt-6 space-y-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-ink-muted">
            <input type="checkbox" checked={filter === "all"} onChange={(e) => setFilter(e.target.checked ? "all" : "open")} className="h-4 w-4" />
            Show cancelled bookings too
          </label>
          {bookings.length === 0 && <p className={cn(card, "text-sm text-ink-muted")}>No bookings yet.</p>}
          {bookings.map((b) => {
            const badge = BADGE[b.display];
            const canConfirm = b.display === "awaiting-payment" || b.display === "expired";
            const canCancel = b.display !== "cancelled";
            return (
              <article key={b.id} className={card}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-ink">{b.name}</h2>
                    <p className="text-sm text-ink-muted">{when(b.date)}</p>
                  </div>
                  <span className={cn("rounded-full px-3 py-1 text-xs font-bold", badge.className)}>{badge.label}</span>
                </div>
                <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                  {[
                    ["Reference", b.reference],
                    ["Fee", `€${CONSULTATION_FEE_EUR}`],
                    ["Email", b.email],
                    ["Phone", b.phone],
                    ["City", b.city],
                    ["Qualification", `${b.qualification} · ${b.score}`],
                    ["Wants", `${b.degree} · ${b.fieldOfStudy}`],
                    ["Language", b.languageTest && b.languageTest !== "Not taken yet" ? `${b.languageTest}${b.languageScore ? ` — ${b.languageScore}` : ""}` : ""],
                    ["Intake", b.intake],
                    ["Message", b.topic],
                  ]
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <dt className="w-24 shrink-0 text-ink-muted">{k}</dt>
                        <dd className="min-w-0 break-words font-semibold text-ink">{v}</dd>
                      </div>
                    ))}
                </dl>
                {(canConfirm || canCancel) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {canConfirm && (
                      <button
                        type="button"
                        disabled={busyKey !== null}
                        onClick={() =>
                          void act(`c-${b.id}`, { action: "confirm", id: b.id }, `Payment received from ${b.name}? This confirms the slot and emails them.`)
                        }
                        className={cn(btn, "bg-[#1fae54] text-white hover:bg-[#178f44]")}
                      >
                        <Check size={14} /> {busyKey === `c-${b.id}` ? "Confirming…" : "Payment received — Confirm"}
                      </button>
                    )}
                    {canCancel && (
                      <button
                        type="button"
                        disabled={busyKey !== null}
                        onClick={() =>
                          void act(`x-${b.id}`, { action: "cancel", id: b.id }, `Cancel ${b.name}'s booking? The day is released and they are emailed.`)
                        }
                        className={cn(btn, "border border-brick/40 text-brick hover:bg-brick/5")}
                      >
                        <X size={14} /> Cancel
                      </button>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      ) : (
        <section className="mt-6">
          <p className="text-sm text-ink-muted">
            Block a day when the advisor is unavailable, and unblock it later. Days held by a student or already
            confirmed can be released by cancelling the booking.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(data?.days ?? []).map((day) => {
              const info = describeDate(day.date);
              const stateLabel = {
                free: "Free",
                blocked: "Blocked by you",
                held: `Held${day.name ? ` · ${day.name}` : ""}`,
                confirmed: `Confirmed${day.name ? ` · ${day.name}` : ""}`,
              }[day.state];
              return (
                <div key={day.date} className={cn(card, "flex items-center justify-between gap-3 p-4")}>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                      <CalendarCheck size={14} className="text-gold" /> {info.weekday}, {info.day} {info.month}
                    </p>
                    <p
                      className={cn(
                        "truncate text-xs font-semibold",
                        day.state === "free" ? "text-[#157a3b]" : day.state === "blocked" ? "text-ink-muted" : "text-[#8a6212]",
                      )}
                    >
                      {stateLabel}
                    </p>
                  </div>
                  {(day.state === "free" || day.state === "blocked") && (
                    <button
                      type="button"
                      disabled={busyKey !== null}
                      onClick={() => void act(`d-${day.date}`, { action: day.state === "free" ? "block" : "unblock", date: day.date })}
                      className={cn(btn, "shrink-0 border border-line text-ink hover:border-ink")}
                    >
                      {day.state === "free" ? "Block" : "Unblock"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
