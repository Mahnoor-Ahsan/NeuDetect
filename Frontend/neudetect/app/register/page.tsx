"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type RegisterResponse = {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    institution?: string | null;
    created_at: string;
  };
};

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("radiologist");
  const [institution, setInstitution] = useState("");

  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  async function handleRegister(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedInstitution = institution.trim();

    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsRegistering(true);

      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
            email: normalizedEmail,
            password,
            role,
            institution: trimmedInstitution || null,
          }),
        }
      );

      const data =
        (await response.json()) as
        | RegisterResponse
        | { detail?: string };

      if (!response.ok) {
        throw new Error(
          "detail" in data && data.detail
            ? data.detail
            : "Registration failed. Please try again."
        );
      }

      const result = data as RegisterResponse;

      sessionStorage.setItem(
        "neudetect_access_token",
        result.access_token
      );

      sessionStorage.setItem(
        "neudetect_user",
        JSON.stringify(result.user)
      );

      router.push("/dashboard");
    } catch (registerError) {
      console.error(
        "Registration error:",
        registerError
      );

      setError(
        registerError instanceof Error
          ? registerError.message
          : "Unable to create your account."
      );
    } finally {
      setIsRegistering(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <Card className="w-full max-w-lg rounded-3xl p-8 sm:p-10">
        {/* Header */}

        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
            N
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            Create your account
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Set up your NeuDetect account to manage MRI
            analyses securely.
          </p>
        </div>

        {/* Error */}

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
          >
            {error}
          </div>
        )}

        {/* Form */}

        <form
          onSubmit={handleRegister}
          className="mt-8 space-y-5"
        >
          <Input
            label="Full name"
            placeholder="Enter your full name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            disabled={isRegistering}
          />

          <Input
            label="Email"
            type="email"
            placeholder="doctor@example.com"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            disabled={isRegistering}
          />

          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Role
            </label>

            <select
              id="role"
              value={role}
              onChange={(event) =>
                setRole(event.target.value)
              }
              disabled={isRegistering}
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                bg-white
                px-4
                py-3
                text-slate-900
                outline-none
                transition
                focus:border-blue-600
                focus:ring-4
                focus:ring-blue-100
                disabled:cursor-not-allowed
                disabled:bg-slate-100
              "
            >
              <option value="radiologist">
                Radiologist
              </option>

              <option value="doctor">
                Doctor
              </option>

              <option value="researcher">
                Researcher
              </option>
            </select>
          </div>

          <Input
            label="Institution"
            placeholder="NeuDetect Medical Center"
            value={institution}
            onChange={(event) =>
              setInstitution(event.target.value)
            }
            disabled={isRegistering}
          />

          <Input
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            disabled={isRegistering}
          />

          <Input
            label="Confirm password"
            type="password"
            placeholder="Enter password again"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(
                event.target.value
              )
            }
            disabled={isRegistering}
          />

          <Button
            type="submit"
            disabled={isRegistering}
            className="w-full"
          >
            {isRegistering
              ? "Creating account..."
              : "Create account"}
          </Button>
        </form>

        {/* Login link */}

        <div className="mt-6 border-t border-slate-100 pt-6 text-center">
          <p className="text-sm text-slate-500">
            Already have an account?
          </p>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Sign in to NeuDetect
          </button>
        </div>
      </Card>
    </main>
  );
}
