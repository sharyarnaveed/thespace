import { deskCount, grid, type Builder } from "../builder";
import { stretchedPlans, type LayoutDef } from "./index";

/**
 * A home for personal workspaces: bedroom, home office and kitchen up top, a
 * living room with a fireplace and a reading nook below. Bigger teams stretch
 * the home office (and the rooms beside it).
 *
 *  ┌───────┬─────────────┬──────┐
 *  │Bedroom│ Home office │Kitch.│
 *  ├─door──┘             └─door─┤
 *  │ Living room  entry  nook   │
 *  └────────────[ ]─────────────┘
 */
export const home: LayoutDef = {
  id: "home",
  base: "wood",
  plans: stretchedPlans({ x: 14, y: 6 }, (b: Builder, config) => {
    const { theme } = b;
    b.windows = [2, 4, 12, 16];
    b.wall(8, 2, 1, 7).wall(0, 7, 9, 2).open(5, 7, 2, 2); // bedroom
    b.wall(18, 2, 1, 7).wall(18, 7, 6, 2).open(20, 7, 2, 2); // kitchen
    b.room("Bedroom", 1, 2, 7, 5, "carpet")
      .room("Kitchen", 19, 2, 4, 5, "kitchen")
      .room("Home office", 9, 2, 9, 7)
      .room("Living room", 1, 9, 10, 6)
      .room("Entry", 11, 9, 4, 6)
      .room("Reading nook", 15, 9, 8, 6);

    /* Bedroom */
    b.add("bed", 2, 4, { interact: "bed" }).add("lamp", 4, 3);
    b.add("bookshelf", 5, 2, { interact: "bookshelf" });
    if (theme.rugs) b.add("rug", 1, 6, { w: 4, h: 2 });
    b.plant(7, 2);
    b.plant(7, 6);

    /* Home office */
    const cols = [10, 13, ...b.bandX(1, 3, 2), b.X(15)];
    b.desks(grid(cols, [4, ...b.bandY(2, 4, 2), b.Y(7)]).slice(0, deskCount(config)));
    b.art(10, 1);
    b.add("clock", 14, 1);
    b.plant(9, 2);
    b.plant(17, 2);
    if (theme.stringLights) b.add("string-lights", 12, 1, { w: 2 });

    /* Kitchen */
    b.add("counter", 19, 2).add("sink", 20, 2).add("coffee-machine", 21, 2, { interact: "coffee" }).add("fridge", 22, 2, { interact: "fridge" });
    b.add("round-table", 20, 5).add("stool", 19, 5).add("stool", 22, 5);

    /* Living room */
    b.add("fireplace", 2, 9, { interact: "fireplace" });
    if (theme.rugs) b.add("rug", 2, 14, { w: 6, h: 3 });
    b.add("coffee-table", 3, 12).add("sofa", 3, 14, { interact: "sofa" });
    b.add("armchair", 1, 12, { interact: "sofa" }).add("armchair", 6, 12, { interact: "sofa" });
    b.add("record-player", 8, 10, { interact: "record-player" });
    if (theme.cat) b.add("cat", 5, 13, { interact: "cat" });
    if (theme.communal) b.add("long-table", 6, 14).add("stool", 6, 13).add("stool", 9, 13);
    b.plant(1, 9);
    b.plant(10, 14);

    /* Entry */
    b.add("mat", 11, 14, { w: 2 }).add("notice-board", 18, 8, { w: 2, interact: "notice-board" });
    b.plant(14, 14);

    /* Reading nook */
    if (theme.bookshelves) b.add("bookshelf", 16, 10, { interact: "bookshelf" }).add("beanbag", 17, 13, { interact: "sofa" });
    b.add("armchair", 20, 12, { interact: "sofa" }).add("lamp", 22, 11);
    if (theme.art) b.art(22, 8);
    b.plant(22, 14);
    b.plant(15, 14);
    for (const x of b.bandX(1, 4, 1)) b.plantAt(x, b.Y(14));

    return { spawn: { tx: 11.5, ty: 13 } };
  }),
};
