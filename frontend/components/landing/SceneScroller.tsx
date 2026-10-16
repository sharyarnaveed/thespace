import type { ReactNode } from "react";

/**
 * On narrow screens the hero scene keeps a readable minimum width and becomes
 * horizontally scrollable inside its frame (never the page itself).
 */
export function SceneScroller({ children }: { children: ReactNode }) {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Office scene — scroll sideways to look around"
      className="overflow-x-auto overscroll-x-contain [scrollbar-width:thin] focus-visible:outline-offset-[-4px]"
    >
      <div className="min-w-[640px]">{children}</div>
    </div>
  );
}
