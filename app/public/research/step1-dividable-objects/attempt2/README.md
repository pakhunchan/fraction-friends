# Cookie SVG Graphics - Attempt 2

## Approach

This attempt uses advanced SVG filter primitives and procedural generation to create photorealistic baked cookie graphics, departing from the flat-gradient approach of attempt 1.

### Techniques Used

**Surface Texture via SVG Filters**
- `feTurbulence` (fractalNoise) generates organic grain that mimics the irregular surface of a real baked cookie
- `feDisplacementMap` warps the cookie shape slightly using a second turbulence layer, creating subtle surface undulation
- `feBlend` in overlay mode composites the noise color onto the base, producing a natural dough-like appearance

**Baked-Edge Darkening**
- Multi-stop `radialGradient` transitions from golden center (#dda05c) through medium brown (#c47e38) to dark baked edge (#7a4218)
- Additional thin stroke rings at the circumference reinforce the caramelized edge effect
- Center is offset slightly up-left to simulate top-down lighting

**Chocolate Chips with Depth**
- Each chip is an `ellipse` with random rotation for organic variety
- A shadow ellipse is rendered offset below/right to create a raised appearance
- A "melted edge" ring (thin stroke) around each chip simulates where the chocolate has spread slightly into the dough during baking
- A small highlight ellipse on each chip provides a glossy sheen

**Jagged Break Edges**
- Half and quarter cookies use a procedurally generated jagged line along cut edges instead of clean geometric cuts
- The jaggedness amplitude follows a sine curve (maximum in the middle, tapering at edges) for a natural break pattern
- A visible jagged-edge stroke is rendered on top of the clip boundary for visual emphasis

**Crumb Particles**
- Small circles with varying size and opacity are scattered near break edges
- Positioned using the same deterministic RNG seeded per variant, so they are stable across renders

**Concavity and Depth**
- Inner shadow via dark semi-transparent stroke or filter creates a slight concave appearance
- Outer drop shadow (`feGaussianBlur` + `feOffset`) lifts the cookie off the background
- Top-left radial highlight gradient simulates light hitting a slightly domed surface

**Deterministic Randomness**
- All procedural elements (chip positions, jagged edges, crumbs, sparkles) use a seeded mulberry32 PRNG
- Each variant (whole, half-left, half-right, quarter) has a distinct seed for consistent but different chip layouts
- This avoids hydration mismatches in SSR/client rendering

### Surface Details
- Tiny "sugar sparkle" dots scattered across the surface simulate granulated sugar crystals catching light
- These use very small radii (0.3-0.8) and low opacity for subtlety

## Props Interface (Unchanged)

```tsx
interface CookieProps {
  size?: number;        // default 120
  isHalf?: boolean;     // default false
  halfSide?: "left" | "right";  // default "left"
  isQuarter?: boolean;  // default false
  onClick?: () => void;
  selected?: boolean;   // default false
  disabled?: boolean;   // default false
}
```

Exports: `Cookie` (default component) and `SlicedCookie` (two halves with gap).

## Integration

Drop-in replacement for the existing `Cookie.tsx`:

```bash
cp step1-dividable-objects/attempt2/Cookie.tsx app/src/app/components/Cookie.tsx
```

No other files need to change. The component preserves all existing:
- Props interface and defaults
- CSS class names (`cookie-drop`, `cookie-slice`)
- Tailwind utility classes for selection, hover, active states
- `SlicedCookie` export with identical API

## Preview

Open `preview.html` in a browser to see all variants at sizes 48px, 80px, 120px, and 140px, plus sliced-cookie and selected-state demos.

## Performance Notes

- SVG filters (feTurbulence, feDisplacementMap) are GPU-accelerated in modern browsers
- Each cookie instance uses unique filter IDs to avoid cross-contamination
- At small sizes (48px), the turbulence detail is still visible but gracefully degrades
- The deterministic PRNG avoids React hydration warnings that `Math.random()` would cause
