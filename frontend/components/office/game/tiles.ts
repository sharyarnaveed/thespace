import type { Frame } from "@/components/pixel/grid";
import { Px } from "@/components/pixel/painter";

export const TILE = 16;

/** Tileset indices. Wall caps occupy 16 slots, one per open-side mask. */
export const T = {
  WOOD_A: 0,
  WOOD_B: 1,
  CARPET: 2,
  KITCHEN: 3,
  FACE: 4,
  WINDOW: 5,
  BLOCK: 6,
  CAP: 7, // 7..22
  TILES: 23,
  CONCRETE: 24,
  BRICK: 25,
  BRICK_WINDOW: 26,
  GRASS: 27,
} as const;

/** Open-side bits for wall caps: which neighbours are not walls. */
export const OPEN = { N: 1, E: 2, S: 4, W: 8 } as const;

function wood(offset: number): Frame {
  const p = new Px(TILE, TILE).rect(0, 0, TILE, TILE, "1");
  for (let r = 0; r < 4; r++) {
    const y = r * 4;
    const seam = (r * 7 + offset) % TILE;
    p.hline(0, y + 3, TILE, "2");
    p.vline(seam, y, 3, "2");
    p.hline((seam + 3) % 12, y, 3, "3");
    p.px((seam + 9) % TILE, y + 1, "2");
  }
  return p.frame();
}

function carpet(): Frame {
  const p = new Px(TILE, TILE).rect(0, 0, TILE, TILE, "9");
  for (let y = 0; y < TILE; y += 4) for (let x = (y / 4) % 2 ? 2 : 0; x < TILE; x += 4) p.px(x + 1, y + 1, "0");
  return p.frame();
}

function kitchen(): Frame {
  const p = new Px(TILE, TILE).rect(0, 0, TILE, TILE, "K");
  p.rect(8, 0, 8, 8, "L").rect(0, 8, 8, 8, "L");
  return p.frame();
}

/** Large office floor tiles with grout lines. */
function floorTiles(): Frame {
  const p = new Px(TILE, TILE).rect(0, 0, TILE, TILE, "1");
  p.hline(0, 15, TILE, "2").vline(15, 0, TILE, "2");
  p.hline(1, 1, 5, "3").vline(1, 1, 4, "3");
  return p.frame();
}

function concrete(): Frame {
  const p = new Px(TILE, TILE).rect(0, 0, TILE, TILE, "1");
  [[2, 3], [9, 1], [13, 7], [5, 10], [11, 13], [1, 14]].forEach(([x, y], i) => p.px(x, y, i % 2 ? "3" : "2"));
  p.hline(0, 15, TILE, "2");
  return p.frame();
}

/** Garden lawn with a few darker blades. */
function grass(): Frame {
  const p = new Px(TILE, TILE).rect(0, 0, TILE, TILE, "l");
  [[2, 3], [9, 1], [13, 7], [5, 10], [11, 13], [1, 13], [7, 6]].forEach(([x, y], i) => p.px(x, y, "g").px(x + (i % 2 ? 1 : -1), y - 1, "g"));
  return p.frame();
}

function brick(): Frame {
  const p = new Px(TILE, TILE).rect(0, 0, TILE, TILE, "4");
  p.hline(0, 0, TILE, "7");
  for (let row = 0; row < 3; row++) {
    const y = 1 + row * 4;
    p.hline(0, y + 3, TILE, "5");
    const off = row % 2 ? 4 : 0;
    for (let x = off; x < TILE; x += 8) p.vline(x, y, 3, "5");
  }
  p.rect(0, 13, TILE, 2, "8").hline(0, 15, TILE, "k");
  return p.frame();
}

function face(): Frame {
  const p = new Px(TILE, TILE).rect(0, 0, TILE, TILE, "4");
  p.hline(0, 0, TILE, "7").hline(0, 1, TILE, "5");
  p.vline(3, 3, 9, "5").vline(11, 3, 9, "5");
  p.hline(0, 12, TILE, "5").rect(0, 13, TILE, 2, "8").hline(0, 15, TILE, "k");
  return p.frame();
}

function windowTile(wall = face()): Frame {
  const p = new Px(TILE, TILE).stamp(wall);
  p.box(2, 2, 12, 10, "q", "k").rect(3, 3, 10, 8, "q");
  p.vline(7, 3, 8, "w").vline(8, 3, 8, "w").hline(3, 6, 10, "w");
  p.px(4, 4, "w").px(5, 4, "w").px(4, 5, "w").px(10, 8, "w");
  p.hline(1, 12, 14, "e").hline(1, 13, 14, "k");
  return p.frame();
}

function cap(mask: number): Frame {
  const p = new Px(TILE, TILE).rect(0, 0, TILE, TILE, "6");
  if (mask & OPEN.N) p.hline(0, 0, TILE, "7");
  if (mask & OPEN.S) p.hline(0, 15, TILE, "7");
  if (mask & OPEN.W) p.vline(0, 0, TILE, "7");
  if (mask & OPEN.E) p.vline(15, 0, TILE, "7");
  return p.frame();
}

/** Every tile frame, in tileset order. */
export function tileFrames(): Frame[] {
  const blank = new Px(TILE, TILE).frame();
  return [
    wood(3),
    wood(11),
    carpet(),
    kitchen(),
    face(),
    windowTile(),
    blank,
    ...Array.from({ length: 16 }, (_, m) => cap(m)),
    floorTiles(),
    concrete(),
    brick(),
    windowTile(brick()),
    grass(),
  ];
}
