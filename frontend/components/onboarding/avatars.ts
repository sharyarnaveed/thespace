import { chibiIdle, chibiWave, type ChibiSpec } from "@/components/pixel/chibi";
import { CAST, characterPalette, makeSprite, type Character, type Sprite } from "@/components/pixel/sprites";

/**
 * Selectable office buddies, drawn as chibi characters (see `pixel/chibi`).
 * `id` is stable and safe to persist; the same id renders the same buddy in
 * onboarding and in the office.
 */
export const AVATARS = [
  { id: "buddy-maya", name: "Maya", spec: { hair: "long" }, look: CAST.maya },
  { id: "buddy-theo", name: "Theo", spec: { hair: "short", extras: ["glasses"] }, look: CAST.theo },
  { id: "buddy-juno", name: "Juno", spec: { hair: "beanie" }, look: CAST.juno },
  { id: "buddy-sam", name: "Sam", spec: { hair: "bun" }, look: CAST.sam },
  { id: "buddy-ines", name: "Inès", spec: { hair: "curly" }, look: CAST.ines },
  { id: "buddy-rio", name: "Rio", spec: { hair: "spiky", extras: ["headphones"] }, look: { skin: "#6e4630", hair: "#e6c76a", top: "#6f877a", pants: "#2b2a22" } },
  { id: "buddy-pip", name: "Pip", spec: { hair: "pigtails", extras: ["bow"] }, look: { skin: "#f3d2b4", hair: "#d98a8a", top: "#a7b99b", pants: "#294b38", accent: "#e79a83" } },
  { id: "buddy-kai", name: "Kai", spec: { hair: "short", extras: ["beard"] }, look: { skin: "#8a5a40", hair: "#2b1f18", top: "#e6c76a", pants: "#4a4238" } },
  { id: "buddy-ada", name: "Ada", spec: { hair: "bob", extras: ["glasses"] }, look: { skin: "#f0c4a0", hair: "#5f9ea0", top: "#c98260", pants: "#3c4a3e" } },
  { id: "buddy-omar", name: "Omar", spec: { hair: "short", extras: ["tie"] }, look: { skin: "#c48a65", hair: "#231d18", top: "#f5f1e8", pants: "#3a3d36" } },
  { id: "buddy-lu", name: "Lu", spec: { hair: "bob", extras: ["headphones"] }, look: { skin: "#e8b48f", hair: "#1f1a17", top: "#294b38", pants: "#9fb3a6" } },
  { id: "buddy-gus", name: "Gus", spec: { hair: "bald", extras: ["beard", "glasses"] }, look: { skin: "#d9a27e", hair: "#e3dccb", top: "#9fb3a6", pants: "#4a3a2f" } },
] as const satisfies readonly { id: string; name: string; spec: ChibiSpec; look: Character }[];

export type Avatar = (typeof AVATARS)[number];
export type AvatarId = Avatar["id"];

export const DEFAULT_AVATAR: AvatarId = AVATARS[0].id;

export const isAvatarId = (id: string | undefined): id is AvatarId => AVATARS.some((a) => a.id === id);

export function avatarById(id: string | undefined): Avatar {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}

export const avatarIdle = (a: Avatar): Sprite => makeSprite(chibiIdle(a.spec), characterPalette(a.look), 2);
export const avatarWave = (a: Avatar): Sprite => makeSprite(chibiWave(a.spec), characterPalette(a.look), 5);
