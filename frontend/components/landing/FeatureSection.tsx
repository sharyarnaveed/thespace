import type { CSSProperties, ReactNode } from "react";
import { PixelSprite, Px } from "@/components/pixel/PixelArt";
import { bust, cake, coffeeForTwo } from "@/components/pixel/props";
import { CAST, characterPalette, idle, makeSprite, walkWithMugFrames } from "@/components/pixel/sprites";
import { C, R } from "@/components/scene/kit";
import { Reveal } from "@/components/motion/Motion";
import { SectionLabel } from "./SectionLabel";
import { BRAND } from "./brand";

/** Top-down floor plan with teammates dotted around it. */
function MiniMap() {
  const people = [
    { b: bust("long", "maya"), x: 18, y: 14, name: "maya" },
    { b: bust("curly", "ines"), x: 44, y: 14, name: "ines" },
    { b: bust("bun", "sam"), x: 142, y: 22, name: "sam" },
    { b: bust("short", "theo"), x: 120, y: 30, name: "theo" },
    { b: bust("beanie", "juno"), x: 70, y: 70, name: "juno" },
  ];
  return (
    <svg viewBox="0 0 200 116" className="block w-full" shapeRendering="crispEdges" role="img" aria-label="A floor plan of the office with five teammates at their desks and in the lounge">
      <R x={0} y={0} w={200} h={116} c={C.ink} />
      <R x={2} y={2} w={196} h={112} c={C.floor} />
      {/* rooms */}
      <R x={4} y={4} w={88} h={50} c="#efe6d2" />
      <R x={96} y={4} w={100} h={56} c={C.sunLight} />
      <R x={4} y={58} w={60} h={54} c={C.sage} />
      <R x={68} y={64} w={128} h={48} c={C.terracottaLight} />
      {/* walls with doorways */}
      <R x={92} y={2} w={4} h={22} c={C.ink} />
      <R x={92} y={36} w={4} h={26} c={C.ink} />
      <R x={2} y={54} w={30} h={4} c={C.ink} />
      <R x={44} y={54} w={52} h={4} c={C.ink} />
      <R x={64} y={58} w={4} h={20} c={C.ink} />
      <R x={64} y={92} w={4} h={22} c={C.ink} />
      <R x={96} y={60} w={50} h={4} c={C.ink} />
      <R x={162} y={60} w={36} h={4} c={C.ink} />
      {/* furniture */}
      {[10, 36, 62].map((x) => (
        <R key={x} x={x} y={36} w={22} h={8} c={C.wood} />
      ))}
      <R x={104} y={10} w={8} h={36} c={C.terracotta} />
      <R x={128} y={48} w={30} h={6} c={C.woodLight} />
      <R x={14} y={74} w={36} h={22} c={C.woodLight} />
      <R x={150} y={90} w={30} h={14} c={C.forest} />
      <R x={80} y={92} w={14} h={14} c={C.sun} />
      {/* proximity ring around the lounge pair */}
      <R x={112} y={16} w={56} h={1} c={C.forest} o={0.5} />
      <R x={112} y={50} w={56} h={1} c={C.forest} o={0.5} />
      <R x={112} y={16} w={1} h={34} c={C.forest} o={0.5} />
      <R x={168} y={16} w={1} h={35} c={C.forest} o={0.5} />
      {people.map((p) => (
        <g key={p.name}>
          <Px frame={p.b.frame} palette={p.b.palette} x={p.x} y={p.y} />
        </g>
      ))}
    </svg>
  );
}

function WalkOver() {
  const walker = makeSprite(walkWithMugFrames("short"), characterPalette(CAST.theo), 5);
  const maya = idle("maya", "long");
  return (
    <div className="scene relative aspect-[5/3] overflow-hidden bg-[#e9dfc9]">
      <div className="absolute inset-x-0 bottom-0 h-[38%]" style={{ background: C.floor }} />
      <div className="absolute inset-x-0 bottom-[38%] h-[3%]" style={{ background: C.forest }} />
      {/* proximity rings */}
      <span className="absolute bottom-[8%] right-[10%] aspect-square w-[46%] animate-[pulse_3s_ease-in-out_infinite] rounded-full border-2 border-dashed border-forest/50" />
      <span className="absolute bottom-[18%] right-[20%] aspect-square w-[26%] rounded-full bg-sun/30" />
      <div className="absolute bottom-[14%] right-[25%] w-[15%]">
        <PixelSprite sprite={maya} label="Maya at her spot in the office" className="w-full" />
      </div>
      <div className="walk-loop absolute bottom-[14%] left-[10%] w-[17%]" style={{ "--walk": "22cqw" } as CSSProperties}>
        <PixelSprite sprite={walker} label="Theo walking over with a coffee" className="w-full" />
      </div>
      <span className="absolute left-3 top-3 border border-ink bg-paper-light px-2 py-1 font-pixel text-[0.6rem] uppercase">
        <span className="mr-1.5 inline-block size-1.5 bg-forest align-middle" />
        proximity chat on
      </span>
    </div>
  );
}

function SocialSide() {
  return (
    <div className="flex aspect-[5/3] items-center justify-center gap-[9%] bg-[#e9dfc9] px-6">
      <PixelSprite sprite={coffeeForTwo()} label="Two coffee mugs with a little heart above them" className="w-[36%]" />
      <PixelSprite sprite={cake()} label="A celebration cake with a flickering candle" className="mt-[4%] w-[30%]" />
    </div>
  );
}

const BENEFITS: { title: string; body: string; note: string; art: ReactNode }[] = [
  {
    title: "See your teammates around the office",
    body: "Glance across the floor and know who's heads-down, who's grabbing a coffee and who's free for a quick question — without pinging anyone.",
    note: "Presence, at a glance",
    art: <MiniMap />,
  },
  {
    title: "Walk over for spontaneous conversations",
    body: "Stroll up to someone's desk and you can simply start talking. Step away and the conversation fades, just like it would down a hallway.",
    note: "Proximity chat",
    art: <WalkOver />,
  },
  {
    title: "Make room for the social side of remote work",
    body: "Birthday cake on Friday, the 3pm coffee crowd, the long lunch in the lounge. The unscheduled moments that turn coworkers into a team.",
    note: "Rituals & downtime",
    art: <SocialSide />,
  },
];

export function FeatureSection() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <SectionLabel index="01">The experience</SectionLabel>
              <h2 id="experience-title" className="mt-8 font-display text-[clamp(2.6rem,5.4vw,5rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
                A little office.
                <br />
                <em className="text-forest">A lot more</em> together.
              </h2>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-ink/80">
                Video calls are great for meetings. They&rsquo;re terrible at everything in between. {BRAND.name} gives your team a
                shared place to <em className="font-semibold text-forest">be</em> — a small, illustrated floor where you can see
                each other, wander over, and bump into the conversations you didn&rsquo;t know you needed.
              </p>
              <p className="mt-10 max-w-sm border-l-2 border-terracotta pl-4 font-display text-2xl font-medium leading-snug tracking-[-0.02em] text-ink/90">
                Not another video call. A place to be, together.
              </p>
            </Reveal>
          </div>
        </div>

        <ol className="lg:col-span-7">
          {BENEFITS.map((b, i) => (
            <li key={b.title} className="border-t border-line py-10 first:border-t-0 first:pt-0 lg:py-14">
              <Reveal className="grid gap-6 sm:grid-cols-[auto_1fr] sm:gap-8">
                <span className="font-display text-6xl font-semibold leading-none tracking-[-0.06em] text-terracotta lg:text-7xl" aria-hidden>
                  0{i + 1}
                </span>
                <div>
                  <p className="font-pixel text-[0.65rem] uppercase tracking-wider text-forest">{b.note}</p>
                  <h3 className="mt-2 font-condensed text-[clamp(1.9rem,3.2vw,2.8rem)] font-extrabold uppercase leading-[0.95]">{b.title}</h3>
                  <p className="mt-4 max-w-xl leading-relaxed text-ink/80">{b.body}</p>
                  <div className="mt-7 max-w-xl -rotate-[0.6deg] border-2 border-ink bg-paper-light p-2 shadow-pixel odd:rotate-[0.6deg]">
                    {b.art}
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
