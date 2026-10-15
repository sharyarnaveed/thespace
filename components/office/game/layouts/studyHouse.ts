import { deskCount, grid, type Builder } from "../builder";
import { stretchedPlans, type LayoutDef } from "./index";

/**
 * A homey shared house for study groups: a library, a study hall of desks, a
 * group room with a whiteboard, a common room by the fire and a kitchen.
 *
 *  ┌───────┬──────────────┬──────┐
 *  │Library door Study hall│Group │
 *  ├─door──┘              ├──────┤
 *  │ Common room  entry   door Kit.│
 *  └─────────────[ ]──────┴──────┘
 */
export const studyHouse: LayoutDef = {
  id: "study-house",
  base: "wood",
  plans: stretchedPlans({ x: 12, y: 5 }, (b: Builder, config) => {
    const { theme } = b;
    b.windows = [10, 14, 17, 22];
    b.wall(8, 2, 1, 7).open(8, 6, 1, 2).wall(0, 9, 9, 2).open(5, 9, 2, 2); // library
    b.wall(16, 2, 1, 6).open(16, 2, 1, 2).wall(16, 6, 8, 2); // group room
    b.wall(16, 8, 1, 7).open(16, 11, 1, 2); // kitchen
    b.room("Library", 1, 2, 7, 7, "carpet")
      .room("Group room", 17, 2, 6, 4, "carpet")
      .room("Kitchen", 17, 8, 6, 7, "kitchen")
      .room("Study hall", 9, 2, 7, 9)
      .room("Common room", 1, 11, 8, 4)
      .room("Entrance", 9, 11, 7, 4);

    /* Library */
    b.add("bookshelf", 1, 2, { interact: "bookshelf" }).add("bookshelf", 3, 2, { interact: "bookshelf" }).add("bookshelf", 5, 2, { interact: "bookshelf" });
    b.add("bookshelf", 2, 4, { interact: "bookshelf" }).add("bookshelf", 4, 4, { interact: "bookshelf" });
    b.add("armchair", 1, 8, { interact: "sofa" }).add("lamp", 7, 5);
    if (theme.rugs) b.add("rug", 2, 8, { w: 3, h: 2 });
    b.plant(7, 8);

    /* Study hall */
    const cols = [9, ...b.bandX(1, 3, 2), b.X(13)];
    b.desks(grid(cols, [4, ...b.bandY(2, 4, 2), b.Y(8)]).slice(0, deskCount(config)));
    b.add("clock", 12, 1);
    b.art(9, 1);
    b.plant(15, 2);
    if (theme.stringLights) b.add("string-lights", 14, 1, { w: 2 });

    /* Group room */
    b.add("whiteboard", 19, 1, { w: 2 }).add("meeting-table", 18, 4, { interact: "meeting" });
    for (const x of [18, 19, 20, 21]) b.add("chair", x, 2);

    /* Kitchen */
    b.add("counter", 17, 8).add("sink", 18, 8).add("coffee-machine", 19, 8, { interact: "coffee" }).add("counter", 20, 8);
    b.add("fridge", 21, 8, { interact: "fridge" });
    b.add("round-table", 19, 12).add("stool", 18, 12).add("stool", 21, 12);
    b.plant(22, 14);

    /* Common room */
    b.add("fireplace", 1, 11, { interact: "fireplace" });
    if (theme.rugs) b.add("rug", 3, 14, { w: 5, h: 3 });
    b.add("coffee-table", 4, 12).add("sofa", 4, 14, { interact: "sofa" }).add("armchair", 7, 13, { interact: "sofa" });
    if (theme.bookshelves) b.add("beanbag", 1, 14, { interact: "sofa" });
    b.add("record-player", 7, 11, { interact: "record-player" });
    if (theme.cat) b.add("cat", 3, 13, { interact: "cat" });

    /* Entrance */
    b.add("mat", 11, 14, { w: 2 });
    if (theme.communal) {
      b.add("long-table", 12, 12);
      for (let i = 0; i < 4; i++) b.add("stool", 12 + i, 11);
    }
    b.plant(9, 14);
    b.plant(15, 14);
    for (const x of b.bandX(1, 4, 1)) b.plantAt(x, b.Y(14));

    return { spawn: { tx: 11.5, ty: 13 } };
  }),
};
