export default function DashboardHeader() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome Back
        </h1>

        <p className="text-slate-500">
          Brain MRI Analysis Dashboard
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold text-slate-900">
            Dr. Mahnoor
          </p>

          <p className="text-sm text-slate-500">
            Radiologist
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
          M
        </div>
      </div>
    </header>
  );
}