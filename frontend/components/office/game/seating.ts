import { Px } from "@/components/pixel/painter";
import { GLYPH_H, textFrame } from "@/components/pixel/font";
import type { Frame } from "@/components/pixel/grid";
import type { OfficeConfig } from "../config";
import type { Interaction } from "./interactions";

/**
 * Who sits where. Desk 1 is always the player's; the next desks are saved for
 * the teammates invited during onboarding (first names only); the rest are open.
 * There is no backend, so invited teammates never actually show up yet.
 */
export type Seat =
  | { desk: number; kind: "mine"; name: string }
  | { desk: number; kind: "invited"; name: string }
  | { desk: number; kind: "open" };

/** `index` is 0-based; desks are numbered from 1. */
export function seatFor(config: OfficeConfig, index: number): Seat {
  const desk = index + 1;
  if (index === 0) return { desk, kind: "mine", name: config.displayName };
  const name = config.teammates[index - 1];
  return name ? { desk, kind: "invited", name } : { desk, kind: "open" };
}

export function seatLabel(seat: Seat) {
  if (seat.kind === "mine") return `${seat.name} (you)`;
  if (seat.kind === "invited") return `${seat.name} (invited)`;
  return "Open";
}

/** What walking up to a desk says. */
export function seatInteraction(seat: Seat): Interaction {
  if (seat.kind === "mine") return { action: "desk", prompt: "Your desk" };
  if (seat.kind === "invited") {
    return {
      action: "flavor",
      prompt: `${seat.name}’s desk`,
      flavor: `Saved for ${seat.name}. They’ll sit here once they join — invites go out when the backend is connected.`,
    };
  }
  return { action: "flavor", prompt: `Open desk ${seat.desk}`, flavor: "Nobody sits here yet. The next teammate to join gets this desk." };
}

const STAR: Frame = ["..k..", ".kkk.", "kkkkk", ".kkk.", ".k.k."];
const MAX_CHARS = 8;

/** Desk nameplate: gold with a star for you, sage for invited teammates, pale for open desks. */
export function plateFrame(seat: Seat): Frame {
  const raw = seat.kind === "open" ? `Open ${seat.desk}` : seat.name;
  const text = textFrame(raw.length > MAX_CHARS ? raw.slice(0, MAX_CHARS - 1) + "." : raw, seat.kind === "open" ? "A" : "k");
  const icon = seat.kind === "mine" ? STAR : null;
  const tw = text[0].length + (icon ? 6 : 0);
  const p = new Px(tw + 6, GLYPH_H + 4).box(0, 0, tw + 6, GLYPH_H + 4, seat.kind === "mine" ? "y" : seat.kind === "invited" ? "v" : "m");
  if (icon) p.stamp(icon, 3, 2);
  return p.stamp(text, icon ? 9 : 3, 2).frame();
}

/** Turn an invitation email into a friendly first name: "sam.lee@x.co" → "Sam". */
export function nameFromEmail(email: string) {
  const first = email.split("@")[0].split(/[._+-]/)[0].replace(/\d+$/, "").replace(/[^\p{L}\d]/gu, "");
  return /\p{L}/u.test(first) ? first[0].toUpperCase() + first.slice(1, 16).toLowerCase() : "Teammate";
}
