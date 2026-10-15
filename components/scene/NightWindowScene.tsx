import type { CSSProperties } from "react";
import { Px } from "@/components/pixel/PixelArt";
import { BASE, CAST, catFrames, characterPalette, hero, makeSprite, plantFrames, waveFrames } from "@/components/pixel/sprites";
import { C, R, Scene, SceneSprite, StringLights } from "./kit";

const W = 160;
const H = 128;

/** The office seen from outside at dusk: one warm window, still glowing. */
export function NightWindowScene() {
  const typist = hero.typist();
  const waver = makeSprite(waveFrames("bun"), characterPalette(CAST.sam), 5);
  const cat = makeSprite(catFrames(), BASE, 2);
  const stars = [
    [8, 6],
    [26, 14],
    [44, 4],
    [70, 10],
    [96, 5],
    [118, 13],
    [140, 7],
    [152, 18],
    [14, 24],
  ];
  const bricks = [];
  for (let y = 30, row = 0; y < H; y += 6, row++) {
    for (let x = row % 2 ? -8 : 0; x < W; x += 16) bricks.push(<R key={`${x}-${y}`} x={x} y={y} w={15} h={5} c={row % 3 ? "#244232" : "#22402f"} />);
  }
  return (
    <Scene
      w={W}
      h={H}
      label="The office at dusk from outside: a warm window glows, Maya still typing and Sam waving goodnight, the cat asleep on the sill."
      overlay={
        <>
          <SceneSprite sprite={typist} sw={W} sh={H} x={44} y={62} />
          <SceneSprite sprite={waver} sw={W} sh={H} x={98} y={63} flip delay={0.4} />
          <SceneSprite sprite={cat} sw={W} sh={H} x={114} y={95} />
        </>
      }
    >
      {/* sky */}
      <R x={0} y={0} w={W} h={30} c="#1b2b33" />
      <R x={0} y={18} w={W} h={12} c="#22343a" />
      <Moon x={124} y={4} />
      {stars.map(([x, y], i) => (
        <R key={i} x={x} y={y} w={1} h={1} c="#fff6d8" className="twinkle" style={{ "--d": `${i * 0.45}s` } as CSSProperties} />
      ))}
      {/* building */}
      <R x={0} y={28} w={W} h={H - 28} c="#1f3a2b" />
      {bricks}
      <R x={0} y={28} w={W} h={3} c={C.ink} />
      {/* window glow on the wall */}
      <g opacity={0.14}>
        <R x={18} y={38} w={124} h={74} c={C.sun} className="lamp-glow" />
      </g>
      {/* window */}
      <R x={24} y={44} w={112} h={62} c={C.ink} />
      <R x={26} y={46} w={108} h={58} c="#f3dca0" />
      <R x={26} y={46} w={108} h={20} c="#f6e4b4" />
      <R x={26} y={84} w={108} h={20} c="#efd394" />
      <StringLightsIn />
      {/* sill */}
      <R x={20} y={104} w={120} h={4} c={C.woodLight} />
      <R x={20} y={108} w={120} h={2} c={C.woodDark} />
      <Px frame={plantFrames()[0]} palette={BASE} x={25} y={86} />
      {/* light spilling down */}
      <g opacity={0.3}>
        <polygon points="26,110 134,110 150,128 10,128" fill={C.sun} className="lamp-glow" />
      </g>
    </Scene>
  );
}

/** Pixel crescent: a 10px disc with an offset disc of sky cut out of it. */
function Moon({ x, y }: { x: number; y: number }) {
  const rows = [4, 8, 10, 10, 10, 10, 10, 10, 8, 4];
  return (
    <g>
      {rows.map((w, i) => (
        <R key={`m${i}`} x={x + (10 - w) / 2} y={y + i} w={w} h={1} c="#f3e6c0" />
      ))}
      {rows.map((w, i) => (
        <R key={`c${i}`} x={x + 4 + (10 - w) / 2} y={y - 2 + i} w={w} h={1} c="#1b2b33" />
      ))}
    </g>
  );
}

function StringLightsIn() {
  return (
    <g transform="translate(26 44)">
      <StringLights w={108} y={4} step={18} />
    </g>
  );
}
