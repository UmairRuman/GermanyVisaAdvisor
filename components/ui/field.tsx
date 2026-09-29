import type { ReactNode } from "react";

export const fieldInputClass =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-brick focus:shadow-[0_0_0_4px_rgba(179,36,28,0.10)]";

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-ink">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-semibold text-brick">{error}</span>}
    </label>
  );
}
