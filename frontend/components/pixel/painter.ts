import type { Frame } from "@/components/pixel/grid";

/**
 * Mutable pixel canvas for composing sprites from boxes and small hand-drawn
 * parts. Uses the same Frame format as `components/pixel/grid` ("." = clear).
 */
export class Px {
  private g: string[][];
  constructor(
    readonly w: number,
    readonly h: number,
  ) {
    this.g = Array.from({ length: h }, () => Array(w).fill("."));
  }

  px(x: number, y: number, ch: string) {
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.g[y][x] = ch;
    return this;
  }

  rect(x: number, y: number, w: number, h: number, ch: string) {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) this.px(i, j, ch);
    return this;
  }

  /** Filled rectangle with a 1px outline. */
  box(x: number, y: number, w: number, h: number, fill: string, line = "k") {
    this.rect(x, y, w, h, line);
    return this.rect(x + 1, y + 1, w - 2, h - 2, fill);
  }

  hline(x: number, y: number, w: number, ch: string) {
    return this.rect(x, y, w, 1, ch);
  }

  vline(x: number, y: number, h: number, ch: string) {
    return this.rect(x, y, 1, h, ch);
  }

  stamp(f: Frame, x = 0, y = 0) {
    f.forEach((row, j) => {
      for (let i = 0; i < row.length; i++) if (row[i] !== ".") this.px(x + i, y + j, row[i]);
    });
    return this;
  }

  frame(): Frame {
    return this.g.map((r) => r.join(""));
  }
}
