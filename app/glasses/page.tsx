"use client";

import { useEffect, useState } from "react";
import { workflowSteps } from "@/lib/mockData";
import { useDpadFocus } from "@/hooks/useDpadFocus";
import GlassesView from "@/components/GlassesView";

export default function GlassesPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [escalated, setEscalated] = useState(false);
  useDpadFocus();

  useEffect(() => {
    fetch("/api/glasses-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activeIndex, escalated }),
    }).catch(() => {});
  }, [activeIndex, escalated]);

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
