import type { CSSProperties } from "react";
import { Px } from "@/components/pixel/PixelArt";
import { BASE, CAST, characterPalette, idle, makeSprite, plantFrames, typingFrames, walkWithMugFrames, waveFrames } from "@/components/pixel/sprites";
import { reader, recordPlayer } from "@/components/pixel/props";
import { catFrames } from "@/components/pixel/sprites";
import { Books, Box, C, Clock, FloorLamp, Mug, R, Room, Rug, Scene, SceneSprite, Shelf, Sofa, StringLights, TrailingPlant, Whiteboard, Window } from "./kit";

const W = 160;
const H = 100;
const FLOOR = 64;
const potted = plantFrames()[0];

export function WorkspaceScene() {
  const maya = makeSprite(typingFrames("long"), characterPalette(CAST.maya), 6);
  const ines = makeSprite(typingFrames("curly"), characterPalette(CAST.ines), 5);
  const theo = makeSprite(walkWithMugFrames("short"), characterPalette(CAST.theo), 5);
  return (
    <Scene
      w={W}
      h={H}
      label="The Workspace: two teammates typing at neighbouring desks, a third desk waiting for its owner."
      overlay={
        <>
          <SceneSprite sprite={maya} sw={W} sh={H} x={4} y={45} hover />
          <SceneSprite sprite={ines} sw={W} sh={H} x={56} y={45} hover delay={0.3} />
          <SceneSprite sprite={theo} sw={W} sh={H} x={118} y={72} hover />
        </>
      }
    >
      <Room w={W} h={H} floorY={FLOOR} />
      <Window x={14} y={9} w={34} h={17} curtains={false} />
      <Clock x={60} y={10} />
      <Shelf x={80} y={24} w={44} />
      <Books x={84} y={24} colors={[C.forest, C.terracotta, C.sun, C.sage, C.woodDark, C.cream]} />
      <TrailingPlant x={112} y={24} />
      <Px frame={potted} palette={BASE} x={140} y={46} />
    </Scene>
  );
}

export function LoungeScene() {
  const theo = idle("theo", "short");
  const sam = makeSprite(waveFrames("bun"), characterPalette(CAST.sam), 5);
  const cat = makeSprite(catFrames(), BASE, 2);
  const record = recordPlayer();
  return (
    <Scene
      w={W}
      h={H}
      label="The Lounge: a terracotta sofa, a record player and two teammates catching up over coffee."
      overlay={
        <>
          <SceneSprite sprite={cat} sw={W} sh={H} x={22} y={44} hover />
          <SceneSprite sprite={record} sw={W} sh={H} x={92} y={30} hover />
          <SceneSprite sprite={theo} sw={W} sh={H} x={104} y={64} hover />
          <SceneSprite sprite={sam} sw={W} sh={H} x={126} y={64} hover flip delay={0.2} />
          <span className="steam" style={{ left: "35.5%", top: "63%", "--d": "0s" } as CSSProperties} />
          <span className="steam" style={{ left: "36.5%", top: "63%", "--d": "1.1s" } as CSSProperties} />
        </>
      }
    >
      <Room w={W} h={H} floorY={FLOOR} />
      <StringLights w={W} y={7} step={18} />
      <Window x={110} y={10} w={36} h={16} sun={false} />
      <R x={90} y={46} w={24} h={20} c={C.ink} />
      <R x={91} y={47} w={22} h={18} c={C.wood} />
      <R x={91} y={47} w={22} h={2} c={C.woodLight} />
      <R x={101} y={49} w={1} h={16} c={C.woodDark} />
      <Sofa x={8} y={36} w={72} />
      <Rug x={6} y={74} w={92} h={22} />
      <R x={28} y={70} w={36} h={4} c={C.ink} />
      <R x={29} y={71} w={34} h={2} c={C.woodLight} />
      <R x={30} y={74} w={2} h={9} c={C.ink} />
      <R x={60} y={74} w={2} h={9} c={C.ink} />
      <Mug x={56} y={65} c={C.cream} />
      <R x={36} y={67} w={10} h={3} c={C.forest} />
      <Px frame={potted} palette={BASE} x={140} y={46} />
    </Scene>
  );
}

export function MeetingScene() {
  const maya = idle("maya", "long");
  const juno = idle("juno", "beanie", 3);
  const sam = makeSprite(waveFrames("bun"), characterPalette(CAST.sam), 5);
  return (
    <Scene
      w={W}
      h={H}
      label="The Meeting Room: three teammates around a table in front of a whiteboard full of sticky notes."
      overlay={
        <>
          <SceneSprite sprite={maya} sw={W} sh={H} x={44} y={48} hover />
          <SceneSprite sprite={juno} sw={W} sh={H} x={70} y={46} hover delay={0.5} />
          <SceneSprite sprite={sam} sw={W} sh={H} x={96} y={48} hover />
        </>
      }
      front={
        <g>
          <R x={30} y={70} w={100} h={6} c={C.ink} />
          <R x={31} y={71} w={98} h={3} c={C.woodLight} />
          <R x={31} y={74} w={98} h={1} c={C.wood} />
          <R x={36} y={76} w={3} h={16} c={C.ink} />
          <R x={121} y={76} w={3} h={16} c={C.ink} />
          <R x={60} y={67} w={10} h={4} c={C.cream} />
          <R x={61} y={68} w={6} h={1} c={C.ink} o={0.4} />
          <Mug x={96} y={66} c={C.sun} />
          <R x={78} y={68} w={8} h={3} c={C.terracotta} />
        </g>
      }
    >
      <Room w={W} h={H} floorY={FLOOR} stripes={false} />
      <Whiteboard x={42} y={8} w={76} h={26} />
      <Clock x={128} y={10} />
      <R x={10} y={12} w={18} h={20} c={C.forest} />
      <R x={12} y={14} w={14} h={16} c={C.sunLight} />
      <R x={14} y={22} w={10} h={6} c={C.sage} />
      <R x={18} y={16} w={4} h={4} c={C.terracotta} />
      <Px frame={potted} palette={BASE} x={138} y={46} />
      <Px frame={potted} palette={BASE} x={2} y={46} flip />
    </Scene>
  );
}

export function QuietCornerScene() {
  const ines = reader();
  const cat = makeSprite(catFrames(), BASE, 2);
  const shelfRows = [16, 30, 44, 58];
  return (
    <Scene
      w={W}
      h={H}
      label="The Quiet Corner: someone reading in an armchair under a warm lamp, next to a tall bookshelf, a cat asleep at their feet."
      overlay={
        <>
          <SceneSprite sprite={ines} sw={W} sh={H} x={52} y={44} hover />
          <SceneSprite sprite={cat} sw={W} sh={H} x={84} y={80} hover />
        </>
      }
    >
      <Room w={W} h={H} floorY={FLOOR} />
      <R x={0} y={0} w={W} h={H} c="#3a2a1a" o={0.12} />
      <Window x={14} y={10} w={30} h={18} night curtains={false} />
      <FloorLamp x={98} y={22} h={52} />
      {/* tall bookshelf */}
      <Box x={112} y={6} w={42} h={64} c={C.woodDark} />
      <R x={114} y={8} w={38} h={60} c="#7d5434" />
      {shelfRows.map((y, i) => (
        <g key={y}>
          <R x={114} y={y} w={38} h={2} c={C.wood} />
          <Books
            x={116 + (i % 2) * 3}
            y={y}
            colors={
              i % 2
                ? [C.sun, C.forest, C.cream, C.terracotta, C.sage, C.forest, C.terracottaDark]
                : [C.terracotta, C.sage, C.forest, C.sun, C.cream, C.woodLight, C.forest]
            }
          />
        </g>
      ))}
      <R x={146} y={67} w={2} h={2} c={C.ink} />
      <Rug x={34} y={78} w={80} h={18} c={C.sage} border={C.forest} />
      <Px frame={potted} palette={BASE} x={4} y={46} />
    </Scene>
  );
}
