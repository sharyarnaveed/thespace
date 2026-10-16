import type { CSSProperties, ReactNode } from "react";
import { PixelSprite } from "@/components/pixel/PixelArt";
import { width } from "@/components/pixel/grid";
import type { Sprite } from "@/components/pixel/sprites";

/**
 * Building blocks for pixel scenes. Everything is drawn on an integer grid in
 * "scene pixels"; the SVG scales up with crisp edges, and HTML overlays
 * (sprites, labels, particles) are positioned in the same units via `at()`.
 */

export const C = {
  ink: "#2b2a22",
  paper: "#f5f1e8",
  wall: "#ece3cf",
  wallLine: "#e2d6bd",
  forest: "#294b38",
  forestDeep: "#1f3a2b",
  sage: "#a7b99b",
  sageDark: "#91a586",
  sageLight: "#bdcbb2",
  terracotta: "#c98260",
  terracottaLight: "#e3a98a",
  terracottaDark: "#a8664a",
  sun: "#e6c76a",
  sunLight: "#f3dfa0",
  wood: "#c9935f",
  woodDark: "#9c6a41",
  woodLight: "#e3b27a",
  floor: "#c99a6b",
  floorAlt: "#c3936a",
  floorLine: "#a97b51",
  cork: "#d6a874",
  cream: "#fffaf0",
  water: "#a8cfd0",
};

type RectProps = { x: number; y: number; w: number; h: number; c: string; className?: string; style?: CSSProperties; o?: number };

export function R({ x, y, w, h, c, className, style, o }: RectProps) {
  return <rect x={x} y={y} width={w} height={h} fill={c} className={className} style={style} opacity={o} />;
}

/** Filled box with a 1px ink outline. */
export function Box({ x, y, w, h, c, line = C.ink }: RectProps & { line?: string }) {
  return (
    <>
      <R x={x} y={y} w={w} h={h} c={line} />
      <R x={x + 1} y={y + 1} w={w - 2} h={h - 2} c={c} />
    </>
  );
}

export function Scene({
  w,
  h,
  label,
  children,
  overlay,
  front,
  className,
}: {
  w: number;
  h: number;
  label: string;
  children: ReactNode;
  overlay?: ReactNode;
  /** Pixel art drawn above the overlay sprites (e.g. a table in front of people). */
  front?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`scene relative ${className ?? ""}`} style={{ aspectRatio: `${w} / ${h}` }}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="absolute inset-0 h-full w-full"
        shapeRendering="crispEdges"
        role="img"
        aria-label={label}
      >
        {children}
      </svg>
      {overlay}
      {front && (
        <svg viewBox={`0 0 ${w} ${h}`} className="pointer-events-none absolute inset-0 h-full w-full" shapeRendering="crispEdges" aria-hidden>
          {front}
        </svg>
      )}
    </div>
  );
}

/** Position an HTML overlay in scene pixels. */
export function at(sw: number, sh: number, x: number, y: number, w?: number): CSSProperties {
  return {
    position: "absolute",
    left: `${(x / sw) * 100}%`,
    top: `${(y / sh) * 100}%`,
    ...(w !== undefined ? { width: `${(w / sw) * 100}%` } : null),
  };
}

/** A sprite placed in scene pixels, sized so one sprite pixel = one scene pixel × scale. */
export function SceneSprite({
  sprite,
  sw,
  sh,
  x,
  y,
  scale = 1,
  label,
  delay,
  hover,
  flip,
  className,
}: {
  sprite: Sprite;
  sw: number;
  sh: number;
  x: number;
  y: number;
  scale?: number;
  label?: string;
  delay?: number;
  hover?: boolean;
  flip?: boolean;
  className?: string;
}) {
  const cell = width(sprite.frames[0]) + 1;
  return (
    <PixelSprite
      sprite={sprite}
      label={label}
      delay={delay}
      hover={hover}
      flip={flip}
      className={className}
      style={at(sw, sh, x, y, cell * scale)}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Furniture & architecture                                            */
/* ------------------------------------------------------------------ */

export function Room({ w, h, floorY, stripes = true }: { w: number; h: number; floorY: number; stripes?: boolean }) {
  const rail = floorY - 32;
  const planks = [];
  for (let y = floorY, row = 0; y < h; y += 8, row++) {
    planks.push(<R key={`p${y}`} x={0} y={y} w={w} h={8} c={row % 2 ? C.floorAlt : C.floor} />);
    planks.push(<R key={`l${y}`} x={0} y={y} w={w} h={1} c={C.floorLine} />);
    for (let x = (row * 37) % 56; x < w; x += 56) planks.push(<R key={`j${y}-${x}`} x={x} y={y} w={1} h={8} c={C.floorLine} />);
  }
  const panels = [];
  for (let x = 4; x + 22 < w; x += 28) {
    panels.push(
      <g key={x}>
        <R x={x} y={rail + 6} w={22} h={1} c={C.sageDark} />
        <R x={x} y={rail + 6} w={1} h={18} c={C.sageDark} />
        <R x={x} y={rail + 24} w={22} h={1} c={C.sageLight} />
        <R x={x + 22} y={rail + 6} w={1} h={19} c={C.sageLight} />
      </g>,
    );
  }
  const lines = [];
  if (stripes) for (let x = 6; x < w; x += 12) lines.push(<R key={x} x={x} y={6} w={1} h={rail - 6} c={C.wallLine} />);
  return (
    <g>
      <R x={0} y={0} w={w} h={floorY} c={C.wall} />
      {lines}
      <R x={0} y={0} w={w} h={5} c={C.forest} />
      <R x={0} y={5} w={w} h={1} c={C.forestDeep} />
      <R x={0} y={rail} w={w} h={3} c={C.woodDark} />
      <R x={0} y={rail} w={w} h={1} c={C.wood} />
      <R x={0} y={rail + 3} w={w} h={floorY - rail - 7} c={C.sage} />
      {panels}
      <R x={0} y={floorY - 4} w={w} h={4} c={C.forest} />
      <R x={0} y={floorY - 4} w={w} h={1} c={C.forestDeep} />
      {planks}
      <R x={0} y={floorY} w={w} h={2} c={C.floorLine} o={0.6} />
    </g>
  );
}

export function Window({
  x,
  y,
  w,
  h,
  night = false,
  curtains = true,
  sun = true,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  night?: boolean;
  curtains?: boolean;
  sun?: boolean;
}) {
  const sky = night ? ["#24384a", "#2c4456", "#36505f"] : ["#efd9a0", "#f4e4b8", "#f8eed6"];
  const hillA = night ? "#2f4a3d" : C.sage;
  const hillB = night ? "#253d31" : "#8fa786";
  const band = Math.floor(h / 3);
  const heights = [10, 13, 15, 13, 11, 9, 10, 12, 14, 12];
  const hills = Array.from({ length: Math.ceil(w / 6) }, (_, i) => [i * 6, heights[i % heights.length]]);
  return (
    <g>
      <R x={x - 2} y={y - 2} w={w + 4} h={h + 4} c={C.forest} />
      <R x={x} y={y} w={w} h={band} c={sky[0]} />
      <R x={x} y={y + band} w={w} h={band} c={sky[1]} />
      <R x={x} y={y + band * 2} w={w} h={h - band * 2} c={sky[2]} />
      {sun && !night && (
        <g>
          <R x={x + 9} y={y + 7} w={8} h={10} c={C.sun} />
          <R x={x + 8} y={y + 8} w={10} h={8} c={C.sun} />
          <R x={x + 10} y={y + 8} w={3} h={2} c="#f6e3a4" />
        </g>
      )}
      {night && (
        <g>
          <R x={x + 10} y={y + 6} w={6} h={7} c="#f3e6c0" />
          <R x={x + 13} y={y + 6} w={3} h={5} c={sky[0]} />
          {[
            [24, 5],
            [40, 9],
            [52, 4],
            [33, 15],
            [6, 18],
          ].map(([sx, sy], i) => (
            <R key={i} x={x + (sx % w)} y={y + sy} w={1} h={1} c="#fff6d8" className="twinkle" style={{ "--d": `${i * 0.6}s` } as CSSProperties} />
          ))}
        </g>
      )}
      {!night && (
        <g fill={C.cream}>
          <R x={x + w - 26} y={y + 10} w={14} h={3} c={C.cream} />
          <R x={x + w - 23} y={y + 8} w={7} h={2} c={C.cream} />
          <R x={x + 22} y={y + 22} w={10} h={2} c={C.cream} />
        </g>
      )}
      {hills.map(([hx, hh], i) =>
        hx < w ? <R key={i} x={x + hx} y={y + h - hh} w={Math.min(6, w - hx)} h={hh} c={i % 2 ? hillA : hillB} /> : null,
      )}
      <R x={x + w - 18} y={y + h - 20} w={5} h={8} c={night ? "#1d3328" : C.forest} />
      <R x={x + w - 19} y={y + h - 17} w={7} h={4} c={night ? "#1d3328" : C.forest} />
      <R x={x + w - 16} y={y + h - 12} w={1} h={4} c={C.woodDark} />
      {/* mullions */}
      <R x={x + Math.floor(w / 2) - 1} y={y} w={2} h={h} c={C.forest} />
      <R x={x} y={y + Math.floor(h / 2) - 1} w={w} h={2} c={C.forest} />
      {/* glass glints */}
      {!night && (
        <g opacity={0.55}>
          <R x={x + 3} y={y + h / 2 + 6} w={1} h={1} c={C.cream} />
          <R x={x + 4} y={y + h / 2 + 5} w={1} h={1} c={C.cream} />
          <R x={x + 5} y={y + h / 2 + 4} w={1} h={1} c={C.cream} />
          <R x={x + w / 2 + 4} y={y + 6} w={1} h={1} c={C.cream} />
          <R x={x + w / 2 + 5} y={y + 5} w={1} h={1} c={C.cream} />
        </g>
      )}
      {/* sill */}
      <R x={x - 5} y={y + h + 2} w={w + 10} h={3} c={C.woodLight} />
      <R x={x - 5} y={y + h + 5} w={w + 10} h={1} c={C.woodDark} />
      {curtains && (
        <g>
          <R x={x - 9} y={y - 6} w={w + 18} h={2} c={C.woodDark} />
          <Curtain x={x - 9} y={y - 4} h={h + 8} />
          <Curtain x={x + w + 1} y={y - 4} h={h + 8} />
        </g>
      )}
    </g>
  );
}

function Curtain({ x, y, h }: { x: number; y: number; h: number }) {
  return (
    <g>
      <R x={x} y={y} w={8} h={h} c={C.terracotta} />
      <R x={x + 2} y={y} w={1} h={h} c={C.terracottaDark} />
      <R x={x + 5} y={y} w={1} h={h} c={C.terracottaDark} />
      <R x={x + 1} y={y} w={1} h={h} c={C.terracottaLight} />
      <R x={x} y={y + h} w={8} h={1} c={C.terracottaDark} />
      <R x={x} y={y + Math.floor(h * 0.62)} w={8} h={2} c={C.sun} />
    </g>
  );
}

export function StringLights({ w, y = 8, step = 20 }: { w: number; y?: number; step?: number }) {
  const bulbs = [C.sun, C.terracotta, C.cream, C.sage];
  const out = [];
  for (let x = 0, i = 0; x < w; x += step, i++) {
    // gentle sag between hooks
    for (let s = 0; s < step; s += 2) {
      const sag = Math.round(Math.sin((s / step) * Math.PI) * 3);
      out.push(<R key={`w${x}-${s}`} x={x + s} y={y + sag} w={2} h={1} c={C.ink} o={0.55} />);
    }
    const bx = x + step / 2 - 1;
    out.push(
      <g key={`b${x}`} className="twinkle" style={{ "--d": `${(i % 5) * 0.7}s` } as CSSProperties}>
        <R x={bx} y={y + 4} w={2} h={3} c={bulbs[i % bulbs.length]} />
        <R x={bx} y={y + 3} w={2} h={1} c={C.ink} />
      </g>,
    );
  }
  return <g>{out}</g>;
}

export function Books({ x, y, colors }: { x: number; y: number; colors: string[] }) {
  const books = colors.map((c, i) => ({ c, h: 7 + ((i * 5) % 5), w: i % 3 === 0 ? 3 : 2, gap: i === 3 ? 2 : 0 }));
  const xs = books.reduce<number[]>((acc, b, i) => [...acc, i === 0 ? x : acc[i - 1] + books[i - 1].w + books[i - 1].gap], []);
  return (
    <g>
      {books.map((b, i) => (
        <g key={i}>
          <R x={xs[i]} y={y - b.h} w={b.w} h={b.h} c={b.c} />
          <R x={xs[i]} y={y - b.h + 2} w={b.w} h={1} c={C.cream} o={0.5} />
        </g>
      ))}
    </g>
  );
}

export function Sofa({ x, y, w = 78, color = C.terracotta, light = C.terracottaLight, dark = C.terracottaDark }: { x: number; y: number; w?: number; color?: string; light?: string; dark?: string }) {
  const half = Math.floor((w - 16) / 2);
  return (
    <g>
      <Box x={x + 3} y={y} w={w - 6} h={20} c={color} />
      <Box x={x + 8} y={y + 3} w={half} h={13} c={light} />
      <Box x={x + 8 + half} y={y + 3} w={half} h={13} c={light} />
      <R x={x + 9} y={y + 4} w={half - 2} h={1} c={C.cream} o={0.35} />
      <Box x={x + 6} y={y + 16} w={w - 12} h={10} c={color} />
      <R x={x + 7} y={y + 17} w={w - 14} h={2} c={light} />
      <Box x={x} y={y + 9} w={9} h={19} c={color} />
      <Box x={x + w - 9} y={y + 9} w={9} h={19} c={color} />
      <R x={x + 1} y={y + 10} w={7} h={2} c={light} />
      <R x={x + w - 8} y={y + 10} w={7} h={2} c={light} />
      <R x={x + 1} y={y + 26} w={w - 2} h={1} c={dark} />
      <R x={x + 3} y={y + 28} w={3} h={3} c={C.ink} />
      <R x={x + w - 6} y={y + 28} w={3} h={3} c={C.ink} />
    </g>
  );
}

export function Rug({ x, y, w, h, c = C.sun, border = C.terracotta }: { x: number; y: number; w: number; h: number; c?: string; border?: string }) {
  return (
    <g>
      <R x={x + 8} y={y} w={w - 16} h={h} c={border} />
      <R x={x + 4} y={y + 2} w={w - 8} h={h - 4} c={border} />
      <R x={x} y={y + 5} w={w} h={h - 10} c={border} />
      <R x={x + 10} y={y + 2} w={w - 20} h={h - 4} c={c} />
      <R x={x + 6} y={y + 4} w={w - 12} h={h - 8} c={c} />
      <R x={x + 3} y={y + 7} w={w - 6} h={h - 14} c={c} />
      <R x={x + 14} y={y + Math.floor(h / 2)} w={w - 28} h={1} c={border} o={0.6} />
      {Array.from({ length: Math.floor((w - 24) / 8) }, (_, i) => (
        <R key={i} x={x + 14 + i * 8 + 3} y={y + Math.floor(h / 2) - 3} w={2} h={2} c={border} o={0.5} />
      ))}
    </g>
  );
}

export function Clock({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <R x={x + 3} y={y} w={7} h={13} c={C.ink} />
      <R x={x} y={y + 3} w={13} h={7} c={C.ink} />
      <R x={x + 1} y={y + 1} w={11} h={11} c={C.ink} />
      <R x={x + 3} y={y + 1} w={7} h={11} c={C.cream} />
      <R x={x + 1} y={y + 3} w={11} h={7} c={C.cream} />
      <R x={x + 2} y={y + 2} w={9} h={9} c={C.cream} />
      <R x={x + 6} y={y + 3} w={1} h={4} c={C.ink} />
      <R x={x + 7} y={y + 6} w={3} h={1} c={C.terracotta} />
      <R x={x + 6} y={y + 2} w={1} h={1} c={C.terracotta} />
    </g>
  );
}

export function FloorLamp({ x, y, h = 66 }: { x: number; y: number; h?: number }) {
  return (
    <g>
      <polygon
        points={`${x - 14},${y + h} ${x + 18},${y + h} ${x + 9},${y + 10} ${x - 5},${y + 10}`}
        fill={C.sunLight}
        className="lamp-glow"
      />
      <R x={x - 3} y={y} w={10} h={2} c={C.ink} />
      <R x={x - 4} y={y + 2} w={12} h={4} c={C.ink} />
      <R x={x - 5} y={y + 6} w={14} h={5} c={C.ink} />
      <R x={x - 2} y={y + 1} w={8} h={2} c={C.sun} />
      <R x={x - 3} y={y + 3} w={10} h={3} c={C.sun} />
      <R x={x - 4} y={y + 6} w={12} h={4} c={C.sun} />
      <R x={x - 4} y={y + 9} w={12} h={1} c="#d4ae4f" />
      <R x={x + 1} y={y + 11} w={2} h={h - 14} c={C.ink} />
      <R x={x - 3} y={y + h - 3} w={10} h={3} c={C.ink} />
    </g>
  );
}

export function Whiteboard({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <Box x={x} y={y} w={w} h={h} c={C.cream} line={C.woodDark} />
      <R x={x + 4} y={y + 4} w={12} h={1} c={C.forest} />
      <R x={x + 4} y={y + 7} w={18} h={1} c={C.ink} o={0.35} />
      <R x={x + 4} y={y + 10} w={14} h={1} c={C.ink} o={0.35} />
      {/* tiny bar chart */}
      <R x={x + w - 26} y={y + h - 8} w={3} h={4} c={C.terracotta} />
      <R x={x + w - 21} y={y + h - 12} w={3} h={8} c={C.sun} />
      <R x={x + w - 16} y={y + h - 10} w={3} h={6} c={C.sage} />
      <R x={x + w - 11} y={y + h - 15} w={3} h={11} c={C.forest} />
      <R x={x + w - 28} y={y + h - 4} w={22} h={1} c={C.ink} o={0.5} />
      {/* sticky notes */}
      <R x={x + 4} y={y + h - 11} w={6} h={6} c={C.sun} />
      <R x={x + 12} y={y + h - 11} w={6} h={6} c={C.terracottaLight} />
      <R x={x + 20} y={y + h - 12} w={6} h={6} c={C.sage} />
      <R x={x + 2} y={y + h} w={w - 4} h={2} c={C.woodDark} />
      <R x={x + 6} y={y + h - 1} w={4} h={1} c={C.terracotta} />
    </g>
  );
}

export function Shelf({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g>
      <R x={x} y={y} w={w} h={3} c={C.wood} />
      <R x={x} y={y + 2} w={w} h={1} c={C.woodDark} />
      <R x={x + 3} y={y + 3} w={2} h={4} c={C.woodDark} />
      <R x={x + w - 5} y={y + 3} w={2} h={4} c={C.woodDark} />
    </g>
  );
}

export function TrailingPlant({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <R x={x} y={y - 6} w={8} h={6} c={C.terracotta} />
      <R x={x} y={y - 6} w={8} h={1} c={C.terracottaDark} />
      <R x={x - 1} y={y - 9} w={10} h={3} c="#6f9a5f" />
      <R x={x + 1} y={y - 11} w={5} h={2} c="#3f6b45" />
      {[0, 3, 7].map((dx, i) => (
        <g key={i}>
          <R x={x + dx} y={y} w={1} h={6 + i * 4} c="#3f6b45" />
          {Array.from({ length: 2 + i }, (_, j) => (
            <R key={j} x={x + dx + (j % 2 ? 1 : -1)} y={y + 2 + j * 4} w={2} h={2} c="#6f9a5f" />
          ))}
        </g>
      ))}
    </g>
  );
}

export function Mug({ x, y, c = C.cream }: { x: number; y: number; c?: string }) {
  return (
    <g>
      <R x={x} y={y} w={4} h={5} c={C.ink} />
      <R x={x + 1} y={y + 1} w={2} h={3} c={c} />
      <R x={x + 4} y={y + 1} w={2} h={3} c={C.ink} />
      <R x={x + 4} y={y + 2} w={1} h={1} c={c} />
    </g>
  );
}
