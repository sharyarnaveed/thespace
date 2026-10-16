import type * as P from "phaser";
import type { PreparedOffice } from "../prepare";
import type { GameBus } from "./events";
import { createOfficeScene, type OfficeSceneData } from "./OfficeScene";

/** One Phaser game per mounted host element. The caller owns `destroy`. */
export function createGame(parent: HTMLElement, prepared: PreparedOffice, bus: GameBus): P.Game {
  const { Phaser } = prepared;
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    backgroundColor: "#2b2a22",
    banner: false,
    audio: { noAudio: true },
    physics: { default: "arcade", arcade: { debug: false } },
    scale: { mode: Phaser.Scale.RESIZE, width: parent.clientWidth, height: parent.clientHeight },
  });
  const data: OfficeSceneData = {
    prepared,
    bus,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  };
  game.scene.add("office", createOfficeScene(Phaser), true, data);
  return game;
}
