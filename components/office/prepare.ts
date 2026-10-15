import { layoutKey, type OfficeConfig } from "./config";
import { buildArt, type OfficeArt } from "./game/assets";
import { generateOffice, type OfficeMap } from "./game/map";

export interface PreparedOffice {
  config: OfficeConfig;
  map: OfficeMap;
  art: OfficeArt;
  Phaser: typeof import("phaser");
}

export const STAGES = ["Preparing your workspace", "Arranging desks and rooms", "Getting your avatar ready", "Opening the office"] as const;

/** Kept across client navigations so `/office` reuses what `/office/loading` prepared. */
let cache: { key: string; promise: Promise<PreparedOffice> } | null = null;

const tick = () => new Promise((r) => setTimeout(r, 0));

/**
 * Everything the office needs before Phaser starts: the generated layout, the
 * painted textures and the Phaser bundle itself. `onStage` reports real
 * progress (index into STAGES) as each piece finishes.
 */
export function prepareOffice(config: OfficeConfig, onStage?: (i: number) => void): Promise<PreparedOffice> {
  const key = [layoutKey(config), config.avatarId, config.displayName, ...config.teammates].join("|");
  if (cache?.key === key) {
    onStage?.(STAGES.length - 1);
    return cache.promise;
  }
  const promise = (async () => {
    onStage?.(0);
    const phaser = import("phaser");
    await tick();
    onStage?.(1);
    const map = generateOffice(config);
    await tick();
    onStage?.(2);
    const art = buildArt(map, config);
    const { default: Phaser } = await phaser;
    onStage?.(3);
    return { config, map, art, Phaser };
  })();
  cache = { key, promise };
  promise.catch(() => {
    if (cache?.promise === promise) cache = null;
  });
  return promise;
}
