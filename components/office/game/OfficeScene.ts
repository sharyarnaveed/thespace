import type * as P from "phaser";
import type { PreparedOffice } from "../prepare";
import { plateKey, rugKey, type Sheet } from "./assets";
import { onResize, setupCamera, setupMinimap } from "./camera";
import type { GameBus } from "./events";
import { INTERACTIONS, type Interaction, type InteractionId } from "./interactions";
import type { PlacedObject } from "./map";
import { PlayerController, createAvatarAnims } from "./player";
import { seatFor, seatInteraction } from "./seating";
import { T, TILE } from "./tiles";

export interface OfficeSceneData {
  prepared: PreparedOffice;
  bus: GameBus;
  reducedMotion: boolean;
}

interface Target {
  id: InteractionId;
  interaction: Interaction;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** How close (px) the player's feet must be to an object's footprint to interact. */
const REACH = 12;

/** The Phaser scene class is built at runtime because Phaser is loaded lazily. */
export function createOfficeScene(Phaser: PreparedOffice["Phaser"]) {
  return class OfficeScene extends Phaser.Scene {
    private data_!: OfficeSceneData;
    private player!: PlayerController;
    private targets: Target[] = [];
    private current: Target | null = null;
    private myDesk: { x: number; y: number } | null = null;
    /** Where the player sits at their own desk, and where to stand when arriving from afar. */
    private myChair: { x: number; y: number; depth: number; front: { x: number; y: number } } | null = null;
    private room = "";
    private paused = false;
    private puffs: P.GameObjects.Image[] = [];
    private coffeeAt = { x: 0, y: 0 };
    private cleanup: (() => void)[] = [];

    constructor() {
      super("office");
    }

    init(data: OfficeSceneData) {
      this.data_ = data;
    }

    create() {
      const { prepared, bus, reducedMotion } = this.data_;
      const { map, art } = prepared;
      const worldW = map.width * TILE;
      const worldH = map.height * TILE;

      this.registerTextures(art.tiles, art.sheets, art.avatar);

      // Floor and walls in one tile layer; collisions on an invisible second layer.
      const tilemap = this.make.tilemap({ data: map.tiles, tileWidth: TILE, tileHeight: TILE });
      const tileset = tilemap.addTilesetImage("tiles", "tiles", TILE, TILE)!;
      tilemap.createLayer(0, tileset, 0, 0)!.setDepth(0);
      const blocked = tilemap.createBlankLayer("collision", tileset)!.setVisible(false);
      map.walls.forEach((row, y) => row.forEach((w, x) => w && blocked.putTileAt(T.BLOCK, x, y)));

      for (const o of map.objects) this.placeObject(o, blocked, reducedMotion);
      blocked.setCollision(T.BLOCK);

      // Player
      createAvatarAnims(this);
      this.player = new PlayerController(this, map.spawn.tx * TILE, map.spawn.ty * TILE + TILE / 2);
      this.physics.world.setBounds(0, 0, worldW, worldH);
      this.physics.add.collider(this.player.sprite, blocked);

      // Cameras
      const cam = setupCamera(this, this.player.sprite, worldW, worldH);
      const { mini, place } = setupMinimap(this, worldW, worldH);
      const marker = this.add.image(0, 0, "marker").setScale(4).setDepth(1e6);
      cam.ignore(marker);
      // Your desk: a bobbing arrow in the world and a marker on the minimap.
      if (this.myDesk && this.textures.exists("desk-marker") && this.textures.exists("desk-arrow")) {
        const { x: dx, y: dy } = this.myDesk;
        const deskMarker = this.add.image(dx, dy, "desk-marker").setScale(3).setDepth(1e6 - 1);
        const arrow = this.add.image(dx, dy - 30, "desk-arrow").setDepth(1e5);
        if (!reducedMotion) this.tweens.add({ targets: arrow, y: arrow.y - 3, duration: 600, yoyo: true, repeat: -1, ease: "Sine.inOut" });
        cam.ignore(deskMarker);
        mini.ignore(arrow);
      }
      this.events.on("postupdate", () => marker.setPosition(this.player.sprite.x, this.player.sprite.y - 8));
      this.events.on("render", () => this.emitAnchor());
      this.cleanup.push(onResize(this, place));

      // Coffee steam, created once and reused.
      this.puffs = Array.from({ length: 6 }, () => this.add.image(0, 0, "puff").setVisible(false).setDepth(1e5));

      // Keyboard interaction and the UI bridge.
      this.input.keyboard!.on("keydown-E", () => this.interact());
      this.cleanup.push(
        bus.on("request-interact", () => this.interact()),
        bus.on("set-paused", (p) => this.setPaused(p)),
        bus.on("set-minimap", (on) => mini.setVisible(on)),
        bus.on("set-status", (status) => {
          if (status === "focusing") this.goToDesk();
          else if (status === "available") this.player.standUp();
          else if (this.atDesk()) this.player.standUp();
        }),
      );
      // Destroying the game fires "destroy" (not "shutdown"), so unsubscribe on both.
      const teardown = () => {
        this.cleanup.forEach((fn) => fn());
        this.cleanup = [];
      };
      this.events.once("shutdown", teardown);
      this.events.once("destroy", teardown);

      bus.emit("ready");
    }

    private registerTextures(tiles: Sheet, sheets: Record<string, Sheet>, avatar: Sheet) {
      const add = (key: string, s: Sheet) => {
        const tex = this.textures.addCanvas(key, s.canvas)!;
        for (let i = 0; i < s.count; i++) tex.add(i, 0, i * s.frameW, 0, s.frameW, s.frameH);
        if (s.count > 1 && s.fps) {
          this.anims.create({ key, frames: this.anims.generateFrameNumbers(key, { start: 0, end: s.count - 1 }), frameRate: s.fps, repeat: -1 });
        }
      };
      this.textures.addCanvas("tiles", tiles.canvas);
      for (const [key, s] of Object.entries(sheets)) add(key, s);
      add("avatar", avatar);
    }

    private placeObject(o: PlacedObject, blocked: P.Tilemaps.TilemapLayer, reducedMotion: boolean) {
      const { art } = this.data_.prepared;
      const meta = art.meta[o.kind];
      const key = o.kind === "rug" ? rugKey(o.w!, o.h!) : o.kind;
      const sheet = art.sheets[key];
      const fw = meta.footprint?.w ?? o.w ?? 1;
      const fh = meta.footprint?.h ?? 1;
      const x = o.tx * TILE + Math.round((fw * TILE - sheet.frameW) / 2);
      const bottom = (o.ty + 1) * TILE;

      let img: P.GameObjects.Sprite;
      if (meta.layer === "floor") {
        const top = o.kind === "rug" ? (o.ty - o.h! + 1) * TILE : bottom - sheet.frameH;
        img = this.add.sprite(o.kind === "rug" ? o.tx * TILE : x, top, key, o.frame ?? 0).setOrigin(0).setDepth(1);
      } else if (meta.layer === "wall") {
        const top = o.ty * TILE + Math.max(-4, Math.round((13 - sheet.frameH) / 2));
        img = this.add.sprite(x, top, key, o.frame ?? 0).setOrigin(0).setDepth(2);
      } else {
        img = this.add.sprite(x, bottom, key, o.frame ?? 0).setOrigin(0, 1).setDepth(bottom);
      }
      if (this.anims.exists(key) && !reducedMotion) {
        img.play({ key, startFrame: (o.tx + o.ty) % sheet.count });
      }

      if (meta.footprint) {
        for (let j = 0; j < fh; j++) for (let i = 0; i < fw; i++) blocked.putTileAt(T.BLOCK, o.tx + i, o.ty - j);
      }
      // Team desks get a nameplate on their front and say whose desk they are.
      let interaction: Interaction | undefined = o.interact && INTERACTIONS[o.interact];
      if (o.desk !== undefined && this.textures.exists(plateKey(o.desk))) {
        const cx = o.tx * TILE + TILE;
        this.add.image(cx, bottom - 1, plateKey(o.desk)).setOrigin(0.5, 1).setDepth(bottom + 0.5);
        interaction = seatInteraction(seatFor(this.data_.prepared.config, o.desk));
        if (o.desk === 0) {
          this.myDesk = { x: cx, y: bottom - 8 };
          this.myChair = { x: cx, y: o.ty * TILE + 1, depth: bottom - 0.5, front: { x: cx, y: bottom + 12 } };
        }
      }
      if (o.interact && interaction) {
        this.targets.push({ id: o.interact, interaction, x0: o.tx * TILE, y0: (o.ty - fh + 1) * TILE, x1: (o.tx + fw) * TILE, y1: bottom });
      }
      if (o.interact === "coffee") this.coffeeAt = { x: x + 8, y: bottom - 22 };
    }

    private setPaused(p: boolean) {
      this.paused = p;
      const kb = this.input.keyboard;
      if (!kb?.manager) return; // game already torn down
      kb.resetKeys();
      // Let overlays use the keyboard normally while they are open.
      if (p) kb.disableGlobalCapture();
      else kb.enableGlobalCapture();
    }

    private interact() {
      if (this.paused || !this.current) return;
      const { id, interaction } = this.current;
      if (interaction.action === "coffee") this.brew();
      if (interaction.action === "break" && !this.player.seated) this.sitOn(this.current);
      this.data_.bus.emit("interact", { id, interaction });
    }

    /** Sit on a sofa, armchair or beanbag: the seat nearest the player. */
    private sitOn(t: Target) {
      const { x, y } = this.player.sprite;
      const seats = [];
      for (let sx = t.x0 + TILE / 2; sx < t.x1; sx += TILE) seats.push(sx);
      const seatX = seats.reduce((a, b) => (Math.abs(b - x) < Math.abs(a - x) ? b : a));
      this.player.sit(seatX, t.y1 - 1, t.y1 + 0.5, { x, y }, false);
    }

    private atDesk() {
      const s = this.player.sprite;
      return this.player.seated && !!this.myChair && s.x === this.myChair.x && s.y === this.myChair.y;
    }

    /** Sit at your own desk, fading over if you're elsewhere in the office. */
    private goToDesk() {
      const chair = this.myChair;
      if (!chair) return;
      const s = this.player.sprite;
      if (this.atDesk()) return;
      const near = !this.player.seated && Math.hypot(s.x - chair.front.x, s.y - chair.front.y) < 56;
      const sit = () => this.player.sit(chair.x, chair.y, chair.depth, near ? { x: s.x, y: s.y } : chair.front, true);
      const cam = this.cameras.main;
      if (near || this.data_.reducedMotion) return sit();
      cam.fadeOut(160, 43, 42, 34);
      cam.once("camerafadeoutcomplete", () => {
        sit();
        cam.fadeIn(200, 43, 42, 34);
      });
    }

    private brew() {
      if (this.data_.reducedMotion) return;
      this.puffs.forEach((p, i) => {
        this.tweens.killTweensOf(p);
        p.setPosition(this.coffeeAt.x + (i % 3) * 2 - 2, this.coffeeAt.y).setAlpha(0).setVisible(true);
        this.tweens.add({
          targets: p,
          y: this.coffeeAt.y - 14,
          alpha: { from: 0.9, to: 0 },
          delay: i * 180,
          duration: 1100,
          onComplete: () => p.setVisible(false),
        });
      });
    }

    /** Nearest interactive object within reach of the player's feet. */
    private nearest(px: number, py: number): Target | null {
      let best: Target | null = null;
      let bestD = REACH;
      for (const t of this.targets) {
        const dx = Math.max(t.x0 - px, 0, px - t.x1);
        const dy = Math.max(t.y0 - py, 0, py - t.y1);
        const d = Math.hypot(dx, dy);
        if (d < bestD) {
          bestD = d;
          best = t;
        }
      }
      return best;
    }

    update() {
      const { bus, prepared } = this.data_;
      if (this.player.update(!this.paused)) bus.emit("stood");
      const { x, y } = this.player.feet;

      const near = this.paused ? null : this.nearest(x, y);
      if (near !== this.current) {
        this.current = near;
        bus.emit("prompt", near ? { id: near.id, interaction: near.interaction } : null);
      }

      const tx = Math.floor(x / TILE);
      const ty = Math.floor(y / TILE);
      const room = prepared.map.rooms.find((r) => tx >= r.x && tx < r.x + r.w && ty >= r.y && ty < r.y + r.h);
      if (room && room.name !== this.room) {
        this.room = room.name;
        bus.emit("room", room.name);
      }
    }

    /** Head position in canvas pixels for the DOM name tag and prompt, after the camera has moved. */
    private emitAnchor() {
      const cam = this.cameras.main;
      const s = this.player.sprite;
      this.data_.bus.onAnchor?.((s.x - cam.worldView.x) * cam.zoom, (s.y - s.height - cam.worldView.y) * cam.zoom);
    }
  };
}
