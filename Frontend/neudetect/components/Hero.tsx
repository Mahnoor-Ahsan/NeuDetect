import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-20 lg:py-24">
      <div>
        <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          Explainable AI for Brain MRI Analysis
        </div>

        <h1 className="mt-7 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          Brain MRI analysis with{" "}
          <span className="text-blue-600">
            explainable AI
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
          NeuDetect provides AI-assisted brain MRI classification
          and Grad-CAM visual explanations, helping users understand
          which image regions influenced the model&apos;s prediction.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <Link
            href="/login"
            className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
          >
            Analyze MRI
          </Link>

          <a
            href="#how-it-works"
            className="rounded-xl border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50"
          >
            How It Works
          </a>
        </div>

        <p className="mt-5 max-w-xl text-xs leading-5 text-slate-400">
          Designed for research and decision-support purposes.
          NeuDetect does not replace professional medical diagnosis.
        </p>
      </div>

      <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
              Example Analysis
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Illustrative result
            </p>
          </div>

          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            AI-assisted
          </span>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src="/images/Brain_Tumor_MRI.jpg"
            alt="Example brain MRI scan"
            width={700}
            height={500}
            priority
            className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] sm:h-80"
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              Prediction
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              Glioma
            </p>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-xs font-medium text-blue-700">
              Confidence
            </p>

            <p className="mt-1 text-lg font-bold text-blue-700">
              98.4%
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Model confidence
            </span>

            <span className="text-xs font-medium text-slate-400">
              Illustrative
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[98.4%] rounded-full bg-blue-600 transition-all duration-700 group-hover:bg-blue-500" />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-colors duration-300 group-hover:border-blue-100">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Grad-CAM explanation
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Visualizes regions that contributed to the prediction.
            </p>
          </div>

          <div className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600">
            AI
          </div>
        </div>
      </div>
    </section>
  );
}