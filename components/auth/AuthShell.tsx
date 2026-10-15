import Link from "next/link";
import type { ReactNode } from "react";
import { BRAND } from "@/components/landing/brand";
import { Logo } from "@/components/landing/Logo";
import { MotionProvider } from "@/components/motion/Motion";

/** Split auth layout: pixel-art scenes on the left, the form card on the right. */
export function AuthShell({
  status,
  heading,
  blurb,
  scenes,
  title,
  subtitle,
  footer,
  fit = false,
  children,
}: {
  /** Small pixel-font line above the left-hand heading. */
  status: string;
  heading: ReactNode;
  blurb: string;
  /** One scene, or a large scene plus a smaller one tucked in below. */
  scenes: [ReactNode] | [ReactNode, ReactNode];
  title: string;
  subtitle: string;
  footer: ReactNode;
  /** Size the card to the viewport so the whole page fits without scrolling (desktop). */
  fit?: boolean;
  children: ReactNode;
}) {
  return (
    <MotionProvider>
      <main
        className={`grid min-h-dvh place-items-center bg-sage/45 px-4 font-display sm:px-6 ${fit ? "py-4 sm:py-6" : "py-8 sm:py-12"}`}
      >
        <div
          className={`grid w-full max-w-6xl overflow-hidden border-2 border-ink bg-forest-deep shadow-[8px_8px_0_0_var(--color-ink)] lg:grid-cols-[1.1fr_1fr] ${fit ? "lg:h-[calc(100dvh-3rem)] lg:max-h-[760px]" : ""}`}
        >
          {/* Pixel-art side */}
          <section
            aria-label={`${BRAND.name} office preview`}
            className="relative hidden flex-col justify-between gap-8 bg-forest p-8 text-paper lg:flex xl:p-10"
          >
            <div>
              <p className="font-pixel text-xs uppercase tracking-widest text-sun">● {status}</p>
              <h2 className="mt-4 max-w-sm text-4xl font-semibold leading-[1.05] tracking-[-0.03em]">{heading}</h2>
              <p className="mt-4 max-w-sm text-paper/70">{blurb}</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="border-2 border-ink bg-paper-light shadow-[6px_6px_0_0_var(--color-ink)]">{scenes[0]}</div>
              {scenes[1] && (
                <div className="ml-auto w-3/5 border-2 border-ink bg-paper-light shadow-[6px_6px_0_0_var(--color-ink)]">
                  {scenes[1]}
                </div>
              )}
            </div>
          </section>

          {/* Form side */}
          <section className={`flex bg-paper-light px-6 sm:px-12 ${fit ? "py-8 lg:overflow-y-auto" : "items-center py-10 sm:py-12"}`}>
            <div className={`mx-auto w-full max-w-md ${fit ? "flex flex-col" : ""}`}>
              <Link href="/" aria-label={`${BRAND.name} home`} className="inline-flex self-start rounded-sm">
                <Logo />
              </Link>

              <h1 className={`${fit ? "mt-8 lg:mt-12" : "mt-10"} text-4xl font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-5xl`}>{title}</h1>
              <p className="mt-3 text-muted">{subtitle}</p>

              <div className="mt-8">{children}</div>

              <p className="mt-8 text-center text-sm text-ink/80">{footer}</p>
            </div>
          </section>
        </div>
      </main>
    </MotionProvider>
  );
}

export function AuthLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-forest underline decoration-2 underline-offset-2 hover:text-terracotta">
      {children}
    </Link>
  );
}
