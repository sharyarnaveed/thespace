import { layoutKey, type OfficeConfig } from "../config";
import { DEFAULT_TEAM_SIZE, isTeamSizeId } from "@/components/onboarding/model";
import { fullTheme, keepTicked } from "../features";
import { Builder, type Floor, type PlacedObject, type Room } from "./builder";
import { layoutDef, type LayoutDef } from "./layouts";
import { THEMES, type Theme } from "./themes";
import { OPEN, T } from "./tiles";

/**
 * Deterministic office generation. The chosen floor plan (see `layouts/`) is
 * furnished from the config: team size sets the desk count, the workspace style
 * picks colours and decorations (the plan may recolour on top), and a seeded RNG
 * fills optional spots — so the same answers always produce the same office.
 */

export type { PlacedObject, Room };

export interface OfficeMap {
  seed: number;
  /** Size in tiles. */
  width: number;
  height: number;
  theme: Theme;
  /** Tileset index per cell, row-major. */
  tiles: number[][];
  walls: boolean[][];
  objects: PlacedObject[];
  rooms: Room[];
  /** Spawn point in tiles (feet position). */
  spawn: { tx: number; ty: number };
}

/* Small, stable hashing and RNG so layouts never change between visits. */
function hash(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return h >>> 0;
}

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FLOOR_TILE: Record<Exclude<Floor, "wood">, number> = { carpet: T.CARPET, kitchen: T.KITCHEN, tiles: T.TILES, concrete: T.CONCRETE, grass: T.GRASS };

function tileIndices(b: Builder, layout: LayoutDef) {
  const isWall = (x: number, y: number) => x < 0 || y < 0 || x >= b.width || y >= b.height || b.walls[y][x];
  return b.walls.map((row, y) =>
    row.map((w, x) => {
      if (!w) {
        const f = b.floor[y][x];
        return f === "wood" ? ((x + y) % 3 === 0 ? T.WOOD_B : T.WOOD_A) : FLOOR_TILE[f];
      }
      // A wall with floor below shows its front face; otherwise its top.
      if (!isWall(x, y + 1)) {
        const hasWindow = y === 1 && b.windows.includes(x);
        if (layout.brick) return hasWindow ? T.BRICK_WINDOW : T.BRICK;
        return hasWindow ? T.WINDOW : T.FACE;
      }
      let mask = 0;
      if (!isWall(x, y - 1)) mask |= OPEN.N;
      if (!isWall(x + 1, y)) mask |= OPEN.E;
      if (!isWall(x - 1, y)) mask |= OPEN.W;
      return T.CAP + mask;
    }),
  );
}

export function generateOffice(config: OfficeConfig): OfficeMap {
  const seed = hash(layoutKey(config));
  const layout = layoutDef(config.layout);
  const plan = layout.plans[isTeamSizeId(config.teamSize) ? config.teamSize : DEFAULT_TEAM_SIZE];
  const style = THEMES[config.workspaceStyle];
  const templated: Theme = { ...style, palette: { ...style.palette, ...layout.palettes?.[config.workspaceStyle] } };
  const theme = config.features ? fullTheme(templated) : templated;
  const b = new Builder(theme, rng(seed), layout.base, plan);
  const { spawn } = plan.build(b, config);
  return {
    seed,
    width: b.width,
    height: b.height,
    theme,
    tiles: tileIndices(b, layout),
    walls: b.walls,
    objects: config.features ? keepTicked(b.objects, config.features) : b.objects,
    rooms: b.rooms,
    spawn: { tx: b.X(spawn.tx), ty: b.Y(spawn.ty) },
  };
}
