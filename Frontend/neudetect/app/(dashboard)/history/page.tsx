"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type PatientData = {
  name: string;
  age: string;
  gender: string;
};

type AnalysisRecord = {
  id: number;
  prediction: string;
  confidence: number;
  mri_url?: string;
  gradcam_url?: string;
  patient?: PatientData;
  fileName?: string;
  analyzedAt?: string;
};

type ApiAnalysisRecord = {
  id: number;
  patient?: PatientData;
  prediction: string;
  confidence: number;
  fileName?: string;
  mri_url?: string;
  gradcam_url?: string;
  analyzedAt?: string;
};

export default function HistoryPage() {
  const router = useRouter();

  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem(
      "neudetect_access_token"
    );

    if (!token) {
      router.replace("/login");
      return;
    }

    let cancelled = false;

    async function loadHistory() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/analyses/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            cache: "no-store",
          }
        );

        if (response.status === 401) {
          if (!cancelled) {
            setError(
              "Your session has expired. Please sign in again."
            );
          }

          sessionStorage.removeItem(
            "neudetect_access_token"
          );
          sessionStorage.removeItem("neudetect_user");

          if (!cancelled) {
            router.replace("/login");
          }

          return;
        }

        if (!response.ok) {
          let detail = "";

          try {
            const errorData = await response.json();

            if (
              errorData &&
              typeof errorData.detail === "string"
            ) {
              detail = errorData.detail;
            }
          } catch {
            // Ignore non-JSON error responses.
          }

          throw new Error(
            detail ||
              `Failed to load analyses: ${response.status}`
          );
        }

        const data =
          (await response.json()) as ApiAnalysisRecord[];

        if (cancelled) {
          return;
        }

        setHistory(data);
        setError("");
      } catch (historyError) {
        if (cancelled) {
          return;
        }

        console.error(
          "Could not load analysis history:",
          historyError
        );

        setHistory([]);

        setError(
          historyError instanceof Error
            ? historyError.message
            : "We could not load your analysis history. Please make sure the NeuDetect backend is running."
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const filteredHistory = useMemo(() => {
    return history.filter((record) => {
      const patientName =
        record.patient?.name?.toLowerCase() || "";

      const prediction =
        record.prediction?.toLowerCase() || "";

      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        patientName.includes(searchValue) ||
        prediction.includes(searchValue);

      const filterValue =
        filter === "All"
          ? null
          : filter === "No Tumor"
            ? "notumor"
            : filter.toLowerCase();

      const matchesFilter =
        filterValue === null ||
        prediction === filterValue;

      return matchesSearch && matchesFilter;
    });
  }, [history, search, filter]);

  function openResult(record: AnalysisRecord) {
    window.location.assign(
      `/result?id=${record.id}`
    );
  }

  return (
    <main>
      {/* Header */}

      <div className="mb-8">
        <div className="mb-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
          ANALYSIS HISTORY
        </div>

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Analysis History
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Review previous MRI analyses stored in NeuDetect.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/upload")}
            className="w-fit rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            New Analysis
          </button>
        </div>
      </div>

      {/* API error */}

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

          <div>
            <p className="font-medium">
              Unable to load analysis history
            </p>

            <p className="mt-1 text-xs leading-5 text-red-600">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Search + filters */}

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search patient or prediction..."
              className="
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
                text-sm
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-500
                focus:bg-white
                focus:ring-4
                focus:ring-blue-50
              "
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              "All",
              "Glioma",
              "Meningioma",
              "No Tumor",
              "Pituitary",
            ].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  filter === option
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* History */}

      {isLoading ? (
        <LoadingHistory />
      ) : filteredHistory.length === 0 ? (
        <EmptyHistory
          hasHistory={history.length > 0}
          onNewAnalysis={() => router.push("/upload")}
        />
      ) : (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Desktop header */}

          <div className="hidden border-b border-slate-100 bg-slate-50 px-6 py-4 md:grid md:grid-cols-[1.5fr_1fr_0.8fr_1fr_auto] md:items-center md:gap-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Patient
            </p>

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Prediction
            </p>

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Confidence
            </p>

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Date
            </p>

            <span />
          </div>

          <div className="divide-y divide-slate-100">
            {filteredHistory.map((record) => {
              const confidence =
                record.confidence <= 1
                  ? record.confidence * 100
                  : record.confidence;

              return (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => openResult(record)}
                  className="group block w-full text-left transition hover:bg-slate-50"
                >
                  <div className="grid gap-4 px-5 py-5 md:grid-cols-[1.5fr_1fr_0.8fr_1fr_auto] md:items-center md:gap-4 md:px-6">
                    {/* Patient */}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {record.patient?.name ||
                          "Unnamed patient"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {record.fileName ||
                          "MRI image"}
                      </p>
                    </div>

                    {/* Prediction */}

                    <div>
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                        {record.prediction === "notumor"
                          ? "No Tumor"
                          : record.prediction}
                      </span>
                    </div>

                    {/* Confidence */}

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {confidence.toFixed(1)}%
                      </p>

                      <div className="mt-2 h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{
                            width: `${Math.min(
                              confidence,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Date */}

                    <div>
                      <p className="text-sm text-slate-600">
                        {record.analyzedAt
                          ? new Date(
                              record.analyzedAt
                            ).toLocaleDateString()
                          : "Unknown"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {record.analyzedAt
                          ? new Date(
                              record.analyzedAt
                            ).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : ""}
                      </p>
                    </div>

                    {/* Action */}

                    <div className="flex items-center justify-end">
                      <span className="text-sm font-semibold text-slate-400 transition group-hover:text-blue-600">
                        View â†’
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Disclaimer */}

      <p className="mt-6 text-center text-xs leading-5 text-slate-400">
        Analysis history is retrieved from the NeuDetect database.
      </p>
    </main>
  );
}

function LoadingHistory() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

      <p className="mt-4 text-sm font-medium text-slate-700">
        Loading analysis history...
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Retrieving records from NeuDetect.
      </p>
    </section>
  );
}

function EmptyHistory({
  hasHistory,
  onNewAnalysis,
}: {
  hasHistory: boolean;
  onNewAnalysis: () => void;
}) {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="text-slate-500"
        >
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h10" />
        </svg>
      </div>

      <h2 className="mt-5 text-lg font-semibold text-slate-900">
        {hasHistory
          ? "No matching analyses"
          : "No analyses yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasHistory
          ? "Try changing your search or filter."
          : "Your completed MRI analyses will appear here."}
      </p>

      {!hasHistory && (
        <button
          type="button"
          onClick={onNewAnalysis}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Analyze an MRI
        </button>
      )}
    </section>
  );
}
