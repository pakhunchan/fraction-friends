"use client";

import { useState, useEffect } from "react";

const STAR_COUNT = 25;

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  dur: number;
  delay: number;
}

// Moon exclusion zone (vw/vh) — keep stars away from the crescent
const MOON_X = 92; // approximate vw center of moon (right:100 ≈ 92vw)
const MOON_Y = 10;  // approximate vh center of moon (top:70 ≈ 10vh)
const MOON_R = 5;   // exclusion radius in vw/vh units

function isNearMoon(x: number, y: number) {
  const dx = x - MOON_X;
  const dy = y - MOON_Y;
  return dx * dx + dy * dy < MOON_R * MOON_R;
}

function generateStars(): Star[] {
  const stars: Star[] = [];
  let id = 0;
  while (stars.length < STAR_COUNT) {
    // Top strip (70%): full width right of panel, y 0–20vh
    // Right edge (30%): x >= 88vw, y 0–50vh
    const inTopStrip = Math.random() < 0.7;
    const x = inTopStrip ? 22 + Math.random() * 78 : 88 + Math.random() * 12;
    const y = inTopStrip ? Math.random() * 20 : Math.random() * 50;
    if (isNearMoon(x, y)) continue;
    const size = 2 + Math.random() * 2;
    const dur = 4 + Math.random() * 4;
    const delay = Math.random() * dur;
    stars.push({ id: id++, x, y, size, dur, delay });
  }
  return stars;
}

export function NightSky() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setStars(generateStars());
  }, []);

  return (
    <>
      {/* Sky glow */}
      <div
        className="fixed pointer-events-none z-0"
        style={{
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 400,
          background:
            "radial-gradient(ellipse at center, rgba(56,189,248,0.06), transparent 70%)",
        }}
      />

      {/* Moon — SVG mask creates a true crescent without background-color dependency */}
      <svg
        className="fixed z-[2] pointer-events-none"
        style={{ top: 70, right: 100 }}
        width="60"
        height="60"
        viewBox="0 0 60 60"
      >
        <defs>
          <mask id="crescent-mask">
            <circle cx="30" cy="30" r="30" fill="white" />
            <circle cx="46" cy="18" r="30" fill="black" />
          </mask>
        </defs>
        <circle cx="30" cy="30" r="30" fill="#f5e6b8" opacity="0.3" mask="url(#crescent-mask)" />
      </svg>

      {/* Stars */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="fixed rounded-full bg-white z-[1]"
          style={{
            left: `${s.x}vw`,
            top: `${s.y}vh`,
            width: s.size,
            height: s.size,
            boxShadow: "0 0 4px 1px rgba(255,255,255,0.3)",
            animation: `twinkle ${s.dur}s ${s.delay}s infinite`,
          }}
        />
      ))}
    </>
  );
}
