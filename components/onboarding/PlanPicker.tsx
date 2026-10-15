"use client";

import { swatch } from "@/components/office/game/layouts";
import { LAYOUTS, TEAM_SIZES, isLayoutId, tierOf, type LayoutId, type StyleId } from "./model";

const card = (checked: boolean) =>
  `flex cursor-pointer items-center gap-3 border-2 border-ink px-3 py-2.5 transition-[background-color,transform] duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-dashed has-[:focus-visible]:outline-forest ${
    checked ? "-translate-y-0.5 bg-sun shadow-pixel-sm" : "bg-paper-light hover:bg-paper-deep"
  }`;

/**
 * Floor-plan template (with colour chips for the chosen style). The office's
 * size and architecture follow the team size; pass `onTeamSize` to let it be
 * changed here too.
 */
export function PlanPicker({
  layout,
  style,
  teamSize,
  onLayout,
  onTeamSize,
  recommended,
}: {
  layout: string;
  style: StyleId;
  teamSize: string;
  onLayout: (layout: LayoutId) => void;
  onTeamSize?: (teamSize: string) => void;
  /** Template made for the chosen purpose, shown with a badge. */
  recommended?: { layout: LayoutId; purpose: string };
}) {
  const current = isLayoutId(layout) ? layout : LAYOUTS[0].id;
  const tier = tierOf(teamSize);
  return (
    <div className="flex flex-col gap-5">
      <fieldset>
        <legend className="mb-2.5 text-sm font-semibold text-ink">Office template</legend>
        <div className="flex flex-col gap-2">
          {LAYOUTS.map((o) => (
            <label key={o.id} className={card(o.id === current)}>
              <input type="radio" name="officeLayout" className="sr-only" checked={o.id === current} onChange={() => onLayout(o.id)} />
              <span aria-hidden className="grid shrink-0 grid-cols-2 border-2 border-ink">
                {swatch(o.id, style).map((c, i) => (
                  <span key={i} className="size-3.5" style={{ background: c }} />
                ))}
              </span>
              <span>
                <span className="block font-semibold text-ink">
                  {o.label}
                  {recommended?.layout === o.id && (
                    <span className="ml-2 border border-ink bg-sage/60 px-1.5 py-0.5 font-mono text-[0.65rem] font-normal uppercase tracking-wide">
                      Made for {recommended.purpose.toLowerCase()}
                    </span>
                  )}
                </span>
                <span className="block text-xs text-ink/70">{o.blurb}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {onTeamSize && (
        <fieldset>
          <legend className="mb-2.5 text-sm font-semibold text-ink">Team size</legend>
          <div className="flex flex-wrap gap-2">
            {TEAM_SIZES.map((o) => (
              <label key={o.id} className={`${card(o.id === teamSize)} py-1.5`}>
                <input type="radio" name="teamSize" className="sr-only" checked={o.id === teamSize} onChange={() => onTeamSize(o.id)} />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <p className="border-2 border-dashed border-ink/40 bg-sage/30 px-3 py-2 text-sm text-ink/80" aria-live="polite">
        Sized for your team: <strong className="text-ink">{tier.label}</strong> with {tier.desks} desks. Smaller teams get
        smaller rooms and a different floor plan.
      </p>
    </div>
  );
}
