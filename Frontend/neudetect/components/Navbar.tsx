import Link from "next/link";
export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">


        {/* Logo */}
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
            N
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            NeuDetect
          </h1>

        </div>



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



        {/* Login */}
        
        <Link
          href="/login"
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Login
        </Link>


      </nav>

    </header>
  );
}