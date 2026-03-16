"use client";

import { Character } from "../components/Character";

// Responsive monster size: smaller for preview cards, will be bigger in actual game
const M = 90; // monster size for most options
const MS = 70; // small monster size

const options = [
  {
    name: "Sparkle Rally",
    render: () => (
      <>
        <style>{`
          @keyframes glow-pulse { 0%, 100% { text-shadow: 0 0 20px #fbbf24, 0 0 40px #f59e0b; } 50% { text-shadow: 0 0 30px #fbbf24, 0 0 60px #f59e0b, 0 0 90px #d97706; } }
          @keyframes monster-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        `}</style>
        <div className="flex flex-col items-center justify-center flex-1 gap-5 p-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center" style={{ animation: "glow-pulse 2s ease-in-out infinite", textShadow: "0 0 20px #fbbf24, 0 0 40px #f59e0b" }}>
            You&apos;ve Got This!
          </h1>
          <div className="flex items-end gap-3 flex-wrap justify-center">
            {[0, 1, 2, 3].map((id) => (
              <div key={id} style={{ animation: `monster-bounce 1.2s ${id * 0.15}s ease-in-out infinite` }}>
                <Character id={id} mood="happy" size={M} />
              </div>
            ))}
          </div>
          <p className="text-base md:text-lg text-white/80 text-center px-2">Time for the quiz — show us what you learned!</p>
        </div>
      </>
    ),
  },
  {
    name: "High Five Circle",
    render: () => (
      <>
        <style>{`@keyframes pulse2 { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.85; transform: scale(1.05); } }`}</style>
        <div className="flex flex-col items-center justify-center flex-1 gap-5 p-4">
          <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: "#FFD700", animation: "pulse2 2s ease-in-out infinite" }}>Quiz Time!</h1>
          <div className="flex items-end gap-3 flex-wrap justify-center">
            <div style={{ transform: "rotate(-10deg) translateY(-6px)" }}><Character id={0} mood="happy" size={M} /></div>
            <div style={{ transform: "translateY(-16px)" }}><Character id={1} mood="happy" size={M} /></div>
            <div style={{ transform: "translateY(-16px)" }}><Character id={2} mood="happy" size={M} /></div>
            <div style={{ transform: "rotate(10deg) translateY(-6px)" }}><Character id={3} mood="happy" size={M} /></div>
          </div>
          <p className="text-base md:text-lg text-[#E0E7FF] text-center px-2">You learned so much today — let&apos;s celebrate with a quiz!</p>
        </div>
      </>
    ),
  },
  {
    name: "Champion Banner",
    render: () => (
      <>
        <style>{`@keyframes monsterBounce3 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }`}</style>
        <div className="flex flex-col items-center justify-center flex-1 gap-5 p-4">
          <div className="px-8 py-3" style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)", clipPath: "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)" }}>
            <div className="text-xl md:text-2xl font-black text-[#1e2d4a] text-center uppercase tracking-wider">⭐ Quiz Challenge! ⭐</div>
          </div>
          <div className="flex items-end gap-3 flex-wrap justify-center">
            {[0, 1, 2, 3].map((id) => (
              <div key={id} style={{ animation: `monsterBounce3 1.2s ${id * 0.15}s ease-in-out infinite` }}>
                <Character id={id} mood="happy" size={M} />
              </div>
            ))}
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">You&apos;re a fraction superstar! ⭐</div>
            <div className="text-base text-[#93c5fd] mt-1">Ready to prove it?</div>
          </div>
        </div>
      </>
    ),
  },
  {
    name: "Gentle Encouragement",
    render: () => (
      <div className="flex flex-col items-center justify-center flex-1 gap-8 p-4">
        <div className="text-3xl md:text-4xl font-bold text-center" style={{ color: "#f5e6b8" }}>Ready for a Fun Quiz?</div>
        <div className="flex items-end gap-4 flex-wrap justify-center">
          {[0, 1, 2, 3].map((id) => <Character key={id} id={id} mood="happy" size={M} />)}
        </div>
        <div className="text-base md:text-lg text-[#a8b8d0] text-center">Don&apos;t worry — your friends are cheering for you!</div>
      </div>
    ),
  },
  {
    name: "Countdown Hype",
    render: () => (
      <div className="flex flex-col items-center justify-center flex-1 gap-4 p-4">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold" style={{ color: "#6b7fff", opacity: 0.5 }}>3</span>
          <span className="text-3xl font-bold" style={{ color: "#8b6bff", opacity: 0.4 }}>...</span>
          <span className="text-6xl font-bold" style={{ color: "#9b6bff", opacity: 0.7 }}>2</span>
          <span className="text-3xl font-bold" style={{ color: "#ab6bff", opacity: 0.5 }}>...</span>
          <span className="text-7xl font-bold" style={{ color: "#bb6bff", opacity: 0.9 }}>1</span>
        </div>
        <div className="text-4xl md:text-5xl font-bold text-center" style={{ background: "linear-gradient(135deg, #4facfe, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Let&apos;s Do This!</div>
        <div className="flex items-end gap-4 flex-wrap justify-center">
          <div style={{ transform: "rotate(-8deg)" }}><Character id={0} mood="happy" size={M} /></div>
          <div style={{ transform: "rotate(6deg)" }}><Character id={1} mood="happy" size={M} /></div>
          <div style={{ transform: "rotate(10deg)" }}><Character id={2} mood="happy" size={M} /></div>
          <div style={{ transform: "rotate(-5deg)" }}><Character id={3} mood="happy" size={M} /></div>
        </div>
        <p className="text-base md:text-lg text-[#c0c8e0] text-center">You&apos;ve been amazing — now show what you know!</p>
      </div>
    ),
  },
  {
    name: "Cheerleader Squad",
    render: () => (
      <>
        <style>{`@keyframes cheerWave { 0% { transform: translateY(0) rotate(0deg); } 100% { transform: translateY(-8px) rotate(3deg); } }`}</style>
        <div className="flex flex-col items-center justify-center flex-1 gap-4 p-4">
          <div className="text-center">
            <span className="text-2xl font-bold" style={{ color: "#ffd93d" }}>Go, </span>
            <span className="text-3xl font-extrabold" style={{ color: "#ff9f43" }}>Go, </span>
            <span className="text-5xl font-black" style={{ color: "#ff6b9d", textShadow: "0 0 18px rgba(255,107,157,0.6)" }}>GO!</span>
          </div>
          <div className="flex flex-col items-center gap-0">
            <div className="flex justify-center gap-12 -mb-1">
              <div style={{ animation: "cheerWave 0.8s ease-in-out infinite alternate" }}><Character id={1} mood="happy" size={M} /></div>
              <div style={{ animation: "cheerWave 0.8s 0.4s ease-in-out infinite alternate" }}><Character id={3} mood="happy" size={M} /></div>
            </div>
            <div className="flex justify-center gap-4">
              <div style={{ animation: "cheerWave 0.8s 0.2s ease-in-out infinite alternate" }}><Character id={0} mood="happy" size={MS} /></div>
              <div style={{ animation: "cheerWave 0.8s 0.6s ease-in-out infinite alternate" }}><Character id={2} mood="happy" size={MS} /></div>
            </div>
          </div>
          <div className="text-base md:text-lg font-semibold text-[#c8dafa] text-center">Your monster friends believe in you!</div>
        </div>
      </>
    ),
  },
  {
    name: "Storybook Page",
    render: () => (
      <div className="flex flex-col items-center justify-center flex-1 p-6">
        <div className="relative rounded-2xl p-8 pb-24 max-w-md w-full text-center overflow-hidden" style={{ background: "#f5f0e1", border: "5px solid #c4a265", boxShadow: "0 0 0 2px #e8dcc4, 0 8px 32px rgba(0,0,0,0.35)" }}>
          <div className="mx-auto mb-4 h-0.5 w-3/5" style={{ background: "linear-gradient(90deg, transparent, #c4a265, transparent)" }} />
          <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#8a7449", fontFamily: "Georgia, serif" }}>Chapter 2</div>
          <div className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "#3b2e1a", fontFamily: "Georgia, serif" }}>The Quiz!</div>
          <div className="text-base mb-3" style={{ letterSpacing: "8px", color: "#c4a265" }}>• • •</div>
          <p className="text-base italic" style={{ color: "#4a3d2a", fontFamily: "Georgia, serif", lineHeight: 1.7 }}>
            Our heroes have learned about fractions.<br />Now it&apos;s time for the ultimate test!
          </p>
          <div className="absolute bottom-[-6px] left-0 right-0 flex justify-around px-8 pointer-events-none">
            <div style={{ transform: "rotate(-8deg)" }}><Character id={0} mood="happy" size={60} /></div>
            <div style={{ transform: "translateY(4px)" }}><Character id={1} mood="happy" size={60} /></div>
            <div style={{ transform: "translateY(4px)" }}><Character id={2} mood="happy" size={60} /></div>
            <div style={{ transform: "rotate(8deg)" }}><Character id={3} mood="happy" size={60} /></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "Trophy Room",
    render: () => (
      <>
        <style>{`@keyframes trophy-glow { 0%, 100% { filter: drop-shadow(0 4px 12px rgba(255,215,0,0.5)); } 50% { filter: drop-shadow(0 4px 24px rgba(255,215,0,0.8)); } }`}</style>
        <div className="flex flex-col items-center justify-center flex-1 gap-5 p-4">
          <div className="text-7xl" style={{ animation: "trophy-glow 2s ease-in-out infinite" }}>🏆</div>
          <div className="text-3xl md:text-4xl font-bold text-white" style={{ textShadow: "0 2px 8px rgba(255,215,0,0.4)" }}>Almost There!</div>
          <div className="flex items-end gap-3 flex-wrap justify-center">
            <div style={{ transform: "translateY(-4px)" }}><Character id={0} mood="happy" size={M} /></div>
            <div style={{ transform: "translateY(-10px)" }}><Character id={1} mood="happy" size={M} /></div>
            <div style={{ transform: "translateY(-10px)" }}><Character id={2} mood="happy" size={M} /></div>
            <div style={{ transform: "translateY(-4px)" }}><Character id={3} mood="happy" size={M} /></div>
          </div>
          <div className="text-base md:text-lg font-semibold text-center" style={{ color: "#ffd700" }}>Answer the quiz to earn your Fraction Trophy!</div>
        </div>
      </>
    ),
  },
  {
    name: "Dance Party",
    render: () => (
      <>
        <style>{`@keyframes danceBounce9 { 0%, 100% { transform: translateY(0) rotate(var(--tilt)); } 50% { transform: translateY(-10px) rotate(var(--tilt)); } }`}</style>
        <div className="flex flex-col items-center justify-center flex-1 gap-5 p-4">
          <div className="text-3xl md:text-4xl font-black text-center" style={{ background: "linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #b44dff, #ff6bd6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Time to Shine!</div>
          <p className="text-base md:text-lg text-[#d0d8e8] text-center">Dance your way through this quiz!</p>
          <div className="flex gap-3 items-end flex-wrap justify-center">
            {[0, 1, 2, 3].map((id) => (
              <div key={id} style={{ ["--tilt" as string]: `${id % 2 === 0 ? -8 : 8}deg`, transform: `rotate(${id % 2 === 0 ? -8 : 8}deg)`, animation: `danceBounce9 0.6s ${id * 0.15}s ease-in-out infinite` }}>
                <Character id={id} mood="happy" size={M} />
              </div>
            ))}
          </div>
        </div>
      </>
    ),
  },
  {
    name: "Warm Hug",
    render: () => (
      <>
        <style>{`@keyframes gentlePulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }`}</style>
        <div className="flex flex-col items-center justify-center flex-1 gap-4 p-4">
          <div className="text-6xl" style={{ animation: "gentlePulse 2s ease-in-out infinite" }}>❤️</div>
          <div className="text-2xl md:text-3xl font-bold text-white text-center">We&apos;re So Proud of You!</div>
          <div className="flex items-end justify-center">
            <div style={{ marginRight: "-14px", zIndex: 1 }}><Character id={0} mood="happy" size={MS} /></div>
            <div style={{ marginRight: "-14px", zIndex: 2, marginBottom: "6px" }}><Character id={1} mood="happy" size={MS} /></div>
            <div style={{ marginRight: "-14px", zIndex: 2, marginBottom: "6px" }}><Character id={2} mood="happy" size={MS} /></div>
            <div style={{ zIndex: 1 }}><Character id={3} mood="happy" size={MS} /></div>
          </div>
          <div className="text-base md:text-lg text-white/85 text-center">Let&apos;s finish strong with a little quiz!</div>
        </div>
      </>
    ),
  },
];

export default function CheerPreview() {
  return (
    <div className="min-h-screen bg-[#0f1729] p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">Cheer Screen Options</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {options.map((opt, i) => (
          <div key={i} className="rounded-2xl overflow-hidden">
            <div className="bg-white/10 px-4 py-2 text-white font-semibold text-lg">
              #{i + 1} — {opt.name}
            </div>
            <div className="bg-[#1e2d4a] flex flex-col items-center justify-center overflow-hidden" style={{ minHeight: "400px" }}>
              {opt.render()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
