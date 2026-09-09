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

The three homepage collections open in accessible, independently scrollable dialogs without changing the page URL or scroll position. Drawing on the Web composites eight actual canvas surfaces into one animated canvas; `scripts/adapt-canvas.mjs` wraps the supplied drawing functions in isolated modules, repairs implicit globals, and removes audio routines. The collage owns one animation scheduler and releases its video and callbacks on close. Creative Work is an empty WIP collection awaiting artwork. Web Applications links to SAIL, Antonio Jefferson Studio, and Ink, using verified assets from the first two websites. The old `/library` route redirects to the homepage collection chooser.

The original imported coursework remains under `public/projects` for future use. It is no longer displayed as a populated interactive gallery. `scripts/check-canvas.mjs` renders all eight adapted surfaces with a native canvas implementation and checks for runtime errors and empty output.

## Decorative asset provenance

Only the painted chapter texture is AI-generated. `public/images/canvas.png` was made with the built-in image-generation tool: landscape 3:2 abstract impasto painting, ultramarine dominant with coral orange, butter yellow and magenta; tactile bristles; no text. It is decorative and not attributed to Franyel as an original drawing.

## Validation

TypeScript check and production build pass. Original résumé verified byte-for-byte against the supplied PDF. Local site response checked. No automated browser interaction or cross-device visual testing has been performed.
