/**
 * Onboarding data model, option lists and the per-branch step definitions.
 * Kept free of React so the same rules can be reused by the preview route
 * (and, later, mirrored by the backend).
 */

import type { FeatureId } from "@/components/office/features";

export type OnboardingMode = "create" | "join";

export interface OnboardingData {
  mode: OnboardingMode | null;

  displayName: string;
  avatarId: string;

  // Create-workspace fields
  workspaceName: string;
  workspaceDescription: string;
  purpose: string;
  teamSize: string;
  workspaceStyle: string;
  officeLayout: string;
  /** Furniture the user ticked; only these are placed. */
  officeFeatures: FeatureId[];
  invitationEmails: string[];

  // Join-workspace fields
  invitationCode: string;
}

export const LIMITS = {
  displayName: 32,
  workspaceName: 40,
  workspaceDescription: 140,
  invitations: 25,
} as const;

export const PURPOSES = [
  { id: "remote-team", label: "Remote team" },
  { id: "startup", label: "Startup" },
  { id: "freelance", label: "Freelance workspace" },
  { id: "study-group", label: "Study group" },
  { id: "personal", label: "Personal workspace" },
  { id: "exploring", label: "Just exploring" },
] as const;

export const TEAM_SIZES = [
  { id: "solo", label: "Just me for now" },
  { id: "2-5", label: "2–5 people" },
  { id: "6-15", label: "6–15 people" },
  { id: "16-50", label: "16–50 people" },
  { id: "50+", label: "More than 50 people" },
] as const;

export const STYLES = [
  { id: "cozy-green", label: "Cozy and green", blurb: "Plants on every sill, warm wood and soft light." },
  { id: "creative-studio", label: "Creative studio", blurb: "Whiteboards, sticky notes and string lights." },
  { id: "quiet-minimal", label: "Quiet and minimal", blurb: "Clean desks, a clock and room to think." },
  { id: "community-lounge", label: "Community lounge", blurb: "A big sofa, a record player, coffee on." },
] as const;

export type StyleId = (typeof STYLES)[number]["id"];
export const DEFAULT_STYLE: StyleId = "cozy-green";

/** Floor plans. Each is recoloured by the chosen style. */
export const LAYOUTS = [
  { id: "classic", label: "Classic", blurb: "Cosy rooms around a hallway, with a lounge and a quiet room." },
  { id: "open-plan", label: "Open plan", blurb: "Cubicle pods, glass partitions, sofas on rugs and a copier." },
  { id: "loft", label: "Loft", blurb: "Brick walls, concrete floors, a kitchen island and phone booths." },
  { id: "home", label: "Home", blurb: "A bedroom, a home office, a kitchen and a living room by the fire." },
  { id: "study-house", label: "Study house", blurb: "A library, a study hall, a group room and a cosy common room." },
  { id: "garden-cafe", label: "Garden café", blurb: "A café, a grassy garden with picnic tables and a little greenhouse." },
] as const;

export type LayoutId = (typeof LAYOUTS)[number]["id"];
export const DEFAULT_LAYOUT: LayoutId = "classic";
export const isLayoutId = (id: unknown): id is LayoutId => LAYOUTS.some((l) => l.id === id);

/** Each purpose gets its own kind of building; picking a purpose preselects it. */
export const PURPOSE_LAYOUT: Record<(typeof PURPOSES)[number]["id"], LayoutId> = {
  "remote-team": "classic",
  startup: "open-plan",
  freelance: "loft",
  "study-group": "study-house",
  personal: "home",
  exploring: "garden-cafe",
};
export const layoutForPurpose = (purpose: string) => PURPOSE_LAYOUT[purpose as keyof typeof PURPOSE_LAYOUT] ?? DEFAULT_LAYOUT;

/**
 * The office is sized for the team: each team size gets its own floor plan
 * (room sizes, which rooms exist, furniture placement) and desk count.
 */
export const OFFICE_TIERS = {
  solo: { label: "Studio", desks: 2 },
  "2-5": { label: "Small office", desks: 4 },
  "6-15": { label: "Medium office", desks: 8 },
  "16-50": { label: "Large office", desks: 12 },
  "50+": { label: "Big office", desks: 16 },
} as const;

export type TeamSizeId = keyof typeof OFFICE_TIERS;
export const DEFAULT_TEAM_SIZE: TeamSizeId = "2-5";
export const isTeamSizeId = (id: unknown): id is TeamSizeId => typeof id === "string" && id in OFFICE_TIERS;
export const tierOf = (teamSize: string) => OFFICE_TIERS[isTeamSizeId(teamSize) ? teamSize : DEFAULT_TEAM_SIZE];

export const labelOf = (list: readonly { id: string; label: string }[], id: string) =>
  list.find((o) => o.id === id)?.label;

export const isStyleId = (id: string | undefined): id is StyleId => STYLES.some((s) => s.id === id);

/* ------------------------------------------------------------------ */
/* Steps                                                               */
/* ------------------------------------------------------------------ */

export const CREATE_STEPS = [
  { id: "identity", label: "You" },
  { id: "workspace", label: "Office" },
  { id: "purpose", label: "Purpose" },
  { id: "style", label: "Style" },
  { id: "layout", label: "Layout" },
  { id: "avatar", label: "Avatar" },
  { id: "invite", label: "Invite" },
  { id: "review", label: "Review" },
] as const;

export const JOIN_STEPS = [
  { id: "code", label: "Code" },
  { id: "identity", label: "You" },
  { id: "confirm", label: "Confirm" },
] as const;

export type CreateStepId = (typeof CREATE_STEPS)[number]["id"];
export type JoinStepId = (typeof JOIN_STEPS)[number]["id"];
export type StepId = CreateStepId | JoinStepId;

export const stepsFor = (mode: OnboardingMode) => (mode === "create" ? CREATE_STEPS : JOIN_STEPS);

/* ------------------------------------------------------------------ */
/* Initial state & branch isolation                                    */
/* ------------------------------------------------------------------ */

export const CREATE_FIELDS = {
  workspaceName: "",
  workspaceDescription: "",
  purpose: "",
  teamSize: "",
  workspaceStyle: DEFAULT_STYLE as string,
  officeLayout: DEFAULT_LAYOUT as string,
  officeFeatures: [] as FeatureId[],
  invitationEmails: [] as string[],
};

export const JOIN_FIELDS = { invitationCode: "" };

export function initialData(defaultAvatar: string): OnboardingData {
  return { mode: null, displayName: "", avatarId: defaultAvatar, ...CREATE_FIELDS, ...JOIN_FIELDS };
}

/** What a create submission is allowed to carry — never the invitation code. */
export type CreatePayload = Pick<
  OnboardingData,
  | "displayName"
  | "avatarId"
  | "workspaceName"
  | "workspaceDescription"
  | "purpose"
  | "teamSize"
  | "workspaceStyle"
  | "officeLayout"
  | "officeFeatures"
  | "invitationEmails"
>;

/** What a join submission is allowed to carry — never workspace settings. */
export type JoinPayload = Pick<OnboardingData, "displayName" | "avatarId" | "invitationCode">;

export function toCreatePayload(d: OnboardingData): CreatePayload {
  return {
    displayName: d.displayName.trim(),
    avatarId: d.avatarId,
    workspaceName: d.workspaceName.trim(),
    workspaceDescription: d.workspaceDescription.trim(),
    purpose: d.purpose,
    teamSize: d.teamSize,
    workspaceStyle: d.workspaceStyle,
    officeLayout: d.officeLayout,
    officeFeatures: [...d.officeFeatures],
    invitationEmails: [...d.invitationEmails],
  };
}

export function toJoinPayload(d: OnboardingData): JoinPayload {
  return { displayName: d.displayName.trim(), avatarId: d.avatarId, invitationCode: d.invitationCode };
}
