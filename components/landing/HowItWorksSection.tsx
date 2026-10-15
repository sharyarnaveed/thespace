import type { ReactNode } from "react";
import { PixelImage, PixelSprite } from "@/components/pixel/PixelArt";
import { ENVELOPE, LOGO, PROP_PALETTE, bust, speechHeart } from "@/components/pixel/props";
import { idle } from "@/components/pixel/sprites";
import { Float, Reveal } from "@/components/motion/Motion";
import { SectionLabel } from "./SectionLabel";

function InviteArt() {
  return (
    <div className="relative flex h-full items-center justify-center">
      <PixelImage frame={LOGO} palette={PROP_PALETTE} label="Your new little office building" className="w-[34%]" />
      <Float className="absolute right-[12%] top-[16%] w-[34%]" rotate={8} distance={8}>
        <PixelImage frame={ENVELOPE} palette={PROP_PALETTE} label="An invitation envelope" className="w-full" />
      </Float>
      <span className="twinkle absolute left-[20%] top-[22%] size-2 bg-sun" aria-hidden />
      <span className="twinkle absolute bottom-[24%] left-[28%] size-1.5 bg-terracotta [--d:1s]" aria-hidden />
      <span className="twinkle absolute bottom-[20%] right-[18%] size-2 bg-sage [--d:1.8s]" aria-hidden />
    </div>
  );
}

function AvatarArt() {
  const choices = [bust("long", "maya"), bust("short", "theo"), bust("beanie", "juno"), bust("bun", "sam"), bust("curly", "ines")];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-4">
      <ul className="grid w-full max-w-[18rem] grid-cols-5 gap-1.5" aria-label="Avatar options">
        {choices.map((b, i) => (
          <li
            key={i}
            className={`relative border-2 p-0.5 ${i === 2 ? "border-ink bg-sun" : "border-ink/25 bg-paper-light"}`}
          >
            <PixelImage frame={b.frame} palette={b.palette} className="w-full" />
            {i === 2 && <span className="blink-cursor absolute -bottom-3 left-1/2 -translate-x-1/2 font-pixel text-[0.6rem]" aria-hidden>▲</span>}
          </li>
        ))}
      </ul>
      <p className="mt-2 border border-ink bg-paper-light px-2 py-1 font-pixel text-[0.6rem] uppercase">desk 04 · by the window</p>
    </div>
  );
}

function TalkArt() {
  return (
    <div className="relative flex h-full items-end justify-center gap-[6%] pb-[10%]">
      <PixelSprite sprite={idle("sam", "bun")} label="Sam" className="w-[17%]" />
      <PixelSprite sprite={idle("theo", "short")} label="Theo" className="w-[17%]" delay={1} />
      <Float className="absolute left-1/2 top-[10%] w-[20%] -translate-x-1/2" distance={5}>
        <PixelImage frame={speechHeart()} palette={PROP_PALETTE} label="A speech bubble with a heart" className="w-full" />
      </Float>
    </div>
  );
}

const STEPS: { title: string; body: string; art: ReactNode; tone: string }[] = [
  {
    title: "Create your office & invite your team",
    body: "Name your floor, pick a layout and send a little invite link. It takes about as long as making a cup of tea.",
    art: <InviteArt />,
    tone: "bg-[#efe3c4]",
  },
  {
    title: "Choose your avatar & settle into your desk",
    body: "Pick a look, claim a spot by the window and make it yours with plants, photos and a favourite mug.",
    art: <AvatarArt />,
    tone: "bg-[#dfe5d5]",
  },
  {
    title: "Walk over, talk & enjoy the day together",
    body: "Wander across to say hi, gather in the meeting room, or share a slow coffee in the lounge. That's it — you're in.",
    art: <TalkArt />,
    tone: "bg-[#f0dccd]",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
      <Reveal className="mx-auto max-w-3xl text-center">
        <div className="flex justify-center">
          <SectionLabel index="03">How it works</SectionLabel>
        </div>
        <h2 id="how-title" className="mt-8 text-balance font-display text-[clamp(2.8rem,6vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
          Three small steps <em className="text-forest">to the office.</em>
        </h2>
      </Reveal>

      <ol className="relative mt-16 grid gap-14 md:grid-cols-3 md:gap-8 lg:mt-24 lg:gap-12">
        {/* pixel path connecting the steps */}
        <span
          aria-hidden
          className="absolute left-[16%] right-[16%] top-5 hidden h-1 md:block"
          style={{
            backgroundImage: "linear-gradient(90deg, var(--color-ink) 50%, transparent 50%)",
            backgroundSize: "12px 4px",
          }}
        />
        {STEPS.map((s, i) => (
          <li key={s.title}>
            <Reveal delay={i * 0.12} className="flex flex-col items-center text-center">
              <span className="relative z-10 inline-flex h-10 items-center border-2 border-ink bg-sun px-3 font-pixel text-sm shadow-pixel-sm">
                Step 0{i + 1}
              </span>
              <div className={`mt-8 aspect-[4/3] w-full border-2 border-ink ${s.tone}`}>{s.art}</div>
              <h3 className="mt-7 max-w-xs font-condensed text-[1.8rem] font-extrabold uppercase leading-[0.95]">{s.title}</h3>
              <p className="mt-3 max-w-sm leading-relaxed text-ink/80">{s.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
