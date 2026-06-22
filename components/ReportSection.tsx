type Props = {
  report: string | null;
};

export default function ReportSection({ report }: Props) {
  return (
    <section id="report" className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Report</p>
        <h2 className="text-2xl font-semibold text-slate-900">Incident summary</h2>
        {report ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
            <pre className="whitespace-pre-wrap text-sm leading-6">{report}</pre>
          </div>
        ) : (
          <p className="text-slate-600">Submit the form to see a technician report summary here.</p>
        )}
      </div>
    </section>
  );
}
