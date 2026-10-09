"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import PredictionCard from "@/components/result/PredictionCard";

type PatientData = {
  name: string;
  age: string;
  gender: string;
};

type AnalysisData = {
  id: number;
  prediction: string;
  confidence: number;
  mri_url?: string;
  gradcam_url?: string;
  patient?: PatientData;
  fileName?: string;
  analyzedAt?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function ResultPage() {
  const router = useRouter();

  const [analysis, setAnalysis] =
    useState<AnalysisData | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadAnalysis() {
      try {
        setIsLoading(true);
        setError("");

        const token = sessionStorage.getItem(
          "neudetect_access_token"
        );

        if (!token) {
          router.replace("/login");
          return;
        }

        const params = new URLSearchParams(
          window.location.search
        );

        const analysisId =
          params.get("id");

        if (!analysisId) {
          setError(
            "No analysis was specified."
          );
          return;
        }

        const response = await fetch(
          `${API_URL}/analyses/${analysisId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        if (response.status === 401) {
          sessionStorage.removeItem(
            "neudetect_access_token"
          );

          sessionStorage.removeItem(
            "neudetect_user"
          );

          router.replace("/login");
          return;
        }

        if (response.status === 404) {
          setError(
            "This analysis could not be found or you do not have access to it."
          );
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Failed to load analysis: ${response.status}`
          );
        }

        const data: AnalysisData =
          await response.json();

        setAnalysis(data);
      } catch (loadError) {
        console.error(
          "Could not load analysis result:",
          loadError
        );

        setError(
          "We could not load this analysis. Please make sure the NeuDetect backend is running."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalysis();
  }, [router]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading analysis result...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !analysis) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v5" />
                <path d="M12 16h.01" />
              </svg>
            </div>

            <h1 className="mt-5 text-lg font-semibold text-slate-900">
              Unable to load analysis
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error ||
                "This analysis is unavailable."}
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/history")
              }
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Back to History
            </button>
          </div>
        </div>
      </main>
    );
  }

  const gradcamUrl = analysis.gradcam_url
    ? analysis.gradcam_url.startsWith("http")
      ? analysis.gradcam_url
      : `${API_URL}${analysis.gradcam_url}`
    : undefined;

  const mriUrl = analysis.mri_url
    ? analysis.mri_url.startsWith("http")
      ? analysis.mri_url
      : `${API_URL}${analysis.mri_url}`
    : undefined;

  const analyzedDate =
    analysis.analyzedAt
      ? new Date(
          analysis.analyzedAt
        ).toLocaleString()
      : "Not available";

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Header */}

      <header className="mb-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
              Analysis Result
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              MRI Analysis
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Review the model prediction and visual
              explanation generated from the submitted MRI.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/upload")
            }
            className="w-fit rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            New analysis
          </button>

        </div>
      </header>

      {/* Patient Summary */}

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-600">
              {getInitials(
                analysis.patient?.name
              )}
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Patient
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                {analysis.patient?.name ||
                  "Patient"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {analysis.patient?.age ||
                  "â€”"}{" "}
                years

                <span className="mx-2 text-slate-300">
                  â€¢
                </span>

                {analysis.patient?.gender ||
                  "â€”"}
              </p>
            </div>

          </div>

          <div className="text-left sm:text-right">

            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Analysis completed
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {analyzedDate}
            </p>

            {analysis.fileName && (
              <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                {analysis.fileName}
              </p>
            )}

          </div>

        </div>

      </section>

      {/* AI Assessment */}

      <section className="mb-8">
        <PredictionCard
          prediction={analysis.prediction}
          confidence={analysis.confidence}
        />
      </section>

      {/* Visual Analysis */}

      <section className="mb-8">

        <div className="mb-5">

          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
            Explainable AI
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Visual analysis
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Compare the original MRI with the regions that received
            stronger attention from the model.
          </p>

        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Original MRI */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-6 py-5">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Source image
                  </p>

                  <h3 className="mt-1 text-base font-semibold text-slate-900">
                    Original MRI
                  </h3>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                  Uploaded scan
                </span>

              </div>

            </div>

            <div className="bg-slate-950 p-4 sm:p-6">

              <div className="flex min-h-[360px] items-center justify-center overflow-hidden rounded-xl">

                {mriUrl ? (
                  <img
                    src={mriUrl}
                    alt={`Original MRI scan for ${
                      analysis.patient?.name ||
                      "patient"
                    }`}
                    className="max-h-[560px] w-full object-contain"
                  />
                ) : (
                  <UnavailableImage
                    title="MRI unavailable"
                    description="The original uploaded image could not be loaded."
                  />
                )}

              </div>

            </div>

            <div className="border-t border-slate-100 px-6 py-4">

              <p className="text-xs leading-5 text-slate-500">
                Original image submitted for this analysis.
              </p>

            </div>

          </section>

          {/* Grad-CAM */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-6 py-5">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Model explanation
                  </p>

                  <h3 className="mt-1 text-base font-semibold text-slate-900">
                    AI attention
                  </h3>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  Grad-CAM
                </span>

              </div>

            </div>

            <div className="bg-slate-950 p-4 sm:p-6">

              <div className="flex min-h-[360px] items-center justify-center overflow-hidden rounded-xl">

                {gradcamUrl ? (
                  <img
                    src={gradcamUrl}
                    alt="Grad-CAM visualization showing regions influencing the model prediction"
                    className="max-h-[560px] w-full object-contain"
                  />
                ) : (
                  <UnavailableImage
                    title="Visualization unavailable"
                    description="A Grad-CAM visualization was not returned for this analysis."
                  />
                )}

              </div>

            </div>

            <div className="border-t border-slate-100 px-6 py-4">

              <p className="text-xs leading-5 text-slate-500">
                Regions receiving stronger visual attention from the model.
              </p>

            </div>

          </section>

        </div>

        {/* Explanation note */}

        <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">

          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">

            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5" />
              <path d="M12 8h.01" />
            </svg>

          </div>

          <div>

            <p className="text-sm font-medium text-slate-800">
              How to read the visualization
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Grad-CAM highlights regions that contributed
              to the model&apos;s prediction. These highlighted
              areas are not confirmed tumor boundaries and
              should not be interpreted as a medical diagnosis.
            </p>

          </div>

        </div>

      </section>

      {/* Next Action */}

      <section className="border-t border-slate-200 pt-8">

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Continue with another scan
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Start a new analysis from the upload workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/upload")
            }
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow"
          >
            Analyze another MRI
          </button>

        </div>

      </section>

      {/* Disclaimer */}

      <p className="mt-8 text-center text-xs leading-5 text-slate-400">
        NeuDetect provides AI-assisted analysis for research
        and decision-support purposes. Results should not be used
        as a substitute for professional medical diagnosis.
      </p>

    </main>
  );
}

function UnavailableImage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-xs px-6 text-center">

      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">

        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
          />

          <path d="M8 15l2.5-3 2 2 2.5-3 3 4" />

        </svg>

      </div>

      <p className="mt-4 text-sm font-medium text-white">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-400">
        {description}
      </p>

    </div>
  );
}

function getInitials(name?: string) {
  if (!name?.trim()) {
    return "PT";
  }

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    words[0][0] +
    words[words.length - 1][0]
  ).toUpperCase();
}
