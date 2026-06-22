export default function Navigation() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">IBM Technician</p>
          <h1 className="text-xl font-semibold text-slate-900">Technician of the Future</h1>
        </div>
        <nav className="flex gap-3 text-sm text-slate-600">
          <a href="#workflow" className="hover:text-slate-900">Workflow</a>
          <a href="#preview" className="hover:text-slate-900">Preview</a>
          <a href="#report" className="hover:text-slate-900">Report</a>
        </nav>
      </div>
    </header>
  );
}
