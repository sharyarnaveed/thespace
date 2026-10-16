import type { ReactNode } from "react";
import { PixelImage, PixelSprite } from "@/components/pixel/PixelArt";
import { PROP_PALETTE, cake, coffeeForTwo, recordPlayer, speechHeart } from "@/components/pixel/props";
import { BASE, CAST, characterPalette, makeSprite, typingFrames, waveFrames } from "@/components/pixel/sprites";
import { Reveal, Tilt } from "@/components/motion/Motion";
import { SectionLabel } from "./SectionLabel";

type Detail = { title: string; body: string; note: string; art: ReactNode; card: string; rotate: number; span: string };

const DETAILS: Detail[] = [
  {
    title: "A desk that's yours",
    body: "Your plant, your lamp, that photo from the team offsite. Little things that make a place feel like your place.",
    note: "personal desks",
    art: <PixelImage frame={typingFrames(null)[0]} palette={BASE} label="A personalised desk with a lamp, photo and cactus" className="w-full max-w-[15rem]" />,
    card: "bg-paper-light text-ink",
    rotate: -2,
    span: "md:col-span-3",
  },
  {
    title: "Music in the air",
    body: "A shared record player in the lounge sets a gentle soundtrack. Turn it up, turn it down, or pass the aux.",
    note: "ambient music",
    art: (
      <div className="relative w-full max-w-[9.5rem]">
        <PixelSprite sprite={recordPlayer()} label="A spinning record player" className="w-full" />
        <span className="float-up absolute -top-2 right-0 font-pixel text-lg [--fx:10px]" aria-hidden>♪</span>
        <span className="float-up absolute -top-2 right-6 font-pixel text-sm [--d:1.4s] [--fx:-8px]" aria-hidden>♫</span>
      </div>
    ),
    card: "bg-sun text-ink",
    rotate: 1.5,
    span: "md:col-span-3 md:mt-12",
  },
  {
    title: "Tiny office rituals",
    body: "Friday cake, Monday plant check, a bell for shipped work. The traditions that make a team feel like one.",
    note: "every friday, 4pm",
    art: <PixelSprite sprite={cake()} label="A cake with a flickering candle" className="w-full max-w-[7.5rem]" />,
    card: "bg-terracotta text-ink",
    rotate: 1,
    span: "md:col-span-2",
  },
  {
    title: "Coffee, together",
    body: "Spot someone in the kitchen and join them. The best conversations rarely make it onto a calendar.",
    note: "coffee at 3",
    art: <PixelSprite sprite={coffeeForTwo()} label="Two mugs of coffee side by side" className="w-full max-w-[9rem]" />,
    card: "bg-sage text-ink",
    rotate: -1.5,
    span: "md:col-span-2 md:-mt-6",
  },
  {
    title: "Friendly hellos",
    body: "Wave when you arrive, high-five a launch, leave a heart on someone's desk. Small gestures, big warmth.",
    note: "press E to wave",
    art: (
      <div className="flex w-full max-w-[13rem] items-end justify-center gap-3">
        <PixelSprite sprite={makeSprite(waveFrames("curly"), characterPalette(CAST.ines), 5)} label="Someone waving hello" className="w-[34%]" />
        <PixelImage frame={speechHeart()} palette={PROP_PALETTE} label="A heart speech bubble" className="mb-[28%] w-[38%]" />
      </div>
    ),
    card: "bg-paper-light text-ink",
    rotate: 2,
    span: "md:col-span-2",
  },
];

const RITUALS = ["Monday plant check", "Coffee at 3", "Friday cake", "Lo-fi Tuesdays", "Wave when you arrive", "Demo day bell", "Long lunch in the lounge", "Goodnight, office"];

export function CozyDetailsSection() {
  return (
    <section aria-labelledby="cozy-title" className="relative overflow-hidden bg-forest text-paper">
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionLabel index="04" light>
              Cozy details
            </SectionLabel>
            <h2 id="cozy-title" className="mt-8 font-display text-[clamp(2.8rem,6vw,5.6rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
              The small things that make it feel like <em className="text-sun">a place.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className="text-lg leading-relaxed text-paper/80">
              An office is more than desks. It&rsquo;s the playlist, the inside jokes, the mug someone always borrows. We
              sweat these details so your team can simply enjoy them.
            </p>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-8 md:grid-cols-6 md:gap-6 lg:mt-20 lg:gap-8">
          {DETAILS.map((d, i) => (
            <li key={d.title} className={d.span}>
              <Tilt rotate={d.rotate} delay={(i % 3) * 0.08} className={`relative h-full border-2 border-ink p-5 shadow-[6px_6px_0_0_var(--color-forest-deep)] ${d.card}`}>
                {/* washi tape */}
                <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-3deg] bg-paper/60 mix-blend-luminosity" />
                <div className="flex h-44 items-center justify-center border border-ink/25 bg-ink/[0.04] py-6">{d.art}</div>
                <p className="mt-5 font-pixel text-[0.62rem] uppercase tracking-wider opacity-75">{d.note}</p>
                <h3 className="mt-1 font-display text-2xl font-semibold leading-tight tracking-[-0.03em]">{d.title}</h3>
                <p className="mt-2 leading-relaxed opacity-85">{d.body}</p>
              </Tilt>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-y-2 border-ink bg-forest-deep py-4" aria-label="Office rituals">
        <div className="flex w-max marquee">
          {[0, 1].map((k) => (
            <ul key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
              {RITUALS.map((r) => (
                <li key={r} className="flex items-center gap-6 pr-6 font-pixel text-sm uppercase text-sun">
                  {r}
                  <span className="size-2 bg-terracotta" aria-hidden />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
