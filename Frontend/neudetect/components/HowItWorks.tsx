const steps = [
  {
    number: "01",
    title: "Upload MRI",
    description:
      "Select a compatible brain MRI image and enter the associated patient information.",
  },
  {
    number: "02",
    title: "AI Analysis",
    description:
      "NeuDetect sends the image to the backend, where the trained ResNet50 model performs classification.",
  },
  {
    number: "03",
    title: "Explain",
    description:
      "Grad-CAM generates a visual explanation showing regions that influenced the model's prediction.",
  },
  {
    number: "04",
    title: "Review Result",
    description:
      "Review the prediction, confidence, MRI image, explanation and saved analysis history.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="px-6 py-20 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-wide text-blue-600">
            WORKFLOW
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How NeuDetect works
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            From MRI upload to an explainable AI-assisted result.
          </p>
        </div>

        {/* Workflow */}
        <div className="relative mt-14">
          {/* Connecting line on desktop */}
          <div className="absolute left-[12%] right-[12%] top-11 hidden h-px bg-slate-200 lg:block" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
              >
                {/* Step number */}
                <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-500 transition-all duration-300 group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-200">
                  {step.number}
                </div>

                {/* Small active indicator */}
                <div className="mt-5 h-1 w-8 rounded-full bg-slate-200 transition-all duration-300 group-hover:w-16 group-hover:bg-blue-600" />

                <h3 className="mt-5 text-lg font-bold text-slate-900 transition-colors duration-300 group-hover:text-blue-600">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>

                {/* Bottom interaction */}
                <div className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-400 transition-colors duration-300 group-hover:text-blue-600">
                  {step.number}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Actual system pipeline */}
      <div className="mt-16 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
            System Pipeline
          </p>

          <h3 className="mt-2 text-xl font-bold text-slate-900">
            From image to explainable result
          </h3>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 md:flex-row">
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm">
            MRI Scan
          </div>

          <span className="text-blue-500 md:text-lg">→</span>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm">
            ResNet50
          </div>

          <span className="text-blue-500 md:text-lg">→</span>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm">
            Prediction
          </div>

          <span className="text-blue-500 md:text-lg">→</span>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm">
            Grad-CAM
          </div>

          <span className="text-blue-500 md:text-lg">→</span>

          <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 shadow-sm">
            Result
          </div>
        </div>
      </div>
    </div>
    </section >
  );
}