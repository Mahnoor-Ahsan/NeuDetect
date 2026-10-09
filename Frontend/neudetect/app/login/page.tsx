"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

const API_URL = "http://127.0.0.1:8000";

type LoginResponse = {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    institution?: string | null;
  };
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setIsLoggingIn(true);

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Login failed. Please check your credentials."
        );
      }

      const result = data as LoginResponse;

      sessionStorage.setItem(
        "neudetect_access_token",
        result.access_token
      );

      sessionStorage.setItem(
        "neudetect_user",
        JSON.stringify(result.user)
      );

      router.push("/dashboard");
    } catch (loginError) {
      console.error("Login error:", loginError);

      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <Card className="w-full max-w-md rounded-3xl p-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
            N
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-slate-600">
            Login to access NeuDetect
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >
          <Input
            label="Email"
            type="email"
            placeholder="doctor@example.com"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            disabled={isLoggingIn}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            disabled={isLoggingIn}
          />

          <Button
            type="submit"
            disabled={isLoggingIn}
            className="w-full"
          >
            {isLoggingIn ? "Signing in..." : "Login"}
          </Button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-6 text-center">
          <p className="text-sm text-slate-500">
            Don&apos;t have an account?
          </p>

          <Link
            href="/register"
            className="mt-1 inline-block text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Create an account
          </Link>
        </div>
      </Card>
    </main>
  );
}