const steps = [
  {
    number: "01",
    title: "Upload MRI",
    description:
      "Upload a brain MRI scan securely through the NeuDetect platform.",
  },
  {
    number: "02",
    title: "AI Prediction",
    description:
      "The deep learning model analyzes the scan and predicts possible tumor types.",
  },
  {
    number: "03",
    title: "Grad-CAM Explanation",
    description:
      "Visual explanations highlight regions influencing the AI decision.",
  },
  {
    number: "04",
    title: "Generate Report",
    description:
      "Receive a structured analysis report with prediction details.",
  },
];


export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="px-8 py-24"
    >

      <div className="mx-auto max-w-7xl">


        <div className="text-center">

          <p className="text-sm font-semibold text-blue-600">
            WORKFLOW
          </p>


          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            How NeuDetect Works
          </h2>


          <p className="mt-4 text-slate-600">
            From MRI upload to explainable AI-powered reporting.
          </p>

        </div>



        <div className="mt-14 grid gap-6 md:grid-cols-4">


          {steps.map((step) => (

            <div
              key={step.number}
              className="relative rounded-2xl border border-slate-200 bg-white p-6"
            >

              <span className="text-sm font-bold text-blue-600">
                {step.number}
              </span>


              <h3 className="mt-4 text-lg font-bold text-slate-900">
                {step.title}
              </h3>


              <p className="mt-3 text-sm leading-6 text-slate-600">
                {step.description}
              </p>


            </div>

          ))}


        </div>


      </div>


    </section>
  );
}