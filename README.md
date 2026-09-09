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

The three homepage collections open in accessible, independently scrollable dialogs without changing the page URL or scroll position. Drawing on the Web composites five selected artworks into one canvas: the animated beach from assignments/HTMLCanvasObjects, orchid and daisy SVGs from assignments/SVG, the cherry-blossom landscape from assignments2/CanvasPair, and one final television signal from assignments2/FinalProject/watchingTV. Earlier beach/TV versions, static backgrounds, video-dot samples, and basic rain exercises are omitted to avoid repetition and favor finished compositions. The supplied SVG paths are preserved, mounted on neutral paper; animated works use the original drawing algorithms with isolated globals. The collage owns one scheduler with three animation loops and releases callbacks on close; it loads no video or audio. Creative Work remains an empty WIP collection. Web Applications links to SAIL, Antonio Jefferson Studio, and Ink. The old `/library` route redirects to the collection chooser.

The original imported coursework remains under `public/projects` for future use. Additional selected originals are preserved under `public/projects/drawing-selected`. `scripts/adapt-canvas.mjs` generates isolated adapters. `scripts/check-canvas.mjs` renders all five selected artworks using the same composition code at desktop and mobile sizes, checks nonempty output and animation loop counts, and refreshes the card thumbnail before building.

## Decorative asset provenance

The SAIL and AJ Studio project thumbnails are browser captures of their live homepage first screens, taken for the portfolio. Ink uses white typography on black. The drawing thumbnail is rendered from the supplied canvas algorithms. Skills use locally stored Devicon v2.16.0 SVGs (https://github.com/devicons/devicon), retaining the project's MIT licensing; brand marks belong to their owners.

About is organized into an introduction, education facts, experience timeline, and interactive skills workbench. Pointer tilt, staggered entrances, and native scroll-linked image transforms respect reduced-motion preferences and the site's motion control. Native scroll-linked effects progressively enhance browsers supporting view timelines; the content and entrance effects remain usable without them.

The editorial refinement follows NN/g's visual hierarchy and purposeful motion guidance: https://www.nngroup.com/articles/good-visual-design/ and https://www.nngroup.com/articles/animation-purpose-ux/. Applied decisions: factual project descriptions, a featured drawing collection, a lead web project with supporting projects, fewer nested panels and pill tags, real site captures, and interaction-focused motion. The requested sketch → canvas → glass → pixel sequence remains the visual foundation.

Only the painted chapter texture is AI-generated. `public/images/canvas.png` was made with the built-in image-generation tool: landscape 3:2 abstract impasto painting, ultramarine dominant with coral orange, butter yellow and magenta; tactile bristles; no text. It is decorative and not attributed to Franyel as an original drawing.

## Validation

TypeScript check and production build pass. Original résumé verified byte-for-byte against the supplied PDF. Local site response checked. No automated browser interaction or cross-device visual testing has been performed.
