"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarCheck,
  CalendarX2,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Timer,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { BOOKING_TIME_LABEL, BOOKING_TIME_ZONE_LABEL, CONSULTATION_FEE_EUR, describeDate } from "@/lib/booking";
import type { AdminBooking, AdminDay } from "@/app/api/admin/bookings/route";

type Data = { bookings: AdminBooking[]; days: AdminDay[] };
type Display = AdminBooking["display"];
type Filter = Display | "all";

const STATUS: Record<Display, { label: string; pill: string; bar: string; dot: string }> = {
  "awaiting-payment": { label: "Awaiting payment", pill: "bg-gold/15 text-[#8a6212]", bar: "bg-gold", dot: "bg-gold" },
  confirmed: { label: "Confirmed", pill: "bg-[#1fae54]/12 text-[#157a3b]", bar: "bg-[#1fae54]", dot: "bg-[#1fae54]" },
  expired: { label: "Hold expired", pill: "bg-ink/8 text-ink-muted", bar: "bg-ink/25", dot: "bg-ink/30" },
  cancelled: { label: "Cancelled", pill: "bg-brick/10 text-brick", bar: "bg-brick/50", dot: "bg-brick/60" },
};

const inputClass =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted/60 focus:border-ink";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

function Shell({ children }: { children: React.ReactNode }) {
  // Covers the public site header/footer so the admin feels like its own app.
  return <div className="fixed inset-0 z-[100] overflow-y-auto bg-paper">{children}</div>;
}

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5 font-display text-lg font-semibold", dark ? "text-paper" : "text-ink")}>
      <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold", dark ? "bg-paper/10 text-paper" : "bg-charcoal text-paper")}>
        GC
      </span>
      <span>
        Germany<span className="text-brick">Chalo</span>
      </span>
    </div>
  );
}

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
    <Shell>
      <div className="flex min-h-full items-center justify-center bg-gradient-to-br from-charcoal via-charcoal to-[#2a1512] px-5 py-10">
        <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-paper p-8 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)]">
          <Logo />
          <div className="mt-7 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brick/10 text-brick">
              <Lock size={20} />
            </span>
            <div>
              <h1 className="font-display text-xl font-semibold text-ink">Admin sign in</h1>
              <p className="text-xs text-ink-muted">Bookings and slot management</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <input type="text" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={inputClass} aria-label="Email" />
            <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={inputClass} aria-label="Password" />
          </div>
          {error && (
            <p role="alert" className="mt-4 flex items-center gap-2 rounded-xl bg-brick/10 px-3 py-2.5 text-sm font-semibold text-brick">
              <AlertCircle size={15} /> {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy || !password || !email}
            className="mt-5 w-full rounded-full bg-brick py-3.5 text-sm font-bold text-paper shadow-[0_14px_30px_-10px_rgba(179,36,28,0.6)] transition-colors hover:bg-brick-dark disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </Shell>
  );
}

function Countdown({ until, now }: { until: string; now: number }) {
  const left = Math.max(0, Math.floor((new Date(until).getTime() - now) / 1000));
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <span className="inline-flex items-center gap-1 font-mono text-xs font-bold tabular-nums text-[#8a6212]">
      <Timer size={13} /> {mm}:{ss} left
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  onClick,
  active,
}: {
  icon: typeof Clock;
  label: string;
  value: number;
  tone: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 rounded-2xl border bg-paper-raised p-4 text-left transition-all hover:-translate-y-0.5",
        active ? "border-ink shadow-[0_14px_30px_-18px_rgba(26,22,19,0.4)]" : "border-line",
      )}
    >
      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", tone)}>
        <Icon size={20} />
      </span>
      <span>
        <span className="block font-display text-2xl font-semibold leading-none text-ink">{value}</span>
        <span className="mt-1 block text-xs font-semibold text-ink-muted">{label}</span>
      </span>
    </button>
  );
}

function BookingCard({
  booking,
  now,
  busyKey,
  onAct,
}: {
  booking: AdminBooking;
  now: number;
  busyKey: string | null;
  onAct: (key: string, body: Record<string, string>, confirmText: string) => void;
}) {
  const [open, setOpen] = useState(booking.display === "awaiting-payment");
  const status = STATUS[booking.display];
  const info = describeDate(booking.date);
  const canConfirm = booking.display === "awaiting-payment" || booking.display === "expired";
  const canCancel = booking.display !== "cancelled";
  const details = [
    ["Qualification", `${booking.qualification} · ${booking.score}`],
    ["Wants", `${booking.degree} · ${booking.fieldOfStudy}`],
    ["Language", booking.languageTest && booking.languageTest !== "Not taken yet" ? `${booking.languageTest}${booking.languageScore ? ` — ${booking.languageScore}` : ""}` : ""],
    ["Intake", booking.intake],
    ["Message", booking.topic],
  ].filter(([, v]) => v);

  return (
    <article className="relative overflow-hidden rounded-2xl border border-line bg-paper-raised">
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-1.5", status.bar)} />
      <div className="p-5 pl-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-charcoal font-display text-sm font-semibold text-paper">
            {initials(booking.name)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h2 className="font-display text-lg font-semibold text-ink">{booking.name}</h2>
              <span className={cn("rounded-full px-3 py-1 text-[11px] font-bold", status.pill)}>{status.label}</span>
              {booking.display === "awaiting-payment" && <Countdown until={booking.expiresAt} now={now} />}
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
              <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
                <CalendarCheck size={14} className="text-gold" /> {info.weekday}, {info.day} {info.month} · {BOOKING_TIME_LABEL}
              </span>
              <span>€{CONSULTATION_FEE_EUR}</span>
              <span className="rounded-md bg-ink/[0.06] px-2 py-0.5 font-mono text-xs font-bold text-ink">{booking.reference}</span>
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href={`mailto:${booking.email}`} className="inline-flex items-center gap-1.5 font-semibold text-ink hover:text-brick">
            <Mail size={14} className="text-ink-muted" /> {booking.email}
          </a>
          <a href={`tel:${booking.phone}`} className="inline-flex items-center gap-1.5 font-semibold text-ink hover:text-brick">
            <Phone size={14} className="text-ink-muted" /> {booking.phone}
          </a>
          <span className="inline-flex items-center gap-1.5 text-ink-muted">
            <MapPin size={14} /> {booking.city}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-ink-muted hover:text-ink"
        >
          {open ? "Hide" : "Show"} profile details <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
        </button>
        {open && (
          <dl className="mt-3 grid gap-x-8 gap-y-2 rounded-xl bg-paper p-4 text-sm sm:grid-cols-2">
            {details.map(([k, v]) => (
              <div key={k} className="min-w-0">
                <dt className="text-[11px] font-bold uppercase tracking-wide text-ink-muted">{k}</dt>
                <dd className="break-words font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        {(canConfirm || canCancel) && (
          <div className="mt-5 flex flex-wrap gap-2.5 border-t border-line pt-4">
            {canConfirm && (
              <button
                type="button"
                disabled={busyKey !== null}
                onClick={() => onAct(`c-${booking.id}`, { action: "confirm", id: booking.id }, `Payment received from ${booking.name}? This confirms the slot and emails them.`)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#1fae54] px-5 py-2.5 text-xs font-bold text-white shadow-[0_10px_22px_-10px_rgba(31,174,84,0.7)] transition-colors hover:bg-[#178f44] disabled:opacity-50"
              >
                <Check size={14} strokeWidth={3} /> {busyKey === `c-${booking.id}` ? "Confirming…" : "Payment received — Confirm"}
              </button>
            )}
            {canCancel && (
              <button
                type="button"
                disabled={busyKey !== null}
                onClick={() => onAct(`x-${booking.id}`, { action: "cancel", id: booking.id }, `Cancel ${booking.name}'s booking? The day is released and they are emailed.`)}
                className="inline-flex items-center gap-1.5 rounded-full border border-brick/40 px-5 py-2.5 text-xs font-bold text-brick transition-colors hover:bg-brick/5 disabled:opacity-50"
              >
                <X size={14} /> Cancel booking
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

const DAY_STYLE: Record<AdminDay["state"], { label: string; tile: string; text: string }> = {
  free: { label: "Free", tile: "border-[#1fae54]/30 bg-[#1fae54]/8 hover:border-[#1fae54]", text: "text-[#157a3b]" },
  held: { label: "Held", tile: "border-gold/40 bg-gold/10", text: "text-[#8a6212]" },
  confirmed: { label: "Booked", tile: "border-brick/30 bg-brick/8", text: "text-brick" },
  blocked: { label: "Blocked", tile: "border-ink/15 bg-ink/[0.06] hover:border-ink/40", text: "text-ink-muted" },
};

export function AdminPanel() {
  const [data, setData] = useState<Data | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [tab, setTab] = useState<"bookings" | "slots">("bookings");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [now, setNow] = useState(() => Date.now());

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
    const refresh = setInterval(run, 30_000);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      cancelled = true;
      clearInterval(refresh);
      clearInterval(tick);
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

  const counts = useMemo(() => {
    const all = data?.bookings ?? [];
    const count = (d: Display) => all.filter((b) => b.display === d).length;
    return {
      awaiting: count("awaiting-payment"),
      confirmed: count("confirmed"),
      expired: count("expired"),
      cancelled: count("cancelled"),
      free: (data?.days ?? []).filter((d) => d.state === "free").length,
    };
  }, [data]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data?.bookings ?? []).filter((b) => {
      if (filter !== "all" && b.display !== filter) return false;
      if (filter === "all" && b.display === "cancelled") return false;
      if (!q) return true;
      return [b.name, b.email, b.phone, b.city, b.reference].some((v) => v.toLowerCase().includes(q));
    });
  }, [data, filter, query]);

  if (authed === null) {
    return (
      <Shell>
        <p className="pt-40 text-center text-sm text-ink-muted">Loading…</p>
      </Shell>
    );
  }
  if (!authed) return <Login onDone={() => void load()} />;

  const FILTERS: { id: Filter; label: string }[] = [
    { id: "all", label: "Active" },
    { id: "awaiting-payment", label: "Awaiting payment" },
    { id: "confirmed", label: "Confirmed" },
    { id: "expired", label: "Expired" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (
    <Shell>
      <header className="sticky top-0 z-10 bg-charcoal text-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3.5">
          <div className="flex items-center gap-4">
            <Logo dark />
            <span className="hidden rounded-full bg-paper/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-paper/70 sm:inline">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => void load()} aria-label="Refresh" className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 text-paper/80 transition-colors hover:border-paper hover:text-paper">
              <RefreshCw size={15} />
            </button>
            <button type="button" onClick={() => void logout()} className="inline-flex h-10 items-center gap-2 rounded-full border border-paper/20 px-4 text-xs font-bold text-paper/80 transition-colors hover:border-paper hover:text-paper">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-8">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink">Bookings</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Sessions at {BOOKING_TIME_LABEL} {BOOKING_TIME_ZONE_LABEL} · updates every 30 seconds
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard icon={Clock} label="Awaiting payment" value={counts.awaiting} tone="bg-gold/15 text-[#8a6212]" active={tab === "bookings" && filter === "awaiting-payment"} onClick={() => { setTab("bookings"); setFilter("awaiting-payment"); }} />
          <StatCard icon={CheckCircle2} label="Confirmed" value={counts.confirmed} tone="bg-[#1fae54]/12 text-[#157a3b]" active={tab === "bookings" && filter === "confirmed"} onClick={() => { setTab("bookings"); setFilter("confirmed"); }} />
          <StatCard icon={CalendarX2} label="Expired holds" value={counts.expired} tone="bg-ink/8 text-ink-muted" active={tab === "bookings" && filter === "expired"} onClick={() => { setTab("bookings"); setFilter("expired"); }} />
          <StatCard icon={CalendarCheck} label="Free days (next 30)" value={counts.free} tone="bg-brick/10 text-brick" active={tab === "slots"} onClick={() => setTab("slots")} />
        </div>

        <div role="tablist" className="mt-8 inline-flex rounded-full border border-line bg-paper-raised p-1">
          {(["bookings", "slots"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-bold transition-colors",
                tab === t ? "bg-charcoal text-paper" : "text-ink-muted hover:text-ink",
              )}
            >
              {t === "bookings" ? "Bookings" : "Manage slots"}
            </button>
          ))}
        </div>

        {notice && (
          <p
            role="status"
            className={cn(
              "mt-5 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold",
              notice.kind === "ok" ? "bg-[#1fae54]/10 text-[#157a3b]" : "bg-brick/10 text-brick",
            )}
          >
            {notice.kind === "ok" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />} {notice.text}
          </p>
        )}

        {tab === "bookings" ? (
          <section className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
                <Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, phone, reference" className={cn(inputClass, "py-2.5 pl-10")} aria-label="Search bookings" />
              </div>
              <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      "shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-colors",
                      filter === f.id ? "border-brick bg-brick text-paper" : "border-line bg-paper-raised text-ink hover:border-ink",
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {visible.length === 0 && (
                <div className="rounded-2xl border border-dashed border-line px-6 py-14 text-center">
                  <CalendarCheck size={28} className="mx-auto text-ink-muted/60" />
                  <p className="mt-3 font-display text-lg font-semibold text-ink">Nothing here yet</p>
                  <p className="text-sm text-ink-muted">New reservations appear here as soon as a student books.</p>
                </div>
              )}
              {visible.map((b) => (
                <BookingCard key={b.id} booking={b} now={now} busyKey={busyKey} onAct={(k, body, text) => void act(k, body, text)} />
              ))}
            </div>
          </section>
        ) : (
          <section className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-xl text-sm text-ink-muted">
                Tap a free day to block it when the advisor is away, and tap a blocked day to open it again. Held and
                booked days are released by cancelling the booking.
              </p>
              <div className="flex flex-wrap gap-3 text-xs font-semibold text-ink-muted">
                {(Object.keys(DAY_STYLE) as AdminDay["state"][]).map((s) => (
                  <span key={s} className="inline-flex items-center gap-1.5">
                    <span className={cn("h-2.5 w-2.5 rounded-full border", DAY_STYLE[s].tile)} /> {DAY_STYLE[s].label}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {(data?.days ?? []).map((day) => {
                const info = describeDate(day.date);
                const style = DAY_STYLE[day.state];
                const toggleable = day.state === "free" || day.state === "blocked";
                return (
                  <button
                    key={day.date}
                    type="button"
                    disabled={!toggleable || busyKey !== null}
                    onClick={() => void act(`d-${day.date}`, { action: day.state === "free" ? "block" : "unblock", date: day.date })}
                    className={cn(
                      "rounded-2xl border p-4 text-left transition-all disabled:cursor-default",
                      style.tile,
                      toggleable && "hover:-translate-y-0.5",
                    )}
                  >
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted">{info.weekday}</span>
                    <span className="block font-display text-3xl font-semibold leading-tight text-ink">{info.day}</span>
                    <span className="block text-xs text-ink-muted">{info.month}</span>
                    <span className={cn("mt-2 block truncate text-xs font-bold", style.text)}>
                      {style.label}
                      {day.name ? ` · ${day.name}` : ""}
                    </span>
                    {toggleable && (
                      <span className="mt-1 block text-[11px] font-semibold text-ink-muted/80">
                        {day.state === "free" ? "Tap to block" : "Tap to open"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </Shell>
  );
}
