"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import SectionTitle from "@/components/ui/SectionTitle";
import StatCard from "@/components/dashboard/StatCard";
import RecentAnalyses from "@/components/dashboard/RecentAnalyses";
import QuickActions from "@/components/dashboard/QuickActions";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type UserProfile = {
  id: number;
  name: string;
  email: string;
  role: string;
  institution?: string | null;
  is_active: boolean;
  created_at?: string | null;
};

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

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] =
    useState<UserProfile | null>(null);

  const [history, setHistory] =
    useState<AnalysisRecord[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadDashboardData() {
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

        /*
         * Load the authenticated user's profile.
         */
        const profileResponse = await fetch(
          `${API_URL}/auth/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        if (profileResponse.status === 401) {
          sessionStorage.removeItem(
            "neudetect_access_token"
          );

          sessionStorage.removeItem(
            "neudetect_user"
          );

          router.replace("/login");
          return;
        }

        if (!profileResponse.ok) {
          throw new Error(
            `Failed to load profile: ${profileResponse.status}`
          );
        }

        const profileData: UserProfile =
          await profileResponse.json();

        setUser(profileData);

        sessionStorage.setItem(
          "neudetect_user",
          JSON.stringify(profileData)
        );

        /*
         * Load analyses belonging to the
         * authenticated user.
         */
        const analysesResponse = await fetch(
          `${API_URL}/analyses/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        if (analysesResponse.status === 401) {
          sessionStorage.removeItem(
            "neudetect_access_token"
          );

          sessionStorage.removeItem(
            "neudetect_user"
          );

          router.replace("/login");
          return;
        }

        if (!analysesResponse.ok) {
          throw new Error(
            `Failed to load analyses: ${analysesResponse.status}`
          );
        }

        const analysesData: AnalysisRecord[] =
          await analysesResponse.json();

        setHistory(analysesData);
      } catch (dashboardError) {
        console.error(
          "Could not load dashboard data:",
          dashboardError
        );

        setHistory([]);

        setError(
          "We could not load your dashboard data. Please make sure the NeuDetect backend is running."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [router]);

  const latestAnalysis = useMemo(() => {
    if (history.length === 0) {
      return null;
    }

    return [...history].sort((a, b) => {
      const dateA = a.analyzedAt
        ? new Date(a.analyzedAt).getTime()
        : 0;

      const dateB = b.analyzedAt
        ? new Date(b.analyzedAt).getTime()
        : 0;

      return dateB - dateA;
    })[0];
  }, [history]);

  const totalAnalyses = history.length;

  /*
   * Every record returned by /analyses/
   * represents a completed analysis.
   */
  const completedAnalyses = history.length;

  const latestConfidence = latestAnalysis
    ? latestAnalysis.confidence <= 1
      ? latestAnalysis.confidence * 100
      : latestAnalysis.confidence
    : 0;

  const firstName =
    user?.name?.trim().split(/\s+/)[0] ||
    "there";

  return (
    <main>
      <div className="mx-auto max-w-7xl">

        <SectionTitle
          badge="DASHBOARD"
          title={`Welcome Back, ${firstName}`}
          description="Monitor MRI analyses, review predictions, and manage your NeuDetect workflow."
        />

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Statistics */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Total Analyses"
            value={
              isLoading
                ? "..."
                : String(totalAnalyses)
            }
            description="MRI scans analyzed"
          />

          <StatCard
            title="Completed"
            value={
              isLoading
                ? "..."
                : String(completedAnalyses)
            }
            description="Successfully analyzed"
          />

          <StatCard
            title="Latest Prediction"
            value={
              isLoading
                ? "..."
                : latestAnalysis?.prediction ||
                  "No results"
            }
            description="Most recent MRI result"
          />

          <StatCard
            title="Latest Confidence"
            value={
              isLoading
                ? "..."
                : latestAnalysis
                  ? `${latestConfidence.toFixed(1)}%`
                  : "â€”"
            }
            description="Most recent model confidence"
          />

        </div>

        {/* Recent Analyses */}

        <RecentAnalyses
          history={history}
        />

        {/* Quick Actions */}

        <div className="mt-10">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            Quick Actions
          </h2>

          <QuickActions />
        </div>

      </div>
    </main>
  );
}
