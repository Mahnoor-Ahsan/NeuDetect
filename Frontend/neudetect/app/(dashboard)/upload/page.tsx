"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import MRIUploadCard from "@/components/upload/MRIUploadCard";
import PatientInfoForm from "@/components/upload/PatientInfoForm";

type PatientData = {
  name: string;
  age: string;
  gender: string;
};

type AnalysisResult = {
  id: number;
  prediction: string;
  confidence: number;
  mri_url?: string;
  gradcam_url?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);

  const [patientData, setPatientData] =
    useState<PatientData>({
      name: "",
      age: "",
      gender: "",
    });

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [error, setError] = useState("");

  async function handleAnalyze() {
    setError("");

    if (!file) {
      setError(
        "Please select a brain MRI image before continuing."
      );
      return;
    }

    if (!patientData.name.trim()) {
      setError(
        "Please enter the patient name."
      );
      return;
    }

    if (!patientData.age) {
      setError(
        "Please enter the patient age."
      );
      return;
    }

    if (!patientData.gender) {
      setError(
        "Please select the patient gender."
      );
      return;
    }

    try {
      setIsAnalyzing(true);

      const token = sessionStorage.getItem(
        "neudetect_access_token"
      );

      if (!token) {
        router.replace("/login");
        return;
      }

      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "patient_name",
        patientData.name
      );
      formData.append(
        "patient_age",
        patientData.age
      );
      formData.append(
        "patient_gender",
        patientData.gender
      );

      const response = await fetch(
        `${API_URL}/analyze/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
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

      if (!response.ok) {
        let message =
          `Analysis failed with status ${response.status}`;

        try {
          const errorData =
            await response.json();

          if (errorData?.detail) {
            message = errorData.detail;
          }
        } catch {
          // Keep the default error message.
        }

        throw new Error(message);
      }

      const result: AnalysisResult =
        await response.json();

      if (!result.id) {
        throw new Error(
          "The analysis was completed but no analysis ID was returned."
        );
      }

      router.push(
        `/result?id=${result.id}`
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "We could not analyze this MRI. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl">
      {/* Page heading */}

      <div className="mb-8">
        <div className="mb-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
          NEW ANALYSIS
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Analyze a brain MRI
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Upload an MRI scan and provide basic patient
          information to receive an AI-assisted brain
          tumor analysis with an explainable Grad-CAM
          visualization.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <svg
            className="mt-0.5 shrink-0"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5" />
            <path d="M12 16h.01" />
          </svg>

          <span>{error}</span>
        </div>
      )}

      {/* Main workspace */}

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* MRI upload */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
              Step 01
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900">
              Select MRI scan
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Upload a clear brain MRI image for
              analysis.
            </p>
          </div>

          <MRIUploadCard
            file={file}
            onFileSelect={setFile}
          />
        </section>

        {/* Patient information */}

        <section>
          <div className="mb-3 px-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
              Step 02
            </p>
          </div>

          <PatientInfoForm
            data={patientData}
            onChange={setPatientData}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            disabled={!file}
          />
        </section>
      </div>

      {/* Process explanation */}

      <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
        <div className="grid gap-6 md:grid-cols-3">
          <ProcessStep
            number="01"
            title="Upload"
            description="Select a compatible brain MRI image from your device."
          />

          <ProcessStep
            number="02"
            title="Analyze"
            description="NeuDetect processes the image using the trained ResNet50 model."
          />

          <ProcessStep
            number="03"
            title="Understand"
            description="Review the prediction, confidence and Grad-CAM explanation."
          />
        </div>
      </section>
    </main>
  );
}

function ProcessStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">
        {number}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}
