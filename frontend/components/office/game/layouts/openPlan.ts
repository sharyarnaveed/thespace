import { BASE_H as MAP_H, deskCount, grid, type Builder } from "../builder";
import { fullPlans, type LayoutDef } from "./index";
import { openPlanTiers } from "./openPlanTiers";

/**
 * A bright corporate floor: cubicle pods with glass-topped partitions, a lounge
 * corner on a green rug, a copy-and-coffee area and a walled break room.
 *
 *  ┌────────┬────────────────┬─────────┐
 *  │ Lounge │  ▭▭  Cubicles  │ Meeting │
 *  │ corner │  ▭▭    ▭▭      ├──door───┤
 *  ├──door──┤  ▭▭    ▭▭      │  Copy & │
 *  │ Break  door  Entrance   │  coffee │
 *  └────────┴──────[ ]───────┴─────────┘
 */
export const openPlan: LayoutDef = {
  id: "open-plan",
  base: "tiles",
  palettes: {
    // Mint and green.
    "cozy-green": {
      1: "#cfe6d3", 2: "#adcfb4", 3: "#e2f1e4", 4: "#eef5ec", 5: "#d3e4cf", 6: "#6f9a7a", 7: "#2b2a22", 8: "#3f6b45",
      9: "#b4d3b9", 0: "#9cc2a3", K: "#f2f8f0", L: "#d6e8d4", F: "#4f9a5f", f: "#3a7546", U: "#4f9a5f", V: "#3a7546",
      R: "#e6c76a", j: "#f3dcc0", X: "#f5f1e8", Y: "#dcd2bd", d: "#e3c9a0", D: "#c9a87a", e: "#f0dcb8",
    },
    // Peach walls, teal sofas, coral chairs.
    "creative-studio": {
      1: "#f3d9b5", 2: "#e2c193", 3: "#fbe8cc", 4: "#fdf3df", 5: "#f0dcb4", 6: "#c98260", 7: "#2b2a22", 8: "#b8673f",
      9: "#e9b48e", 0: "#dc9f78", K: "#fffaf0", L: "#f3dcc0", F: "#3f8f94", f: "#2c6a6e", U: "#e07a5f", V: "#b85c44",
      R: "#e6c76a", j: "#c98260", X: "#fffaf0", Y: "#e8d9bd", d: "#f5f1e8", D: "#d9cfbd", e: "#fffaf0",
    },
    // Lavender tiles, blue sofas and chairs, green rugs.
    "quiet-minimal": {
      1: "#c7c8ea", 2: "#a9abd6", 3: "#dcddf5", 4: "#e8eaf4", 5: "#cfd3e6", 6: "#7f86b5", 7: "#2b2a22", 8: "#5f6aa8",
      9: "#9fa6d8", 0: "#8a91c9", K: "#f2f3fa", L: "#d9dcef", F: "#3f72d6", f: "#2a52a8", U: "#3f72d6", V: "#2a52a8",
      R: "#4f9e4a", j: "#7cc46f", X: "#ece6d6", Y: "#cfc6b0", d: "#ece6d6", D: "#cdc4ad", e: "#f7f3ea",
    },
    // Warm sand, mustard sofas, terracotta chairs.
    "community-lounge": {
      1: "#ecd3b8", 2: "#d9b48f", 3: "#f6e3cf", 4: "#f7e6d2", 5: "#e9cdb0", 6: "#8f4c2e", 7: "#2b2a22", 8: "#8f4c2e",
      9: "#d9a27e", 0: "#c48a65", K: "#fdf3e3", L: "#ecd3b8", F: "#d9a441", f: "#b0822a", U: "#c46a4a", V: "#9a4f35",
      R: "#294b38", j: "#6f9a5f", X: "#fdf3e3", Y: "#e6cfae", d: "#c9935f", D: "#9c6a41", e: "#ddb07c",
    },
  },
  plans: {
    ...openPlanTiers,
    ...fullPlans({ x: 22, y: 13 }, (b: Builder, config) => {
      const { theme } = b;
      b.windows = [2, 5, 8, 11, 15, 19, 24, 28, 33, 37, 41];
      b.wall(30, 10, 14, 2).wall(30, 2, 1, 10).open(35, 10, 2, 2); // meeting room
      b.wall(0, 17, 14, 2).wall(13, 17, 1, MAP_H - 17).open(5, 17, 2, 2).open(13, 23, 1, 2); // break room

      b.room("Meeting room", 31, 2, 12, 8, "carpet")
        .room("Break room", 1, 19, 12, 11, "carpet")
        .room("Lounge corner", 1, 2, 12, 8)
        .room("Cubicles", 14, 2, 16, 15)
        .room("Copy & coffee", 31, 12, 12, 18)
        .room("Entrance", 14, 17, 16, 13)
        .room("Office floor", 1, 2, 42, 28);

      /* Lounge corner */
      b.add("rug", 2, 9, { w: 8, h: 5 });
      b.add("sofa", 3, 6, { interact: "sofa" }).add("sofa", 5, 6, { interact: "sofa" }).add("coffee-table", 4, 8);
      b.add("armchair", 2, 8, { interact: "sofa" }).add("armchair", 7, 8, { interact: "sofa" });
      b.add("tree", 1, 2, { interact: "plant" }).add("bookshelf", 9, 2, { interact: "bookshelf" });
      b.plant(12, 2, "tree");
      b.art(6, 1);

      /* Cubicle pods: partition behind, chairs, then desks facing the aisle. */
      const n = deskCount(config);
      const pods = grid([15, ...b.bandX(0, 8, 7).map((x) => x + 1), b.X(23)], [3, 8, ...b.bandY(0, 5, 4), b.Y(13)]);
      const used = Math.max(2, Math.ceil(n / 2));
      const slots: { x: number; y: number }[] = [];
      pods.forEach((p, i) => {
        if (i >= used) {
          b.plantAt(p.x + 2, p.y + 1, "tree");
          return;
        }
        for (let x = p.x - 1; x <= p.x + 6; x++) b.place("partition-h", x, p.y);
        for (const x of [p.x - 1, p.x + 6]) b.place("partition-v", x, p.y + 1).place("partition-v", x, p.y + 2);
        slots.push({ x: p.x, y: p.y + 2 }, { x: p.x + 3, y: p.y + 2 });
        b.place("bin", p.x + 5, p.y + 2);
      });
      b.desks(slots.slice(0, Math.max(2, n)));
      b.add("water-cooler", 21, 2, { interact: "water-cooler" });

      /* Meeting room */
      b.add("tv", 36, 1, { w: 2 }).add("meeting-table", 35, 6, { interact: "meeting" });
      for (const x of [35, 36, 37, 38]) b.add("chair", x, 4);
      b.add("chair", 34, 6).add("chair", 39, 6);
      b.plant(31, 2);
      b.plant(42, 2);
      if (theme.stringLights) b.add("string-lights", 32, 1, { w: 2 });

      /* Copy & coffee */
      b.add("copier", 40, 14, { interact: "copier" }).add("bin", 42, 14);
      b.add("counter", 33, 19).add("sink", 34, 19).add("coffee-machine", 35, 19, { interact: "coffee" }).add("counter", 36, 19);
      b.add("fridge", 38, 19, { interact: "fridge" }).add("water-cooler", 39, 19, { interact: "water-cooler" });
      b.add("round-table", 33, 24).add("round-table", 38, 24);
      for (const x of [32, 35, 37, 40]) b.add("stool", x, 24);
      b.add("tree", 42, 29, { interact: "plant" });
      b.plant(31, 29, "tree");
      b.plant(42, 19);

      /* Entrance */
      b.add("mat", 21, MAP_H - 2, { w: 2 }).add("chair", 21, 21).add("reception", 20, 22, { interact: "workspace" });
      b.add("tree", 18, 29, { interact: "plant" }).add("tree", 25, 29, { interact: "plant" });
      b.add("armchair", 16, 26, { interact: "sofa" }).add("armchair", 16, 28, { interact: "sofa" });
      b.plant(28, 18);
      for (const x of b.bandX(1, 4, 1)) b.plantAt(x, b.Y(18), "tree");

      /* Break room */
      b.add("rug", 2, 27, { w: 8, h: 5 });
      b.add("sofa", 3, 24, { interact: "sofa" }).add("sofa", 5, 24, { interact: "sofa" }).add("coffee-table", 4, 26);
      b.add("armchair", 2, 26, { interact: "sofa" }).add("armchair", 7, 26, { interact: "sofa" });
      b.add("record-player", 9, 19, { interact: "record-player" }).add("bookshelf", 1, 19, { interact: "bookshelf" });
      b.add("clock", 3, 18).add("notice-board", 8, 18, { w: 2, interact: "notice-board" });
      if (theme.cat) b.add("cat", 8, 28, { interact: "cat" });
      b.add("tree", 12, 19, { interact: "plant" });
      b.plant(1, 29);
      b.plant(12, 29);

      return { spawn: { tx: 21.5, ty: MAP_H - 3 } };
    }),
  },
};
