"use client";

import { useEffect, useState } from "react";

export type StampState = "idle" | "loading" | "error" | "success";

const CONFIG: Record<
  Exclude<StampState, "idle">,
  { label: string; color: string }
> = {
  loading: { label: "Vérification…", color: "#1B2A4A" },
  error: { label: "Refusé", color: "#B23A2E" },
  success: { label: "Validé", color: "#2F6B4F" },
};

/**
 * Renders like a rubber stamp: unfilled while pending, then "thumped" down
 * onto the page in ink once the outcome (validé / refusé) is known.
 */
export default function StampStatus({ state }: { state: StampState }) {
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    setSettled(false);
    if (state === "idle") return;
    const t = setTimeout(() => setSettled(true), 20);
    return () => clearTimeout(t);
  }, [state]);

  if (state === "idle") return null;

  const cfg = CONFIG[state];
  const inked = state !== "loading";

  return (
    <span
      aria-live="polite"
      className="pointer-events-none inline-flex select-none items-center justify-center whitespace-nowrap rounded-[3px] border-2 px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 ease-out"
      style={{
        color: cfg.color,
        borderColor: cfg.color,
        backgroundColor: inked ? `${cfg.color}14` : "transparent",
        transform: settled
          ? "scale(1) rotate(-4deg)"
          : "scale(1.6) rotate(-14deg)",
        opacity: settled ? 1 : 0,
      }}
    >
      {cfg.label}
    </span>
  );
}
