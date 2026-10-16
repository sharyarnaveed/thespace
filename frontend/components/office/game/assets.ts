import type { Frame } from "@/components/pixel/grid";
import { stripCanvas } from "@/components/onboarding/phaser/textures";
import { avatarFrames, type Facing } from "./avatar";
import { catalog, rugFrame, type ObjectDef } from "./furniture";
import type { OfficeConfig } from "../config";
import type { OfficeMap } from "./map";
import { plateFrame, seatFor } from "./seating";
import { Px } from "@/components/pixel/painter";
import { tileFrames } from "./tiles";

/**
 * Paints every texture the office needs onto canvases — tiles, furniture,
 * rugs and the player's avatar. Phaser-free, so it can run on the loading
 * screen; the scene only registers the finished canvases.
 */

export interface Sheet {
  canvas: HTMLCanvasElement;
  frameW: number;
  frameH: number;
  count: number;
  fps?: number;
}

export interface OfficeArt {
  tiles: Sheet;
  sheets: Record<string, Sheet>;
  /** Collision footprint and draw layer per object kind. */
  meta: Record<string, Pick<ObjectDef, "footprint" | "layer">>;
  avatar: Sheet;
}

export const AVATAR_ORDER: Facing[] = ["down", "up", "side"];
export const FRAMES_PER_FACING = 5;
/** Seated frames come after the walk cycles. */
export const SIT_FRAME = AVATAR_ORDER.length * FRAMES_PER_FACING;

function sheet(frames: Frame[], palette: Record<string, string>, fps?: number): Sheet {
  const { canvas, w, h } = stripCanvas(frames, palette);
  return { canvas, frameW: w, frameH: h, count: frames.length, fps };
}

export const rugKey = (w: number, h: number) => `rug-${w}x${h}`;

export const plateKey = (desk: number) => `plate-${desk}`;

export function buildArt(map: OfficeMap, config: OfficeConfig): OfficeArt {
  const pal = map.theme.palette;
  const sheets: Record<string, Sheet> = {};
  const meta: OfficeArt["meta"] = { rug: { footprint: null, layer: "floor" } };
  for (const [kind, def] of Object.entries(catalog(map.theme)) as [string, ObjectDef][]) {
    sheets[kind] = sheet(def.frames, pal, def.fps);
    meta[kind] = { footprint: def.footprint, layer: def.layer };
  }
  for (const o of map.objects) {
    if (o.kind === "rug" && o.w && o.h) sheets[rugKey(o.w, o.h)] ??= sheet([rugFrame(o.w, o.h)], pal);
  }
  sheets.puff = sheet([new Px(2, 2).rect(0, 0, 2, 2, "w").frame()], pal);
  sheets.marker = sheet([new Px(6, 6).box(0, 0, 6, 6, "y").frame()], pal);
  sheets["desk-marker"] = sheet([new Px(6, 6).box(0, 0, 6, 6, "n").frame()], pal);
  sheets["desk-arrow"] = sheet([["kkkkkkk", "kyyyyyk", ".kyyyk.", "..kyk..", "...k..."]], pal);
  // One nameplate per team desk.
  for (const o of map.objects) {
    if (o.desk !== undefined) sheets[plateKey(o.desk)] = sheet([plateFrame(seatFor(config, o.desk))], pal);
  }

  const a = avatarFrames(config.avatarId);
  return {
    tiles: sheet(tileFrames(), pal),
    sheets,
    meta,
    avatar: sheet(
      [...AVATAR_ORDER.flatMap((f) => a.frames[f]), ...a.sit],
      a.palette,
    ),
  };
}
