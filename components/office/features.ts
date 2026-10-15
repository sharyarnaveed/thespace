import type { PlacedObject } from "./game/builder";
import type { Theme } from "./game/themes";

/**
 * What the user ticks for their office. Every piece of furniture belongs to
 * one feature; the building itself (walls, rooms, partitions, door mat) is
 * always there. Only ticked features are placed.
 */
export const FEATURES = [
  { id: "desks", label: "Desks", kinds: ["desk", "desk-mine", "desk-chair", "reception"] },
  { id: "meeting", label: "Meeting table & screen", kinds: ["meeting-table", "chair", "tv", "whiteboard"] },
  { id: "kitchen", label: "Kitchen & coffee", kinds: ["counter", "sink", "coffee-machine", "fridge", "water-cooler"] },
  { id: "tables", label: "Café tables & stools", kinds: ["round-table", "long-table", "stool"] },
  { id: "seating", label: "Sofas & armchairs", kinds: ["sofa", "armchair", "coffee-table", "beanbag"] },
  { id: "bed", label: "Bed", kinds: ["bed"] },
  { id: "fireplace", label: "Fireplace", kinds: ["fireplace"] },
  { id: "bookshelves", label: "Bookshelves", kinds: ["bookshelf"] },
  { id: "plants", label: "Plants & trees", kinds: ["plant", "small-plant", "tree"] },
  { id: "rugs", label: "Rugs", kinds: ["rug"] },
  { id: "lamps", label: "Lamps", kinds: ["lamp"] },
  { id: "art", label: "Wall art & clock", kinds: ["art", "clock"] },
  { id: "stringLights", label: "String lights", kinds: ["string-lights"] },
  { id: "music", label: "Record player", kinds: ["record-player"] },
  { id: "office", label: "Copier, bins & notice board", kinds: ["copier", "bin", "notice-board"] },
  { id: "cat", label: "Office cat", kinds: ["cat"] },
] as const;

export type FeatureId = (typeof FEATURES)[number]["id"];

export const ALL_FEATURES: FeatureId[] = FEATURES.map((f) => f.id);

export const isFeatureId = (id: unknown): id is FeatureId => FEATURES.some((f) => f.id === id);

const FEATURE_OF = new Map<string, FeatureId>(FEATURES.flatMap((f) => f.kinds.map((k) => [k, f.id] as const)));

/** The feature an object belongs to; undefined for parts of the building. */
export const featureOf = (kind: PlacedObject["kind"]) => FEATURE_OF.get(kind);

/** Turn on every optional decoration so the plan places all it can; `keepTicked` then removes the rest. */
export const fullTheme = (theme: Theme): Theme => ({
  ...theme,
  plants: 0.95,
  rugs: true,
  art: true,
  stringLights: true,
  bookshelves: true,
  cat: true,
  communal: false,
});

export function keepTicked(objects: PlacedObject[], features: FeatureId[]) {
  return objects.filter((o) => {
    const f = featureOf(o.kind);
    return !f || features.includes(f);
  });
}
