# Franyel

A personal website in four material chapters: sketch, canvas, glass, and pixel art.

## Development

Run `npm install`, then `npm run dev`. Build with `npm run build`.

The project is in this `site` directory so the original parent repository remains intact. Sites source history is maintained here independently.

## Content

- `app/page.tsx`: projects, experience, creative study briefs, navigation and dialogs.
- `app/globals.css`: section themes, responsive layouts and material transitions.
- `components/glass-sculpture.tsx`: interactive WebGL glass loop, visibility-aware rendering and motion controls.
- `public/resume.pdf`: a one-page résumé prepared from the supplied LaTeX content.

The creative studies are explicitly planned work, not completed artwork. Replace their typographic brief cards with original work as it becomes available. Project visuals are labeled workflow illustrations, not screenshots. No performance metrics are invented.

## Decorative asset provenance

The three chapter images were made with the built-in image-generation tool and are not attributed to Franyel as original drawings.

- `public/images/sketch.png`: Square monochrome graphite drawing on warm ivory paper of a flowing tangled ribbon/knot, loose construction circles and delicate hatching; no text.
- `public/images/canvas.png`: Landscape 3:2 abstract impasto painting, ultramarine dominant with coral orange, butter yellow and magenta; tactile bristles; no text.
- `public/images/pixel.png`: Landscape 3:2 pixel-art night-blue sky, peach horizon, purple hills, blue meadow, and a tiny explorer on the right; open sky for text; no lettering.

## Validation

TypeScript check and production build pass. Résumé rendered and visually reviewed. Site and local asset responses checked. No automated browser interaction or cross-device visual testing has been performed.
