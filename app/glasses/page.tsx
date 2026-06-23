"use client";

import { useState } from "react";
import { workflowSteps } from "@/lib/mockData";
import { useDpadFocus } from "@/hooks/useDpadFocus";
import "./glasses.css";

export default function GlassesPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [escalated, setEscalated] = useState(false);
  useDpadFocus();

  const step = workflowSteps[activeIndex];
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === workflowSteps.length - 1;

  return (
    <div className="glasses-app">
      <header className="glasses-header">
        <h1>{step.title}</h1>
        <span className="glasses-step-count">
          Step {activeIndex + 1} / {workflowSteps.length}
        </span>
      </header>
      <div className="glasses-content">
        <p className="glasses-step-description">{step.description}</p>
        {step.warning ? <div className="glasses-warning">{step.warning}</div> : null}
        {escalated ? (
          <div className="glasses-escalation">Escalation flagged — review with a senior technician.</div>
        ) : null}
      </div>
      <nav className="glasses-nav">
        <button
          type="button"
          className="focusable"
          disabled={isFirst}
          onClick={() => setActiveIndex((index) => Math.max(0, index - 1))}
        >
          Previous
        </button>
        <button
          type="button"
          className="focusable"
          disabled={isLast}
          onClick={() => setActiveIndex((index) => Math.min(workflowSteps.length - 1, index + 1))}
        >
          Next
        </button>
        <button
          type="button"
          className={`focusable danger ${escalated ? "active" : ""}`}
          onClick={() => setEscalated((value) => !value)}
        >
          {escalated ? "Cancel escalate" : "Escalate"}
        </button>
      </nav>
    </div>
  );
}
