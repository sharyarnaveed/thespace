/**
 * What each interactive object does. A few open React panels; the rest show a
 * short line of flavour text.
 */
export type InteractionAction = "desk" | "workspace" | "coffee" | "meeting" | "break" | "music" | "flavor";

export interface Interaction {
  action: InteractionAction;
  prompt: string;
  flavor?: string;
}

export const INTERACTIONS = {
  "my-desk": { action: "desk", prompt: "Your desk" },
  desk: { action: "flavor", prompt: "Empty desk", flavor: "An empty desk, ready for a future teammate." },
  "quiet-desk": { action: "flavor", prompt: "Quiet desk", flavor: "Heads-down time. Nothing is buzzing in here." },
  workspace: { action: "workspace", prompt: "Check your workspace" },
  coffee: { action: "coffee", prompt: "Make a coffee" },
  meeting: { action: "meeting", prompt: "Use the meeting room" },
  "call-booth": { action: "meeting", prompt: "Take a call" },
  sofa: { action: "break", prompt: "Take a break" },
  "record-player": { action: "music", prompt: "Play a record" },
  plant: { action: "flavor", prompt: "Admire the plant", flavor: "The leaves look great. Someone has been watering them." },
  cat: { action: "flavor", prompt: "Pet the office cat", flavor: "Purrr. The office cat approves of your work today." },
  fridge: { action: "flavor", prompt: "Open the fridge", flavor: "Oat milk, three yoghurts and a lunch labelled “do not eat”." },
  "water-cooler": { action: "flavor", prompt: "Grab some water", flavor: "Glug glug. A good hydration break." },
  bookshelf: { action: "flavor", prompt: "Browse the shelf", flavor: "Design books, a well-worn atlas and one very old cookbook." },
  bed: { action: "flavor", prompt: "Look at the bed", flavor: "Very tempting. A power nap can wait until after this task." },
  fireplace: { action: "flavor", prompt: "Warm up by the fire", flavor: "The fire crackles. Toasty hands, happy brain." },
  copier: { action: "flavor", prompt: "Use the copier", flavor: "It whirs, blinks and prints nothing. Classic copier." },
  "notice-board": { action: "flavor", prompt: "Read the notice board", flavor: "“Welcome to the office!” and an empty lunch sign-up sheet." },
} satisfies Record<string, Interaction>;

export type InteractionId = keyof typeof INTERACTIONS;
