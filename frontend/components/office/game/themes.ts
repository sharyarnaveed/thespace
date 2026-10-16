import type { StyleId } from "@/components/onboarding/model";
import type { Palette } from "@/components/pixel/grid";
import { BASE } from "@/components/pixel/sprites";

/**
 * Per-style palette and decoration rules. Environment colours use letters the
 * shared BASE palette leaves free:
 *   1/2/3 wood floor (main, seam, light)     9/0 carpet (main, fleck)
 *   4/5   wall face (main, shade)            6/7 wall cap (main, edge)
 *   8     baseboard                          K/L kitchen tiles
 *   F/f   upholstery (main, shade)           U/V chair (main, shade)
 *   R/j   rug (main, pattern)                M/N art accents
 *   X/Y   partition panel (main, shade)
 */
export interface Theme {
  palette: Palette;
  /** Chance (0–1) that each optional plant spot gets a plant. */
  plants: number;
  rugs: boolean;
  art: boolean;
  bookshelves: boolean;
  stringLights: boolean;
  /** Communal tables and extra seating instead of some desks. */
  communal: boolean;
  cat: boolean;
  deskExtra: "plant" | "books" | "none" | "mug";
}

const env = (p: Palette): Palette => ({ ...BASE, X: "#e3dccb", Y: "#c9c0ab", ...p });

export const THEMES: Record<StyleId, Theme> = {
  "cozy-green": {
    palette: env({
      1: "#c9935f", 2: "#a8774a", 3: "#ddb07c",
      4: "#a7b99b", 5: "#8fa383", 6: "#4f6448", 7: "#2b2a22", 8: "#9c6a41",
      9: "#b9c7a5", 0: "#a3b48f", K: "#f5f1e8", L: "#dfe6cf",
      F: "#6f9a5f", f: "#3f6b45", U: "#c98260", V: "#9a5f45",
      R: "#d9a27e", j: "#f3dcc0", M: "#e6c76a", N: "#6f9a5f",
    }),
    plants: 0.9, rugs: true, art: false, bookshelves: false, stringLights: false, communal: false, cat: true, deskExtra: "plant",
  },
  "creative-studio": {
    palette: env({
      1: "#d8cdb6", 2: "#bfb299", 3: "#e8dfcc",
      4: "#e6c76a", 5: "#cfad52", 6: "#5a3825", 7: "#2b2a22", 8: "#c98260",
      9: "#e3a98c", 0: "#cf8f72", K: "#f5f1e8", L: "#e9d6a5",
      F: "#c98260", f: "#9a5434", U: "#5f9ea0", V: "#3f7476",
      R: "#5f9ea0", j: "#e6c76a", M: "#d9534f", N: "#5f9ea0",
    }),
    plants: 0.45, rugs: true, art: true, bookshelves: true, stringLights: true, communal: false, cat: false, deskExtra: "books",
  },
  "quiet-minimal": {
    palette: env({
      1: "#e6ddca", 2: "#d3c8b1", 3: "#f1eadb",
      4: "#f5f1e8", 5: "#e2dbc9", 6: "#8a8a7e", 7: "#2b2a22", 8: "#c9c0ab",
      9: "#dcd7ca", 0: "#cdc7b8", K: "#faf7f0", L: "#e6e1d5",
      F: "#9fb3a6", f: "#6f877a", U: "#d9d4c7", V: "#a9a395",
      R: "#e2dbc9", j: "#cdc7b8", M: "#2b2a22", N: "#9fb3a6",
    }),
    plants: 0.2, rugs: false, art: false, bookshelves: false, stringLights: false, communal: false, cat: false, deskExtra: "none",
  },
  "community-lounge": {
    palette: env({
      1: "#b57843", 2: "#8f5a30", 3: "#c98d58",
      4: "#d9a27e", 5: "#c48a65", 6: "#4a3a2f", 7: "#2b2a22", 8: "#5a3825",
      9: "#7d9a86", 0: "#6a8673", K: "#f5f1e8", L: "#e3cfae",
      F: "#294b38", f: "#1f3a2b", U: "#e6c76a", V: "#b89a45",
      R: "#e6c76a", j: "#c98260", M: "#c98260", N: "#294b38",
    }),
    plants: 0.6, rugs: true, art: true, bookshelves: false, stringLights: true, communal: true, cat: true, deskExtra: "mug",
  },
};
