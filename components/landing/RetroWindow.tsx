import type { ReactNode } from "react";

/** Chunky retro app window used to frame pixel scenes. */
export function RetroWindow({
  title,
  right,
  footer,
  children,
  className,
}: {
  title: string;
  right?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-2 border-ink bg-paper-light ${className ?? ""}`}>
      <div className="flex items-center gap-3 border-b-2 border-ink bg-paper-deep px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-3 border-2 border-ink bg-terracotta" />
          <span className="size-3 border-2 border-ink bg-sun" />
          <span className="size-3 border-2 border-ink bg-sage" />
        </span>
        <span className="truncate font-pixel text-[0.7rem] uppercase tracking-wider text-ink">{title}</span>
        {right && <span className="ml-auto flex shrink-0 items-center gap-2 font-mono text-[0.7rem] text-ink/70">{right}</span>}
      </div>
      {children}
      {footer && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t-2 border-ink bg-paper-deep px-3 py-2 font-mono text-[0.7rem] text-ink/75">
          {footer}
        </div>
      )}
    </div>
  );
}
