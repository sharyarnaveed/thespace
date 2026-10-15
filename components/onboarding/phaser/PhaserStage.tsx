"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { SCRIPTS, type ScriptId } from "./scripts";
import { svgToCanvas } from "./textures";

/**
 * Upgrades a static pixel scene (`children`, rendered on the server) into a
 * small Phaser game that plays one of the cutscenes in `./scripts`.
 *
 * - Phaser is loaded lazily, client-only.
 * - The static scene stays as the accessible image and the fallback (no JS,
 *   WebGL failure, or reduced motion — in which case Phaser never loads).
 * - The game loop sleeps while the stage is scrolled out of view.
 */
export function PhaserStage({ script, w, h, children }: { script: ScriptId; w: number; h: number; children: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const mount = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = host.current;
    const target = mount.current;
    if (!el || !target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let game: import("phaser").Game | undefined;
    let io: IntersectionObserver | undefined;

    (async () => {
      const svg = el.querySelector<SVGSVGElement>(".scene > svg");
      if (!svg) return;
      const [{ default: Phaser }, backdrop] = await Promise.all([import("phaser"), svgToCanvas(svg, w, h)]);
      if (cancelled) return;

      class Stage extends Phaser.Scene {
        create() {
          this.textures.addCanvas("backdrop", backdrop);
          this.add.image(0, 0, "backdrop").setOrigin(0);
          SCRIPTS[script](this);
          setReady(true);
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: target,
        width: w,
        height: h,
        pixelArt: true,
        backgroundColor: "#f5f1e8",
        banner: false,
        audio: { noAudio: true },
        input: { keyboard: false, mouse: false, touch: false, gamepad: false },
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
        scene: Stage,
      });

      io = new IntersectionObserver(([entry]) => {
        if (!game) return;
        if (entry.isIntersecting) game.loop.wake();
        else game.loop.sleep();
      });
      io.observe(el);
    })().catch(() => {
      // Phaser or WebGL unavailable: the static scene simply stays.
    });

    return () => {
      cancelled = true;
      io?.disconnect();
      game?.destroy(true);
      setReady(false);
    };
  }, [script, w, h]);

  return (
    <div ref={host} className={`relative ${ready ? "phaser-ready" : ""}`}>
      {children}
      <div
        ref={mount}
        aria-hidden
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 [&_canvas]:block ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
