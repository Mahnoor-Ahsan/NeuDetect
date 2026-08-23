const features = [
  {
    icon: "↑",
    title: "MRI Upload",
    description:
      "Securely upload brain MRI scans for automated AI analysis.",
  },
  {
    icon: "🧠",
    title: "AI Analysis",
    description:
      "Deep learning models analyze MRI patterns and generate predictions.",
  },
  {
    icon: "◉",
    title: "Explainable AI",
    description:
      "Grad-CAM highlights important regions behind the AI decision.",
  },
];


export default function FeatureSection() {
  return (
    <section
      id="features"
      className="bg-slate-50 px-8 py-24"
    >

      <div className="mx-auto max-w-7xl">


        <div className="text-center">

          <p className="text-sm font-semibold text-blue-600">
            FEATURES
          </p>


          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            AI-Powered Brain MRI Workflow
          </h2>


          <p className="mt-4 text-slate-600">
            From MRI upload to explainable clinical insights.
          </p>

        </div>



        <div className="mt-14 grid gap-8 md:grid-cols-3">


          {features.map((feature) => (

            <div
              key={feature.title}
              className="group rounded-2xl border border-slate-200 bg-white p-8 transition hover:-translate-y-1 hover:shadow-lg"
            >


              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl text-blue-600">
                {feature.icon}
              </div>



              <h3 className="mt-6 text-xl font-bold text-slate-900">
                {feature.title}
              </h3>



              <p className="mt-3 leading-7 text-slate-600">
                {feature.description}
              </p>


            </div>

          ))}


        </div>


      </div>


    </section>
  );
}