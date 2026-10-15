import type { ReactNode } from "react";
import { MousePointer2 } from "lucide-react";
import { LoungeScene, MeetingScene, QuietCornerScene, WorkspaceScene } from "@/components/scene/SpaceScenes";
import { Reveal } from "@/components/motion/Motion";
import { SectionLabel } from "./SectionLabel";
import { BRAND } from "./brand";

type Space = {
  room: string;
  title: string;
  body: string;
  tags: string[];
  inside: string;
  scene: ReactNode;
  className: string;
};

const SPACES: Space[] = [
  {
    room: "Room 01",
    title: "The Workspace",
    body: "Rows of personal desks where heads-down work happens side by side. Close enough to ask a quick question, quiet enough to focus.",
    tags: ["personal desks", "focus status", "shared work"],
    inside: "3 at their desks",
    scene: <WorkspaceScene />,
    className: "lg:col-span-7",
  },
  {
    room: "Room 02",
    title: "The Lounge",
    body: "The sofa, the record player and the good mugs. Drift in for a coffee break and leave with the week's best idea.",
    tags: ["coffee breaks", "music", "hangouts"],
    inside: "2 chatting",
    scene: <LoungeScene />,
    className: "lg:col-span-5 lg:mt-28",
  },
  {
    room: "Room 03",
    title: "The Meeting Room",
    body: "Close the door, gather round the table and work it out together — whiteboard, sticky notes and all.",
    tags: ["collaboration", "whiteboard", "stand-ups"],
    inside: "3 in a huddle",
    scene: <MeetingScene />,
    className: "lg:col-span-5",
  },
  {
    room: "Room 04",
    title: "The Quiet Corner",
    body: "A lamp, an armchair, a shelf of books and a sleeping cat. A calm nook for deep concentration, no interruptions.",
    tags: ["deep focus", "do not disturb", "reading"],
    inside: "1 reading",
    scene: <QuietCornerScene />,
    className: "lg:col-span-7 lg:-mt-20",
  },
];

export function OfficeSpacesSection() {
  return (
    <section id="spaces" aria-labelledby="spaces-title" className="relative border-t border-line bg-paper-deep/60">
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionLabel index="02">Our spaces</SectionLabel>
            <h2 id="spaces-title" className="mt-8 font-condensed text-[clamp(3rem,7.5vw,7rem)] font-black uppercase leading-[0.85] tracking-[-0.01em]">
              Four little rooms,
              <br />
              <span className="font-display font-semibold normal-case tracking-[-0.05em] text-forest">one warm floor.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className="text-lg leading-relaxed text-ink/80">
              Every {BRAND.name} comes with a handful of rooms designed around the way teams actually spend their day — from
              focused mornings to slow Friday afternoons.
            </p>
            <p className="mt-4 hidden items-center gap-2 font-mono text-xs text-muted [@media(hover:hover)]:flex">
              <MousePointer2 className="size-3.5" aria-hidden /> Hover a room to wake it up
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-16">
          {SPACES.map((s, i) => (
            <Reveal key={s.title} delay={(i % 2) * 0.1} className={s.className}>
              <figure className="group">
                <div className="border-2 border-ink bg-paper-light transition-[transform,box-shadow] duration-500 ease-soft group-hover:-translate-y-1.5 group-hover:shadow-[8px_8px_0_0_var(--color-ink)]">
                  <div className="flex items-center justify-between border-b-2 border-ink px-3 py-2 font-pixel text-[0.62rem] uppercase">
                    <span>{s.room}</span>
                    <span className="flex items-center gap-1.5 text-muted">
                      <span className="size-1.5 bg-forest" aria-hidden />
                      {s.inside}
                    </span>
                  </div>
                  {s.scene}
                </div>
                <figcaption className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div>
                    <h3 className="font-display text-4xl font-semibold leading-none tracking-[-0.04em] lg:text-[2.6rem]">{s.title}</h3>
                    <p className="mt-3 max-w-md leading-relaxed text-ink/80">{s.body}</p>
                  </div>
                  <ul className="flex flex-wrap gap-1.5 sm:max-w-[13rem] sm:justify-end">
                    {s.tags.map((t) => (
                      <li key={t} className="border border-ink/40 px-2 py-0.5 font-mono text-[0.68rem] text-ink/75">
                        {t}
                      </li>
                    ))}
                  </ul>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
