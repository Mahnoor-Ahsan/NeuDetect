"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";

const API_URL = "http://127.0.0.1:8000";

type UserProfile = {
  id: number;
  name: string;
  email: string;
  role: string;
  institution?: string | null;
  is_active: boolean;
  created_at?: string | null;
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const token = sessionStorage.getItem(
        "neudetect_access_token"
      );

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/auth/me`,
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

        if (!response.ok) {
          throw new Error(
            `Failed to load profile: ${response.status}`
          );
        }

        const data: UserProfile =
          await response.json();

        setUser(data);

        sessionStorage.setItem(
          "neudetect_user",
          JSON.stringify(data)
        );
      } catch (profileError) {
        console.error(
          "Could not load profile:",
          profileError
        );

        setError(
          "We could not load your profile. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  function handleLogout() {
    sessionStorage.removeItem(
      "neudetect_access_token"
    );

    sessionStorage.removeItem(
      "neudetect_user"
    );

    router.replace("/login");
  }
  if (isLoading) {
    return (
      <main>
        <SectionTitle
          badge="PROFILE"
          title="Your Profile"
          description="Manage your NeuDetect account information."
        />

        <div className="mt-10 flex min-h-[300px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading profile...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main>
        <SectionTitle
          badge="PROFILE"
          title="Your Profile"
          description="Manage your NeuDetect account information."
        />

        <div
          role="alert"
          className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700"
        >
          {error || "Your profile could not be loaded."}
        </div>
      </main>
    );
  }

  const initials = getInitials(user.name);

  const displayRole = formatRole(user.role);

  const memberSince = user.created_at
    ? new Date(
      user.created_at
    ).toLocaleDateString()
    : "Not available";

  return (
    <main>
      <SectionTitle
        badge="PROFILE"
        title="Your Profile"
        description="Manage your NeuDetect account information."
      />

      <Card className="mt-10 max-w-4xl">
        {/* Profile header */}

        <div className="flex flex-col items-center border-b border-slate-200 pb-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white shadow-md">
            {initials}
          </div>

          <h2 className="mt-6 text-3xl font-bold text-slate-900">
            {user.name}
          </h2>

          <p className="mt-1 text-slate-500">
            {displayRole}
          </p>

          <span
            className={`mt-4 rounded-full px-4 py-2 text-sm font-medium ${user.is_active
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
              }`}
          >
            {user.is_active
              ? "Active Account"
              : "Inactive Account"}
          </span>
        </div>

        {/* Account information */}

        <div className="mt-10">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900">
              Account information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Information associated with your NeuDetect account.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ProfileField
              label="Full Name"
              value={user.name}
            />

            <ProfileField
              label="Email"
              value={user.email}
            />

            <ProfileField
              label="Role"
              value={displayRole}
            />

            <ProfileField
              label="Institution"
              value={
                user.institution || "Not provided"
              }
            />

            <ProfileField
              label="Account ID"
              value={`#${user.id}`}
            />

            <ProfileField
              label="Member Since"
              value={memberSince}
            />
          </div>
        </div>

        {/* Account actions */}

        <div className="mt-10 border-t border-slate-200 pt-8">
          <h3 className="text-lg font-semibold text-slate-900">
            Account actions
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Additional profile editing and password management
            will be connected in a later account-management step.
          </p>

          <div className="mt-5 flex flex-wrap gap-4">
            <Button
              variant="danger"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </Card>

      <p className="mt-6 text-center text-xs leading-5 text-slate-400">
        Your profile information is retrieved from the NeuDetect
        authentication service.
      </p>
    </main>
  );
}

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-500">
        {label}
      </p>

      <p className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
        {value}
      </p>
    </div>
  );
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/);

  if (words.length === 0) {
    return "U";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return (
    words[0][0] +
    words[words.length - 1][0]
  ).toUpperCase();
}

function formatRole(role: string) {
  return role
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1)
    )
    .join(" ");
}