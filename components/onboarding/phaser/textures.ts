import type * as PhaserNS from "phaser";
import { height, toRuns, width, type Frame, type Palette } from "@/components/pixel/grid";

type PhaserScene = PhaserNS.Scene;

/** Paint pixel-grid frames side by side onto a canvas (one cell per frame). */
export function stripCanvas(frames: Frame[], palette: Palette) {
  const w = width(frames[0]);
  const h = height(frames[0]);
  const canvas = document.createElement("canvas");
  canvas.width = w * frames.length;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  frames.forEach((f, i) => {
    for (const r of toRuns(f, palette, i * w, 0)) {
      ctx.fillStyle = r.fill;
      ctx.fillRect(r.x, r.y, r.w, 1);
    }
  });
  return { canvas, w, h };
}

/**
 * Register a pixel sprite as a Phaser texture with numbered frames and, when it
 * has more than one frame, a looping animation under the same key.
 */
export function addPixelSprite(scene: PhaserScene, key: string, frames: Frame[], palette: Palette, fps = 4) {
  if (scene.textures.exists(key)) return key;
  const { canvas, w, h } = stripCanvas(frames, palette);
  const tex = scene.textures.addCanvas(key, canvas)!;
  frames.forEach((_, i) => tex.add(i, 0, i * w, 0, w, h));
  if (frames.length > 1) {
    scene.anims.create({
      key,
      frames: frames.map((_, i) => ({ key, frame: i })),
      frameRate: fps,
      repeat: -1,
    });
  }
  return key;
}

/**
 * Rasterise the scene's existing SVG backdrop (the same art the static
 * fallback shows) at 1 scene pixel = 1 texture pixel.
 */
export async function svgToCanvas(svg: SVGSVGElement, w: number, h: number) {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("width", String(w));
  clone.setAttribute("height", String(h));
  clone.removeAttribute("class");
  const xml = new XMLSerializer().serializeToString(clone);
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas;
}

/** Copy a frame with a rectangle cleared back to transparent. */
export function erase(frame: Frame, x0: number, y0: number, x1: number, y1: number): Frame {
  return frame.map((row, y) =>
    y < y0 || y > y1 ? row : row.split("").map((ch, x) => (x >= x0 && x <= x1 ? "." : ch)).join(""),
  );
}
