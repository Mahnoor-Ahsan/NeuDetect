"use client";

type GradCAMCardProps = {
  gradcamUrl?: string;
};

export default function GradCAMCard({
  gradcamUrl,
}: GradCAMCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
          Explainable AI
        </p>

        <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
          Model attention visualization
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Grad-CAM highlights image regions that contributed to the
          model&apos;s prediction. It provides an explanation of model
          attention, not a medical diagnosis.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
        {gradcamUrl ? (
          <div className="overflow-hidden rounded-xl bg-slate-950">
            <div className="flex min-h-[360px] items-center justify-center p-4">
              <img
                src={gradcamUrl}
                alt="Grad-CAM visualization of the brain MRI"
                className="max-h-[600px] w-full object-contain"
              />
            </div>
          </div>
        ) : (
          <div className="flex min-h-[360px] items-center justify-center rounded-xl bg-slate-950">
            <div className="px-6 text-center">
              <p className="text-sm font-medium text-white">
                Visualization unavailable
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                The analysis did not return a Grad-CAM visualization.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            What this shows
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Regions receiving stronger visual attention from the model
            during classification.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Important
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Highlighted regions should not be interpreted as confirmed
            tumor boundaries or a clinical diagnosis.
          </p>
        </div>
      </div>
    </section>
  );
}