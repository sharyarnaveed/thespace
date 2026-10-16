import { Logo } from "./Logo";
import { EARLY_ACCESS, NAV_LINKS } from "./links";
import { BRAND } from "./brand";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-paper">
      <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-20 sm:px-8 lg:px-12">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-5 max-w-sm leading-relaxed text-ink/75">
              A cozy pixel-art virtual office for remote teams. See each other, walk over, and make room for the small moments
              that make work feel human.
            </p>
          </div>
          <nav aria-label="Footer" className="md:col-span-4 md:col-start-7">
            <p className="font-pixel text-[0.65rem] uppercase text-muted">Explore</p>
            <ul className="mt-4 space-y-2">
              {[...NAV_LINKS, { href: EARLY_ACCESS, label: "Get early access" }].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="font-display text-2xl font-medium tracking-[-0.03em] transition-colors hover:text-terracotta">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-2">
            <p className="font-pixel text-[0.65rem] uppercase text-muted">Office hours</p>
            <p className="mt-4 font-mono text-sm leading-relaxed text-ink/75">
              Open whenever
              <br />
              your team is.
            </p>
            <a href="#top" className="mt-6 inline-block font-mono text-sm underline decoration-ink/30 underline-offset-4 hover:decoration-terracotta">
              Back to top ↑
            </a>
          </div>
        </div>

        <p
          aria-hidden
          className="mt-20 select-none whitespace-nowrap font-condensed text-[clamp(4rem,18.5vw,17.5rem)] font-black uppercase leading-[0.78] tracking-[-0.02em] text-forest"
        >
          <span className="font-display font-semibold normal-case tracking-[-0.06em] text-terracotta">{BRAND.lead}</span>
          {BRAND.word}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 font-mono text-xs text-muted">
          <p>© 2026 {BRAND.name}. Made with care for remote teams.</p>
          <p className="flex items-center gap-2">
            <span className="size-2 bg-forest" aria-hidden /> All pixels hand-placed
          </p>
        </div>
      </div>
    </footer>
  );
}
