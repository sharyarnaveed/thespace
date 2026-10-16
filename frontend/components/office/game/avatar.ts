import { avatarById } from "@/components/onboarding/avatars";
import { CHIBI_H, CHIBI_W, chibiSit, chibiWalk, type Facing } from "@/components/pixel/chibi";
import type { Frame, Palette } from "@/components/pixel/grid";
import { characterPalette } from "@/components/pixel/sprites";

/**
 * The player's sprite frames: the same chibi buddy picked in onboarding, with
 * idle + four walk frames per facing. Left is the side view mirrored.
 */
export type { Facing };
export const AVATAR_W = CHIBI_W;
export const AVATAR_H = CHIBI_H;

export function avatarFrames(avatarId: string): { palette: Palette; frames: Record<Facing, Frame[]>; sit: Frame[] } {
  const a = avatarById(avatarId);
  return { palette: characterPalette(a.look), frames: chibiWalk(a.spec), sit: chibiSit(a.spec) };
}
