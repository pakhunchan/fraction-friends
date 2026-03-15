# Step 2: Character Graphics (Attempt 1)

Drop-in replacement for the Character component with detailed SVG character art.

## Files

- **Character.tsx** -- React component, same props interface as original
- **preview.html** -- Standalone visual preview (open in any browser)

## Characters

| ID | Description | Shirt | Eye Color | Distinguishing Features |
|----|-------------|-------|-----------|------------------------|
| 0 | Boy, curly dark hair, warm brown skin | Gold/yellow | Brown | Curly hair made of overlapping circles |
| 1 | Girl, long straight brown hair, light skin | Blue | Blue-grey | Hair falls past shoulders, pink headband with bow |
| 2 | Boy, spiky black hair, medium skin | Purple hoodie | Green | Dramatic spikes, hoodie with drawstrings and pocket |
| 3 | Girl, red pigtails, freckles, fair skin | Green | Green | Pigtails with gold hair bands, wispy bangs, freckles |

## Mood Variants

- **Neutral**: Relaxed eyebrows, open eyes with full iris/pupil detail, gentle smile curve
- **Happy**: Raised eyebrows, squinted "joy" eyes (smaller eye opening), wide open mouth showing teeth, rosy cheek blush
- **Sad**: Angled "worried" eyebrows, droopy upper-lid lines, downturned mouth

## Design Notes

- SVG gradients used for skin (radialGradient) and hair (linear or radial) to add depth
- Each character has a unique eye color (brown, blue-grey, green, green) for personality
- White eye highlights (primary + secondary) give the cartoon "alive" look
- Girls have subtle eyelash details
- Clothing has collar/neckline detail and subtle shadow lines
- All characters fit within a 100x100 viewBox
- Gradient IDs are scoped per character (skin0, skin1, etc.) to avoid conflicts when multiple characters render simultaneously
