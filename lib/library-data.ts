export type LibraryCategory = 'canvas' | 'games' | 'web';
export type LibraryItem = {
  id: string;
  title: string;
  category: LibraryCategory;
  medium: string;
  description: string;
  href: string;
  local?: boolean;
  width?: number;
  height?: number;
  controls?: string;
  image?: string;
  sourceLabel?: string;
};
export const libraryItems: LibraryItem[] = [
  {
    id: 'dead-channel',
    title: 'Dead Channel',
    category: 'canvas',
    medium: 'Canvas / JavaScript / CSS 3D',
    description:
      'Three interactive television scenes exploring the relationship between viewer and device.',
    href: '/projects/drawing/FinalProject/index.html',
    local: true,
    width: 1100,
    height: 720,
    controls:
      'Choose a TV to open a scene. Some scenes include audio controls.',
    image: '/projects/thumbs/i.png',
  },
  {
    id: 'tv-signal',
    title: 'TV Signal',
    category: 'canvas',
    medium: 'HTML Canvas',
    description:
      'A television test-pattern drawing built from sampled colors and pixel noise.',
    href: '/projects/drawing/HTMLCanvas/index.html',
    local: true,
    width: 1100,
    height: 720,
    controls: 'A canvas drawing; reload to generate a new arrangement.',
    image: '/projects/thumbs/e.png',
  },
  {
    id: 'tv-static',
    title: 'TV Static',
    category: 'canvas',
    medium: 'Canvas / Animation / Objects',
    description:
      'Animated television static and color bars built with reusable canvas objects.',
    href: '/projects/drawing/HTMLCanvasObjects/index.html',
    local: true,
    width: 1100,
    height: 720,
    controls: 'Watch the animated canvas.',
    image: '/projects/thumbs/g.png',
  },
  {
    id: 'canvas-pair',
    title: 'Canvas Pair',
    category: 'canvas',
    medium: 'Canvas / Video / Animation',
    description:
      'Paired canvas scenes combining a landscape, animated petals, and sampled video.',
    href: '/projects/drawing/CanvasPair/index.html',
    local: true,
    width: 1260,
    height: 850,
    controls: 'Watch the two canvases; the video plays muted.',
    image: '/projects/thumbs/f.png',
  },
  {
    id: 'theatre-animation',
    title: 'Theatre Animation',
    category: 'canvas',
    medium: 'CSS / Animation',
    description: 'A theatrical composition animated with CSS.',
    href: '/projects/drawing/CSSAnimation/index.html',
    local: true,
    width: 1100,
    height: 720,
    controls: 'Watch the animated scene.',
    image: '/projects/thumbs/c.gif',
  },
  {
    id: 'cinema-icons',
    title: 'Cinema Icon System',
    category: 'canvas',
    medium: 'SVG / CSS',
    description:
      'A coordinated set of cinema icons: ticket, star, clapperboard, camera, and popcorn.',
    href: '/projects/drawing/SVG/index.html',
    local: true,
    width: 1100,
    height: 720,
    controls: 'Use the pointer to explore.',
    image: '/projects/thumbs/b.gif',
  },
  {
    id: 'spotlight-scroll',
    title: 'Spotlight & Scroll',
    category: 'canvas',
    medium: 'JavaScript / Pointer / Scroll',
    description:
      'A pointer-controlled spotlight and a linked scroll interaction.',
    href: '/projects/drawing/JSInteraction/index.html',
    local: true,
    width: 1100,
    height: 720,
    controls:
      'Move the pointer to reveal the scene. Select Scroll for the second interaction.',
    image: '/projects/thumbs/d.gif',
  },
  {
    id: 'street-audio',
    title: 'Street Scene',
    category: 'canvas',
    medium: 'Web Audio API / Video',
    description:
      'A street collage with audio playback, volume, and stereo panning controls.',
    href: '/projects/drawing/WebAudioAPI/index.html',
    local: true,
    width: 1100,
    height: 720,
    controls:
      'Press Play inside the scene to enable sound. Adjust volume and panning.',
    image: '/projects/thumbs/h.png',
  },
  {
    id: 'planet-hopper',
    title: 'Planet Hopper',
    category: 'games',
    medium: 'p5.js / Matter.js',
    description:
      'A pixel-art adventure with quests, dialogue, combat, and directional gravity.',
    href: '/projects/interactive/franyelFinal/index.html',
    local: true,
    width: 1100,
    height: 750,
    controls:
      'WASD: move · Arrow keys: gravity · E: interact · X: dialogue · R: reset. Click the game first.',
    image: '/projects/interactive/franyelFinal/media/images/background.png',
  },
  {
    id: 'critters',
    title: 'Critters of Creation',
    category: 'games',
    medium: 'p5.js / Interactive Computing',
    description:
      'A multi-world exploration game from the Interactive Computing midterm.',
    href: '/projects/interactive/midterm/index.html',
    local: true,
    width: 800,
    height: 600,
    controls: 'Click the game first, then follow its on-screen prompts.',
  },
  {
    id: 'breakout',
    title: 'Breakout!',
    category: 'games',
    medium: 'p5.js / Game',
    description:
      'A paddle-and-ball game with accelerating bounces and collectible targets.',
    href: '/projects/interactive/assignment02/index.html',
    local: true,
    width: 700,
    height: 750,
    controls: 'Click to launch the ball. A / D: move the paddle.',
  },
  {
    id: 'skyhunt',
    title: 'Skyhunt',
    category: 'games',
    medium: 'p5.js / Game',
    description:
      'A target-shooting game with three weapons, reload timing, and escalating enemies.',
    href: '/projects/interactive/assignment03/index.html',
    local: true,
    width: 1000,
    height: 850,
    controls: 'Click: shoot · 1 / 2 / 3: switch weapon · R: reload.',
  },
  {
    id: 'pension-panic',
    title: 'Pension Panic',
    category: 'games',
    medium: 'p5.js / Matter.js',
    description:
      'A physics game about keeping falling money airborne with a jetpack and movable ramps.',
    href: '/projects/interactive/assignment05/index.html',
    local: true,
    width: 800,
    height: 1100,
    controls: '← / →: move · Space: blast wind · Q / W: lift the ramps.',
  },
  {
    id: 'robot-routing',
    title: 'Robot Routing',
    category: 'games',
    medium: 'p5.js / Objects',
    description: 'Generative robots navigate a field of directional arrows.',
    href: '/projects/interactive/assignment04/index.html',
    local: true,
    width: 820,
    height: 620,
    controls: 'Click arrows to change the robots’ routes.',
  },
  {
    id: 'floating-island',
    title: 'Floating Island',
    category: 'games',
    medium: 'A-Frame / p5.js / 3D',
    description:
      'An explorable 3D world with a floating island, a house, and interactive objects.',
    href: '/projects/interactive/assignment06/index.html',
    local: true,
    width: 1100,
    height: 720,
    controls:
      'Click and drag to look around; use the scene’s movement and object interactions.',
  },
  {
    id: 'swimming-fish',
    title: 'Swimming Fish',
    category: 'games',
    medium: 'p5.js / Animation',
    description:
      'An early p5.js study of a swimming fish with randomized color and motion.',
    href: '/projects/interactive/assignment01/index.html',
    local: true,
    width: 420,
    height: 420,
    controls: 'Watch the animated sketch.',
  },
  {
    id: 'sail',
    title: 'SAIL',
    category: 'web',
    medium: 'React / Next.js / Motion',
    description:
      'Marketing website with interactive product visualizations and original motion content.',
    href: 'https://sailgtx.com',
    sourceLabel: 'Live website',
  },
  {
    id: 'studio',
    title: 'Antonio Jefferson Studio',
    category: 'web',
    medium: 'Flask / MongoDB / Stripe',
    description:
      'Studio booking platform with calendar integration, payments, and automated confirmations.',
    href: 'https://ajstudiosite.onrender.com/',
    sourceLabel: 'Live demo',
  },
  {
    id: 'kitchin',
    title: 'kitchIn',
    category: 'web',
    medium: 'Flask / MongoDB / Docker',
    description:
      'Shared household pantry management with requests, authentication, and household roles.',
    href: 'https://github.com/Franyel1/kitchIn',
    sourceLabel: 'GitHub repository',
  },
];
