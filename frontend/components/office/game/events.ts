import type { Interaction, InteractionId } from "./interactions";

/**
 * Typed bridge between the Phaser scene and the React HUD. Neither side
 * imports the other; they only share this bus. High-frequency data (the
 * player's screen position) goes through `onAnchor` and is written straight
 * to the DOM, never through React state.
 */
export interface GameEvents {
  /** Game → UI */
  ready: void;
  prompt: { id: InteractionId; interaction: Interaction } | null;
  room: string;
  interact: { id: InteractionId; interaction: Interaction };
  /** The player got up from a seat by moving. */
  stood: void;
  /** UI → game */
  "request-interact": void;
  "set-paused": boolean;
  "set-minimap": boolean;
  /** Focusing sits the player at their desk; Available gets them up. */
  "set-status": PlayerStatus;
}

export type PlayerStatus = "available" | "focusing" | "break";

type Handler<T> = (payload: T) => void;

export class GameBus {
  private handlers = new Map<keyof GameEvents, Set<Handler<never>>>();

  /** Called every frame with the player's head position in canvas pixels. */
  onAnchor: ((x: number, y: number) => void) | null = null;

  setAnchor(fn: ((x: number, y: number) => void) | null) {
    this.onAnchor = fn;
  }

  on<K extends keyof GameEvents>(type: K, fn: Handler<GameEvents[K]>) {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type)!.add(fn as Handler<never>);
    return () => void this.handlers.get(type)?.delete(fn as Handler<never>);
  }

  emit<K extends keyof GameEvents>(type: K, ...payload: GameEvents[K] extends void ? [] : [GameEvents[K]]) {
    this.handlers.get(type)?.forEach((fn) => (fn as Handler<unknown>)(payload[0]));
  }
}
