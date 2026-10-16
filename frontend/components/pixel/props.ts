import { BASE, CAST, HEADS, characterPalette, type HeadStyle, type Sprite } from "./sprites";
import { blank, pad, patch, stamp, tint, type Frame, type Palette } from "./grid";

export const PROP_PALETTE: Palette = { ...BASE, f: "#cfc6b4", j: "#d6a874", J: "#b98a59" };

export const LOGO: Frame = [
  "....kkkk....",
  "..kkttttkk..",
  ".kttttttttk.",
  "kkkkkkkkkkkk",
  ".kvvvvvvvvk.",
  ".kvyyvvyyvk.",
  ".kvyyvvyyvk.",
  ".kvvvvvvvvk.",
  ".kvvvkkvvvk.",
  ".kvvvkyvvvk.",
  ".kvvvkyvvvk.",
  "kkkkkkkkkkkk",
];

const HEART: Frame = [
  ".kk.kk.",
  "knnknnk",
  "knnnnnk",
  ".knnnk.",
  "..knk..",
  "...k...",
];

const RECORD_PLAYER: Frame = [
  "kkkkkkkkkkkkkkkkkkkk",
  "keeeeeeeeeeeeeeeeeek",
  "keeeekkkkkkeeeeekkek",
  "keeekxxxxxxkeeeekAek",
  "keekxxxqxxxxkeeekAek",
  "kekxxqxxxxxxxkeeeAek",
  "kekxxxxkkxxxxkeeeAek",
  "kekxxxknnkxxxkeeAeek",
  "kekxxxknnkxxxkeAeeek",
  "kekxxxxkkxxxxkAeeeek",
  "kekxxxxxxxxxxAeeeeek",
  "keekxxxxxxxxkeeeeeek",
  "keeekxxxxxxkeeeekyek",
  "keeeekkkkkkeeeeeeeek",
  "kddddddddddddddddddk",
  "kkkkkkkkkkkkkkkkkkkk",
];

export function recordPlayer(): Sprite {
  const a = RECORD_PLAYER;
  const b = patch(a, [
    [7, 4, "x"],
    [5, 5, "x"],
    [11, 9, "q"],
    [10, 10, "q"],
  ]);
  return { frames: [a, b], palette: PROP_PALETTE, fps: 4 };
}

const MUG: Frame = [
  "kkkkkkk..",
  "kDDDDDkkk",
  "kwmmmmk.k",
  "knnnnnk.k",
  "kwmmmmkkk",
  "kwmmmmk..",
  ".kkkkk...",
];

export function coffeeForTwo(): Sprite {
  const base = stamp(stamp(stamp(blank(22, 18), HEART, 7, 0), flipMug(), 1, 11), MUG, 12, 11);
  const steamA = patch(base, [
    [4, 9, "f"],
    [5, 8, "f"],
    [15, 8, "f"],
    [16, 9, "f"],
  ]);
  const steamB = patch(base, [
    [5, 9, "f"],
    [4, 8, "f"],
    [16, 8, "f"],
    [15, 9, "f"],
  ]);
  return { frames: [steamA, steamB], palette: PROP_PALETTE, fps: 2 };
}

function flipMug(): Frame {
  return MUG.map((r) => r.split("").reverse().join(""));
}

export function cake(): Sprite {
  const base: Frame = [
    "........y.........",
    ".......yny........",
    "........y.........",
    ".......kwk........",
    ".......kwk........",
    ".......kwk........",
    "..kkkkkkkkkkkkkk..",
    ".kwwwwwwwwwwwwwwk.",
    ".kwwrwwwywwwrwwwk.",
    ".knwwnwwnwwnwwnwk.",
    ".kddddddddddddddk.",
    ".kddddddddddddddk.",
    ".knnnnnnnnnnnnnnk.",
    ".kddddddddddddddk.",
    ".kDDDDDDDDDDDDDDk.",
    "kkkkkkkkkkkkkkkkkk",
    "kaaaaaaaaaaaaaaaak",
    ".kkkkkkkkkkkkkkkk.",
  ];
  const flicker = patch(base, [
    [8, 0, "."],
    [9, 0, "y"],
    [7, 1, "."],
    [9, 1, "n"],
    [10, 1, "y"],
  ]);
  return { frames: [base, base, flicker], palette: PROP_PALETTE, fps: 4 };
}

export const ENVELOPE: Frame = [
  "kkkkkkkkkkkkkkkkkkkkkk",
  "kkeeeeeeeeeeeeeeeeeekk",
  "kekkeeeeeeeeeeeeeekkek",
  "keeekkeeeeeeeeeekkeeek",
  "keeeeekkeeeeeekkeeeeek",
  "keeeeeeekknnkkeeeeeeek",
  "keeeeeeeeknnkeeeeeeeek",
  "keeeeeeeeekkeeeeeeeeek",
  "keeeeeeeeeeeeeeeeeeeek",
  "keeeeeeeeeeeeeeeeeeeek",
  "kJJJJJJJJJJJJJJJJJJJJk",
  "kkkkkkkkkkkkkkkkkkkkkk",
];

export function speechHeart(): Frame {
  const bubble: Frame = [
    "..kkkkkkkkkkkk..",
    ".kwwwwwwwwwwwwk.",
    "kwwwwwwwwwwwwwwk",
    "kwwwwwwwwwwwwwwk",
    "kwwwwwwwwwwwwwwk",
    "kwwwwwwwwwwwwwwk",
    "kwwwwwwwwwwwwwwk",
    "kwwwwwwwwwwwwwwk",
    ".kwwwwwwwwwwwwk.",
    "..kkkwwkkkkkkk..",
    "....kwk.........",
    "....kk..........",
  ];
  return stamp(bubble, HEART, 5, 1);
}

/** Head-and-shoulders portrait for the avatar picker. */
export function bust(head: HeadStyle, who: keyof typeof CAST): { frame: Frame; palette: Palette } {
  const shoulders: Frame = ["...kcccssccck...", "..kcCccccccCck..", "..kcCccccccCck.."];
  return { frame: pad([...HEADS[head], ...shoulders], 1, 1, 1, 0), palette: characterPalette(CAST[who]) };
}

/** Someone tucked into an armchair with a book (28 wide). */
export function reader(): Sprite {
  const pal = characterPalette(CAST.ines);
  const chairPal = { ...pal, t: "#c98260", T: tint("#c98260", -0.2), v: "#e3a98a" };
  const back: Frame = [
    "....kkkkkkkkkkkkkkkkkkkk....",
    "...kttttttttttttttttttttk...",
    "...ktvttttttttttttttttvtk...",
    "...ktttttttttttttttttttTk...",
    "...ktttttttttttttttttttTk...",
    "...ktttttttttttttttttttTk...",
    "...ktttttttttttttttttttTk...",
    "...ktttttttttttttttttttTk...",
    "...ktttttttttttttttttttTk...",
    "...ktttttttttttttttttttTk...",
    "...ktttttttttttttttttttTk...",
    "...ktttttttttttttttttttTk...",
  ];
  const front: Frame = [
    "kkkkkk................kkkkkk",
    "ktvttk................ktvttk",
    "ktttTk................ktttTk",
    "ktttTkkkkkkkkkkkkkkkkkktttTk",
    "ktttTkvvvvvvvvvvvvvvvvktttTk",
    "ktttTkttttttttttttttttktttTk",
    "ktttTkttttttttttttttttktttTk",
    "kTTTTkTTTTTTTTTTTTTTTTkTTTTk",
    "kkkkkkkkkkkkkkkkkkkkkkkkkkkk",
    ".kDk....................kDk.",
    ".kkk....................kkk.",
  ];
  const book: Frame = [
    ".kkkkkkkkkk.",
    "kwwwwwkwwwwk",
    "kwwwwwkwwwwk",
    "kwwwwwkwwwwk",
    "knnnnnnnnnnk",
    ".kkkkkkkkkk.",
  ];
  const build = (bob: number, page: boolean) => {
    let f = blank(28, 30);
    f = stamp(f, back, 0, 8);
    f = stamp(f, [...HEADS.long, "...kcccssccck...", "..kcCccccccCck..", "..kcCccccccCck.."], 6, 3 + bob);
    f = stamp(f, front, 0, 19);
    f = stamp(f, page ? patch(book, [[5, 1, "f"], [5, 2, "f"]]) : book, 8, 16);
    f = patch(f, [
      [7, 18, "s"],
      [20, 18, "s"],
    ]);
    return f;
  };
  return {
    frames: [build(0, false), build(0, false), build(0, false), build(1, false), build(0, true), build(0, false)],
    palette: chairPal,
    fps: 2,
  };
}
