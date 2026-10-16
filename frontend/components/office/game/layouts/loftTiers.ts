import { deskCount, grid } from "../builder";
import type { Plan } from "./index";

/**
 * Loft plans for smaller teams: a studio with one call booth, a small loft with
 * two booths and a meeting room, and a medium loft with three booths.
 */
export const loftTiers: Record<"solo" | "2-5" | "6-15", Plan> = {
  solo: {
    w: 20,
    h: 14,
    build(b, config) {
      const { theme } = b;
      b.windows = [2, 5, 8, 11, 14, 17];
      b.wall(0, 8, 5, 2).wall(4, 8, 1, 6).open(2, 8, 1, 2); // call booth
      b.room("Call booth", 1, 10, 3, 3, "carpet").room("Lounge", 12, 2, 7, 6).room("Kitchen island", 10, 8, 6, 3).room("Loft", 1, 2, 18, 11);

      b.desks(grid([3, 6], [5]).slice(0, deskCount(config)));
      b.add("notice-board", 8, 1, { w: 2, interact: "workspace" });
      b.desks(grid([1], [12]), "call-booth");

      if (theme.rugs) b.add("rug", 12, 7, { w: 6, h: 5 });
      b.add("sofa", 13, 4, { interact: "sofa" }).add("sofa", 15, 4, { interact: "sofa" }).add("coffee-table", 14, 6);
      b.add("record-player", 16, 2, { interact: "record-player" }).add("fridge", 18, 2, { interact: "fridge" });

      b.add("counter", 11, 9).add("coffee-machine", 12, 9, { interact: "coffee" }).add("sink", 13, 9);
      for (const x of [11, 12, 13]) b.add("stool", x, 10);

      b.add("mat", 9, 12, { w: 2 }).add("tree", 7, 12, { interact: "plant" }).add("lamp", 1, 6);
      if (theme.cat) b.add("cat", 16, 7, { interact: "cat" });
      b.plant(18, 12, "tree");
      return { spawn: { tx: 9.5, ty: 11 } };
    },
  },

  "2-5": {
    w: 28,
    h: 18,
    build(b, config) {
      const { theme } = b;
      b.windows = [2, 6, 10, 14, 18, 22, 25];
      b.wall(0, 12, 9, 2).wall(4, 12, 1, 6).wall(8, 12, 1, 6).open(2, 12, 1, 2).open(6, 12, 1, 2); // booths
      b.wall(18, 10, 10, 2).wall(18, 10, 1, 8).open(22, 10, 2, 2).open(18, 14, 1, 2); // meeting room
      b.room("Phone booths", 1, 14, 7, 3, "carpet")
        .room("Meeting room", 19, 12, 8, 5, "carpet")
        .room("Lounge", 19, 2, 8, 8)
        .room("Kitchen island", 10, 3, 7, 8)
        .room("Workbench", 1, 2, 8, 9)
        .room("Entrance", 9, 12, 9, 5)
        .room("Loft", 1, 2, 26, 15);

      b.desks(grid([2, 5], [5, 9]).slice(0, deskCount(config)));
      b.desks(grid([1], [16]), "call-booth");
      b.desks(grid([5], [16]), "quiet-desk");

      b.add("long-table", 11, 5);
      for (let x = 11; x <= 14; x++) b.add("stool", x, 4).add("stool", x, 10);
      b.add("counter", 11, 9).add("sink", 12, 9).add("coffee-machine", 13, 9, { interact: "coffee" }).add("counter", 14, 9);
      b.add("fridge", 17, 2, { interact: "fridge" });

      if (theme.rugs) b.add("rug", 20, 8, { w: 6, h: 5 });
      b.add("sofa", 21, 5, { interact: "sofa" }).add("sofa", 23, 5, { interact: "sofa" }).add("coffee-table", 22, 7);
      b.add("armchair", 20, 7, { interact: "sofa" }).add("armchair", 25, 7, { interact: "sofa" });
      b.add("record-player", 25, 2, { interact: "record-player" });
      if (theme.cat) b.add("cat", 24, 9, { interact: "cat" });

      b.add("tv", 20, 11, { w: 2 }).add("meeting-table", 21, 15, { interact: "meeting" });
      for (const x of [21, 22, 23, 24]) b.add("chair", x, 13);

      b.add("mat", 13, 16, { w: 2 }).add("chair", 13, 13).add("reception", 12, 14, { interact: "workspace" });
      b.add("tree", 10, 16, { interact: "plant" }).add("tree", 16, 16, { interact: "plant" });
      b.art(5, 1);
      return { spawn: { tx: 13.5, ty: 15 } };
    },
  },

  "6-15": {
    w: 34,
    h: 24,
    build(b, config) {
      const { theme } = b;
      b.windows = [2, 5, 8, 11, 15, 19, 23, 27, 30];
      b.wall(0, 14, 13, 2).wall(4, 14, 1, 10).wall(8, 14, 1, 10).wall(12, 14, 1, 10);
      b.open(2, 14, 1, 2).open(6, 14, 1, 2).open(10, 14, 1, 2); // booths
      b.wall(22, 14, 12, 2).wall(22, 14, 1, 10).open(27, 14, 2, 2).open(22, 19, 1, 2); // meeting room
      b.room("Phone booths", 1, 16, 11, 7, "carpet")
        .room("Meeting room", 23, 16, 10, 7, "carpet")
        .room("Workbench", 1, 2, 13, 12)
        .room("Lounge", 22, 2, 11, 12)
        .room("Kitchen island", 14, 2, 8, 12)
        .room("Entrance", 13, 16, 9, 7)
        .room("Loft", 1, 2, 32, 21);

      b.desks(grid([2, 5, 8, 11], [5, 10]).slice(0, deskCount(config)));
      b.desks(grid([1], [19]), "call-booth");
      b.desks(grid([5, 9], [19]), "quiet-desk");
      b.add("clock", 1, 15);

      b.add("long-table", 15, 6);
      for (let x = 15; x <= 18; x++) b.add("stool", x, 5);
      b.add("counter", 15, 11).add("sink", 16, 11).add("coffee-machine", 17, 11, { interact: "coffee" });
      b.add("counter", 18, 11).add("counter", 19, 11);
      for (let x = 15; x <= 19; x++) b.add("stool", x, 12);
      b.add("fridge", 20, 2, { interact: "fridge" }).add("water-cooler", 14, 2, { interact: "water-cooler" });
      if (theme.stringLights) b.add("string-lights", 16, 1, { w: 2 });

      if (theme.rugs) b.add("rug", 24, 9, { w: 7, h: 5 });
      b.add("sofa", 25, 6, { interact: "sofa" }).add("sofa", 27, 6, { interact: "sofa" }).add("coffee-table", 26, 8);
      b.add("armchair", 24, 8, { interact: "sofa" }).add("armchair", 29, 8, { interact: "sofa" });
      b.add("record-player", 31, 2, { interact: "record-player" });
      b.add("beanbag", 31, 10, { interact: "sofa" });
      if (theme.bookshelves) b.add("bookshelf", 23, 2, { interact: "bookshelf" });
      if (theme.cat) b.add("cat", 28, 9, { interact: "cat" });
      b.art(28, 1);

      b.add("tv", 24, 15, { w: 2 }).add("meeting-table", 26, 20, { interact: "meeting" });
      for (const x of [26, 27, 28, 29]) b.add("chair", x, 18);
      b.add("chair", 25, 20).add("chair", 30, 20);
      b.plant(32, 22);

      b.add("mat", 16, 22, { w: 2 }).add("chair", 16, 18).add("reception", 15, 19, { interact: "workspace" });
      b.add("tree", 14, 22, { interact: "plant" }).add("tree", 19, 22, { interact: "plant" });
      b.plant(13, 16, "tree");
      return { spawn: { tx: 16.5, ty: 21 } };
    },
  },
};
