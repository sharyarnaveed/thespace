import { BASE_H as MAP_H, deskCount, grid, type Builder } from "../builder";
import { fullPlans, type LayoutDef } from "./index";
import { classicTiers } from "./classicTiers";

/**
 * Rooms around a central hallway. Colours come entirely from the workspace style.
 *
 *  ┌─────────┬───────────────┬─────────┐
 *  │ Meeting │  Open desks   │ Kitchen │
 *  ├──door───┘               └──door───┤
 *  │              Hallway              │
 *  ├──door───┐               ┌──door───┤
 *  │  Quiet  door  Entrance  door Lounge│
 *  └─────────┴──────[ ]──────┴─────────┘
 */
export const classic: LayoutDef = {
  id: "classic",
  base: "wood",
  plans: {
    ...classicTiers,
    ...fullPlans({ x: 22, y: 7 }, (b: Builder, config) => {
      const { theme } = b;
      b.windows = [2, 11, 16, 19, 24, 27, 39, 41];
      b.wall(0, 11, 14, 2).wall(13, 2, 1, 11); // meeting
      b.wall(30, 11, 14, 2).wall(30, 2, 1, 11); // kitchen
      b.wall(0, 16, 14, 2).wall(13, 16, 1, MAP_H - 16); // quiet
      b.wall(30, 16, 14, 2).wall(30, 16, 1, MAP_H - 16); // lounge
      b.open(6, 11, 2, 2).open(35, 11, 2, 2).open(6, 16, 2, 2).open(13, 23, 1, 2).open(36, 16, 2, 2).open(30, 23, 1, 2);

      b.room("Meeting room", 1, 2, 12, 9, "carpet")
        .room("Desks", 14, 2, 16, 11)
        .room("Coffee corner", 31, 2, 12, 9, "kitchen")
        .room("Hallway", 1, 13, 42, 3)
        .room("Quiet room", 1, 18, 12, 12, "carpet")
        .room("Entrance", 14, 16, 16, 14)
        .room("Lounge", 31, 18, 12, 12);

      /* Meeting room */
      b.add("tv", 6, 1, { w: 2 }).add("meeting-table", 5, 6, { interact: "meeting" });
      for (const x of [5, 6, 7, 8]) b.add("chair", x, 4);
      b.add("chair", 4, 6).add("chair", 9, 6);
      if (theme.stringLights) b.add("string-lights", 9, 1, { w: 2 });
      b.add("plant", 1, 10, { interact: "plant" });
      b.plant(12, 10);
      b.plant(12, 2);
      b.plant(1, 2);
      if (theme.rugs) b.add("rug", 4, 8, { w: 6, h: 6 });

      /* Open desks */
      const n = deskCount(config);
      const cols = [15, 18, ...b.bandX(1, 3, 2), b.X(23), b.X(26)];
      const slots = grid(cols, [5, ...b.bandY(2, 4, 2), b.Y(9)]);
      b.desks(theme.communal ? slots.slice(0, Math.min(cols.length, n)) : slots.slice(0, n));
      if (theme.communal) {
        for (const x of [15, 23]) {
          b.add("long-table", x, 9);
          for (let i = 0; i < 4; i++) b.add("stool", x + i, 8);
        }
      }
      b.add("water-cooler", 20, 2, { interact: "water-cooler" });
      if (theme.bookshelves) b.add("bookshelf", 21, 2, { interact: "bookshelf" });
      else if (theme.plants > 0.5) b.add("lamp", 22, 2);
      b.plant(14, 2);
      b.plant(29, 2);
      b.plant(14, 12);
      b.plant(29, 12);
      if (theme.stringLights) b.add("string-lights", 21, 1, { w: 2 });

      /* Coffee corner */
      b.add("counter", 31, 2).add("sink", 32, 2).add("counter", 33, 2).add("coffee-machine", 34, 2, { interact: "coffee" });
      b.add("counter", 35, 2).add("fridge", 36, 2, { interact: "fridge" });
      b.add("round-table", 33, 7).add("round-table", 38, 7);
      for (const x of [32, 35, 37, 40]) b.add("stool", x, 7);
      b.add("plant", 42, 2, { interact: "plant" });
      b.plant(42, 10);
      b.plant(31, 10);
      b.art(38, 1);

      /* Hallway */
      b.add("notice-board", 9, 12, { w: 2, interact: "notice-board" });
      if (theme.art) b.add("whiteboard", 39, 12, { w: 2 });
      b.art(3, 12);
      b.art(33, 12);
      b.plant(1, 15);
      b.plant(42, 15);

      /* Quiet room */
      b.add("clock", 9, 17);
      b.desks(grid([2, 9], [b.Y(21), b.Y(26)]), "quiet-desk");
      b.add("bookshelf", 2, 18, { interact: "bookshelf" }).add("lamp", 11, 18);
      b.plant(1, 29);
      b.plant(12, 29);
      b.plant(5, 29);

      /* Entrance */
      b.add("mat", 21, MAP_H - 2, { w: 2 }).add("chair", 21, 20).add("reception", 20, 21, { interact: "workspace" });
      b.add("plant", 18, 29, { interact: "plant" }).add("plant", 25, 29, { interact: "plant" });
      b.add("armchair", 15, 24, { interact: "sofa" }).add("armchair", 15, 26, { interact: "sofa" }).add("lamp", 15, 22);
      b.plant(28, 17);
      b.plant(14, 17);
      b.plant(28, 26);
      for (const x of b.bandX(1, 4, 1)) b.plantAt(x, b.Y(17));

      /* Lounge */
      if (theme.rugs) b.add("rug", 33, 25, { w: 6, h: 5 });
      b.add("sofa", 34, 22, { interact: "sofa" }).add("sofa", 36, 22, { interact: "sofa" }).add("coffee-table", 35, 24);
      b.add("armchair", 33, 24, { interact: "sofa" }).add("armchair", 38, 24, { interact: "sofa" });
      b.add("record-player", 40, 18, { interact: "record-player" });
      if (theme.cat) b.add("cat", 37, 25, { interact: "cat" });
      if (theme.stringLights) b.add("string-lights", 32, 17, { w: 2 });
      b.art(39, 17);
      if (theme.communal) {
        b.add("sofa", 34, 28, { interact: "sofa" }).add("sofa", 36, 28, { interact: "sofa" }).add("armchair", 39, 28, { interact: "sofa" });
      }
      if (theme.bookshelves) b.add("beanbag", 40, 27, { interact: "sofa" }).add("beanbag", 41, 25, { interact: "sofa" });
      b.plant(31, 18);
      b.plant(42, 29);
      b.plant(31, 29);

      return { spawn: { tx: 21.5, ty: MAP_H - 3 } };
    }),
  },
};
