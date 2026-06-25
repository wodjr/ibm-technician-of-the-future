"use client";

import { useEffect, useRef, useState } from "react";
import { useDpadFocus } from "@/hooks/useDpadFocus";
import GlassesView from "@/components/GlassesView";
import type { GlassesState } from "@/lib/glassesState";
import { workflowSteps } from "@/lib/mockData";

const POLL_INTERVAL_MS = 1000;

export default function GlassesPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [escalated, setEscalated] = useState(false);
  const hasLoadedInitialState = useRef(false);
  useDpadFocus();

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      try {
        const response = await fetch("/api/glasses-state", { cache: "no-store" });
        if (response.ok) {
          const data: GlassesState = await response.json();
          if (!cancelled) {
            setActiveIndex(data.activeIndex);
            setEscalated(data.escalated);
          }
        }
      } finally {
        hasLoadedInitialState.current = true;
      }
    }

    loadInitial();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // Skip the first run — that's the initial render before loadInitial()
    // has had a chance to seed real state, and would otherwise clobber
    // whatever the phone already set.
    if (!hasLoadedInitialState.current) return;

    fetch("/api/glasses-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activeIndex, escalated }),
    }).catch(() => {});
  }, [activeIndex, escalated]);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const response = await fetch("/api/glasses-state", { cache: "no-store" });
        if (!response.ok) return;
        const data: GlassesState = await response.json();
        if (cancelled) return;
        setActiveIndex(data.activeIndex);
        setEscalated(data.escalated);
      } catch {
        // Transient network error — keep showing the last known state.
      }
    }

    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <GlassesView
      activeIndex={activeIndex}
      escalated={escalated}
      onPrevious={() => setActiveIndex((index) => Math.max(0, index - 1))}
      onNext={() => setActiveIndex((index) => Math.min(workflowSteps.length - 1, index + 1))}
      onToggleEscalate={() => setEscalated((value) => !value)}
    />
  );
}
