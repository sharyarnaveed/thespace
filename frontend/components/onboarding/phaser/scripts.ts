import type * as PhaserNS from "phaser";
import { PROP_PALETTE, speechHeart } from "@/components/pixel/props";
import { BASE, CAST, characterPalette, idleFrames, plantFrames, typingFrames, walkWithMugFrames, waterFrames, waveFrames } from "@/components/pixel/sprites";
import { addPixelSprite, erase } from "./textures";

type Scene = PhaserNS.Scene;
type Sprite = PhaserNS.GameObjects.Sprite;

/**
 * Little looping "cutscenes" for the path-choice cards. Coordinates are scene
 * pixels (120×72), sprites use a top-left origin like the SVG fallback.
 *
 * Sprite frame offsets worth knowing: walk frames are padded 1px on the left
 * (body at x+1, or x+3 when flipped), idle frames are not, watering frames
 * share the walk padding.
 */

const MUG = ["kkkk..", "kmmkk.", "knnk.k", "kmmkk.", "kkkk.."];

/** Promise helpers driven by the scene clock, so they pause with the game loop. */
function director(scene: Scene) {
  let alive = true;
  scene.events.once("destroy", () => (alive = false));
  scene.events.once("shutdown", () => (alive = false));
  // A dead scene never resolves, which simply halts the script.
  const wait = (ms: number) => new Promise<void>((r) => scene.time.delayedCall(ms, () => alive && r()));
  const tween = (config: PhaserNS.Types.Tweens.TweenBuilderConfig) =>
    new Promise<void>((r) => scene.tweens.add({ ...config, onComplete: () => alive && r() }));
  return { wait, tween, alive: () => alive };
}

function pose(s: Sprite, key: string, x: number, flip: boolean) {
  s.setTexture(key, 0).setFlipX(flip).setX(x);
  if (s.scene.anims.exists(key)) s.play(key);
}

/** Heart speech bubble that floats up above (x, y) and fades. */
async function heart(scene: Scene, d: ReturnType<typeof director>, x: number, y: number, hold = 1400) {
  const b = scene.add.image(x, y + 2, "heart").setOrigin(0).setAlpha(0).setDepth(10);
  await d.tween({ targets: b, alpha: 1, y, duration: 260, ease: "Quad.Out" });
  await d.wait(hold);
  await d.tween({ targets: b, alpha: 0, y: y - 2, duration: 300 });
  b.destroy();
}

/* ------------------------------------------------------------------ */
/* Create: carry a mug to the desk, then water the plant              */
/* ------------------------------------------------------------------ */

export function playCreate(scene: Scene) {
  const juno = characterPalette(CAST.juno);
  addPixelSprite(scene, "desk", typingFrames(null).map((f) => erase(f, 34, 14, 39, 18)), BASE, 3);
  addPixelSprite(scene, "mug", [MUG], BASE);
  addPixelSprite(scene, "plant", plantFrames(), BASE, 2);
  addPixelSprite(scene, "heart", [speechHeart()], PROP_PALETTE);
  addPixelSprite(scene, "juno-carry", walkWithMugFrames("beanie"), juno, 6);
  addPixelSprite(scene, "juno-walk", walkWithMugFrames("beanie").map((f) => erase(f, 15, 13, 19, 19)), juno, 6);
  addPixelSprite(scene, "juno-idle", idleFrames("beanie"), juno, 2);
  addPixelSprite(scene, "juno-water", waterFrames("beanie"), juno, 3);

  scene.add.sprite(6, 27, "desk").setOrigin(0).play("desk");
  const mug = scene.add.image(40, 41, "mug").setOrigin(0).setAlpha(0);
  // bottom-centre origin so the plant can bounce from its pot
  const plant = scene.add.sprite(84 + 9, 36 + 19, "plant").setOrigin(0.5, 1).play("plant");
  const juno$ = scene.add.sprite(124, 31, "juno-carry").setOrigin(0).setDepth(5);

  const d = director(scene);
  const drip = () => {
    const drop = scene.add.rectangle(81 + Math.round(Math.random() * 2), 47, 1, 2, 0xa8cfd0).setOrigin(0).setDepth(6);
    scene.tweens.add({ targets: drop, y: 53, alpha: 0, duration: 520, ease: "Quad.In", onComplete: () => drop.destroy() });
  };

  (async () => {
    while (d.alive()) {
      // walk in from the right with a fresh coffee
      juno$.setAlpha(1).setY(31);
      pose(juno$, "juno-carry", 124, true);
      await d.tween({ targets: juno$, x: 42, duration: 3600 });

      // set it down on the desk
      pose(juno$, "juno-idle", 45, true);
      mug.setY(39).setAlpha(1);
      await d.tween({ targets: mug, y: 41, duration: 180, ease: "Bounce.Out" });
      void heart(scene, d, 44, 16, 900);
      await d.wait(1100);

      // over to the plant
      pose(juno$, "juno-walk", 44, false);
      await d.tween({ targets: juno$, x: 56, duration: 700 });
      pose(juno$, "juno-water", 56, false);
      const rain = scene.time.addEvent({ delay: 170, loop: true, callback: drip });
      await d.wait(2400);
      rain.remove();
      pose(juno$, "juno-idle", 57, false);
      await d.tween({ targets: plant, scaleY: 1.08, scaleX: 0.96, duration: 160, yoyo: true, repeat: 1, ease: "Sine.InOut" });
      await d.wait(900);

      // wander off, coffee stays behind for a bit
      pose(juno$, "juno-walk", 56, false);
      await d.tween({ targets: juno$, x: 124, duration: 3000 });
      await d.wait(600);
      await d.tween({ targets: mug, alpha: 0, duration: 500 });
      await d.wait(500);
    }
  })();
}

/* ------------------------------------------------------------------ */
/* Join: step through the door, get waved at                          */
/* ------------------------------------------------------------------ */

export function playJoin(scene: Scene) {
  const theo = characterPalette(CAST.theo);
  const sam = characterPalette(CAST.sam);
  addPixelSprite(scene, "heart", [speechHeart()], PROP_PALETTE);
  addPixelSprite(scene, "theo-walk", walkWithMugFrames("short"), theo, 6);
  addPixelSprite(scene, "theo-idle", idleFrames("short"), theo, 2);
  addPixelSprite(scene, "sam-idle", idleFrames("bun"), sam, 2);
  addPixelSprite(scene, "sam-wave", waveFrames("bun"), sam, 5);
  addPixelSprite(scene, "maya-idle", idleFrames("long"), characterPalette(CAST.maya), 2);

  const sam$ = scene.add.sprite(81, 30, "sam-idle").setOrigin(0).setFlipX(true).play("sam-idle");
  scene.add.sprite(98, 30, "maya-idle").setOrigin(0).play({ key: "maya-idle", startFrame: 3 });
  const theo$ = scene.add.sprite(13, 30, "theo-walk").setOrigin(0).setDepth(5);

  const d = director(scene);
  (async () => {
    while (d.alive()) {
      // appear in the doorway and head over
      pose(theo$, "theo-walk", 13, false);
      theo$.setAlpha(0);
      void d.tween({ targets: theo$, alpha: 1, duration: 450 });
      await d.tween({ targets: theo$, x: 52, duration: 2700 });
      pose(theo$, "theo-idle", 53, false);

      // a wave and a little heart from the team
      await d.wait(250);
      pose(sam$, "sam-wave", 78, true);
      await heart(scene, d, 80, 16, 1700);
      pose(sam$, "sam-idle", 81, true);
      await d.wait(1200);

      await d.tween({ targets: theo$, alpha: 0, duration: 500 });
      await d.wait(700);
    }
  })();
}

export const SCRIPTS = { create: playCreate, join: playJoin };
export type ScriptId = keyof typeof SCRIPTS;
