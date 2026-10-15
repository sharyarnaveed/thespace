import type { CSSProperties } from "react";
import { height, toRuns, width, type Frame, type Palette } from "./grid";
import type { Sprite } from "./sprites";

/** Collapse a frame into one <path> per colour — far fewer DOM nodes than rects. */
function framePaths(frame: Frame, palette: Palette, offsetX = 0, offsetY = 0) {
  const byFill = new Map<string, string>();
  for (const r of toRuns(frame, palette, offsetX, offsetY)) {
    byFill.set(r.fill, (byFill.get(r.fill) ?? "") + `M${r.x} ${r.y}h${r.w}v1h-${r.w}z`);
  }
  return [...byFill].map(([fill, d]) => <path key={fill} d={d} fill={fill} />);
}

/** Static pixel art placed inside an existing <svg> at (x, y) in scene pixels. */
export function Px({
  frame,
  palette,
  x = 0,
  y = 0,
  flip = false,
  className,
}: {
  frame: Frame;
  palette: Palette;
  x?: number;
  y?: number;
  flip?: boolean;
  className?: string;
}) {
  const transform = flip
    ? `translate(${x + width(frame)} ${y}) scale(-1 1)`
    : `translate(${x} ${y})`;
  return (
    <g transform={transform} className={className}>
      {framePaths(frame, palette)}
    </g>
  );
}

/** Standalone static pixel image that scales to its container width. */
export function PixelImage({
  frame,
  palette,
  label,
  className,
  style,
}: {
  frame: Frame;
  palette: Palette;
  label?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox={`0 0 ${width(frame)} ${height(frame)}`}
      className={`pixelated block ${className ?? ""}`}
      style={style}
      shapeRendering="crispEdges"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {framePaths(frame, palette)}
    </svg>
  );
}

/**
 * Animated sprite: every frame is laid out on a horizontal strip and the strip
 * is stepped through with a CSS `steps()` animation — a classic sprite sheet,
 * with no JavaScript running per frame.
 *
 * Size it by giving it a width (className/style); height follows the aspect ratio.
 * `hover` keeps it on the first frame until an ancestor `.group` is hovered.
 */
export function PixelSprite({
  sprite,
  label,
  delay = 0,
  hover = false,
  flip = false,
  className,
  style,
}: {
  sprite: Sprite;
  label?: string;
  delay?: number;
  hover?: boolean;
  flip?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const { frames, palette, fps } = sprite;
  const w = width(frames[0]);
  const h = height(frames[0]);
  // 1px transparent gutter between cells avoids neighbour bleed when scaled.
  const cell = w + 1;
  const n = frames.length;
  return (
    <div
      className={`pixel-sprite ${className ?? ""}`}
      style={{ aspectRatio: `${cell} / ${h}`, ...(flip ? { scale: "-1 1" } : null), ...style }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg
        viewBox={`0 0 ${cell * n} ${h}`}
        className={`sprite-strip ${hover ? "sprite-hover" : ""}`}
        style={
          {
            width: `${n * 100}%`,
            "--frames": n,
            "--dur": `${n / fps}s`,
            "--delay": `${delay}s`,
          } as CSSProperties
        }
        shapeRendering="crispEdges"
        preserveAspectRatio="none"
      >
        {frames.map((f, i) => (
          <g key={i}>{framePaths(f, palette, i * cell, 0)}</g>
        ))}
      </svg>
    </div>
  );
}
