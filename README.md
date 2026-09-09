# Franyel

A personal website in four material chapters: sketch, canvas, glass, and pixel art.

## Development

Run `npm install`, then `npm run dev`. Build with `npm run build`.

The project is in this `site` directory so the original parent repository remains intact. Sites source history is maintained here independently.

## Content

- `app/page.tsx`: projects, experience, and links into the project library.
- `app/globals.css`: navy typographic opening, section themes, responsive layouts and material transitions.
- `components/glass-sculpture.tsx`: interactive WebGL glass loop.
- `components/pixel-landscape.tsx`: original code-drawn canvas landscape. Integer four-CSS-pixel grid, no image smoothing, responsive dimensions and visibility-aware star animation. Respects the motion control.
- `public/resume.pdf`: the original PDF supplied by Franyel, copied unchanged.

The opening is live typography, with outline layers, construction guides, and an ink reveal. It uses no generated image. The pixel scene is drawn entirely in canvas, with no raster backdrop.

The library contains eight Drawing on the Web projects and eight Interactive Computing projects copied from the supplied C:\dev folders, plus live links for SAIL, Antonio Jefferson Studio, and Ink. The library opens as a scrollable overlay on the homepage; coursework cards lead to the playable project view. Original coursework assets and code are preserved, with hosting adaptations limited to local dependency and asset paths. Drawing thumbnails are silent for now so the collage can stay easy to explore.

## Decorative asset provenance

Only the painted chapter texture is AI-generated. `public/images/canvas.png` was made with the built-in image-generation tool: landscape 3:2 abstract impasto painting, ultramarine dominant with coral orange, butter yellow and magenta; tactile bristles; no text. It is decorative and not attributed to Franyel as an original drawing.

## Validation

TypeScript check and production build pass. Original résumé verified byte-for-byte against the supplied PDF. Local site response checked. No automated browser interaction or cross-device visual testing has been performed.
