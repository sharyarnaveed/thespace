import type { Frame } from "@/components/pixel/grid";
import { catFrames, plantFrames } from "@/components/pixel/sprites";
import { Px } from "@/components/pixel/painter";
import type { Theme } from "./themes";

/**
 * Pixel-art furniture, drawn in a 3/4 top-down view: top surfaces first, then
 * a darker front face. Colours come from the theme palette (see `themes.ts`),
 * so the same shapes restyle per workspace style.
 */

const MONITOR: Frame = [
  "kkkkkkkkkkkk",
  "kxxxxxxxxxxk",
  "kxqqqqxxxxxk",
  "kxxvvvvvxxxk",
  "kxxxyyyxxxxk",
  "kxqqqxxxxxxk",
  "kxxxxxxxxxxk",
  "kkkkkkkkkkkk",
  "....kAAk....",
  "..kkAAAAkk..",
];

const MUG: Frame = ["kkkk.", "kmmkk", "knnkk", "kkkk."];
const SPROUT: Frame = [".kk.k", "kglkgk", ".kgGk.", "kkkkk", "kbbBk", ".kkk."];
const BOOKS: Frame = ["kkkkkk", "kyktkn", "kyktkn", "kkkkkk"];

function desk(extra: Theme["deskExtra"] | "mine"): Frame {
  const p = new Px(32, 26);
  p.box(0, 8, 32, 11, "d").hline(1, 9, 30, "e");
  p.box(0, 18, 32, 6, "D").hline(1, 19, 30, "d");
  p.rect(1, 23, 3, 3, "k").rect(28, 23, 3, 3, "k");
  p.stamp(MONITOR, 10, 0);
  p.box(10, 13, 12, 4, "a").hline(11, 14, 10, "m");
  if (extra === "mine") p.box(25, 10, 5, 5, "y").hline(26, 12, 3, "n");
  if (extra === "plant") p.stamp(SPROUT, 25, 9);
  if (extra === "books") p.stamp(BOOKS, 24, 12);
  if (extra === "mug") p.stamp(MUG, 25, 12);
  return p.frame();
}

function chair(): Frame {
  return new Px(14, 16)
    .box(2, 0, 10, 9, "U")
    .hline(3, 7, 8, "V")
    .box(1, 8, 12, 5, "V")
    .rect(6, 13, 2, 2, "A")
    .hline(3, 15, 8, "k")
    .frame();
}

function sofa(): Frame {
  const p = new Px(32, 22);
  p.box(1, 0, 30, 11, "F").hline(2, 9, 28, "f");
  p.box(4, 9, 24, 9, "F").vline(16, 10, 7, "f").hline(5, 16, 22, "f");
  p.box(0, 5, 6, 15, "F").box(26, 5, 6, 15, "F");
  p.hline(1, 6, 4, "f").hline(27, 6, 4, "f");
  p.rect(2, 20, 2, 2, "k").rect(28, 20, 2, 2, "k");
  return p.frame();
}

function armchair(): Frame {
  const p = new Px(16, 20);
  p.box(1, 0, 14, 10, "F").hline(2, 8, 12, "f");
  p.box(3, 8, 10, 8, "F").hline(4, 14, 8, "f");
  p.box(0, 5, 4, 13, "F").box(12, 5, 4, 13, "F");
  p.rect(1, 18, 2, 2, "k").rect(13, 18, 2, 2, "k");
  return p.frame();
}

function table(w: number, h: number, mugs: number[] = []): Frame {
  const p = new Px(w, h);
  p.box(0, 0, w, h - 6, "d").hline(1, 1, w - 2, "e");
  p.box(0, h - 7, w, 5, "D");
  p.rect(1, h - 2, 3, 2, "k").rect(w - 4, h - 2, 3, 2, "k");
  for (const x of mugs) p.stamp(MUG, x, 3);
  return p.frame();
}

function meetingTable(): Frame {
  const p = new Px(64, 30).stamp(table(64, 30));
  p.box(8, 5, 12, 8, "a").box(9, 6, 10, 5, "x").px(11, 7, "q");
  p.box(28, 6, 9, 7, "w").hline(30, 8, 5, "A").hline(30, 10, 4, "A");
  p.box(44, 5, 12, 8, "a").box(45, 6, 10, 5, "x").px(47, 7, "q");
  return p.frame();
}

function stool(): Frame {
  return new Px(10, 12).box(0, 0, 10, 6, "U").hline(1, 4, 8, "V").rect(4, 6, 2, 4, "A").hline(2, 10, 6, "k").frame();
}

function counter(top: "plain" | "sink" | "coffee"): Frame {
  const p = new Px(16, 24);
  p.box(0, 8, 16, 6, "a").hline(1, 9, 14, "m");
  p.box(0, 13, 16, 11, "e").vline(8, 14, 9, "D").px(6, 17, "k").px(10, 17, "k");
  if (top === "sink") p.box(3, 9, 10, 4, "A").rect(4, 10, 8, 2, "q").rect(7, 5, 2, 5, "A");
  if (top === "coffee") {
    p.box(2, 0, 12, 13, "x").box(4, 2, 8, 4, "A").px(6, 3, "y").px(9, 3, "n");
    p.rect(5, 7, 6, 1, "k").stamp(MUG, 5, 9);
  }
  return p.frame();
}

function fridge(): Frame {
  return new Px(16, 30).box(1, 0, 14, 30, "w").hline(2, 1, 12, "m").hline(1, 11, 14, "k").rect(11, 4, 2, 5, "A").rect(11, 14, 2, 8, "A").frame();
}

function bookshelf(seed: number): Frame {
  const colors = ["y", "n", "t", "v", "q", "b", "M", "N"];
  const p = new Px(32, 32).box(0, 0, 32, 32, "D");
  for (let s = 0; s < 3; s++) {
    const y = 2 + s * 10;
    p.rect(2, y, 28, 8, "T");
    let x = 2;
    let i = s * 5 + seed;
    while (x < 29) {
      const w = 2 + (i % 2);
      const h = 6 + (i % 3 === 0 ? 0 : 1);
      p.rect(x, y + 8 - h, w, h, colors[(i * 3 + seed) % colors.length]).vline(x + w, y + 8 - h, h, "k");
      x += w + 1;
      i++;
    }
    p.hline(1, y + 8, 30, "k").hline(1, y + 9, 30, "d");
  }
  return p.frame();
}

function waterCooler(): Frame {
  return new Px(12, 26).box(2, 0, 8, 10, "q").hline(3, 2, 6, "w").box(0, 9, 12, 17, "w").box(3, 12, 6, 3, "A").px(4, 13, "n").px(7, 13, "q").frame();
}

function lamp(): Frame {
  return new Px(10, 28).box(1, 0, 8, 7, "y").hline(2, 1, 6, "w").vline(5, 7, 18, "k").box(2, 24, 6, 4, "A").frame();
}

function beanbag(): Frame {
  return new Px(16, 14).box(2, 0, 12, 4, "M").box(0, 3, 16, 10, "M").hline(2, 10, 12, "j").hline(1, 13, 14, "k").frame();
}

function smallPlant(): Frame {
  const leaves: Frame = ["...kk.kk...", "..kglkglk..", ".kglkgGlk..", "kgGkggkGglk", ".kgGgGgGk..", "..kkGGGkk.."];
  return new Px(12, 14).stamp(leaves, 0, 0).box(2, 6, 8, 8, "b").hline(3, 7, 6, "B").frame();
}

function recordPlayer(): Frame {
  const p = new Px(24, 22).box(0, 6, 24, 16, "D").hline(1, 7, 22, "d");
  p.box(1, 0, 22, 9, "a").box(3, 1, 12, 7, "k").rect(8, 3, 2, 3, "n").px(18, 3, "y").vline(19, 2, 5, "A");
  p.rect(3, 12, 18, 7, "T").vline(9, 12, 7, "k").vline(15, 12, 7, "k");
  return p.frame();
}

function reception(): Frame {
  const p = new Px(48, 26);
  p.stamp(MONITOR, 6, 0);
  p.box(0, 9, 48, 7, "e").hline(1, 10, 46, "w");
  p.box(0, 15, 48, 11, "d").hline(1, 16, 46, "D").box(16, 18, 16, 5, "y").hline(19, 20, 10, "k");
  p.stamp(SPROUT, 38, 4).stamp(MUG, 30, 11);
  return p.frame();
}

function mat(): Frame {
  return new Px(32, 14).box(0, 0, 32, 14, "n").box(2, 2, 28, 10, "b", "B").hline(6, 6, 20, "y").hline(6, 7, 20, "y").frame();
}

/** Cubicle divider seen from the front: a panel with a strip of glass on top. */
function partitionH(): Frame {
  const p = new Px(16, 22);
  p.box(0, 0, 16, 8, "q").hline(1, 2, 14, "w").px(3, 4, "w");
  p.box(0, 7, 16, 13, "X").hline(1, 8, 14, "Y").hline(1, 18, 14, "Y");
  return p.rect(1, 20, 2, 2, "A").rect(13, 20, 2, 2, "A").frame();
}

/** Cubicle divider running north–south: just its narrow top edge and side. */
function partitionV(): Frame {
  const p = new Px(16, 22);
  p.box(5, 0, 6, 22, "X").vline(6, 1, 20, "q").vline(9, 1, 20, "Y");
  return p.frame();
}

function copier(): Frame {
  const p = new Px(32, 28);
  p.box(1, 0, 28, 8, "w").hline(2, 1, 26, "m").box(4, 2, 12, 4, "a").px(22, 3, "t").px(24, 3, "n");
  p.box(0, 7, 32, 19, "m").hline(1, 8, 30, "w");
  p.box(3, 11, 26, 4, "a").box(3, 16, 26, 4, "a").box(3, 21, 26, 4, "a");
  p.hline(12, 12, 8, "A").hline(12, 17, 8, "A").hline(12, 22, 8, "A");
  return p.rect(2, 26, 3, 2, "k").rect(27, 26, 3, 2, "k").frame();
}

function bin(): Frame {
  return new Px(10, 12).box(0, 0, 10, 3, "A").box(1, 2, 8, 10, "a").vline(3, 4, 6, "A").vline(6, 4, 6, "A").frame();
}

/** Big potted tree with a round canopy. */
function tree(): Frame {
  const p = new Px(20, 34);
  const canopy: [number, number][] = [[6, 13], [3, 16], [2, 17], [1, 18], [1, 18], [0, 19], [0, 19], [0, 19], [0, 19], [1, 18], [1, 18], [2, 17], [3, 16], [5, 14]];
  canopy.forEach(([a, b], y) => p.px(a, y, "k").px(b, y, "k").hline(a + 1, y, b - a - 1, y < 4 || y % 3 === 0 ? "g" : "G"));
  p.hline(6, 0, 8, "k").hline(5, 13, 10, "k");
  [[5, 3], [10, 2], [14, 5], [4, 7], [9, 8], [15, 10], [7, 11]].forEach(([x, y]) => p.px(x, y, "l"));
  p.vline(9, 14, 10, "D").vline(10, 14, 10, "D").vline(8, 14, 10, "k").vline(11, 14, 10, "k");
  p.box(4, 23, 12, 3, "b").box(5, 25, 10, 9, "b").vline(13, 26, 7, "B");
  return p.frame();
}

/** Double bed seen from the foot end: headboard, pillows, a blanket in the rug colour. */
function bed(): Frame {
  const p = new Px(32, 36);
  p.box(0, 0, 32, 10, "D").hline(1, 2, 30, "d");
  p.box(1, 8, 30, 24, "w").box(4, 10, 10, 6, "w", "A").box(18, 10, 10, 6, "w", "A");
  p.box(1, 17, 30, 15, "R").hline(2, 19, 28, "j").hline(2, 27, 28, "j");
  p.box(0, 30, 32, 4, "D");
  return p.rect(1, 34, 3, 2, "k").rect(28, 34, 3, 2, "k").frame();
}

/** Stone fireplace with a mantel; two frames so the fire flickers. */
function fireplace(flicker: number): Frame {
  const p = new Px(32, 30);
  p.box(0, 0, 32, 5, "D").hline(1, 2, 30, "d");
  p.box(2, 4, 28, 26, "a").hline(3, 5, 26, "m").hline(3, 18, 4, "A").hline(25, 12, 4, "A");
  p.box(7, 11, 18, 17, "k");
  p.rect(10, 20, 12, 6, "n").rect(12 + flicker, 15, 3, 6, "n").rect(17 - flicker, 14 + flicker, 3, 7, "n");
  p.rect(13, 21, 6, 4, "y").rect(15 - flicker, 18, 2, 3, "y");
  return p.hline(9, 26, 14, "D").frame();
}

/* Wall-mounted decorations (no collision). */

function whiteboard(): Frame {
  const p = new Px(32, 14).box(0, 0, 32, 13, "w", "A");
  p.hline(3, 3, 10, "n").hline(3, 5, 7, "t").box(18, 3, 6, 5, "y").box(25, 2, 5, 5, "v").hline(4, 8, 12, "q");
  return p.hline(4, 13, 24, "A").frame();
}

function tv(): Frame {
  return new Px(32, 16).box(0, 0, 32, 15, "x").rect(2, 2, 28, 11, "x").hline(3, 3, 8, "q").hline(3, 5, 12, "v").vline(15, 15, 1, "k").frame();
}

function art(seed: number): Frame {
  const p = new Px(12, 12).box(0, 0, 12, 12, "w", "D").rect(1, 1, 10, 10, "k").rect(2, 2, 8, 8, "w");
  const c = ["M", "N", "y", "j", "n", "t"];
  p.rect(3, 6, 6, 3, c[seed % c.length]).rect(3 + (seed % 3), 3, 3, 3, c[(seed + 2) % c.length]);
  return p.frame();
}

function clock(): Frame {
  const ring: Frame = ["..kkkk..", ".kwwwwk.", "kwwwkwwk", "kwwwkwwk", "kwwkkwwk", "kwwwwwwk", ".kwwwwk.", "..kkkk.."];
  return ring;
}

function stringLights(): Frame {
  const p = new Px(32, 7);
  const sag = [0, 0, 1, 1, 2, 2, 3, 3, 3, 3, 2, 2, 1, 1, 0, 0];
  for (let x = 0; x < 32; x++) p.px(x, sag[x % 16], "k");
  const bulbs = ["y", "n", "q", "l"];
  [3, 8, 12, 19, 24, 28].forEach((x, i) => p.rect(x, sag[x % 16] + 1, 2, 2, bulbs[i % bulbs.length]));
  return p.frame();
}

function noticeBoard(): Frame {
  return new Px(24, 16).box(0, 0, 24, 16, "e", "D").box(2, 2, 7, 6, "w").box(11, 3, 6, 5, "y").box(5, 9, 8, 5, "v").px(5, 3, "n").px(13, 4, "n").px(8, 10, "n").frame();
}

/* ------------------------------------------------------------------ */
/* Catalog                                                             */
/* ------------------------------------------------------------------ */

export type Layer = "floor" | "wall" | "sort";

export interface ObjectDef {
  frames: Frame[];
  fps?: number;
  /** Tiles blocked by the object, measured up from its bottom-left tile. Null = walk-through. */
  footprint: { w: number; h: number } | null;
  layer: Layer;
}

const solid = (w: number, h = 1) => ({ w, h });

/** Object kinds. Some take a variant suffix (e.g. `art-3`) handled in `objectDef`. */
export function catalog(theme: Theme) {
  return {
    desk: { frames: [desk(theme.deskExtra)], footprint: solid(2), layer: "sort" },
    "desk-mine": { frames: [desk("mine")], footprint: solid(2), layer: "sort" },
    chair: { frames: [chair()], footprint: solid(1), layer: "sort" },
    "desk-chair": { frames: [chair()], footprint: solid(2), layer: "sort" },
    sofa: { frames: [sofa()], footprint: solid(2), layer: "sort" },
    armchair: { frames: [armchair()], footprint: solid(1), layer: "sort" },
    "coffee-table": { frames: [table(28, 16, [4, 18])], footprint: solid(2), layer: "sort" },
    "round-table": { frames: [table(30, 18, [6])], footprint: solid(2), layer: "sort" },
    "long-table": { frames: [table(64, 22, [8, 30, 50])], footprint: solid(4), layer: "sort" },
    "meeting-table": { frames: [meetingTable()], footprint: solid(4, 2), layer: "sort" },
    stool: { frames: [stool()], footprint: null, layer: "sort" },
    counter: { frames: [counter("plain")], footprint: solid(1), layer: "sort" },
    sink: { frames: [counter("sink")], footprint: solid(1), layer: "sort" },
    "coffee-machine": { frames: [counter("coffee")], footprint: solid(1), layer: "sort" },
    fridge: { frames: [fridge()], footprint: solid(1), layer: "sort" },
    bookshelf: { frames: [bookshelf(1)], footprint: solid(2), layer: "sort" },
    "water-cooler": { frames: [waterCooler()], footprint: solid(1), layer: "sort" },
    lamp: { frames: [lamp()], footprint: solid(1), layer: "sort" },
    beanbag: { frames: [beanbag()], footprint: solid(1), layer: "sort" },
    plant: { frames: plantFrames(), fps: 2, footprint: solid(1), layer: "sort" },
    "small-plant": { frames: [smallPlant()], footprint: solid(1), layer: "sort" },
    "record-player": { frames: [recordPlayer()], footprint: solid(2), layer: "sort" },
    reception: { frames: [reception()], footprint: solid(3), layer: "sort" },
    cat: { frames: catFrames(), fps: 2, footprint: null, layer: "sort" },
    "partition-h": { frames: [partitionH()], footprint: solid(1), layer: "sort" },
    "partition-v": { frames: [partitionV()], footprint: solid(1), layer: "sort" },
    copier: { frames: [copier()], footprint: solid(2), layer: "sort" },
    bin: { frames: [bin()], footprint: solid(1), layer: "sort" },
    tree: { frames: [tree()], footprint: solid(1), layer: "sort" },
    bed: { frames: [bed()], footprint: solid(2, 2), layer: "sort" },
    fireplace: { frames: [fireplace(0), fireplace(1)], fps: 3, footprint: solid(2), layer: "sort" },
    mat: { frames: [mat()], footprint: null, layer: "floor" },
    whiteboard: { frames: [whiteboard()], footprint: null, layer: "wall" },
    tv: { frames: [tv()], footprint: null, layer: "wall" },
    art: { frames: [art(0), art(1), art(2), art(3), art(4), art(5)], footprint: null, layer: "wall" },
    clock: { frames: [clock()], footprint: null, layer: "wall" },
    "string-lights": { frames: [stringLights()], footprint: null, layer: "wall" },
    "notice-board": { frames: [noticeBoard()], footprint: null, layer: "wall" },
  } satisfies Record<string, ObjectDef>;
}

export type ObjectKind = keyof ReturnType<typeof catalog>;

/** A rug sized in tiles, drawn on the floor layer. */
export function rugFrame(w: number, h: number): Frame {
  const p = new Px(w * 16, h * 16).box(0, 0, w * 16, h * 16, "j", "k").rect(2, 2, w * 16 - 4, h * 16 - 4, "R");
  for (let x = 4; x < w * 16 - 4; x += 6) p.px(x, 4, "j").px(x + 3, h * 16 - 5, "j");
  p.box(6, 6, w * 16 - 12, h * 16 - 12, "R", "j");
  return p.frame();
}
