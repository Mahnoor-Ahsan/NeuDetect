"use client";

type PredictionCardProps = {
  prediction: string;
  confidence: number;
};

export default function PredictionCard({
  prediction,
  confidence,
}: PredictionCardProps) {
  const confidencePercent =
    confidence <= 1 ? confidence * 100 : confidence;

  const safeConfidence = Math.min(
    Math.max(confidencePercent, 0),
    100
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {/* Header */}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
          AI Assessment
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Classification generated from the submitted MRI image.
        </p>
      </div>

      {/* Prediction + confidence */}

      <div className="mt-8 grid gap-8 sm:grid-cols-2 sm:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Model prediction
          </p>

          <h2 className="mt-2 text-3xl font-bold capitalize tracking-tight text-slate-950 sm:text-4xl">
            {prediction}
          </h2>
        </div>

        <div className="sm:text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Confidence
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {safeConfidence.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Confidence meter */}

      <div className="mt-7">
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-700 ease-out"
            style={{
              width: `${safeConfidence}%`,
            }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Lower
          </span>

          <span className="text-xs font-medium text-slate-500">
            Model confidence
          </span>

          <span className="text-xs text-slate-400">
            Higher
          </span>
        </div>
      </div>

      {/* Status */}

      <div className="mt-7 flex items-start gap-3 border-t border-slate-100 pt-6">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12l4 4L19 6" />
          </svg>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            Analysis complete
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            This is an AI-assisted model prediction and should not
            be interpreted as a medical diagnosis.
          </p>
        </div>
      </div>
    </section>
  );
}