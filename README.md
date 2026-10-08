# Franyel

A personal website in four material chapters: sketch, canvas, glass, and pixel art.

## Development

This is a local Next.js 16 App Router app with React 19, TypeScript, Tailwind CSS 4, and the original custom CSS and artwork. Use Node.js 22.13 or newer.

From this repository's root:

```powershell
cd site
npm install
npm run dev
```

Open http://localhost:3000 (or the address printed by the server). Edit files in `app` and `components`; the page updates automatically.

For a production server, stop development, then run:

```powershell
npm run build
npm start
```

Run `npm run typecheck` for TypeScript checks and `npm run lint` for linting. Tailwind runs through `postcss.config.mjs`; custom styling lives in `app/globals.css`, `app/polish.css`, `app/editorial.css`, and the latest visual refinement in `app/atelier.css`. Images, résumé, and imported artwork are local files in `public`. Google Fonts are fetched during the initial build.

The old Sites hosting manifest is retained as project history; local development and production use Next.js directly. To deploy to a Next.js host, select `site` as the project root.

## Content

- `app/page.tsx`: projects, experience, and links into the project library.
- `app/globals.css`: navy typographic opening, section themes, responsive layouts and material transitions.
- `components/magic-eight-ball.tsx`: interactive Magic 8 Ball with a PS2-inspired faceted mesh, mouse-following rotation, directional drag/tap/keyboard shaking, and 20 randomized answers. `lib/eight-ball-renderer.ts` projects 144 flat-shaded triangles and cached retro textures in Canvas 2D, without requiring WebGL. One bounded motion controller settles into the exact final pose before publishing the answer; idle rendering stops entirely. Pause and reduced motion reveal answers immediately. The previous glass-loop components are retained as unused source.
- `components/pixel-landscape.tsx`: original code-drawn canvas landscape. Integer four-CSS-pixel grid, no image smoothing, and responsive dimensions. Draws on resize, with no idle animation loop.
- `public/resume.pdf`: the original PDF supplied by Franyel, copied unchanged.

The opening uses oversized live sketch typography and construction guides. Four material sheets reveal one another as the preceding sheet rises away: sketch, canvas, glass, and pixels. Selected work and About share the continuous glass sheet. Transparent torn-paper and painted-bristle assets and a static canvas contour belong to the outgoing sheets. The bottom of About is drawn in canvas; its pixel contour reveals the full sky beneath it. The incoming landscape has no separate upper cutout, so one boundary travels with the lifting page. Pages and cards stay flat, with no pointer parallax or tilt. The pixel scene is drawn entirely in canvas, with no raster backdrop.

The three homepage collections open in accessible, independently scrollable dialogs without changing the page URL or scroll position. Drawing on the Web composites eight studies into one transparent canvas: beach, sampled TV bars, neon ice cubes, Minecraft block and rose, fish and droplets, geometric forms, waves, and static. Large gradient-tinted flower SVGs decorate the edges. The beach randomly chooses a complete coordinated palette each time the collection opens; four palettes maintain distinct water, sand, sun, sky, and botanical colors.

The ice and Minecraft scenes adapt the supplied six-face CSS cubes to a shared canvas texture renderer, retaining the original SVG faces and pixel textures. Ice renders twelve cubes with pre-rasterized faces. Minecraft caches the sky/terrain and disables image smoothing. Fish uses the supplied Canvas Pair video and color-sampled expanding rings: the 4.82 MB original is optimized to a 1.94 MB, 600px, 24fps H.264 clip with no audio track. One persistent 60×40 sampling canvas and a capped ripple pool replace per-drop allocations. The native render uses a poster extracted from that same clip.

The collage loads only when opened and uses the existing scheduler capped at 30fps with independent clocks. Offscreen studies stop updating, and the fish video pauses when offscreen, hidden, or motion-paused. Pausing stops the frame loop entirely; paused scrolling repaints once for the newly visible region. Geometry is cached on scroll and resize, and animated paints are clipped to the collection viewport. Closing clears callbacks and unloads the video. The output pixel ratio is capped at 1 to limit memory for the tall canvas. Static particle count is reduced from 5,000 to 1,400. Creative Work remains an empty WIP collection. Web Applications links to SAIL, Antonio Jefferson Studio, and Ink. The old `/library` route redirects to the collection chooser.

The original imported coursework remains under `public/projects` for future use. Additional source scripts, CSS, textures and the optimized fish clip are under `public/projects/drawing-selected`. `scripts/adapt-canvas.mjs` generates isolated adapters. `scripts/check-canvas.mjs` renders all eight artworks at desktop and mobile sizes, checks rotated bounds for clipping, checks palette diversity and scheduler suspend/resume/cleanup, and refreshes the card thumbnail before building. No browser playback or cross-device performance testing has been performed.

## Decorative asset provenance

The SAIL and AJ Studio project thumbnails are browser captures of their live homepage first screens, taken for the portfolio. Ink uses white typography on black. The drawing thumbnail is rendered from the supplied canvas algorithms. Skills use locally stored Devicon v2.16.0 SVGs (https://github.com/devicons/devicon), retaining the project's MIT licensing; brand marks belong to their owners.

About is organized into an introduction, education facts, experience timeline, and interactive skills workbench. The page reveal respects reduced-motion preferences and the site's motion control. Extra image, title, and asterisk scroll animations are removed. Native scroll-linked reveals progressively enhance browsers supporting view timelines, with a cached-layout fallback for other browsers.

The editorial refinement follows NN/g's visual hierarchy and purposeful motion guidance: https://www.nngroup.com/articles/good-visual-design/ and https://www.nngroup.com/articles/animation-purpose-ux/. Applied decisions: factual project descriptions, a featured drawing collection, a lead web project with supporting projects, fewer nested panels and pill tags, real site captures, and interaction-focused motion. The requested sketch → canvas → glass → pixel sequence remains the visual foundation.

The decorative AI sculptures have been removed. The Library uses a newly generated coral painted-canvas texture, with transparent torn-paper and dry-brush paint scans for the outgoing boundaries. The three local assets live in `public/materials`; the exact built-in imagegen prompts are saved in [docs/material-asset-prompts.json](docs/material-asset-prompts.json). Fixed material sizing preserves their aspect ratios: phones crop the strips, wider screens repeat them, and a short color blend joins each edge to its page. Original drawings, real project captures, and the pixel landscape remain. A functional Magic 8 Ball replaces the glass loop in the projects introduction. The tools workbench uses light lettering on navy and dark text on its light detail surface. Source research and validation are recorded in [docs/design-polish.md](docs/design-polish.md).

The page reveal uses one native CSS translation per incoming sheet where supported, with a continuous handoff into normal scrolling and no JavaScript transition updates during scrolling. All page rotation, perspective, and full-sheet drop-shadow filters are removed. The scheduled-frame fallback caches layout measurements until reflow. Chapter navigation resolves normal layout positions on click, and navigation highlighting caches chapter positions until resize. Paper fibers, painted bristles, and the pixel contour give each material a distinct boundary attached to its outgoing sheet. Navigation and the collection overlay use readable surfaces without backdrop blur. The paper and paint assets need no separate animation loop. The Magic 8 Ball renders only during interaction or resize. Projects joins About without an exposed background gap; the index label is simply “Projects.”

## Validation

Run `node scripts/check-eight-ball.mjs` for mesh topology, rigid rotation, texture mapping, gesture direction, and animation easing checks. It uses the existing TypeScript package and Node's assertions without another test dependency.

The original project recorded résumé verification against the supplied PDF. The October 2026 refinement passes the production static-export build, TypeScript, and focused lint for the page and motion controllers. The about component retains its two existing raw-image lint warnings. Browser checks covered desktop and phone layouts, forward and reverse page reveals, tools tabs and selection, motion pause/resume, mobile navigation, and the original canvas collection. Earlier checks covered pointer depth and the web collection. The final static export was also reviewed in the browser. Full-repository lint still reports existing issues in the artwork and untouched components. Physical-device and cross-browser performance testing has not been performed; see the source record for exact validation scope.
