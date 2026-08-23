"use client";

import Link from "next/link";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

type PatientData = {
  name: string;
  age: string;
  gender: string;
};

type AnalysisRecord = {
  id: number;
  prediction: string;
  confidence: number;
  patient?: PatientData;
  fileName?: string;
  analyzedAt?: string;
};

type RecentAnalysesProps = {
  history: AnalysisRecord[];
};

export default function RecentAnalyses({
  history,
}: RecentAnalysesProps) {
  const recentAnalyses = [...history]
    .sort((a, b) => {
      const dateA = a.analyzedAt
        ? new Date(a.analyzedAt).getTime()
        : 0;

      const dateB = b.analyzedAt
        ? new Date(b.analyzedAt).getTime()
        : 0;

      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <Card className="mt-8">

      {/* Header */}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Recent Analyses
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your latest MRI analysis activity.
          </p>
        </div>

        <Link
          href="/history"
          className="rounded-lg px-2 py-1 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          View All
        </Link>
      </div>

      {/* Empty state */}

      {recentAnalyses.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
          <p className="text-sm font-semibold text-slate-700">
            No analyses yet
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Your completed MRI analyses will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">

          <table className="w-full text-left">

            {/* Table header */}

            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-400">

                <th className="pb-4 pr-4">
                  Patient
                </th>

                <th className="pb-4 pr-4">
                  Prediction
                </th>

                <th className="pb-4 pr-4">
                  Confidence
                </th>

                <th className="pb-4 pr-4">
                  Date
                </th>

                <th className="pb-4 pr-4">
                  Status
                </th>

                <th className="pb-4 text-right">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {recentAnalyses.map((record) => {
                const confidence =
                  record.confidence <= 1
                    ? record.confidence * 100
                    : record.confidence;

                return (
                  <tr
                    key={record.id}
                    className="group border-b border-slate-100 text-sm transition last:border-0 hover:bg-slate-50"
                  >

                    {/* Patient */}

                    <td className="py-4 pr-4">
                      <Link
                        href={`/result?id=${record.id}`}
                        className="block rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <p className="font-semibold text-slate-900 transition group-hover:text-blue-700">
                          {record.patient?.name ||
                            "Unnamed patient"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {record.fileName ||
                            "MRI image"}
                        </p>
                      </Link>
                    </td>

                    {/* Prediction */}

                    <td className="py-4 pr-4">
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700 transition group-hover:bg-blue-100">
                        {record.prediction}
                      </span>
                    </td>

                    {/* Confidence */}

                    <td className="py-4 pr-4">
                      <p className="font-semibold text-slate-800">
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
                    </td>

                    {/* Date */}

                    <td className="py-4 pr-4 text-slate-500">
                      {record.analyzedAt
                        ? new Date(
                            record.analyzedAt
                          ).toLocaleDateString()
                        : "—"}
                    </td>

                    {/* Status */}

                    <td className="py-4 pr-4">
                      <Badge variant="success">
                        Completed
                      </Badge>
                    </td>

                    {/* Action */}

                    <td className="py-4 text-right">

                      <Link
                        href={`/result?id=${record.id}`}
                        aria-label={`View analysis for ${
                          record.patient?.name ||
                          "patient"
                        }`}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 outline-none transition hover:bg-blue-50 hover:text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <span>
                          View
                        </span>

                        <span
                          aria-hidden="true"
                          className="transition-transform group-hover:translate-x-0.5"
                        >
                          →
                        </span>
                      </Link>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>
      )}

    </Card>
  );
}