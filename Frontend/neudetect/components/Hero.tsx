import Image from "next/image";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-16 px-8 py-24 lg:grid-cols-2">

      {/* Left Side */}
      <div>

        <div className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          Explainable AI for Brain MRI Analysis
        </div>


        <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight text-slate-900">
          Reliable Brain Tumor Detection with Explainable AI
        </h1>


        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
          Upload MRI scans, receive AI-assisted predictions, and understand
          decisions through Grad-CAM visual explanations designed for
          transparent clinical support.
        </p>


        <div className="mt-10 flex flex-wrap gap-4">

          <button className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700">
            Analyze MRI
          </button>


          <button className="rounded-xl border border-slate-300 px-7 py-3 font-semibold text-slate-700 transition hover:bg-slate-100">
            View Demo
          </button>

        </div>

      </div>



      {/* MRI Preview Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">


        <div className="overflow-hidden rounded-2xl bg-slate-100">

          <Image
            src="/images/Brain_Tumor_MRI.jpg"
            alt="Brain MRI scan"
            width={600}
            height={600}
            className="h-80 w-full object-cover"
          />

        </div>


        <div className="mt-6 flex items-center justify-between">

          <div>

            <p className="text-sm text-slate-500">
              Prediction
            </p>

            <h3 className="text-xl font-bold text-slate-900">
              Glioma
            </h3>

          </div>



          <div className="rounded-xl bg-green-50 px-5 py-3">

            <p className="text-xs text-green-700">
              Confidence
            </p>

            <p className="text-xl font-bold text-green-700">
              98.4%
            </p>

          </div>


        </div>



        <div className="mt-6 rounded-xl bg-slate-50 p-4">

          <p className="font-medium text-slate-800">
            Grad-CAM Explanation
          </p>

          <p className="mt-2 text-sm text-slate-500">
            AI attention regions will appear here after analysis.
          </p>

        </div>


      </div>


    </section>
  );
}