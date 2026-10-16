import type { LayoutId, StyleId, TeamSizeId } from "@/components/onboarding/model";
import type { Palette } from "@/components/pixel/grid";
import type { OfficeConfig } from "../../config";
import type { Builder, Floor, PlanShape } from "../builder";
import { THEMES } from "../themes";
import { classic } from "./classic";
import { gardenCafe } from "./gardenCafe";
import { home } from "./home";
import { loft } from "./loft";
import { openPlan } from "./openPlan";
import { studyHouse } from "./studyHouse";

export interface Plan extends PlanShape {
  build(b: Builder, config: OfficeConfig): { spawn: { tx: number; ty: number } };
}

/**
 * An office template: one floor plan per team size (different rooms, room
 * sizes and furniture), plus `palettes` that recolour it per workspace style
 * on top of the style's own colours. The style still drives decorations.
 */
export interface LayoutDef {
  id: LayoutId;
  /** Floor used wherever a room doesn't set its own. */
  base: Floor;
  /** Brick wall faces instead of painted ones. */
  brick?: boolean;
  palettes?: Record<StyleId, Palette>;
  plans: Record<TeamSizeId, Plan>;
}

/** The 44×31 full plan, stretched for the two largest team sizes. */
export function fullPlans(split: { x: number; y: number }, build: Plan["build"]): Pick<Record<TeamSizeId, Plan>, "16-50" | "50+"> {
  return {
    "16-50": { w: 44, h: 31, split, dx: 8, dy: 5, build },
    "50+": { w: 44, h: 31, split, dx: 16, dy: 10, build },
  };
}

/**
 * One 24×16 plan for every team size: bigger teams stretch it at `split`,
 * which grows the room the split runs through (the desks) and the rooms beside it.
 */
export function stretchedPlans(split: { x: number; y: number }, build: Plan["build"]): Record<TeamSizeId, Plan> {
  const plan = (dx: number, dy: number): Plan => ({ w: 24, h: 16, split, dx, dy, build });
  return { solo: plan(0, 0), "2-5": plan(6, 3), "6-15": plan(12, 7), "16-50": plan(20, 11), "50+": plan(28, 15) };
}

const LAYOUT_DEFS: Record<LayoutId, LayoutDef> = {
  classic,
  "open-plan": openPlan,
  loft,
  home,
  "study-house": studyHouse,
  "garden-cafe": gardenCafe,
};

export const layoutDef = (id: LayoutId) => LAYOUT_DEFS[id] ?? classic;

/** A few key colours (floor, wall, sofa, rug) of a template in a style, for previews. */
export function swatch(layout: LayoutId, style: StyleId): string[] {
  const p = { ...THEMES[style].palette, ...layoutDef(layout).palettes?.[style] };
  return ["1", "4", "F", "R"].map((k) => p[k]);
}
