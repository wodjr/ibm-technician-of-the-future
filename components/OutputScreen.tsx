import type { DiagnosisResult } from "@/types/technician";

type Props = {
  result: DiagnosisResult | null;
  activeStep: string;
};

export default function OutputScreen({ result, activeStep }: Props) {
  if (!result) {
    return (
      <section id="preview" className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Preview</p>
          <h2 className="text-2xl font-semibold text-slate-900">Guidance output</h2>
          <p className="text-slate-600">Fill in the form to generate a technician-friendly diagnosis and next step recommendation.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="preview" className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Preview</p>
          <h2 className="text-2xl font-semibold text-slate-900">Guidance output</h2>
        </div>
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Current step</p>
              <p className="text-lg font-semibold text-slate-900">{activeStep}</p>
            </div>
            <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-pink-700">
              Recommendation
            </span>
          </div>
          <p className="text-base leading-7 text-slate-700">{result.summary}</p>
          <div className="rounded-3xl bg-white p-4 shadow-sm shadow-slate-100">
            <p className="text-sm text-slate-500">Next recommended action</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{result.action}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
