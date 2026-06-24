import { workflowSteps } from "@/lib/mockData";
import "@/app/glasses/glasses.css";

type Props = {
  activeIndex: number;
  escalated: boolean;
  embedded?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onToggleEscalate?: () => void;
};

export default function GlassesView({
  activeIndex,
  escalated,
  embedded = false,
  onPrevious,
  onNext,
  onToggleEscalate,
}: Props) {
  const step = workflowSteps[activeIndex];
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === workflowSteps.length - 1;

  return (
    <div className={`glasses-app ${embedded ? "glasses-app--embedded" : ""}`}>
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
        <button type="button" className="focusable" disabled={isFirst || !onPrevious} onClick={onPrevious}>
          Previous
        </button>
        <button type="button" className="focusable" disabled={isLast || !onNext} onClick={onNext}>
          Next
        </button>
        <button
          type="button"
          className={`focusable danger ${escalated ? "active" : ""}`}
          disabled={!onToggleEscalate}
          onClick={onToggleEscalate}
        >
          {escalated ? "Cancel escalate" : "Escalate"}
        </button>
      </nav>
    </div>
  );
}
