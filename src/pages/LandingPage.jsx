import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white">
              🛡️
            </div>

            <span className="text-xl font-bold text-slate-900">
              InsureMS
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="font-medium text-slate-700 transition hover:text-blue-600"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-indigo-50" />

        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-200/20 blur-3xl" />

        <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-5xl flex-col items-center justify-center px-6 text-center">
          <div className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            Smart Insurance Management Platform
          </div>

          <h1 className="mt-8 text-5xl font-bold leading-tight text-slate-900 md:text-6xl lg:text-7xl">
            Insurance
            <span className="block bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">
            Manage policies, claims, payments and customer protection through
            a secure, modern platform designed for customers, agents and
            administrators.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:-translate-y-1 hover:bg-blue-700"
            >
              Create Account
            </Link>

            <Link
              to="/login"
              className="rounded-2xl border border-slate-300 px-8 py-4 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>Secure Platform</span>
            </div>

            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span>Fast Claims</span>
            </div>

            <div className="flex items-center gap-2">
              <span>🛡️</span>
              <span>Trusted Coverage</span>
            </div>

            <div className="flex items-center gap-2">
              <span>📱</span>
              <span>Digital Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-100 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-slate-900">
              Everything You Need
            </h2>

            <p className="mt-4 text-slate-600">
              A complete insurance management solution.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 p-8 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="text-4xl">📄</div>
              <h3 className="mt-4 text-xl font-semibold">
                Policy Management
              </h3>
              <p className="mt-3 text-slate-600">
                Create, manage and monitor insurance policies.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 p-8 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="text-4xl">💰</div>
              <h3 className="mt-4 text-xl font-semibold">
                Payments
              </h3>
              <p className="mt-3 text-slate-600">
                Track premiums and payment history effortlessly.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 p-8 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="text-4xl">⚡</div>
              <h3 className="mt-4 text-xl font-semibold">
                Claims
              </h3>
              <p className="mt-3 text-slate-600">
                Submit and process claims with transparency.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 p-8 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="text-4xl">👥</div>
              <h3 className="mt-4 text-xl font-semibold">
                User Management
              </h3>
              <p className="mt-3 text-slate-600">
                Support customers, agents and administrators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-linear-to-r from-blue-600 to-indigo-700 py-24 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold md:text-5xl">
            Ready to Get Started?
          </h2>

          <p className="mt-6 text-lg text-blue-100">
            Join InsureMS and experience modern insurance management.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-block rounded-2xl bg-white px-8 py-4 font-semibold text-blue-600 transition hover:scale-105"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-500">
          © 2026 InsureMS. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default LandingPage