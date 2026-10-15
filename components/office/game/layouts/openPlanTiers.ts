import { deskCount, type Builder } from "../builder";
import type { Plan } from "./index";

/** A cubicle pod: glass-topped partition behind, side panels, two desks. Returns its desk slots. */
export function pod(b: Builder, px: number, py: number) {
  for (let x = px - 1; x <= px + 6; x++) b.place("partition-h", x, py);
  for (const x of [px - 1, px + 6]) b.place("partition-v", x, py + 1).place("partition-v", x, py + 2);
  b.place("bin", px + 5, py + 2);
  return [
    { x: px, y: py + 2 },
    { x: px + 3, y: py + 2 },
  ];
}

/** Lay out just enough pods for the team; spare pod spots get a tree. */
function pods(b: Builder, spots: { x: number; y: number }[], desks: number) {
  const used = Math.max(1, Math.ceil(desks / 2));
  const slots: { x: number; y: number }[] = [];
  spots.forEach((p, i) => {
    if (i < used) slots.push(...pod(b, p.x, p.y));
    else b.plantAt(p.x + 2, p.y + 1, "tree");
  });
  b.desks(slots.slice(0, desks));
}

/**
 * Open-plan offices for smaller teams: one pod in a studio, two pods beside a
 * small meeting room, or four pods with a walled meeting room and break room.
 */
export const openPlanTiers: Record<"solo" | "2-5" | "6-15", Plan> = {
  solo: {
    w: 20,
    h: 14,
    build(b, config) {
      b.windows = [2, 5, 9, 13, 17];
      b.room("Kitchenette", 14, 2, 5, 3, "kitchen").room("Lounge corner", 1, 9, 6, 4).room("Studio floor", 1, 2, 18, 11);
      pods(b, [{ x: 6, y: 4 }], deskCount(config));
      b.add("notice-board", 11, 1, { w: 2, interact: "workspace" });
      b.add("tv", 2, 1, { w: 2 }).add("round-table", 2, 3, { interact: "call-booth" });
      b.add("counter", 14, 2).add("coffee-machine", 15, 2, { interact: "coffee" }).add("sink", 16, 2).add("fridge", 17, 2, { interact: "fridge" });
      b.add("water-cooler", 18, 2, { interact: "water-cooler" });
      b.add("rug", 1, 12, { w: 6, h: 4 }).add("sofa", 2, 10, { interact: "sofa" }).add("sofa", 4, 10, { interact: "sofa" }).add("coffee-table", 3, 12);
      b.add("copier", 16, 9, { interact: "copier" }).add("bin", 18, 9);
      b.add("record-player", 14, 6, { interact: "record-player" });
      b.add("mat", 9, 12, { w: 2 }).add("tree", 12, 12, { interact: "plant" });
      b.plant(7, 12, "tree");
      return { spawn: { tx: 9.5, ty: 11 } };
    },
  },

  "2-5": {
    w: 28,
    h: 18,
    build(b, config) {
      const { theme } = b;
      b.windows = [2, 6, 10, 14, 17, 21, 25];
      b.wall(19, 8, 9, 2).wall(19, 2, 1, 8).open(22, 8, 2, 2);
      b.room("Meeting room", 20, 2, 7, 6, "carpet")
        .room("Lounge corner", 1, 10, 8, 7)
        .room("Copy & coffee", 19, 10, 8, 7)
        .room("Cubicles", 1, 2, 18, 7)
        .room("Entrance", 9, 9, 10, 8)
        .room("Office floor", 1, 2, 26, 15);

      pods(b, [{ x: 3, y: 3 }, { x: 11, y: 3 }], deskCount(config));
      b.add("water-cooler", 18, 2, { interact: "water-cooler" });
      b.plant(18, 7, "tree");

      b.add("tv", 22, 1, { w: 2 }).add("meeting-table", 21, 5, { interact: "meeting" });
      for (const x of [21, 22, 23, 24]) b.add("chair", x, 3);

      b.add("rug", 2, 16, { w: 6, h: 4 }).add("sofa", 2, 13, { interact: "sofa" }).add("sofa", 4, 13, { interact: "sofa" });
      b.add("coffee-table", 3, 15).add("armchair", 7, 15, { interact: "sofa" }).add("record-player", 1, 10, { interact: "record-player" });
      if (theme.cat) b.add("cat", 6, 16, { interact: "cat" });

      b.add("counter", 20, 10).add("coffee-machine", 21, 10, { interact: "coffee" }).add("sink", 24, 10).add("fridge", 25, 10, { interact: "fridge" });
      b.add("copier", 25, 14, { interact: "copier" }).add("round-table", 21, 14).add("stool", 20, 14).add("stool", 23, 14);

      b.add("mat", 13, 16, { w: 2 }).add("chair", 13, 12).add("reception", 12, 13, { interact: "workspace" });
      b.add("tree", 11, 16, { interact: "plant" }).add("tree", 16, 16, { interact: "plant" });
      return { spawn: { tx: 13.5, ty: 15 } };
    },
  },

  "6-15": {
    w: 34,
    h: 24,
    build(b, config) {
      const { theme } = b;
      b.windows = [2, 5, 9, 13, 17, 21, 26, 30];
      b.wall(23, 9, 11, 2).wall(23, 2, 1, 9).open(27, 9, 2, 2); // meeting room
      b.wall(0, 14, 11, 2).wall(10, 14, 1, 10).open(4, 14, 2, 2).open(10, 19, 1, 2); // break room
      b.room("Meeting room", 24, 2, 9, 7, "carpet")
        .room("Break room", 1, 16, 9, 7, "carpet")
        .room("Copy & coffee", 24, 11, 9, 12)
        .room("Cubicles", 1, 2, 22, 12)
        .room("Entrance", 11, 14, 12, 9)
        .room("Office floor", 1, 2, 32, 21);

      pods(b, [{ x: 3, y: 3 }, { x: 11, y: 3 }, { x: 3, y: 8 }, { x: 11, y: 8 }], deskCount(config));
      b.add("water-cooler", 20, 2, { interact: "water-cooler" });
      b.plant(20, 7, "tree");

      b.add("tv", 27, 1, { w: 2 }).add("meeting-table", 26, 6, { interact: "meeting" });
      for (const x of [26, 27, 28, 29]) b.add("chair", x, 4);
      b.add("chair", 25, 6).add("chair", 30, 6);
      if (theme.stringLights) b.add("string-lights", 30, 1, { w: 2 });

      b.add("rug", 2, 22, { w: 6, h: 4 }).add("sofa", 3, 19, { interact: "sofa" }).add("sofa", 5, 19, { interact: "sofa" });
      b.add("coffee-table", 4, 21).add("armchair", 2, 21, { interact: "sofa" }).add("armchair", 7, 21, { interact: "sofa" });
      b.add("record-player", 7, 16, { interact: "record-player" }).add("bookshelf", 1, 16, { interact: "bookshelf" }).add("clock", 2, 15);
      if (theme.cat) b.add("cat", 8, 22, { interact: "cat" });

      b.add("counter", 24, 11).add("sink", 25, 11).add("coffee-machine", 26, 11, { interact: "coffee" });
      b.add("fridge", 29, 11, { interact: "fridge" }).add("water-cooler", 30, 11, { interact: "water-cooler" });
      b.add("copier", 31, 15, { interact: "copier" });
      b.add("round-table", 25, 17).add("round-table", 29, 17);
      for (const x of [24, 27, 28, 31]) b.add("stool", x, 17);
      b.add("tree", 32, 22, { interact: "plant" });
      b.plant(24, 22, "tree");

      b.add("mat", 16, 22, { w: 2 }).add("chair", 16, 18).add("reception", 15, 19, { interact: "workspace" });
      b.add("tree", 14, 22, { interact: "plant" }).add("tree", 19, 22, { interact: "plant" });
      b.add("armchair", 12, 20, { interact: "sofa" }).add("armchair", 12, 22, { interact: "sofa" });
      return { spawn: { tx: 16.5, ty: 21 } };
    },
  },
};
