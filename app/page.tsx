import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-6 text-6xl">📋</div>
        <h1 className="text-5xl font-bold text-white mb-4">AppTrackr</h1>
        <p className="text-slate-400 text-xl mb-10 max-w-md mx-auto">
          Track every job application in one place. Never lose track of where
          you applied.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="border border-slate-500 hover:border-slate-400 text-slate-300 font-semibold px-8 py-3 rounded-lg transition"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  )
}