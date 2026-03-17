"use client";

import Link from "next/link";
import { Character } from "./components/Character";

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
          <div className="h-full relative rounded-2xl border border-white/10 bg-[#1a2540] p-6 transition-all duration-200 group-hover:border-blue-400/40 group-hover:bg-[#1e2d50] group-hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-blue-500/10">
            {/* Visual decoration */}
            <div className="mb-4 flex gap-2 items-end">
              <Character id={0} mood="happy" size={50} />
              <Character id={1} mood="happy" size={50} />
              {/* Chocolate bar SVG */}
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" style={{flexShrink: 0}}>
                <g transform="rotate(-20 15 20)">
                  {/* Chocolate bar segments */}
                  <rect x="6" y="14" width="7" height="7" fill="#6B4423" stroke="#4A2C18" strokeWidth="0.5" />
                  <rect x="13" y="14" width="7" height="7" fill="#7A5230" stroke="#4A2C18" strokeWidth="0.5" />
                  <rect x="6" y="21" width="7" height="7" fill="#7A5230" stroke="#4A2C18" strokeWidth="0.5" />
                  <rect x="13" y="21" width="7" height="7" fill="#6B4423" stroke="#4A2C18" strokeWidth="0.5" />

                  {/* Highlight on chocolate */}
                  <ellipse cx="10" cy="17" rx="2" ry="1.5" fill="#A0674A" opacity="0.6" />
                  <ellipse cx="17" cy="24" rx="2" ry="1.5" fill="#A0674A" opacity="0.6" />

                  {/* Red wrapper - touching chocolate */}
                  <rect x="20" y="14" width="18" height="14" fill="#E74C3C" rx="1" />
                  <rect x="21" y="15" width="16" height="12" fill="#FF6B5B" />
                  <ellipse cx="27" cy="18" rx="3" ry="2" fill="white" opacity="0.3" />
                </g>
              </svg>
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
          <div className="h-full relative rounded-2xl border border-white/10 bg-[#1a2540] p-6 transition-all duration-200 group-hover:border-purple-400/40 group-hover:bg-[#1e2d50] group-hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-purple-500/10">
            {/* Visual decoration */}
            <div className="mb-4 flex gap-3 items-center">
              <Character id={2} mood="happy" size={50} />
              <Character id={3} mood="happy" size={50} />
              {/* Fractions SVG (1/2 = 2/4) */}
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                {/* 1/2 */}
                <text x="6" y="16" fontSize="12" fontWeight="bold" fill="currentColor" className="text-blue-400">1</text>
                <line x1="4" y1="18" x2="14" y2="18" stroke="currentColor" strokeWidth="1.5" className="text-blue-400" />
                <text x="6" y="30" fontSize="12" fontWeight="bold" fill="currentColor" className="text-blue-400">2</text>

                {/* Equals sign */}
                <line x1="18" y1="20" x2="26" y2="20" stroke="currentColor" strokeWidth="2" className="text-purple-400" />
                <line x1="18" y1="26" x2="26" y2="26" stroke="currentColor" strokeWidth="2" className="text-purple-400" />

                {/* 2/4 */}
                <text x="30" y="16" fontSize="12" fontWeight="bold" fill="currentColor" className="text-blue-400">2</text>
                <line x1="28" y1="18" x2="38" y2="18" stroke="currentColor" strokeWidth="1.5" className="text-blue-400" />
                <text x="30" y="30" fontSize="12" fontWeight="bold" fill="currentColor" className="text-blue-400">4</text>
              </svg>
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
