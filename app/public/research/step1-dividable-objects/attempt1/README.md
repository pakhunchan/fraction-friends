# Cookie SVG Component - Attempt 1

## What was created

A drop-in replacement for the existing `Cookie.tsx` component with rich, detailed SVG graphics:

- **Whole cookie** -- Golden-brown with radial gradient shading, 10 irregularly-placed chocolate chips (ellipses with rotation for organic shapes), a subtle fractal-noise texture overlay, highlight/shadow gradients for 3D dome effect, and a slightly wobbly edge path (cubic bezier instead of a perfect circle).
- **Half cookies (left/right)** -- The whole cookie sliced vertically at the center. Each half shows only the chips that fall on its side. The straight cut edge is rendered in a lighter "crumb" color via a linear gradient.
- **Quarter cookie** -- Upper-right quadrant wedge with two cut edges (vertical and horizontal) both showing the crumb-colored cut line.
- **Selected state** -- Blue glow filter effect (matches the existing `ring-blue-400` style) plus a dashed white slice indicator line on whole cookies.

## Files

- `Cookie.tsx` -- React component, same interface as the original
- `preview.html` -- Standalone HTML showing all variants at multiple sizes; open directly in a browser
- `README.md` -- This file

## How to preview

```bash
open step1-dividable-objects/attempt1/preview.html
```

Or simply double-click the file in Finder. No build step needed -- it is pure HTML with inline SVGs.

## How to integrate

Copy `Cookie.tsx` to replace the existing component:

```bash
cp step1-dividable-objects/attempt1/Cookie.tsx app/src/app/components/Cookie.tsx
```

The component has the same exports (`Cookie`, `SlicedCookie`) and the same props interface, so no other files need to change.

## Design details

- **Edge path**: Cubic bezier loop with slight perturbations so the outline is not a perfect circle
- **Gradients**: `radialGradient` for body (lighter center, darker edges), highlight (top-left white glow), and shadow (bottom-right darkening)
- **Texture**: SVG `feTurbulence` filter blended at low opacity for a baked-surface look
- **Chocolate chips**: Rotated ellipses with per-chip shadow and highlight sub-ellipses
- **Cut edges**: `linearGradient` in a warm crumb color (#e8c088) along the straight slice lines
- **Drop shadow**: `feDropShadow` for depth against the page background
- **Selected glow**: `feGaussianBlur` + `feFlood` (blue) composited around the cookie shape
- **Color palette**: #eab06a (highlight center), #d4894e (base), #c07a3e (mid-edge), #a86830 (outer edge), #3d2314 / #2a1508 (chips), #e8c088 (cut crumb)
