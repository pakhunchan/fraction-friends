# Step 2: Character Graphics — Attempt 2

## Style Direction

Pixar / Disney Junior inspired cartoon characters with:

- **Big heads, tiny bodies** — the head takes up ~65% of the 100x100 viewport
- **Huge expressive eyes** — large oval sclera, colored irises, double specular highlights (big + small), upper eyelid line emphasis
- **Three distinct mood states** that change multiple facial features simultaneously:
  - **Happy**: Eyes become upward crescents (squinting joy), big open mouth with teeth and tongue
  - **Sad**: Eyes tilt down at outer corners via rotation, brows droop inward, pouty lower lip frown
  - **Neutral**: Relaxed friendly default, open eyes, gentle closed-mouth smile
- **Personality details**: Blush circles, ear outlines, per-character eyebrow shapes, nose with nostril hints

## Characters

| ID | Name    | Description                                   | Hair         | Outfit               | Extra           |
|----|---------|-----------------------------------------------|--------------|----------------------|-----------------|
| 0  | Marcus  | Friendly boy, warm brown skin                 | Short afro   | Gold/yellow hoodie   | Kangaroo pocket |
| 1  | Sophie  | Cheerful girl, light skin                     | Wavy auburn + red bow | Blue dress top | Peter Pan collar, thick lashes |
| 2  | Kai     | Mischievous boy, olive skin                   | Messy dark + cowlick | Purple t-shirt  | Star graphic, angled brows |
| 3  | Priya   | Studious girl, medium-dark skin               | Black space buns | Green cardigan    | Round glasses, thick lashes |

## Architecture

The component is decomposed into focused sub-components:

- `AfroHair`, `WavyBowHair`, `MessyCowlickHair`, `SpaceBunsHair` — hair renderers
- `Eyes` — the centerpiece; handles all 3 moods, girl lashes, iris color, dual highlights
- `Eyebrows` — 4 distinct neutral styles + mood-responsive variants
- `Mouth` — open-smile-with-teeth (happy), pouty-frown (sad), gentle-curve (neutral)
- `Nose` — button nose with subtle nostril shading
- `Ears` — with inner ear shadow
- `Body` — per-character outfit details (hoodie/dress/tee/cardigan)
- `Glasses` — round frames for Priya

## Props Interface (unchanged)

```tsx
interface CharacterProps {
  id: number;        // 0-3 selects character
  mood?: Mood;       // "neutral" | "happy" | "sad" (default: "neutral")
  onClick?: () => void;
  highlighted?: boolean;
}
```

## Files

- `Character.tsx` — Drop-in replacement React component
- `preview.html` — Self-contained HTML preview with all 12 character+mood combos, plus 48px and 32px size checks

## Differences from Attempt 1 (which was empty)

This is the first substantive attempt. It was designed to be a significant quality step up from the original flat blob characters.

## Key Design Decisions

1. **Eyes are the star**: Each open eye has 7 layers (sclera, upper shadow, iris, pupil, big highlight, small highlight, outline + lid line). This creates the "alive" Pixar look.
2. **Happy eyes close**: Rather than keeping eyes open, happy mood switches to crescent arcs — this is the signature Disney/anime "joy squint" that reads well at any size.
3. **Sad uses rotation**: Rather than redrawing sad eyes from scratch, the same open eye is `rotate()`-tilted at the outer corners, creating a natural droop effect while keeping the detailed iris rendering.
4. **Girl characters get lashes**: 4 lash lines per eye on Sophie and Priya, visible in both neutral/sad (open eye) and happy (crescent) states.
5. **Each outfit is distinct**: Hoodie with drawstrings and pocket, dress with Peter Pan collar and buttons, tee with star graphic, cardigan over light undershirt.
6. **SVG viewBox 0 0 100 100**: Matches the original component exactly for drop-in replacement.
