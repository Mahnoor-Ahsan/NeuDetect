export default function Footer() {
  return (
    <footer
      id="about"
      className="border-t border-slate-200 bg-slate-50 px-6 py-10 sm:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-slate-900">
            NeuDetect
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Explainable AI-based brain MRI analysis.
          </p>
        </div>

        <p className="text-xs leading-5 text-slate-400 sm:max-w-md sm:text-right">
          Research and decision-support project. AI-assisted results
          should not be treated as a substitute for professional
          medical diagnosis.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-slate-200 pt-5 text-xs text-slate-400">
        © 2026 NeuDetect. All rights reserved.
      </div>
    </footer>
  );
}