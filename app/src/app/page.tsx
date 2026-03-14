import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen starfield bg-[#0f1729] flex flex-col items-center px-4 py-12 overflow-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
          Fraction Friends
        </h1>
        <p className="text-lg text-[#a8b4d4]">
          Choose a lesson to start learning
        </p>
      </div>

      {/* Lesson Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
        {/* Card 1: Midnight Snack */}
        <Link href="/basic" className="group block">
          <div className="relative rounded-2xl border border-white/10 bg-[#1a2540] p-6 transition-all duration-200 group-hover:border-blue-400/40 group-hover:bg-[#1e2d50] group-hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-blue-500/10">
            {/* Visual decoration */}
            <div className="text-5xl mb-4 flex gap-2">
              <span>🍫</span>
              <span>👾</span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">
              Midnight Snack
            </h2>
            <p className="text-sm font-medium text-blue-400 mb-3">
              Basic Fractions
            </p>
            <p className="text-[#a8b4d4] text-sm leading-relaxed">
              Learn about halves and quarters by sharing chocolate bars with
              friendly monsters
            </p>

            {/* Play indicator */}
            <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                <svg
                  className="w-4 h-4 ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.8A1 1 0 005 3.7v12.6a1 1 0 001.3.9l10-6.3a1 1 0 000-1.8l-10-6.3z" />
                </svg>
              </span>
              Play Now
            </div>
          </div>
        </Link>

        {/* Card 2: Same Size, Different Names */}
        <Link href="/equivalence" className="group block">
          <div className="relative rounded-2xl border border-white/10 bg-[#1a2540] p-6 transition-all duration-200 group-hover:border-purple-400/40 group-hover:bg-[#1e2d50] group-hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-purple-500/10">
            {/* Visual decoration */}
            <div className="text-5xl mb-4 flex gap-2">
              <span>🟰</span>
              <span>🧩</span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">
              Same Size, Different Names
            </h2>
            <p className="text-sm font-medium text-purple-400 mb-3">
              Fraction Equivalence
            </p>
            <p className="text-[#a8b4d4] text-sm leading-relaxed">
              Discover that 1/2 and 2/4 are the same amount
            </p>

            {/* Play indicator */}
            <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-purple-400 group-hover:text-purple-300 transition-colors">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                <svg
                  className="w-4 h-4 ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.8A1 1 0 005 3.7v12.6a1 1 0 001.3.9l10-6.3a1 1 0 000-1.8l-10-6.3z" />
                </svg>
              </span>
              Play Now
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
