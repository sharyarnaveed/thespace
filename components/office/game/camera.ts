import type * as P from "phaser";

/** Minimap size and placement in CSS pixels; the HUD draws its frame from the same numbers. */
export const MINIMAP = { scale: 0.25, margin: 16 } as const;

/** Largest whole-number zoom that still shows a sensible slice of the office. */
const zoomFor = (w: number, h: number) => Math.max(2, Math.min(4, Math.floor(Math.min(w / 320, h / 208))));

/** Main camera: integer zoom (crisp pixels), smooth follow, clamped to the map. */
export function setupCamera(scene: P.Scene, target: P.GameObjects.Sprite, mapW: number, mapH: number) {
  const cam = scene.cameras.main;
  cam.setBounds(0, 0, mapW, mapH);
  cam.setRoundPixels(true);
  cam.startFollow(target, true, 0.12, 0.12);
  cam.setZoom(zoomFor(scene.scale.width, scene.scale.height));
  return cam;
}

/** Whole-office overview pinned to the bottom-right corner. */
export function setupMinimap(scene: P.Scene, mapW: number, mapH: number) {
  const w = Math.round(mapW * MINIMAP.scale);
  const h = Math.round(mapH * MINIMAP.scale);
  const mini = scene.cameras.add(0, 0, w, h, false, "minimap");
  mini.setZoom(MINIMAP.scale).setBackgroundColor("#2b2a22");
  mini.centerOn(mapW / 2, mapH / 2);
  const place = () => mini.setPosition(scene.scale.width - w - MINIMAP.margin, scene.scale.height - h - MINIMAP.margin);
  place();
  return { mini, place, size: { w, h } };
}

/** Keep zoom and the minimap correct when the window resizes. */
export function onResize(scene: P.Scene, place: () => void) {
  const fit = (size: P.Structs.Size) => {
    scene.cameras.main.setZoom(zoomFor(size.width, size.height));
    place();
  };
  scene.scale.on("resize", fit);
  return () => scene.scale.off("resize", fit);
}
