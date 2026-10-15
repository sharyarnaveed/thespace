import { deskCount, grid, type Builder } from "../builder";
import { stretchedPlans, type LayoutDef } from "./index";

/**
 * A relaxed place to explore: a café and a book-swap corner on the left, a
 * grassy garden with desks and picnic tables, and a little greenhouse.
 *
 *  ┌──────┬─────────────────────┐
 *  │ Café door  Garden  trees  │
 *  ├─door─┤  desks   picnic    │
 *  │ Book │          ├─greenh.─┤
 *  │ swap │          door      │
 *  └──────────[ ]──────────────┘
 */
export const gardenCafe: LayoutDef = {
  id: "garden-cafe",
  base: "wood",
  plans: stretchedPlans({ x: 14, y: 6 }, (b: Builder, config) => {
    const { theme } = b;
    b.windows = [2, 6, 12, 17, 21];
    b.wall(9, 2, 1, 7).open(9, 4, 1, 2).wall(0, 7, 10, 2).open(4, 7, 2, 2); // café
    b.wall(17, 9, 7, 2).wall(17, 9, 1, 6).open(17, 12, 1, 2); // greenhouse
    b.room("Café", 1, 2, 8, 5, "tiles")
      .room("Book swap", 1, 9, 8, 6)
      .room("Greenhouse", 18, 11, 5, 4, "tiles")
      .room("Garden", 10, 2, 13, 13, "grass");

    /* Café */
    b.add("counter", 1, 2).add("coffee-machine", 2, 2, { interact: "coffee" }).add("sink", 3, 2).add("counter", 4, 2);
    b.add("fridge", 5, 2, { interact: "fridge" });
    b.add("round-table", 2, 5).add("stool", 1, 5).add("stool", 4, 5);
    b.add("round-table", 6, 5).add("stool", 8, 5);
    b.art(8, 1);
    if (theme.stringLights) b.add("string-lights", 6, 1, { w: 2 });

    /* Book swap */
    b.add("bookshelf", 1, 9, { interact: "bookshelf" }).add("bookshelf", 6, 9, { interact: "bookshelf" });
    if (theme.rugs) b.add("rug", 2, 14, { w: 5, h: 3 });
    b.add("beanbag", 2, 12, { interact: "sofa" }).add("beanbag", 5, 13, { interact: "sofa" });
    b.add("record-player", 7, 13, { interact: "record-player" });
    if (theme.bookshelves) b.add("armchair", 1, 14, { interact: "sofa" });

    /* Garden */
    const cols = [11, ...b.bandX(1, 3, 2), b.X(15)];
    b.desks(grid(cols, [5, ...b.bandY(2, 4, 2), b.Y(9)]).slice(0, deskCount(config)));
    b.add("tree", 10, 2, { interact: "plant" }).add("tree", 22, 2, { interact: "plant" }).add("tree", 22, 7, { interact: "plant" });
    b.add("round-table", 19, 5).add("stool", 18, 5).add("stool", 21, 5);
    if (theme.communal) {
      b.add("long-table", 17, 8);
      for (let i = 0; i < 4; i++) b.add("stool", 17 + i, 7);
    }
    if (theme.stringLights) b.add("string-lights", 16, 1, { w: 2 });
    b.add("lamp", 10, 13).add("mat", 11, 14, { w: 2 });
    if (theme.cat) b.add("cat", 14, 13, { interact: "cat" });
    b.plant(14, 2);
    b.plant(16, 14);
    for (const x of b.bandX(1, 4, 1)) b.plantAt(x, b.Y(2), "tree");

    /* Greenhouse */
    for (const [x, y] of [[18, 11], [20, 11], [22, 11], [18, 14], [22, 14]]) b.add("plant", x, y, { interact: "plant" });
    b.add("small-plant", 20, 14).add("small-plant", 19, 11);

    return { spawn: { tx: 11.5, ty: 13 } };
  }),
};
