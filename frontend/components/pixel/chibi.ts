import type { Frame } from "./grid";
import { Px } from "./painter";

/**
 * Chibi office buddies: a big round head (with ears and dotted hair shine),
 * a short body with sleeves, hands and shoes. Every pose is 16×26 — two rows of
 * headroom for buns, bows and spikes, a 13-row head, then the body.
 *
 * Colours use the shared character palette letters (see `characterPalette`):
 * s/S skin, h/H hair, c/C top, p/P trousers, i/I accent, o shoes, k ink.
 */

export type Hair = "short" | "spiky" | "bun" | "bob" | "long" | "curly" | "beanie" | "pigtails" | "bald";
export type Extra = "glasses" | "beard" | "headphones" | "bow" | "tie";
export type Facing = "down" | "up" | "side";

export interface ChibiSpec {
  hair: Hair;
  extras?: readonly Extra[];
}

export const CHIBI_W = 16;
export const CHIBI_H = 26;

const HY = 2; // head top
const BY = HY + 13; // body top
/** Head outline span [left, right] for each of the 13 head rows. */
const SPAN: [number, number][] = [[4, 11], [3, 12], [2, 13], [1, 14], [1, 14], [1, 14], [1, 14], [1, 14], [1, 14], [1, 14], [2, 13], [3, 12], [4, 11]];

const has = (spec: ChibiSpec, e: Extra) => spec.extras?.includes(e) ?? false;

/* ------------------------------------------------------------------ */
/* Head                                                                */
/* ------------------------------------------------------------------ */

function skull(p: Px) {
  SPAN.forEach(([a, b], r) => {
    const y = HY + r;
    if (r === 0 || r === 12) p.hline(a, y, b - a + 1, "k");
    else p.px(a, y, "k").px(b, y, "k").hline(a + 1, y, b - a - 1, r === 11 ? "S" : "s");
  });
}

function ears(p: Px, left: boolean, right: boolean) {
  for (const y of [HY + 7, HY + 8]) {
    if (left) p.px(0, y, "k").px(1, y, "s");
    if (right) p.px(15, y, "k").px(14, y, "s");
  }
}

/** Fill a head row's interior between x0 and x1 (clamped to the outline). */
function fillRow(p: Px, r: number, x0: number, x1: number, ch: string) {
  const [a, b] = SPAN[r];
  for (let x = Math.max(a + 1, x0); x <= Math.min(b - 1, x1); x++) p.px(x, HY + r, ch);
}

/** Hair cap shared by every style: crown plus a row of shine dots. */
function crown(p: Px, rows: number) {
  for (let r = 1; r <= rows; r++) fillRow(p, r, 0, 15, "h");
  for (let x = 4; x <= 11; x += 2) p.px(x, HY + 2, "H");
}

/** Afro-style volume: push the outline out by a pixel around the top of the head. */
function puff(p: Px) {
  p.hline(4, HY - 1, 8, "k").hline(4, HY, 8, "h");
  for (let r = 1; r <= 8; r++) {
    const [a, b] = SPAN[r];
    p.px(a - 1, HY + r, "k").px(a, HY + r, "h").px(b + 1, HY + r, "k").px(b, HY + r, "h");
  }
  p.px(2, HY, "k").px(3, HY, "k").px(12, HY, "k").px(13, HY, "k");
  for (let x = 5; x <= 10; x += 2) p.px(x, HY - 1, "H");
}

function spikes(p: Px) {
  for (const x of [4, 7, 10]) p.px(x, HY - 2, "k").px(x - 1, HY - 1, "k").px(x, HY - 1, "h").px(x + 1, HY - 1, "k").px(x, HY, "h");
}

function topBun(p: Px) {
  p.box(5, 0, 6, 3, "h").px(6, 1, "H").px(5, 0, ".").px(10, 0, ".").hline(6, 2, 4, "h");
}

function frontHair(p: Px, spec: ChibiSpec) {
  const fringe = (xs: number[]) => xs.forEach((x) => p.px(x, HY + 5, "h"));
  const sides = (to: number) => {
    for (let r = 5; r <= to; r++) {
      fillRow(p, r, 0, 3, "h");
      fillRow(p, r, 12, 15, "h");
    }
  };
  switch (spec.hair) {
    case "bald":
      p.px(2, HY + 6, "h").px(13, HY + 6, "h").px(2, HY + 7, "h").px(13, HY + 7, "h");
      return ears(p, true, true);
    case "short":
    case "spiky":
    case "bun":
      crown(p, 4);
      fringe([2, 3, 4, 7, 8, 11, 12, 13]);
      p.px(2, HY + 6, "h").px(13, HY + 6, "h");
      if (spec.hair === "spiky") spikes(p);
      if (spec.hair === "bun") topBun(p);
      return ears(p, true, true);
    case "curly":
      crown(p, 5);
      puff(p);
      p.px(2, HY + 6, "h").px(13, HY + 6, "h");
      return ears(p, true, true);
    case "beanie":
      for (let r = 0; r <= 4; r++) fillRow(p, r, 0, 15, "i");
      fillRow(p, 5, 0, 15, "I");
      p.hline(4, HY, 8, "k").box(6, 0, 4, 3, "w");
      p.px(2, HY + 6, "h").px(13, HY + 6, "h");
      return ears(p, true, true);
    case "bob":
    case "long":
    case "pigtails":
      crown(p, 4);
      if (spec.hair === "pigtails") fringe([2, 3, 4, 5, 7, 8, 10, 11, 12, 13]);
      else fillRow(p, 5, 0, 15, "h");
      sides(spec.hair === "pigtails" ? 7 : 10);
      if (spec.hair === "pigtails") ears(p, true, true);
      return;
  }
}

/** Long hair and pigtails hang beside the body, so they are drawn after it. */
function hangingHair(p: Px, spec: ChibiSpec, facing: Facing) {
  if (spec.hair === "long") {
    const strand = (x: number) => p.box(x, HY + 9, 3, 8, "h").px(x + 1, HY + 11, "H").px(x + 1, HY + 13, "H");
    if (facing === "up") p.box(2, HY + 10, 12, 8, "h").hline(3, HY + 16, 10, "H");
    if (facing === "side") strand(2);
    else {
      strand(0);
      strand(13);
    }
  }
  if (spec.hair === "pigtails") {
    const tail = (x: number) => p.box(x, HY + 6, 3, 7, "h").px(x + 1, HY + 7, "i");
    if (facing === "side") tail(0);
    else {
      tail(0);
      tail(13);
    }
  }
}

function face(p: Px, spec: ChibiSpec, facing: Facing) {
  if (facing === "up") return;
  const eyes = facing === "down" ? [5, 10] : [11];
  for (const x of eyes) p.vline(x, HY + 8, 2, "k");
  if (facing === "down") p.px(3, HY + 10, "r").px(12, HY + 10, "r");
  else p.px(12, HY + 10, "r").px(14, HY + 8, "s").px(15, HY + 8, "k").px(15, HY + 7, ".").px(15, HY + 9, ".");

  if (has(spec, "glasses")) {
    // Clear lenses: frame only, eyes looking through.
    const lens = (x: number, eye: number) => p.box(x, HY + 7, 5, 4, "w").vline(eye, HY + 8, 2, "k");
    if (facing === "down") {
      lens(2, 4);
      lens(9, 11);
      p.hline(7, HY + 8, 2, "k");
    } else {
      lens(9, 11);
      p.hline(5, HY + 8, 4, "k");
    }
  }
  if (has(spec, "beard")) {
    const [x0, x1] = facing === "down" ? [2, 13] : [9, 13];
    for (let r = 10; r <= 11; r++) fillRow(p, r, x0, x1, "h");
    p.vline(x0, HY + 8, 2, "h");
    if (facing === "down") p.vline(x1, HY + 8, 2, "h").hline(7, HY + 10, 2, "r");
  }
}

function backHair(p: Px, spec: ChibiSpec) {
  if (spec.hair === "bald") {
    for (let r = 6; r <= 9; r++) fillRow(p, r, 0, 15, "h");
    return ears(p, true, true);
  }
  if (spec.hair === "beanie") {
    for (let r = 0; r <= 4; r++) fillRow(p, r, 0, 15, "i");
    fillRow(p, 5, 0, 15, "I");
    p.hline(4, HY, 8, "k").box(6, 0, 4, 3, "w");
    for (let r = 6; r <= 10; r++) fillRow(p, r, 0, 15, "h");
  } else {
    for (let r = 1; r <= 11; r++) fillRow(p, r, 0, 15, "h");
    for (let x = 4; x <= 11; x += 2) p.px(x, HY + 2, "H");
    if (spec.hair === "curly") puff(p);
    if (spec.hair === "bun") topBun(p);
    if (spec.hair === "spiky") spikes(p);
  }
  if (spec.hair !== "bob" && spec.hair !== "long") ears(p, true, true);
}

function sideHair(p: Px, spec: ChibiSpec) {
  if (spec.hair === "bald") {
    for (let r = 6; r <= 9; r++) fillRow(p, r, 0, 6, "h");
    return;
  }
  if (spec.hair === "beanie") {
    for (let r = 0; r <= 4; r++) fillRow(p, r, 0, 15, "i");
    fillRow(p, 5, 0, 15, "I");
    p.hline(4, HY, 8, "k").box(6, 0, 4, 3, "w");
    for (let r = 6; r <= 10; r++) fillRow(p, r, 0, 6, "h");
    return;
  }
  crown(p, 4);
  fillRow(p, 5, 0, 15, "h");
  const back = spec.hair === "bob" || spec.hair === "long" ? 8 : 7;
  for (let r = 6; r <= 11; r++) fillRow(p, r, 0, back, "h");
  fillRow(p, 6, 0, 12, "h");
  if (spec.hair === "curly") puff(p);
  if (spec.hair === "bun") p.box(2, 1, 5, 4, "h").px(3, 2, "H");
  if (spec.hair === "spiky") spikes(p);
  if (spec.hair !== "bob" && spec.hair !== "long") p.box(6, HY + 6, 3, 4, "s").px(7, HY + 7, "S");
}

function accessories(p: Px, spec: ChibiSpec, facing: Facing) {
  if (has(spec, "headphones")) {
    p.hline(3, HY - 1, 10, "k").hline(4, HY, 8, "A");
    if (facing === "side") p.box(5, HY + 5, 4, 5, "x");
    else p.box(0, HY + 5, 3, 5, "x").box(13, HY + 5, 3, 5, "x");
  }
  if (has(spec, "bow")) {
    const x = facing === "side" ? 3 : 10;
    p.box(x, 0, 3, 3, "i").box(x + 3, 0, 3, 3, "i").px(x + 2, 1, "I").px(x + 3, 1, "I");
  }
}

/* ------------------------------------------------------------------ */
/* Body                                                                */
/* ------------------------------------------------------------------ */

/** Legs and shoes. `step` 1/2 lifts alternate feet (front/back) or strides (side). */
function legs(p: Px, facing: Facing, step: 0 | 1 | 2) {
  const shoe = (x: number, y: number, w: number) => p.px(x, y, "k").hline(x + 1, y, w - 2, "o").px(x + w - 1, y, "k").hline(x, y + 1, w, "k");
  if (facing === "side") {
    const leg = (x: number) => {
      p.box(x, BY + 5, 4, 5, "p");
      shoe(x, BY + 9, 6);
    };
    if (step === 0) leg(6);
    else {
      leg(3);
      leg(8);
    }
    return;
  }
  const leg = (x: number, lift: number) => {
    p.box(x, BY + 5, 4, 5 - lift, "p");
    shoe(x - (x < 8 ? 1 : 0), BY + 9 - lift, 5);
  };
  leg(4, step === 1 ? 1 : 0);
  leg(8, step === 2 ? 1 : 0);
  p.hline(7, BY + 6, 2, "p");
}

function torso(p: Px, spec: ChibiSpec, facing: Facing, swing: number) {
  if (facing === "side") {
    p.box(4, BY - 1, 8, 7, "c").vline(10, BY, 5, "C");
    // One arm, swinging forward and back with the stride.
    p.box(6 + swing, BY, 3, 6, "c").vline(7 + swing, BY + 3, 2, "s");
    if (has(spec, "tie")) p.vline(10, BY, 3, "n");
    return;
  }
  p.box(3, BY - 1, 10, 7, "c");
  p.vline(4, BY, 5, "C").vline(11, BY, 5, "C");
  if (facing === "down") {
    p.px(6, BY, "w").px(9, BY, "w").px(7, BY, "s").px(8, BY, "s");
    if (has(spec, "tie")) p.vline(7, BY + 1, 3, "n").vline(8, BY + 1, 3, "n").px(7, BY + 1, "N");
  }
  const arm = (x: number, dy: number) => {
    p.box(x, BY + dy, 4, 6, "c");
    p.hline(x + 1, BY + 3 + dy, 2, "s").hline(x + 1, BY + 4 + dy, 2, "s");
  };
  arm(0, swing > 0 ? -1 : 0);
  arm(12, swing < 0 ? -1 : 0);
}

/** Head for a facing, without the body. */
function head(p: Px, spec: ChibiSpec, facing: Facing) {
  skull(p);
  if (facing === "down") frontHair(p, spec);
  else if (facing === "up") backHair(p, spec);
  else sideHair(p, spec);
  face(p, spec, facing);
  accessories(p, spec, facing);
}

/** One pose. `step` 0 = standing, 1/2 = alternate feet forward. */
export function chibiPose(spec: ChibiSpec, facing: Facing, step: 0 | 1 | 2 = 0, blink = false): Frame {
  const p = new Px(CHIBI_W, CHIBI_H);
  const swing = step === 0 ? 0 : step === 1 ? 1 : -1;
  legs(p, facing, step);
  torso(p, spec, facing, swing);
  hangingHair(p, spec, facing);
  head(p, spec, facing);
  if (blink) {
    for (const x of facing === "down" ? [5, 10] : [11]) p.px(x, HY + 8, "s").px(x, HY + 9, "S");
  }
  return p.frame();
}

/**
 * Seated, facing the viewer, knees folded (feet end two rows above the frame
 * bottom). Two frames with alternating arms, for typing at a desk.
 */
export function chibiSit(spec: ChibiSpec): Frame[] {
  return [1, -1].map((swing) => {
    const p = new Px(CHIBI_W, CHIBI_H);
    p.box(4, BY + 5, 8, 3, "p").hline(7, BY + 6, 2, "P");
    for (const x of [3, 8]) p.px(x, BY + 7, "k").hline(x + 1, BY + 7, 3, "o").px(x + 4, BY + 7, "k").hline(x, BY + 8, 5, "k");
    torso(p, spec, "down", swing);
    hangingHair(p, spec, "down");
    head(p, spec, "down");
    return p.frame();
  });
}

/** Lift a frame by a pixel (walking bounce). */
const bob = (f: Frame): Frame => [...f.slice(1), ".".repeat(f[0].length)];

/** [idle, walk ×4] for each facing. Left is the side view mirrored. */
export function chibiWalk(spec: ChibiSpec): Record<Facing, Frame[]> {
  const cycle = (facing: Facing): Frame[] => {
    const stand = chibiPose(spec, facing);
    return [stand, chibiPose(spec, facing, 1), bob(stand), chibiPose(spec, facing, 2), bob(stand)];
  };
  return { down: cycle("down"), up: cycle("up"), side: cycle("side") };
}

/** Standing idle with a slow blink. */
export function chibiIdle(spec: ChibiSpec): Frame[] {
  const base = chibiPose(spec, "down");
  return [base, base, base, base, base, chibiPose(spec, "down", 0, true)];
}

/** Waving with the right hand (20px wide to fit the raised arm). */
export function chibiWave(spec: ChibiSpec): Frame[] {
  const body = chibiPose(spec, "down");
  const withArm = (dy: number) => {
    const p = new Px(20, CHIBI_H).stamp(body, 2, 0);
    p.rect(15, BY, 3, 6, "."); // drop the resting right arm
    p.box(16, BY - 7 + dy, 4, 7, "c").hline(17, BY - 6 + dy, 2, "s").hline(17, BY - 5 + dy, 2, "s");
    return p.frame();
  };
  const up = withArm(0);
  const lean = withArm(1);
  const rest = new Px(20, CHIBI_H).stamp(body, 2, 0).frame();
  return [up, lean, up, lean, up, lean, rest, rest, rest, rest];
}

/** Head and shoulders for desk scenes (16×21): typing hands are added by the caller. */
export function chibiUpper(spec: ChibiSpec): Frame {
  return chibiPose(spec, "down").slice(0, BY + 6);
}
