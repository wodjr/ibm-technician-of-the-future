"use client";

import { useEffect, useState } from "react";
import GlassesView from "@/components/GlassesView";
import type { GlassesState } from "@/lib/glassesState";

const POLL_INTERVAL_MS = 1000;

export default function CastPage() {
  const [state, setState] = useState<GlassesState>({ activeIndex: 0, escalated: false });

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const response = await fetch("/api/glasses-state", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled) setState(data);
      } catch {
        // Transient network error — keep showing the last known state.
      }
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">Live mirror of glasses display</p>
      <GlassesView activeIndex={state.activeIndex} escalated={state.escalated} embedded />
    </div>
  );
}
