import type { ReactNode } from "react";
import { Px } from "@/components/pixel/PixelArt";
import { recordPlayer } from "@/components/pixel/props";
import { BASE, CAST, characterPalette, hero, idle, makeSprite, plantFrames, typingFrames, waveFrames } from "@/components/pixel/sprites";
import { Books, C, Clock, FloorLamp, R, Room, Rug, Scene, SceneSprite, Shelf, Sofa, StringLights, TrailingPlant, Whiteboard, Window, at } from "@/components/scene/kit";
import { chibiUpper } from "@/components/pixel/chibi";
import { avatarById } from "./avatars";
import { DEFAULT_STYLE, type StyleId } from "./model";

const potted = plantFrames()[0];

/* ------------------------------------------------------------------ */
/* Path-choice illustrations                                           */
/* ------------------------------------------------------------------ */

export const CW = 120;
export const CH = 72;
const CFLOOR = 48;

/** Someone setting up a fresh desk: computer, mug, desk lamp, and a plant being watered. */
export function CreateIllustration() {
  const desk = makeSprite(typingFrames(null), BASE, 3);
  return (
    <Scene
      w={CW}
      h={CH}
      label="A little pixel character watering a plant beside a freshly arranged desk with a computer and a coffee mug."
      overlay={
        <>
          <SceneSprite sprite={desk} sw={CW} sh={CH} x={6} y={27} hover />
          <SceneSprite sprite={hero.waterer()} sw={CW} sh={CH} x={56} y={31} hover />
          <SceneSprite sprite={hero.plant()} sw={CW} sh={CH} x={84} y={36} hover delay={0.4} />
        </>
      }
    >
      <Room w={CW} h={CH} floorY={CFLOOR} />
      <Window x={14} y={9} w={26} h={12} curtains={false} />
      <Clock x={56} y={8} />
      <Shelf x={78} y={12} w={32} />
      <Books x={81} y={12} colors={[C.forest, C.terracotta, C.sun, C.sage]} />
      <TrailingPlant x={100} y={12} />
    </Scene>
  );
}

/** A newcomer stepping through the office door towards teammates who wave hello. */
export function JoinIllustration() {
  const newcomer = hero.walker();
  const sam = makeSprite(waveFrames("bun"), characterPalette(CAST.sam), 5);
  const maya = idle("maya", "long");
  return (
    <Scene
      w={CW}
      h={CH}
      label="A pixel character walking in through an office doorway, coffee in hand, towards two teammates who wave hello."
      overlay={
        <>
          <SceneSprite sprite={newcomer} sw={CW} sh={CH} x={13} y={30} hover />
          <SceneSprite sprite={sam} sw={CW} sh={CH} x={78} y={30} hover flip delay={0.2} />
          <SceneSprite sprite={maya} sw={CW} sh={CH} x={98} y={30} hover />
        </>
      }
    >
      <Room w={CW} h={CH} floorY={CFLOOR} />
      {/* doorway: frame, warm light spilling in, the door swung open */}
      <R x={8} y={12} w={28} h={36} c={C.woodDark} />
      <R x={10} y={14} w={24} h={34} c={C.sunLight} />
      <R x={10} y={14} w={24} h={3} c={C.sun} />
      <R x={10} y={14} w={5} h={34} c={C.terracotta} />
      <R x={11} y={30} w={2} h={2} c={C.sun} />
      <polygon points="10,48 34,48 46,54 4,54" fill={C.sunLight} opacity={0.55} />
      <Px frame={potted} palette={BASE} x={40} y={30} />
      <StringLights w={CW} y={6} step={16} />
      <Window x={72} y={14} w={30} h={12} curtains={false} sun={false} />
    </Scene>
  );
}

/* ------------------------------------------------------------------ */
/* Office preview                                                      */
/* ------------------------------------------------------------------ */

const W = 160;
const H = 100;
const FLOOR = 64;

function StyleBackdrop({ style }: { style: StyleId }) {
  switch (style) {
    case "creative-studio":
      return (
        <g>
          <Room w={W} h={H} floorY={FLOOR} />
          <StringLights w={W} y={7} step={18} />
          <Whiteboard x={108} y={14} w={46} h={24} />
          <R x={14} y={14} w={14} h={12} c={C.sun} />
          <R x={30} y={18} w={10} h={10} c={C.terracottaLight} />
          <R x={20} y={28} w={12} h={8} c={C.sage} />
          <Rug x={58} y={76} w={96} h={20} c={C.sun} border={C.terracotta} />
          <Px frame={potted} palette={BASE} x={60} y={46} />
        </g>
      );
    case "quiet-minimal":
      return (
        <g>
          <Room w={W} h={H} floorY={FLOOR} stripes={false} />
          <Window x={14} y={10} w={30} h={16} curtains={false} />
          <Clock x={124} y={12} />
          <Shelf x={112} y={34} w={36} />
          <Books x={118} y={34} colors={[C.cream, C.sage, C.forest]} />
          <FloorLamp x={70} y={22} h={50} />
          <Px frame={potted} palette={BASE} x={138} y={46} />
        </g>
      );
    case "community-lounge":
      return (
        <g>
          <Room w={W} h={H} floorY={FLOOR} />
          <StringLights w={W} y={7} step={16} />
          <Window x={114} y={12} w={34} h={14} sun={false} />
          <R x={56} y={46} w={22} h={20} c={C.ink} />
          <R x={57} y={47} w={20} h={18} c={C.wood} />
          <R x={57} y={47} w={20} h={2} c={C.woodLight} />
          <Sofa x={84} y={40} w={70} />
          <Rug x={56} y={78} w={100} h={18} />
        </g>
      );
    case "cozy-green":
    default:
      return (
        <g>
          <Room w={W} h={H} floorY={FLOOR} />
          <Window x={18} y={11} w={30} h={16} />
          <Shelf x={110} y={22} w={42} />
          <TrailingPlant x={116} y={22} />
          <TrailingPlant x={138} y={22} />
          <Rug x={58} y={78} w={96} h={18} c={C.sage} border={C.forest} />
          <Px frame={potted} palette={BASE} x={72} y={46} />
          <Px frame={potted} palette={BASE} x={118} y={46} />
          <Px frame={potted} palette={BASE} x={140} y={46} flip />
        </g>
      );
  }
}

/**
 * Miniature office: a hanging name sign, the owner's avatar at their desk
 * (with a name tag) and furniture that follows the chosen style.
 */
export function OfficePreview({
  style = DEFAULT_STYLE,
  workspaceName,
  avatarId,
  displayName,
  className,
}: {
  style?: StyleId;
  workspaceName?: string;
  avatarId?: string;
  displayName?: string;
  className?: string;
}) {
  const avatar = avatarById(avatarId);
  const desk = makeSprite(typingFrames("short", chibiUpper(avatar.spec)), characterPalette(avatar.look), 5);
  const extras: ReactNode[] = [];
  if (style === "community-lounge")
    extras.push(<SceneSprite key="rec" sprite={recordPlayer()} sw={W} sh={H} x={57} y={30} />);
  if (style === "cozy-green" || style === "community-lounge")
    extras.push(<SceneSprite key="cat" sprite={hero.cat()} sw={W} sh={H} x={style === "cozy-green" ? 92 : 104} y={84} />);

  const sign = workspaceName?.trim() || "Your office";
  const tag = displayName?.trim();
  return (
    <Scene
      w={W}
      h={H}
      className={className}
      label={`Preview of ${sign}: a ${style.replace("-", " ")} office with ${tag ? `${tag}'s` : "your"} avatar, ${avatar.name}, working at a desk.`}
      overlay={
        <>
          <SceneSprite sprite={desk} sw={W} sh={H} x={6} y={45} />
          {extras}
          {/* hanging sign with the office name */}
          <div aria-hidden className="absolute left-1/2 top-[6%] flex max-w-[44%] -translate-x-1/2 flex-col items-center">
            <span className="flex w-1/2 justify-between">
              <span className="h-[1.6cqw] w-[0.6cqw] bg-ink" />
              <span className="h-[1.6cqw] w-[0.6cqw] bg-ink" />
            </span>
            <span
              className="max-w-full truncate border-[0.6cqw] border-ink bg-paper-light px-[1.6cqw] py-[0.5cqw] font-pixel leading-tight text-forest"
              style={{ fontSize: "3.2cqw" }}
            >
              {sign}
            </span>
          </div>
          {tag && (
            <span
              aria-hidden
              className="absolute max-w-[34%] -translate-x-1/2 truncate bg-ink px-[1cqw] font-pixel leading-snug text-paper"
              style={{ ...at(W, H, 28, 38), fontSize: "2.6cqw" }}
            >
              {tag}
            </span>
          )}
        </>
      }
    >
      <StyleBackdrop style={style} />
    </Scene>
  );
}
