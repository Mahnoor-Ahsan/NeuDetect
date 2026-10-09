"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

type UserProfile = {
  id: number;
  name: string;
  email: string;
  role: string;
  institution?: string | null;
  is_active?: boolean;
};

function subscribeToUser() {
  return () => {};
}

function getUserSnapshot() {
  return sessionStorage.getItem("neudetect_user");
}

function getServerUserSnapshot() {
  return null;
}

export default function DashboardHeader() {
  const router = useRouter();

  const storedUser = useSyncExternalStore(
    subscribeToUser,
    getUserSnapshot,
    getServerUserSnapshot
  );

  const user = useMemo(() => {
    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as UserProfile;
    } catch (error) {
      console.error("Could not read stored user:", error);
      return null;
    }
  }, [storedUser]);

  const displayName = user?.name?.trim() || "User";

  const displayRole =
    user?.role?.trim()
      ? user.role.charAt(0).toUpperCase() +
        user.role.slice(1)
      : "User";

  const initials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("") || "U";

  function handleProfileClick() {
    router.push("/profile");
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome Back
        </h1>

        <p className="text-slate-500">
          Brain MRI Analysis Dashboard
        </p>
      </div>

      <button
        type="button"
        onClick={handleProfileClick}
        className="flex items-center gap-4 rounded-xl px-2 py-1.5 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Open profile"
      >
        <div className="text-right">
          <p className="font-semibold text-slate-900">
            {displayName}
          </p>

          <p className="text-sm text-slate-500">
            {displayRole}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
          {initials}
        </div>
      </button>
    </header>
  );
}