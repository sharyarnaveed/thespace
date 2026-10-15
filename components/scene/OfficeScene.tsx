import type { CSSProperties } from "react";
import { PixelSprite, Px } from "@/components/pixel/PixelArt";
import { BASE, hero, plantFrames, typingFrames } from "@/components/pixel/sprites";
import { recordPlayer } from "@/components/pixel/props";
import {
  Books,
  C,
  Clock,
  FloorLamp,
  Mug,
  R,
  Room,
  Rug,
  Scene,
  SceneSprite,
  Shelf,
  Sofa,
  StringLights,
  TrailingPlant,
  Window,
  at,
} from "./kit";

const W = 320;
const H = 160;
const FLOOR = 100;
const WALK = 100; // scene px the coffee runner travels

const pos = (x: number, y: number, w?: number) => at(W, H, x, y, w);

/** Little floating name tag, like the ones above avatars in the app. */
function Tag({
  x,
  y,
  name,
  status,
  dot = C.sage,
  className,
  style,
}: {
  x: number;
  y: number;
  name: string;
  status?: string;
  dot?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`pointer-events-none -translate-x-1/2 whitespace-nowrap border border-ink bg-paper-light px-[0.5cqw] py-[0.15cqw] font-pixel leading-none text-ink shadow-[0.25cqw_0.25cqw_0_0_var(--color-ink)] ${className ?? ""}`}
      style={{ ...pos(x, y), fontSize: "max(8px, 1.05cqw)", ...style }}
    >
      <span className="mr-[0.4cqw] inline-block size-[0.7cqw] min-h-1 min-w-1 align-middle" style={{ background: dot }} />
      {name}
      {status && <span className="text-muted"> · {status}</span>}
    </div>
  );
}

function Steam({ x, y, n = 3 }: { x: number; y: number; n?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          className="steam"
          style={{ ...pos(x + (i % 2), y), "--d": `${i * 0.8}s`, "--sx": `${i % 2 ? -0.4 : 0.5}cqw` } as CSSProperties}
        />
      ))}
    </>
  );
}

export function OfficeScene() {
  const typist = hero.typist();
  const walker = hero.walker();
  const waterer = hero.waterer();
  const waver = hero.waver();
  const cat = hero.cat();
  const plant = hero.plant();
  const record = recordPlayer();
  const emptyDesk = typingFrames(null)[0];
  const potted = plantFrames()[0];

  const overlay = (
    <>
      {/* ——— Workspace ——— */}
      <SceneSprite sprite={typist} sw={W} sh={H} x={10} y={83} label="Maya typing at her desk" />
      <Steam x={36.5} y={94} />
      <Tag x={36} y={71} name="maya" status="deep focus" dot={C.terracotta} />
      <Tag x={84} y={75} name="ines" status="back in 5" dot={C.sun} className="max-md:hidden" />

      {/* ——— Plant care ——— */}
      <SceneSprite sprite={plant} sw={W} sh={H} x={138} y={95} scale={1.15} label="A potted plant swaying" delay={0.4} />
      <SceneSprite sprite={waterer} sw={W} sh={H} x={110} y={90} label="Juno watering the plant" />
      {[0, 0.33, 0.66].map((d, i) => (
        <span key={i} className="drop" style={{ ...pos(138 + i, 104), "--d": `${d}s` } as CSSProperties} />
      ))}
      <Tag x={124} y={81} name="juno" status="plant duty" dot={C.forest} />

      {/* ——— Lounge ——— */}
      <SceneSprite sprite={record} sw={W} sh={H} x={198} y={72} label="A record player spinning" />
      {[0, 1.2, 2.4].map((d, i) => (
        <span
          key={i}
          className="float-up ambient-sm-off font-pixel text-forest"
          style={{ ...pos(206 + i * 4, 68), fontSize: "1.5cqw", "--d": `${d}s`, "--fx": `${i % 2 ? -1 : 1.4}cqw` } as CSSProperties}
          aria-hidden
        >
          {i % 2 ? "♫" : "♪"}
        </span>
      ))}
      <Steam x={247.5} y={114} n={2} />
      <SceneSprite sprite={cat} sw={W} sh={H} x={276} y={138} scale={1.1} label="Biscuit the office cat, asleep on the rug" />
      {[0, 1.3, 2.6].map((d, i) => (
        <span
          key={i}
          className="float-up font-pixel text-muted"
          style={{ ...pos(291, 134), fontSize: `${0.9 + i * 0.25}cqw`, "--d": `${d}s`, "--fx": "1.6cqw" } as CSSProperties}
          aria-hidden
        >
          z
        </span>
      ))}
      <Tag x={262} y={151} name="biscuit" status="napping" dot={C.terracottaLight} className="max-md:hidden" />

      {/* ——— Sam waves at Theo ——— */}
      <SceneSprite sprite={waver} sw={W} sh={H} x={176} y={112} flip label="Sam waving hello" delay={0.6} />
      <div className="bubble-pop" style={{ ...pos(152, 96) }}>
        <div
          className="relative border border-ink bg-paper-light px-[0.7cqw] py-[0.35cqw] font-pixel leading-none text-ink shadow-[0.25cqw_0.25cqw_0_0_var(--color-ink)]"
          style={{ fontSize: "max(8px, 1.15cqw)" }}
        >
          morning, theo!
          <span className="absolute -bottom-[0.9cqw] right-[1.6cqw] size-[0.9cqw] border-r border-b border-ink bg-paper-light [clip-path:polygon(100%_0,100%_100%,0_0)]" />
        </div>
      </div>
      <Tag x={186} y={138} name="sam" dot={C.sage} />

      {/* ——— Coffee run (walks left ↔ right) ——— */}
      <div className="walk-loop" style={{ ...pos(36, 133, 21), "--walk": `${(WALK / W) * 100}cqw` } as CSSProperties}>
        <PixelSprite sprite={walker} label="Theo walking with a coffee" className="w-full" />
      </div>
      <div className="walk-label" style={{ ...pos(46, 125), "--walk": `${(WALK / W) * 100}cqw` } as CSSProperties}>
        <Tag x={0} y={0} name="theo" status="coffee run" dot={C.terracotta} style={{ left: 0, top: 0 }} />
      </div>
    </>
  );

  return (
    <Scene w={W} h={H} label="A cozy pixel-art office: Maya types at her desk, Juno waters a plant, Sam waves to Theo who is carrying a coffee, and Biscuit the cat naps on the lounge rug." overlay={overlay}>
      <Room w={W} h={H} floorY={FLOOR} />

      {/* sunlight spilling in from the windows */}
      <polygon points="22,63 86,63 150,160 74,160" fill={C.sunLight} className="sunbeam" />
      <polygon points="232,63 296,63 320,112 320,160 284,160" fill={C.sunLight} className="sunbeam" style={{ animationDelay: "-4s" }} />

      <StringLights w={W} y={7} step={22} />
      <Window x={22} y={16} w={64} h={44} />
      <Window x={232} y={16} w={64} h={44} sun={false} />

      {/* noticeboard */}
      <R x={104} y={18} w={46} h={36} c={C.woodDark} />
      <R x={106} y={20} w={42} h={32} c={C.cork} />
      <R x={109} y={23} w={10} h={9} c={C.sun} />
      <R x={110} y={26} w={7} h={1} c={C.ink} o={0.35} />
      <R x={110} y={28} w={5} h={1} c={C.ink} o={0.35} />
      <R x={122} y={24} w={10} h={8} c={C.cream} />
      <R x={123} y={26} w={7} h={1} c={C.forest} o={0.6} />
      <R x={123} y={28} w={8} h={1} c={C.forest} o={0.6} />
      <R x={135} y={22} w={10} h={10} c={C.sage} />
      <R x={137} y={25} w={2} h={2} c={C.forest} />
      <R x={141} y={25} w={2} h={2} c={C.forest} />
      <R x={137} y={28} w={6} h={1} c={C.forest} />
      <R x={110} y={36} w={9} h={10} c={C.terracottaLight} />
      <R x={123} y={37} w={13} h={10} c={C.sun} />
      <R x={125} y={40} w={9} h={1} c={C.ink} o={0.35} />
      <R x={125} y={42} w={6} h={1} c={C.ink} o={0.35} />
      <R x={139} y={36} w={7} h={9} c={C.cream} />
      {[
        [113, 23],
        [126, 24],
        [140, 22],
        [114, 36],
        [129, 37],
        [142, 36],
      ].map(([px, py], i) => (
        <R key={i} x={px} y={py} w={1} h={1} c={i % 2 ? C.forest : C.terracottaDark} />
      ))}

      {/* clock, art and shelf */}
      <Clock x={161} y={16} />
      <R x={182} y={16} w={32} h={26} c={C.forest} />
      <R x={184} y={18} w={28} h={22} c={C.sunLight} />
      <R x={184} y={32} w={28} h={8} c={C.sage} />
      <R x={190} y={29} w={10} h={4} c={C.sage} />
      <R x={199} y={22} w={5} h={5} c={C.terracotta} />
      <R x={184} y={37} w={28} h={3} c="#8fa786" />
      <Shelf x={156} y={56} w={60} />
      <Books x={160} y={56} colors={[C.forest, C.terracotta, C.sun, C.sage, C.woodDark, C.cream, C.terracottaDark, C.forest]} />
      <Mug x={186} y={51} c={C.sun} />
      <TrailingPlant x={202} y={56} />

      {/* workspace */}
      <Px frame={emptyDesk} palette={BASE} x={58} y={83} />

      {/* lounge */}
      <R x={196} y={88} w={24} h={22} c={C.ink} />
      <R x={197} y={89} w={22} h={20} c={C.wood} />
      <R x={197} y={89} w={22} h={2} c={C.woodLight} />
      <R x={207} y={91} w={1} h={18} c={C.woodDark} />
      <R x={204} y={98} w={2} h={2} c={C.ink} />
      <R x={209} y={98} w={2} h={2} c={C.ink} />
      <R x={198} y={110} w={2} h={2} c={C.ink} />
      <R x={216} y={110} w={2} h={2} c={C.ink} />
      <Sofa x={224} y={80} w={76} />
      <R x={282} y={86} w={8} h={7} c={C.sun} />
      <R x={282} y={86} w={8} h={1} c={C.ink} o={0.4} />
      <FloorLamp x={308} y={48} h={64} />
      <Rug x={204} y={124} w={108} h={30} />
      {/* coffee table */}
      <R x={234} y={118} w={46} h={5} c={C.ink} />
      <R x={235} y={119} w={44} h={2} c={C.woodLight} />
      <R x={235} y={121} w={44} h={1} c={C.wood} />
      <R x={237} y={123} w={3} h={10} c={C.ink} />
      <R x={274} y={123} w={3} h={10} c={C.ink} />
      <R x={238} y={127} w={38} h={1} c={C.woodDark} />
      <Mug x={245} y={113} c={C.cream} />
      <R x={262} y={115} w={10} h={3} c={C.forest} />
      <R x={263} y={114} w={8} h={1} c={C.cream} />

      {/* foreground plant for depth */}
      <Px frame={potted} palette={BASE} x={302} y={138} />
    </Scene>
  );
}
