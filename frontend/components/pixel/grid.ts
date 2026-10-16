/**
 * Tiny pixel-grid toolkit.
 *
 * A Frame is an array of equal-length strings where every character is one
 * pixel. "." is transparent; any other character is looked up in a Palette.
 * Frames are composed from small parts (heads, bodies, props) so characters
 * share proportions and stay consistent across poses.
 */

export type Frame = string[];
export type Palette = Record<string, string>;
export type Pixel = [x: number, y: number, ch: string];

export const width = (f: Frame) => (f[0] ? f[0].length : 0);
export const height = (f: Frame) => f.length;

export function blank(w: number, h: number): Frame {
  return Array.from({ length: h }, () => ".".repeat(w));
}

/** Paste `src` onto `dst` at (x, y). Transparent pixels in `src` are skipped. */
export function stamp(dst: Frame, src: Frame, x = 0, y = 0): Frame {
  const out = dst.map((row) => row.split(""));
  src.forEach((row, sy) => {
    const ty = y + sy;
    if (ty < 0 || ty >= out.length) return;
    for (let sx = 0; sx < row.length; sx++) {
      const ch = row[sx];
      const tx = x + sx;
      if (ch === "." || tx < 0 || tx >= out[ty].length) continue;
      out[ty][tx] = ch;
    }
  });
  return out.map((r) => r.join(""));
}

/** Set individual pixels. Use " " to erase a pixel back to transparent. */
export function patch(src: Frame, pixels: Pixel[]): Frame {
  const out = src.map((row) => row.split(""));
  for (const [x, y, ch] of pixels) {
    if (out[y] && x >= 0 && x < out[y].length) out[y][x] = ch === " " ? "." : ch;
  }
  return out.map((r) => r.join(""));
}

export function pad(src: Frame, left: number, right: number, top = 0, bottom = 0): Frame {
  const w = width(src) + left + right;
  return stamp(blank(w, height(src) + top + bottom), src, left, top);
}

/** Move content inside the same canvas size (content falling off is dropped). */
export function shift(src: Frame, dx: number, dy: number): Frame {
  return stamp(blank(width(src), height(src)), src, dx, dy);
}

export function flipX(src: Frame): Frame {
  return src.map((row) => row.split("").reverse().join(""));
}

/** Shift a hex colour towards black (amt < 0) or white (amt > 0). */
export function tint(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) =>
    Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt),
  );
  return "#" + ch.map((c) => c.toString(16).padStart(2, "0")).join("");
}

export type Run = { x: number; y: number; w: number; fill: string };

/** Merge horizontal runs of identical colour so each run becomes one <rect>. */
export function toRuns(frame: Frame, palette: Palette, offsetX = 0, offsetY = 0): Run[] {
  const runs: Run[] = [];
  frame.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === "." || !palette[ch]) {
        x++;
        continue;
      }
      let end = x + 1;
      while (end < row.length && row[end] === ch) end++;
      runs.push({ x: x + offsetX, y: y + offsetY, w: end - x, fill: palette[ch] });
      x = end;
    }
  });
  return runs;
}
