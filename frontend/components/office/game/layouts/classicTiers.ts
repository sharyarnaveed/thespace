import { deskCount, grid } from "../builder";
import type { Plan } from "./index";

/**
 * Classic plans for smaller teams: a one-room studio, a small office with a
 * meeting room and kitchen, and a medium office that adds a quiet room and a
 * walled lounge around a hallway.
 */
export const classicTiers: Record<"solo" | "2-5" | "6-15", Plan> = {
  /*  ┌────────────────────┐
   *  │ desk   call  kitch.│
   *  │            lounge  │
   *  └───────[ ]──────────┘  */
  solo: {
    w: 20,
    h: 14,
    build(b, config) {
      const { theme } = b;
      b.windows = [3, 6, 12, 16];
      b.room("Kitchenette", 13, 2, 6, 5, "kitchen").room("Lounge nook", 11, 9, 8, 4).room("Studio", 1, 2, 18, 11);

      b.desks(grid([3, 6], [5]).slice(0, deskCount(config)));
      b.add("bookshelf", 1, 2, { interact: "bookshelf" });
      b.add("notice-board", 8, 1, { w: 2, interact: "workspace" });
      b.add("tv", 10, 1, { w: 2 }).add("round-table", 10, 3, { interact: "call-booth" });
      b.add("counter", 14, 2).add("coffee-machine", 15, 2, { interact: "coffee" }).add("sink", 16, 2).add("fridge", 17, 2, { interact: "fridge" });
      b.add("stool", 15, 5).add("stool", 17, 5);
      if (theme.rugs) b.add("rug", 12, 12, { w: 6, h: 3 });
      b.add("sofa", 13, 10, { interact: "sofa" }).add("armchair", 17, 11, { interact: "sofa" }).add("coffee-table", 13, 12);
      b.add("record-player", 17, 9, { interact: "record-player" });
      if (theme.cat) b.add("cat", 16, 12, { interact: "cat" });
      b.add("mat", 9, 12, { w: 2 }).add("plant", 1, 12, { interact: "plant" });
      b.plant(18, 2);
      b.plant(7, 12);
      b.add("lamp", 1, 8);
      return { spawn: { tx: 9.5, ty: 11 } };
    },
  },

  /*  ┌───────┬─────────┬──────┐
   *  │Meeting│  desks  │Kitch.│
   *  ├─door──┘         └─door─┤
   *  │ lounge  entrance  focus│
   *  └──────────[ ]───────────┘  */
  "2-5": {
    w: 28,
    h: 18,
    build(b, config) {
      const { theme } = b;
      b.windows = [2, 7, 11, 15, 21, 25];
      b.wall(0, 8, 10, 2).wall(9, 2, 1, 8).open(4, 8, 2, 2); // meeting
      b.wall(19, 8, 9, 2).wall(19, 2, 1, 8).open(22, 8, 2, 2); // kitchen
      b.room("Meeting room", 1, 2, 8, 6, "carpet")
        .room("Kitchen", 20, 2, 7, 6, "kitchen")
        .room("Desks", 10, 2, 9, 8)
        .room("Lounge", 1, 10, 9, 7)
        .room("Focus corner", 19, 10, 8, 7)
        .room("Entrance", 10, 10, 9, 7);

      b.add("tv", 4, 1, { w: 2 }).add("meeting-table", 3, 5, { interact: "meeting" });
      for (const x of [3, 4, 5, 6]) b.add("chair", x, 3);
      b.plant(1, 7);

      b.desks(grid([11, 14], [4, 7]).slice(0, deskCount(config)));
      b.add("water-cooler", 17, 2, { interact: "water-cooler" });
      b.plant(18, 2);

      b.add("counter", 20, 2).add("coffee-machine", 21, 2, { interact: "coffee" }).add("sink", 22, 2).add("fridge", 23, 2, { interact: "fridge" });
      b.add("round-table", 22, 5).add("stool", 21, 5).add("stool", 24, 5);
      b.plant(26, 7);

      if (theme.rugs) b.add("rug", 2, 16, { w: 6, h: 4 });
      b.add("sofa", 3, 13, { interact: "sofa" }).add("sofa", 5, 13, { interact: "sofa" }).add("coffee-table", 4, 15);
      b.add("armchair", 8, 15, { interact: "sofa" }).add("record-player", 1, 11, { interact: "record-player" });
      if (theme.cat) b.add("cat", 6, 16, { interact: "cat" });
      b.add("notice-board", 6, 9, { w: 2, interact: "notice-board" });

      b.add("mat", 13, 16, { w: 2 }).add("chair", 13, 12).add("reception", 12, 13, { interact: "workspace" });
      b.add("plant", 11, 16, { interact: "plant" }).add("plant", 16, 16, { interact: "plant" });

      b.desks(grid([21, 24], [14]), "quiet-desk");
      b.add("bookshelf", 19, 11, { interact: "bookshelf" }).add("lamp", 26, 11);
      b.plant(26, 16);
      b.art(24, 9);
      return { spawn: { tx: 13.5, ty: 15 } };
    },
  },

  /*  ┌────────┬────────────┬────────┐
   *  │Meeting │   desks    │Kitchen │
   *  ├─door───┘            └──door──┤
   *  │            Hallway           │
   *  ├─door───┐            ┌──door──┤
   *  │ Quiet door Entrance door Lounge│
   *  └────────┴────[ ]─────┴────────┘  */
  "6-15": {
    w: 34,
    h: 24,
    build(b, config) {
      const { theme } = b;
      b.windows = [2, 6, 13, 17, 20, 26, 30];
      b.wall(0, 9, 11, 2).wall(10, 2, 1, 9).open(4, 9, 2, 2); // meeting
      b.wall(23, 9, 11, 2).wall(23, 2, 1, 9).open(27, 9, 2, 2); // kitchen
      b.wall(0, 14, 11, 2).wall(10, 14, 1, 10).open(4, 14, 2, 2).open(10, 19, 1, 2); // quiet
      b.wall(23, 14, 11, 2).wall(23, 14, 1, 10).open(27, 14, 2, 2).open(23, 19, 1, 2); // lounge
      b.room("Meeting room", 1, 2, 9, 7, "carpet")
        .room("Kitchen", 24, 2, 9, 7, "kitchen")
        .room("Desks", 11, 2, 12, 9)
        .room("Hallway", 1, 11, 32, 3)
        .room("Quiet room", 1, 16, 9, 7, "carpet")
        .room("Lounge", 24, 16, 9, 7)
        .room("Entrance", 11, 14, 12, 9);

      b.add("tv", 4, 1, { w: 2 }).add("meeting-table", 3, 6, { interact: "meeting" });
      for (const x of [3, 4, 5, 6]) b.add("chair", x, 4);
      b.add("chair", 2, 6).add("chair", 7, 6);
      b.plant(1, 8);
      b.plant(9, 8);
      if (theme.rugs) b.add("rug", 2, 8, { w: 6, h: 5 });

      const n = deskCount(config);
      b.desks(grid([12, 15, 18, 21], [4, 8]).slice(0, theme.communal ? Math.min(4, n) : n));
      if (theme.communal) {
        b.add("long-table", 12, 8).add("long-table", 18, 8);
        for (const x of [12, 13, 14, 15, 18, 19, 20, 21]) b.add("stool", x, 7);
      }
      b.add("water-cooler", 17, 2, { interact: "water-cooler" });
      if (theme.stringLights) b.add("string-lights", 13, 1, { w: 2 });

      b.add("counter", 24, 2).add("sink", 25, 2).add("coffee-machine", 26, 2, { interact: "coffee" }).add("counter", 27, 2);
      b.add("fridge", 28, 2, { interact: "fridge" });
      b.add("round-table", 25, 6).add("round-table", 29, 6);
      for (const x of [24, 27, 31]) b.add("stool", x, 6);
      b.plant(32, 2);
      b.plant(32, 8);

      b.add("notice-board", 7, 10, { w: 2, interact: "notice-board" });
      b.art(20, 1);
      b.plant(1, 13);
      b.plant(32, 13);

      b.add("clock", 7, 15);
      b.desks(grid([2, 6], [20]), "quiet-desk");
      b.add("bookshelf", 1, 16, { interact: "bookshelf" }).add("lamp", 9, 16);
      b.plant(1, 22);
      b.plant(9, 22);

      b.add("mat", 16, 22, { w: 2 }).add("chair", 16, 17).add("reception", 15, 18, { interact: "workspace" });
      b.add("plant", 14, 22, { interact: "plant" }).add("plant", 19, 22, { interact: "plant" });
      b.add("armchair", 12, 19, { interact: "sofa" }).add("armchair", 12, 21, { interact: "sofa" });

      if (theme.rugs) b.add("rug", 25, 21, { w: 6, h: 4 });
      b.add("sofa", 26, 18, { interact: "sofa" }).add("sofa", 28, 18, { interact: "sofa" }).add("coffee-table", 27, 20);
      b.add("armchair", 25, 20, { interact: "sofa" }).add("armchair", 30, 20, { interact: "sofa" });
      b.add("record-player", 31, 16, { interact: "record-player" });
      if (theme.cat) b.add("cat", 29, 21, { interact: "cat" });
      if (theme.stringLights) b.add("string-lights", 29, 15, { w: 2 });
      b.plant(32, 22);
      return { spawn: { tx: 16.5, ty: 21 } };
    },
  },
};
