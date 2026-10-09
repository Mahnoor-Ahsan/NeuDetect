
"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="NeuDetect home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
            N
          </div>

          <span className="text-xl font-bold tracking-tight text-slate-900">
            NeuDetect
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a
            href="#features"
            className="transition hover:text-blue-600"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="transition hover:text-blue-600"
          >
            How It Works
          </a>

          <a
            href="#about"
            className="transition hover:text-blue-600"
          >
            About
          </a>
        </div>

        {/* Authentication */}
        <div className="flex items-center gap-3">
          <Link
            href="/register"
            className="rounded-xl border border-blue-600 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Create Account
          </Link>

          <Link
            href="/login"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}