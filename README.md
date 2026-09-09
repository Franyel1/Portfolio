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

The three homepage collections open in accessible, independently scrollable dialogs without changing the page URL or scroll position. Drawing on the Web composites eight studies into one transparent canvas: beach, sampled TV bars, neon ice cubes, Minecraft block and rose, fish and droplets, geometric forms, waves, and static. Large gradient-tinted flower SVGs decorate the edges. The beach randomly chooses a complete coordinated palette each time the collection opens; four palettes maintain distinct water, sand, sun, sky, and botanical colors.

The ice and Minecraft scenes adapt the supplied six-face CSS cubes to a shared canvas texture renderer, retaining the original SVG faces and pixel textures. Ice renders twelve cubes with pre-rasterized faces. Minecraft caches the sky/terrain and disables image smoothing. Fish uses the supplied Canvas Pair video and color-sampled expanding rings: the 4.82 MB original is optimized to a 1.94 MB, 600px, 24fps H.264 clip with no audio track. One persistent 60×40 sampling canvas and a capped ripple pool replace per-drop allocations. The native render uses a poster extracted from that same clip.

The collage has one 30fps scheduler with independent clocks. Offscreen studies stop updating, and the fish video pauses when offscreen, hidden, or motion-paused. Closing clears callbacks and unloads the video. The output pixel ratio is capped at 1.5 to limit memory for the tall canvas. Static particle count is reduced from 5,000 to 1,400. Creative Work remains an empty WIP collection. Web Applications links to SAIL, Antonio Jefferson Studio, and Ink. The old `/library` route redirects to the collection chooser.

The original imported coursework remains under `public/projects` for future use. Additional source scripts, CSS, textures and the optimized fish clip are under `public/projects/drawing-selected`. `scripts/adapt-canvas.mjs` generates isolated adapters. `scripts/check-canvas.mjs` renders all eight artworks at desktop and mobile sizes, checks rotated bounds for clipping, checks palette diversity and scheduler suspend/resume/cleanup, and refreshes the card thumbnail before building. No browser playback or cross-device performance testing has been performed.

## Decorative asset provenance

The SAIL and AJ Studio project thumbnails are browser captures of their live homepage first screens, taken for the portfolio. Ink uses white typography on black. The drawing thumbnail is rendered from the supplied canvas algorithms. Skills use locally stored Devicon v2.16.0 SVGs (https://github.com/devicons/devicon), retaining the project's MIT licensing; brand marks belong to their owners.

About is organized into an introduction, education facts, experience timeline, and interactive skills workbench. Pointer tilt, staggered entrances, and native scroll-linked image transforms respect reduced-motion preferences and the site's motion control. Native scroll-linked effects progressively enhance browsers supporting view timelines; the content and entrance effects remain usable without them.

The editorial refinement follows NN/g's visual hierarchy and purposeful motion guidance: https://www.nngroup.com/articles/good-visual-design/ and https://www.nngroup.com/articles/animation-purpose-ux/. Applied decisions: factual project descriptions, a featured drawing collection, a lead web project with supporting projects, fewer nested panels and pill tags, real site captures, and interaction-focused motion. The requested sketch → canvas → glass → pixel sequence remains the visual foundation.

Only the painted chapter texture is AI-generated. `public/images/canvas.png` was made with the built-in image-generation tool: landscape 3:2 abstract impasto painting, ultramarine dominant with coral orange, butter yellow and magenta; tactile bristles; no text. It is decorative and not attributed to Franyel as an original drawing.

## Validation

TypeScript check and production build pass. Original résumé verified byte-for-byte against the supplied PDF. Local site response checked. No automated browser interaction or cross-device visual testing has been performed.
