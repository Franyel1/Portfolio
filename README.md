# Franyel

A personal website in four material chapters: sketch, canvas, glass, and pixel art.

## Development

Run `npm install`, then `npm run dev`. Build with `npm run build`.

The project is in this `site` directory so the original parent repository remains intact. Sites source history is maintained here independently.

## Content

- `app/page.tsx`: projects, experience, creative study briefs, navigation and dialogs.
- `app/globals.css`: navy typographic opening, section themes, responsive layouts and material transitions.
- `components/glass-sculpture.tsx`: interactive WebGL glass loop.
- `components/pixel-landscape.tsx`: original code-drawn canvas landscape. Integer four-CSS-pixel grid, no image smoothing, responsive dimensions and visibility-aware star animation. Respects the motion control.
- `public/resume.pdf`: a one-page résumé prepared from the supplied LaTeX content.

The opening is live typography, with outline layers, construction guides, and an ink reveal. It uses no generated image. The pixel scene is drawn entirely in canvas, with no raster backdrop.

Creative studies are explicitly planned work, not completed artwork. Project visuals are labeled workflow illustrations, not screenshots. No performance metrics are invented.

## Decorative asset provenance

Only the painted chapter texture is AI-generated. `public/images/canvas.png` was made with the built-in image-generation tool: landscape 3:2 abstract impasto painting, ultramarine dominant with coral orange, butter yellow and magenta; tactile bristles; no text. It is decorative and not attributed to Franyel as an original drawing.

## Validation

TypeScript check and production build pass. Résumé rendered and visually reviewed. Local site response checked. No automated browser interaction or cross-device visual testing has been performed.
