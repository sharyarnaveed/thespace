import { blank, flipX, pad, patch, shift, stamp, tint, type Frame, type Palette } from "./grid";

/* ------------------------------------------------------------------ */
/* Palette                                                             */
/* ------------------------------------------------------------------ */

export const INK = "#2b2a22";

/** Shared colours available to every sprite. Character palettes extend this. */
export const BASE: Palette = {
  k: INK,
  w: "#fffaf0",
  r: "#e79a83", // blush
  o: "#4a3a2f", // shoes
  m: "#f5f1e8", // mug
  n: "#c98260", // mug band / terracotta
  g: "#6f9a5f", // leaf
  G: "#3f6b45", // leaf shade
  l: "#a3c68b", // leaf light
  b: "#b8673f", // pot
  B: "#8f4c2e", // pot shade
  d: "#c9935f", // wood
  D: "#9c6a41", // wood shade
  e: "#e3b27a", // wood light
  a: "#9fb3a6", // metal / can
  A: "#6f877a", // metal shade
  q: "#a8cfd0", // water / screen glow
  y: "#e6c76a",
  t: "#294b38", // forest
  T: "#1f3a2b",
  v: "#a7b99b", // sage
  z: "#d99b5f", // cat ginger
  Z: "#b57843", // cat stripes
  u: "#f3dcc0", // cat belly
  x: "#3a3d36", // screen dark
};

export type Character = {
  skin: string;
  hair: string;
  top: string;
  pants: string;
  accent?: string; // beanie etc.
};

export function characterPalette(c: Character): Palette {
  return {
    ...BASE,
    s: c.skin,
    S: tint(c.skin, -0.2),
    h: c.hair,
    H: tint(c.hair, 0.25),
    c: c.top,
    C: tint(c.top, -0.18),
    p: c.pants,
    P: tint(c.pants, -0.2),
    i: c.accent ?? c.top,
    I: tint(c.accent ?? c.top, -0.2),
  };
}

export const CAST = {
  maya: { skin: "#f0c4a0", hair: "#3b2a22", top: "#e6c76a", pants: "#294b38" },
  theo: { skin: "#9c6b4e", hair: "#231d18", top: "#c98260", pants: "#3c4a3e" },
  juno: { skin: "#c48a65", hair: "#5a3825", top: "#294b38", pants: "#d9cbb0", accent: "#e6c76a" },
  sam: { skin: "#f3d2b4", hair: "#9a5434", top: "#a7b99b", pants: "#4a4238" },
  ines: { skin: "#d9a27e", hair: "#1f1a17", top: "#f5f1e8", pants: "#c98260" },
} satisfies Record<string, Character>;

/* ------------------------------------------------------------------ */
/* Character parts — all 16px wide. Head rows 0-11, body rows 12-23.   */
/* ------------------------------------------------------------------ */

const FACE_LOWER: Frame = [
  "...kssksskssk...",
  "...ksrssssrsk...",
  "...ksssSSsssk...",
  "....kssssssk....",
  ".....kkSSkk.....",
];

export const HEADS = {
  short: [
    "................",
    ".....kkkkkk.....",
    "....khhhhhhk....",
    "...khhHHhhhhk...",
    "...khHhhhhhhk...",
    "...khhhhhhhhk...",
    "...khhhsssshk...",
    ...FACE_LOWER,
  ],
  bun: [
    "......kkkk......",
    ".....khHhhk.....",
    "....kkhhhhkk....",
    "...khhhhhhhhk...",
    "...khHhhhhhhk...",
    "...khhhhhhhhk...",
    "...khsssssshk...",
    ...FACE_LOWER,
  ],
  long: [
    "................",
    ".....kkkkkk.....",
    "....khhhhhhk....",
    "...khhHHhhhhk...",
    "..khhhhhhhhhhk..",
    "..khhhhhhhhhhk..",
    "..khhsssssshhk..",
    "..khsskssksshk..",
    "..khsrssssrshk..",
    "..khsssSSssshk..",
    "..khhkssssskhhk.",
    "..kkk.kSSk.kkk..",
  ],
  curly: [
    "....kk.kk.kk....",
    "...khhkhhkhhk...",
    "..khhhhhhhhhhk..",
    "..khhHhhhhHhhk..",
    "..khhhhhhhhhhk..",
    "..khhhhhhhhhhk..",
    "..khhsssssshhk..",
    "..kksskssksskk..",
    "...ksrssssrsk...",
    "...ksssSSsssk...",
    "....kssssssk....",
    ".....kkSSkk.....",
  ],
  beanie: [
    ".......kk.......",
    "......kwwk......",
    "....kkiiiikk....",
    "...kiiiiiiiik...",
    "...kiiIiiIiik...",
    "...kIIIIIIIIk...",
    "...khsssssshk...",
    ...FACE_LOWER,
  ],
} satisfies Record<string, Frame>;

export type HeadStyle = keyof typeof HEADS;

const TORSO: Frame = [
  "...kcccssccck...",
  "..kcCccccccCck..",
  "..kcCccccccCck..",
  "..kcCccccccCck..",
  "..ksCccccccCsk..",
  "..kkCCCCCCCCkk..",
];

const LEGS_STAND: Frame = [
  "....kppppppk....",
  "....kppkkppk....",
  "....kppkkppk....",
  "....kPPkkPPk....",
  "...kook..kook...",
  "...kkkk..kkkk...",
];

/** Left foot (viewer's left) lifted. */
const LEGS_STEP: Frame = [
  "....kppppppk....",
  "....kppkkppk....",
  "....kPPkkppk....",
  "...kookkkPPk....",
  "...kkkk..kook...",
  ".........kkkk...",
];

/** Torso with the viewer's-right arm removed, for poses that move that arm. */
const TORSO_ONE_ARM: Frame = [
  "...kcccssccck...",
  "..kcCccccccCk...",
  "..kcCccccccCk...",
  "..kcCccccccCk...",
  "..ksCccccccCk...",
  "..kkCCCCCCCCk...",
];

function person(head: HeadStyle, torso: Frame, legs: Frame): Frame {
  return [...HEADS[head], ...torso, ...legs];
}

/* ------------------------------------------------------------------ */
/* Animated characters                                                 */
/* ------------------------------------------------------------------ */

export type Sprite = { frames: Frame[]; palette: Palette; fps: number };

/** Standing idle with a slow blink. */
export function idleFrames(head: HeadStyle): Frame[] {
  const base = person(head, TORSO, LEGS_STAND);
  const eyeRow = 7;
  const blink = patch(base, [
    [6, eyeRow, "s"],
    [9, eyeRow, "s"],
    [6, eyeRow + 1, "S"],
    [9, eyeRow + 1, "S"],
  ]);
  return [base, base, base, base, base, blink];
}

/** Walking cycle with a vertical bounce, holding a mug (18px wide). */
export function walkWithMugFrames(head: HeadStyle): Frame[] {
  const mug: Frame = [
    "kkkk.",
    "kmmkk",
    "knnk.k",
    "kmmkk",
    "kkkk.",
  ];
  const withMug = (f: Frame) => stamp(pad(f, 1, 3), mug, 14, 14);
  const holdArm = (torso: Frame) =>
    patch(torso, [
      [13, 3, "c"],
      [13, 4, "s"],
    ]);
  const torso = holdArm(TORSO_ONE_ARM);
  const stepA = withMug(person(head, torso, LEGS_STEP));
  const stepB = withMug(person(head, torso, flipLegs(LEGS_STEP)));
  const pass = withMug(person(head, torso, LEGS_STAND));
  const up = shift(pass, 0, -1);
  return [stepA, up, stepB, up];
}

function flipLegs(legs: Frame): Frame {
  // mirror the leg block while keeping it centred on the 16px body
  return flipX(legs);
}

/** Waving: arm raised high, hand rocking between two positions (20px wide). */
export function waveFrames(head: HeadStyle): Frame[] {
  const body = pad(person(head, TORSO_ONE_ARM, LEGS_STAND), 1, 3);
  const up: Frame = [
    ".kk.",
    "kssk",
    "kssk",
    "kssk",
    "kcck",
    "kcck",
    "kCck",
    "kCck",
    "kCck",
    "kCck",
    ".Cck",
  ];
  const lean: Frame = [
    "...kk.",
    "..kssk",
    "..kssk",
    "..kssk",
    "..kcck",
    ".kcck.",
    ".kCck.",
    "kCck..",
    "kCck..",
    "kCck..",
    ".Cck..",
  ];
  const down: Frame = ["kcck", "kcck", "kcck", "kssk", ".kk."];
  const a = stamp(body, up, 13, 2);
  const b = stamp(body, lean, 13, 2);
  const rest = stamp(patch(body, [[13, 13, "C"], [13, 14, "C"], [13, 15, "C"]]), down, 13, 13);
  return [a, b, a, b, a, b, rest, rest, rest, rest];
}

/** Watering a plant: arm out to the side with a can that tips (26px wide). */
export function waterFrames(head: HeadStyle): Frame[] {
  const body = pad(person(head, TORSO_ONE_ARM, LEGS_STAND), 1, 9);
  const can: Frame = [
    "...kkkk...",
    "..k....k..",
    ".kkkkkkkk.k",
    ".kaaaaaakkak",
    ".kaaaaaakak.",
    ".kAAAAAAkk..",
    "..kkkkkkk...",
  ];
  const canTipped: Frame = [
    "...kkkk.....",
    "..k....k....",
    ".kkkkkkkk...",
    ".kaaaaaakk..",
    ".kaaaaaakak.",
    ".kAAAAAAkkak",
    "..kkkkkkk..k",
  ];
  const arm = patch(body, [
    [14, 13, "c"],
    [15, 13, "c"],
    [16, 13, "k"],
    [14, 14, "C"],
    [15, 14, "c"],
    [16, 14, "s"],
    [17, 14, "k"],
    [14, 15, "k"],
    [15, 15, "k"],
    [16, 15, "k"],
    [14, 12, "k"],
    [15, 12, "k"],
    [16, 12, "k"],
  ]);
  const level = stamp(arm, can, 15, 10);
  const tipped = stamp(arm, canTipped, 15, 11);
  return [level, tipped, tipped, tipped, level, level];
}

/**
 * Seated behind a desk, typing. Includes chair, desk, monitor and mug.
 * With `head = null` it draws the same desk unoccupied, with a few personal touches.
 * `upper` swaps in a different seated head-and-shoulders (e.g. a chibi avatar).
 */
export function typingFrames(head: HeadStyle | null, upper?: Frame): Frame[] {
  const W = 44;
  const H = 32;
  const chair: Frame = [
    "..kkkkkkkkkkkkkk..",
    ".kttttttttttttttk.",
    ".ktTttttttttttTtk.",
    ".ktTttttttttttTtk.",
    ".ktTttttttttttTtk.",
    ".ktTttttttttttTtk.",
    ".ktTttttttttttTtk.",
    ".ktTttttttttttTtk.",
    ".ktTttttttttttTtk.",
  ];
  const typingTorso = (left: boolean): Frame =>
    patch(TORSO, [
      [3, 4, left ? "c" : "s"],
      [12, 4, left ? "s" : "c"],
    ]);
  const monitor: Frame = [
    "kkkkkkkkkkkkkk",
    "kxxxxxxxxxxxxk",
    "kxqqqqqxxxxxxk",
    "kxxxvvvvxxxxxk",
    "kxxxvvvxxxxxxk",
    "kxqqqqxxxxxxxk",
    "kxxxyyyyyxxxxk",
    "kxxxxxxxxxxxxk",
    "kkkkkkkkkkkkkk",
    ".....kAAk.....",
    "...kkkAAkkk...",
    "...kAAAAAAk...",
  ];
  const desk: Frame = [
    "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
    "keeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeek",
    "kddddddddddddddddddddddddddddddddddddddddddk",
    "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
    ".kDDk...........................kddddddddk.",
    ".kDDk...........................kdDDDDDDdk.",
    ".kDDk...........................kddddddddk.",
    ".kDDk...........................kddkkkkddk.",
    ".kDDk...........................kddddddddk.",
    ".kDDk...........................kdDDDDDDdk.",
    ".kDDk...........................kddddddddk.",
    ".kDDk...........................kddkkkkddk.",
    ".kkkk...........................kkkkkkkkkk.",
  ];
  const keyboard: Frame = ["kkkkkkkkkkkk", "kAmAmAmAmAmk"];
  const mug: Frame = ["kkkk.", "kmmkk", "knnk.k", "kmmkk", "kkkk."];

  const build = (left: boolean, bob: number, cursor: boolean) => {
    let f = blank(W, H);
    if (head) f = stamp(f, chair, 13, 9);
    if (upper) f = stamp(f, upper, 14, bob);
    else if (head) f = stamp(f, [...HEADS[head], ...typingTorso(left)], 14, 2 + bob);
    else f = stamp(f, DESK_EXTRAS, 14, 6);
    f = stamp(f, monitor, 0, 7);
    if (!head) f = patch(f, [[10, 8, "y"], [11, 8, "y"], [12, 8, "y"], [10, 9, "y"], [11, 9, "y"], [12, 9, "y"]]);
    if (!cursor) f = patch(f, [[9, 13, "x"], [10, 13, "x"], [11, 13, "x"], [12, 13, "x"]]);
    f = stamp(f, keyboard, 16, 17);
    f = stamp(f, mug, 34, 14);
    f = stamp(f, desk, 0, 19);
    if (!head) return f;
    // hands resting on the keyboard; one lifts per frame
    const hands = left
      ? [
          [17, 16, "s"],
          [18, 16, "s"],
          [25, 17, "s"],
          [26, 17, "s"],
        ]
      : [
          [17, 17, "s"],
          [18, 17, "s"],
          [25, 16, "s"],
          [26, 16, "s"],
        ];
    return patch(f, hands as [number, number, string][]);
  };
  return [
    build(true, 0, true),
    build(false, 0, true),
    build(true, 0, false),
    build(false, 1, false),
    build(true, 1, true),
    build(false, 0, true),
  ];
}

/* ------------------------------------------------------------------ */
/* Creatures & props                                                   */
/* ------------------------------------------------------------------ */

export function catFrames(): Frame[] {
  const base: Frame = [
    "..........k.k...",
    ".........kzkzk..",
    "....kkkkkkzzzzk.",
    "...kzzZzzZzkzzzk",
    "..kzzzZzzZzzzzuk",
    ".kzzzzzzzzzzzuk.",
    "kzkkzzzzzzzzzk..",
    "kzzzkkkkkkkkk...",
    ".kkk............",
  ];
  const breathe: Frame = [
    "..........k.k...",
    ".........kzkzk..",
    "....kkkkkkzzzzk.",
    "...kzzZzzZzkzzzk",
    "..kzzzZzzZzzzzuk",
    ".kzzzzzzzzzzzuk.",
    "kzkkzzzzzzzzzk..",
    "kzzzkkkkkkkkk...",
    ".kkk............",
  ].map((r, i) => (i === 2 ? "...kkkkkkkzzzzk." : i === 3 ? "..kzzzZzzZzkzzzk" : r));
  const flick = patch(base, [
    [0, 6, "."],
    [0, 7, "k"],
    [1, 6, "k"],
    [0, 8, "."],
    [1, 8, "k"],
    [0, 5, "."],
  ]);
  return [base, base, breathe, breathe, base, base, breathe, flick, breathe, base];
}

export function plantFrames(): Frame[] {
  const leaves: Frame = [
    ".......kk.........",
    "......kglk....kk..",
    "..kk..kgglk..kglk.",
    ".kglk.kggGk.kgglk.",
    ".kgglkkgGk.kggGk..",
    "..kgGkkgGkkgGkk...",
    "...kkgkgGkgGk..kk.",
    ".kk..kggGgGk..kglk",
    "kglkk.kgGGk..kggk.",
    ".kggGkkgGkkkgGk...",
    "..kkgGgGgGgGkk....",
    "....kkGGGGkk......",
  ];
  const pot: Frame = [
    "...kkkkkkkkkkk....",
    "...kbbbbbbbbbk....",
    "...kkkkkkkkkkk....",
    "....kbbbbbbBk.....",
    "....kbbbbbbBk.....",
    "....kbbbbbbBk.....",
    ".....kkkkkkk......",
  ];
  const sway = (dx: number) => {
    const top = shift(leaves.slice(0, 6), dx, 0);
    return [...top, ...leaves.slice(6), ...pot];
  };
  return [sway(0), sway(0), sway(1), sway(1), sway(0), sway(0), sway(-1), sway(-1)];
}

/** Desk lamp, framed photo and a tiny cactus for an unoccupied desk (20x13). */
const DESK_EXTRAS: Frame = (() => {
  const lamp: Frame = [
    "..kkkk..",
    ".knnnnk.",
    "knnnnnnk",
    "kkkkkkkk",
    ".yykkyy.",
    "....k...",
    ".....k..",
    "......k.",
    ".....k..",
    "....k...",
    "...k....",
    ".kkkkk..",
    ".kAAAk..",
  ];
  const photo: Frame = ["kkkkk", "kqqqk", "kyqvk", "kvvvk", "kkkkk"];
  const cactus: Frame = ["..kk..", ".kglk.", ".kgGk.", ".kglk.", ".kgGk.", "kkkkkk", "kbbbBk", "kbbbBk", ".kkkk."];
  let f = blank(20, 13);
  f = stamp(f, lamp, 0, 0);
  f = stamp(f, photo, 9, 8);
  f = stamp(f, cactus, 14, 4);
  return f;
})();

export function makeSprite(frames: Frame[], palette: Palette, fps: number): Sprite {
  return { frames, palette, fps };
}

export function idle(who: keyof typeof CAST, head: HeadStyle, fps = 2): Sprite {
  return makeSprite(idleFrames(head), characterPalette(CAST[who]), fps);
}

export const hero = {
  typist: () => makeSprite(typingFrames("long"), characterPalette(CAST.maya), 6),
  walker: () => makeSprite(walkWithMugFrames("short"), characterPalette(CAST.theo), 5),
  waterer: () => makeSprite(waterFrames("beanie"), characterPalette(CAST.juno), 3),
  waver: () => makeSprite(waveFrames("bun"), characterPalette(CAST.sam), 5),
  cat: () => makeSprite(catFrames(), BASE, 2),
  plant: () => makeSprite(plantFrames(), BASE, 2),
};
