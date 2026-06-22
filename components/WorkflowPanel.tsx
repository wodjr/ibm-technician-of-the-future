import type { WorkflowStep } from "@/lib/mockData";

type Props = {
  steps: WorkflowStep[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export default function WorkflowPanel({ steps, activeIndex, onSelect }: Props) {
  return (
    <section id="workflow" className="space-y-4 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Workflow</p>
          <h2 className="text-2xl font-semibold text-slate-900">Step-by-step guidance</h2>
        </div>
      </div>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            onClick={() => onSelect(index)}
            className={`block w-full rounded-3xl border px-5 py-4 text-left transition ${
              index === activeIndex
                ? "border-pink-500 bg-pink-50"
                : "border-slate-200 bg-slate-50 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-900">Step {index + 1}</span>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600">{step.id}</span>
            </div>
            <p className="mt-3 text-base text-slate-700">{step.title}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
