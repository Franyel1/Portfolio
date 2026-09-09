// Each row is a complete palette: water, sand, sun, sky, botanical accent.
export const beachPalettes = [
  [
    [45, 112, 132],
    [234, 202, 163],
    [238, 135, 88],
    [169, 206, 216],
    [49, 112, 79],
  ],
  [
    [46, 97, 128],
    [225, 184, 155],
    [227, 114, 108],
    [173, 185, 212],
    [116, 84, 116],
  ],
  [
    [39, 113, 118],
    [229, 201, 156],
    [235, 172, 81],
    [177, 211, 204],
    [78, 128, 94],
  ],
  [
    [54, 85, 120],
    [215, 185, 165],
    [217, 131, 127],
    [164, 181, 209],
    [116, 139, 154],
  ],
];
export function pickBeachPalette(random = Math.random) {
  return beachPalettes[Math.floor(random() * beachPalettes.length)].map(
    ([r, g, b]) => `rgba(${r}, ${g}, ${b}, 1)`,
  );
}
