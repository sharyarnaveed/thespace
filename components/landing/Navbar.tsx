"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { EARLY_ACCESS, NAV_LINKS } from "./links";
import { BRAND } from "./brand";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 ${
        scrolled || open ? "border-b border-line bg-paper/92 backdrop-blur-[2px]" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="#top" aria-label={`${BRAND.name} — back to top`} className="rounded-sm" onClick={() => setOpen(false)}>
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative px-3 py-2 font-mono text-[0.8rem] uppercase tracking-[0.08em] text-ink/80 transition-colors hover:text-ink"
              >
                {l.label}
                <span className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-forest transition-transform duration-300 ease-soft group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <motion.a
            href={EARLY_ACCESS}
            whileHover={{ y: -2 }}
            whileTap={{ y: 1 }}
            className="hidden items-center gap-1.5 border-2 border-ink bg-sun px-4 py-2 text-sm font-semibold text-ink shadow-pixel-sm transition-shadow hover:shadow-pixel sm:inline-flex"
          >
            Get early access
            <ArrowUpRight className="size-4" aria-hidden />
          </motion.a>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center border-2 border-ink bg-paper-light md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden md:hidden"
          >
            <ul className="space-y-1 px-5 pb-6 pt-2">
              {NAV_LINKS.map((l, i) => (
                <motion.li key={l.href} initial={{ x: -12, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.05 * i }}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between border-b border-line py-3 font-display text-3xl font-semibold tracking-[-0.04em] text-ink"
                  >
                    {l.label}
                    <span className="font-pixel text-xs text-muted">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
              <li className="pt-4">
                <a
                  href={EARLY_ACCESS}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 border-2 border-ink bg-sun px-4 py-3 font-semibold shadow-pixel-sm"
                >
                  Get early access <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
