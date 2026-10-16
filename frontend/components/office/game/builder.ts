import { tierOf } from "@/components/onboarding/model";
import type { OfficeConfig } from "../config";
import type { ObjectKind } from "./furniture";
import type { InteractionId } from "./interactions";
import type { Theme } from "./themes";

/** The full-size plans are drawn at 44×31; the largest team sizes stretch them. */
export const BASE_W = 44;
export const BASE_H = 31;

export type Floor = "wood" | "carpet" | "kitchen" | "tiles" | "concrete" | "grass";

export interface PlacedObject {
  kind: ObjectKind | "rug";
  /** Bottom-left tile of the object. */
  tx: number;
  ty: number;
  /** Width in tiles used to centre walk-through objects (solid ones use their footprint). */
  w?: number;
  h?: number;
  /** Static variant frame (e.g. which painting). */
  frame?: number;
  interact?: InteractionId;
  /** Team desk number (0-based) for assigned desks; see `seating.ts`. */
  desk?: number;
}

export interface Room {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Initial desk count for the team size (capped, so big teams don't mean a huge map). */
export const deskCount = (c: OfficeConfig) => tierOf(c.teamSize).desks;

type Slot = { x: number; y: number };

/** Plan dimensions: drawn at `w`×`h`, optionally stretched by `dx`/`dy` at `split`. */
export interface PlanShape {
  w: number;
  h: number;
  split?: Slot;
  dx?: number;
  dy?: number;
}

/**
 * Helpers a floor plan uses to lay out walls, rooms and furniture.
 *
 * Plans are written in base (cozy) coordinates. For bigger sizes the map is
 * stretched at the plan's split lines: anything at or past `split.x` moves
 * right by `dx`, anything at or past `split.y` moves down by `dy`, and walls or
 * rooms that cross a split grow. The plan then fills the new bands using
 * actual coordinates (`place`, `X`, `Y`, `bandX`, `bandY`).
 */
export class Builder {
  readonly width: number;
  readonly height: number;
  readonly walls: boolean[][];
  readonly floor: Floor[][];
  readonly objects: PlacedObject[] = [];
  readonly rooms: Room[] = [];
  private windowCols: number[] = [];

  readonly split: Slot;
  readonly dx: number;
  readonly dy: number;

  constructor(
    readonly theme: Theme,
    private rand: () => number,
    base: Floor,
    shape: PlanShape,
  ) {
    this.split = shape.split ?? { x: shape.w, y: shape.h };
    this.dx = shape.dx ?? 0;
    this.dy = shape.dy ?? 0;
    this.width = shape.w + this.dx;
    this.height = shape.h + this.dy;
    this.walls = Array.from({ length: this.height }, () => Array<boolean>(this.width).fill(false));
    this.floor = Array.from({ length: this.height }, () => Array<Floor>(this.width).fill(base));
    // Outer shell (thick top wall so windows have a face to sit in) and the main entrance.
    this.fill(this.walls, 0, 0, this.width, 2, true);
    this.fill(this.walls, 0, this.height - 1, this.width, 1, true);
    this.fill(this.walls, 0, 0, 1, this.height, true);
    this.fill(this.walls, this.width - 1, 0, 1, this.height, true);
    this.fill(this.walls, this.X(Math.floor(shape.w / 2) - 1), this.height - 1, 2, 1, false);
  }

  /** Base → actual coordinates. */
  X = (x: number) => (x >= this.split.x ? x + this.dx : x);
  Y = (y: number) => (y >= this.split.y ? y + this.dy : y);

  /** Positions inside the stretched bands, `step` apart, leaving `size` tiles for each item. */
  bandX(first: number, step: number, size: number) {
    const out: number[] = [];
    for (let x = this.split.x + first; x + size <= this.split.x + this.dx - 1; x += step) out.push(x);
    return out;
  }
  bandY(first: number, step: number, size: number) {
    const out: number[] = [];
    for (let y = this.split.y + first; y + size <= this.split.y + this.dy - 1; y += step) out.push(y);
    return out;
  }

  /** A base rect in actual coordinates, growing it if it crosses a split. */
  private stretch(x: number, y: number, w: number, h: number) {
    const sx = this.split.x;
    const sy = this.split.y;
    return {
      x: this.X(x),
      y: this.Y(y),
      w: x < sx && x + w > sx ? w + this.dx : w,
      h: y < sy && y + h > sy ? h + this.dy : h,
    };
  }

  private fill<T>(grid: T[][], x: number, y: number, w: number, h: number, v: T) {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (grid[j]?.[i] !== undefined) grid[j][i] = v;
  }

  wall(x: number, y: number, w: number, h: number) {
    const r = this.stretch(x, y, w, h);
    this.fill(this.walls, r.x, r.y, r.w, r.h, true);
    return this;
  }

  /** Cut a doorway (doors keep their size). */
  open(x: number, y: number, w: number, h: number) {
    this.fill(this.walls, this.X(x), this.Y(y), w, h, false);
    return this;
  }

  /** Name an area (for the HUD label) and optionally give it its own floor. */
  room(name: string, x: number, y: number, w: number, h: number, floor?: Floor) {
    const r = this.stretch(x, y, w, h);
    this.rooms.push({ name, ...r });
    if (floor) this.fill(this.floor, r.x, r.y, r.w, r.h, floor);
    return this;
  }

  /** Top-wall columns (base coordinates) that get windows; the stretched band gets more. */
  set windows(cols: number[]) {
    this.windowCols = [...cols.map(this.X), ...this.bandX(1, 4, 1)];
  }
  get windows() {
    return this.windowCols;
  }

  /** Add an object at base coordinates. Rugs keep their top edge in place. */
  add(kind: PlacedObject["kind"], tx: number, ty: number, extra: Partial<PlacedObject> = {}) {
    const top = kind === "rug" && extra.h ? ty - extra.h + 1 : ty;
    return this.place(kind, this.X(tx), this.Y(top) + (ty - top), extra);
  }

  /** Add an object at actual coordinates. */
  place(kind: PlacedObject["kind"], tx: number, ty: number, extra: Partial<PlacedObject> = {}) {
    this.objects.push({ kind, tx, ty, ...extra });
    return this;
  }

  maybe(chance: number) {
    return this.rand() < chance;
  }

  /** Optional plant (actual coordinates), more likely in greener styles. */
  plantAt(tx: number, ty: number, kind: "plant" | "tree" = "plant") {
    if (this.maybe(this.theme.plants)) this.place(kind, tx, ty, { interact: "plant" });
  }

  /** Optional plant at base coordinates. */
  plant(tx: number, ty: number, kind: "plant" | "tree" = "plant") {
    this.plantAt(this.X(tx), this.Y(ty), kind);
  }

  /** Optional framed picture on a wall face. */
  art(tx: number, ty: number) {
    if (this.theme.art) this.add("art", tx, ty, { frame: Math.floor(this.rand() * 6) });
  }

  /** Desks (actual coordinates) with chairs tucked behind; the first is the player's. */
  desks(slots: Slot[], interact: InteractionId = "desk") {
    slots.forEach((d, i) => {
      const mine = i === 0 && interact === "desk";
      this.place("desk-chair", d.x, d.y - 1);
      const team = interact === "desk";
      this.place(mine ? "desk-mine" : "desk", d.x, d.y, { interact: mine ? "my-desk" : interact, desk: team ? i : undefined });
    });
  }
}

/** Every combination of columns and rows, top row first. */
export const grid = (xs: number[], ys: number[]): Slot[] =>
  ys.flatMap((y) => xs.map((x) => ({ x, y })));
