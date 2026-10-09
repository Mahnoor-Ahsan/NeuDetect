const features = [
  {
    number: "01",
    title: "MRI Upload",
    description:
      "Upload a compatible brain MRI image and provide the basic patient information associated with the analysis.",
  },
  {
    number: "02",
    title: "AI Classification",
    description:
      "The trained ResNet50 model analyzes the MRI and produces an AI-assisted classification with a confidence value.",
  },
  {
    number: "03",
    title: "Grad-CAM Explanation",
    description:
      "A Grad-CAM visualization shows image regions that contributed to the model's prediction.",
  },
];

export default function FeatureSection() {
  return (
    <section
      id="features"
      className="bg-slate-50 px-6 py-20 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-wide text-blue-600">
            FEATURES
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            One workflow, three key capabilities
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            NeuDetect combines MRI analysis with model explainability
            and persistent analysis history.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/60"
            >
              <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-blue-600 transition-transform duration-300 group-hover:scale-x-100" />

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                {feature.number}
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-blue-600">
                {feature.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {feature.description}
              </p>

              <div className="mt-6 h-px w-8 bg-slate-200 transition-all duration-300 group-hover:w-12 group-hover:bg-blue-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}