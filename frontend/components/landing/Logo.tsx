import { PixelImage } from "@/components/pixel/PixelArt";
import { LOGO, PROP_PALETTE } from "@/components/pixel/props";
import { BRAND } from "./brand";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <PixelImage frame={LOGO} palette={PROP_PALETTE} className="h-7 w-7" />
      <span className={`text-[1.35rem] leading-none ${light ? "text-paper" : "text-ink"}`}>
        <span className="font-display font-medium tracking-[-0.04em] text-forest">{BRAND.lead}</span>
        <span className="font-condensed font-extrabold uppercase tracking-tight">{BRAND.word}</span>
      </span>
    </span>
  );
}
