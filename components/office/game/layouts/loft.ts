import { BASE_H as MAP_H, deskCount, grid, type Builder } from "../builder";
import { fullPlans, type LayoutDef } from "./index";
import { loftTiers } from "./loftTiers";

/**
 * Industrial loft: brick walls, big windows, concrete floor, a kitchen island,
 * leather sofas, phone booths and a meeting room.
 *
 *  ┌─────────────┬──────┬──────────────┐
 *  │  Workbench  │      │    Lounge    │
 *  │   desks     │island│              │
 *  ├─┬─┬─┐       │      ├──door────────┤
 *  │booths│  Entrance    door Meeting  │
 *  └─┴─┴─┴──────[ ]─────┴──────────────┘
 */
export const loft: LayoutDef = {
  id: "loft",
  base: "concrete",
  brick: true,
  palettes: {
    // Red brick, green leather.
    "cozy-green": {
      1: "#b9b4a2", 2: "#a29d8a", 3: "#cdc9b8", 4: "#9c5a3c", 5: "#d1a588", 6: "#3a3a2c", 7: "#1f1c19", 8: "#2b2a22",
      9: "#6f877a", 0: "#5d7366", K: "#e8e4dc", L: "#c9c3b8", F: "#3f6b45", f: "#294b38", U: "#3a3d36", V: "#24261f",
      R: "#c9a24a", j: "#6f9a5f", X: "#4a5248", Y: "#333a32", d: "#9a6a43", D: "#6e4a2f", e: "#b07f55",
    },
    // White-painted brick, mustard sofas, pale concrete.
    "creative-studio": {
      1: "#d6d2ca", 2: "#c2bdb3", 3: "#e6e3dc", 4: "#f0ebe2", 5: "#d6cdbd", 6: "#5a3825", 7: "#1f1c19", 8: "#5a3825",
      9: "#5f9ea0", 0: "#4d8a8c", K: "#fffaf0", L: "#e6e1d5", F: "#d9a441", f: "#b0822a", U: "#5f9ea0", V: "#3f7476",
      R: "#d9534f", j: "#e6c76a", X: "#5a3825", Y: "#3f271a", d: "#c9935f", D: "#9c6a41", e: "#ddb07c",
    },
    // Grey brick, black leather.
    "quiet-minimal": {
      1: "#c4c4bf", 2: "#adada8", 3: "#d6d6d1", 4: "#8c8c86", 5: "#b4b4ad", 6: "#3a3a38", 7: "#1f1f1d", 8: "#2b2b29",
      9: "#7a8590", 0: "#68737e", K: "#f2f2ef", L: "#d9d9d4", F: "#3a3d36", f: "#24261f", U: "#3a3d36", V: "#24261f",
      R: "#d9d4c7", j: "#a9a395", X: "#5a5f66", Y: "#3f444a", d: "#a6a39b", D: "#7d7a73", e: "#bdbab2",
    },
    // Classic red brick and cognac leather.
    "community-lounge": {
      1: "#b9b4ab", 2: "#a29d94", 3: "#cdc9c1", 4: "#a9573b", 5: "#d4a58c", 6: "#3a3530", 7: "#1f1c19", 8: "#2b2a22",
      9: "#5d6b78", 0: "#4f5c68", K: "#e8e4dc", L: "#c9c3b8", F: "#8a4b2e", f: "#5e321d", U: "#3a3d36", V: "#24261f",
      R: "#c9a24a", j: "#8a4b2e", X: "#4a4f55", Y: "#33383d", d: "#9a6a43", D: "#6e4a2f", e: "#b07f55",
    },
  },
  plans: {
    ...loftTiers,
    ...fullPlans({ x: 26, y: 12 }, (b: Builder, config) => {
      const { theme } = b;
      b.windows = [2, 5, 8, 11, 14, 18, 22, 26, 30, 34, 38, 41];
      // Phone booths, each with a one-tile door.
      b.wall(0, 22, 13, 2).wall(4, 22, 1, MAP_H - 22).wall(8, 22, 1, MAP_H - 22).wall(12, 22, 1, MAP_H - 22);
      b.open(2, 22, 1, 2).open(6, 22, 1, 2).open(10, 22, 1, 2);
      // Meeting room.
      b.wall(30, 17, 14, 2).wall(30, 17, 1, MAP_H - 17).open(35, 17, 2, 2).open(30, 23, 1, 2);

      b.room("Phone booths", 1, 24, 11, 6, "carpet")
        .room("Meeting room", 31, 19, 12, 11, "carpet")
        .room("Workbench", 1, 2, 16, 12)
        .room("Lounge", 26, 2, 17, 13)
        .room("Kitchen island", 14, 13, 15, 8)
        .room("Entrance", 13, 21, 17, 9)
        .room("Loft", 1, 2, 42, 28);

      /* Workbench desks */
      const left = grid([2, 5, 8, 11], [5, 10, ...b.bandY(2, 4, 2)]);
      const band = grid(b.bandX(1, 3, 2), [5, 10]);
      b.desks([...left, ...band].sort((p, q) => p.y - q.y || p.x - q.x).slice(0, deskCount(config)));
      b.add("bookshelf", 14, 2, { interact: "bookshelf" }).add("water-cooler", 16, 2, { interact: "water-cooler" });
      b.add("lamp", 1, 13);
      b.plant(13, 13, "tree");
      if (theme.stringLights) b.add("string-lights", 6, 1, { w: 2 });

      /* Kitchen island and a communal table */
      b.add("long-table", 19, 15);
      for (let x = 19; x <= 22; x++) b.add("stool", x, 14);
      b.add("counter", 18, 19).add("sink", 19, 19).add("coffee-machine", 20, 19, { interact: "coffee" });
      b.add("counter", 21, 19).add("counter", 22, 19).add("fridge", 25, 19, { interact: "fridge" });
      for (let x = 18; x <= 22; x++) b.add("stool", x, 20);
      b.plant(16, 19);

      /* Lounge */
      if (theme.rugs) b.add("rug", 29, 10, { w: 9, h: 6 });
      b.add("sofa", 30, 6, { interact: "sofa" }).add("sofa", 32, 6, { interact: "sofa" }).add("sofa", 34, 6, { interact: "sofa" });
      b.add("coffee-table", 31, 8).add("coffee-table", 33, 8);
      b.add("armchair", 29, 8, { interact: "sofa" }).add("armchair", 36, 8, { interact: "sofa" });
      b.add("record-player", 40, 2, { interact: "record-player" });
      b.add("beanbag", 39, 10, { interact: "sofa" }).add("beanbag", 41, 10, { interact: "sofa" });
      if (theme.bookshelves) b.add("bookshelf", 27, 2, { interact: "bookshelf" });
      else b.plant(27, 2, "tree");
      if (theme.cat) b.add("cat", 35, 10, { interact: "cat" });
      b.add("tree", 42, 13, { interact: "plant" });
      b.plant(26, 13, "tree");
      b.art(33, 1);

      /* Meeting room */
      b.add("tv", 36, 18, { w: 2 }).add("meeting-table", 35, 25, { interact: "meeting" });
      for (const x of [35, 36, 37, 38]) b.add("chair", x, 23);
      b.add("chair", 34, 25).add("chair", 39, 25);
      b.plant(42, 19);
      b.plant(42, 29);
      b.art(40, 18);

      /* Phone booths */
      b.desks(grid([1, 5, 9], [b.Y(27)]), "quiet-desk");
      b.add("clock", 1, 23);

      /* Entrance */
      b.add("mat", 21, MAP_H - 2, { w: 2 }).add("chair", 21, 24).add("reception", 20, 25, { interact: "workspace" });
      b.add("tree", 18, 29, { interact: "plant" }).add("tree", 25, 29, { interact: "plant" });
      b.add("armchair", 15, 26, { interact: "sofa" }).add("armchair", 15, 28, { interact: "sofa" });
      b.plant(28, 27);

      return { spawn: { tx: 21.5, ty: MAP_H - 3 } };
    }),
  },
};
