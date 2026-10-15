import { DEFAULT_AVATAR, isAvatarId, type AvatarId } from "@/components/onboarding/avatars";
import { isFeatureId, type FeatureId } from "./features";
import { nameFromEmail } from "./game/seating";
import {
  DEFAULT_LAYOUT,
  DEFAULT_STYLE,
  LIMITS,
  PURPOSES,
  STYLES,
  TEAM_SIZES,
  isLayoutId,
  type LayoutId,
  type OnboardingData,
  type StyleId,
} from "@/components/onboarding/model";

/**
 * Normalized input for the office generator, derived from onboarding answers.
 * Field names mirror `OnboardingData` so nothing is renamed on the way in.
 *
 * `mode`:
 * - "create": built from the user's own create-workspace answers.
 * - "join":   joining can't be verified without a backend, so the office is a
 *             labelled preview — no workspace details are invented.
 * - "demo":   no onboarding data at all (e.g. `/office` opened directly).
 */
export interface OfficeConfig {
  mode: "create" | "join" | "demo";
  displayName: string;
  avatarId: AvatarId;
  workspaceName: string;
  workspaceDescription: string;
  workspaceStyle: StyleId;
  purpose: string;
  teamSize: string;
  /** Floor-plan template, from onboarding (`officeLayout`) or the office settings. */
  layout: LayoutId;
  /** Furniture ticked during onboarding; null (the demo) means everything the plan has. */
  features: FeatureId[] | null;
  /** First names of invited teammates (never their emails), who get the next desks. */
  teammates: string[];
}

const STORAGE_KEY = "pixel-office:onboarding";
/** Template/team size changed later in the office settings; overrides the onboarding answers. */
const PLAN_KEY = "pixel-office:plan";
const DEMO_NAME = "Demo office";

/**
 * Map any style value — ids, labels, or loose variants — to a supported style.
 * The single place where style strings are interpreted.
 */
export function normalizeStyle(value: unknown): StyleId {
  if (typeof value !== "string") return DEFAULT_STYLE;
  const v = value.toLowerCase().replace(/[^a-z]+/g, " ").trim();
  for (const s of STYLES) if (v === s.id.replace("-", " ") || v === s.label.toLowerCase()) return s.id;
  if (/green|cozy|cosy/.test(v)) return "cozy-green";
  if (/creative|studio/.test(v)) return "creative-studio";
  if (/quiet|minimal/.test(v)) return "quiet-minimal";
  if (/community|lounge|social/.test(v)) return "community-lounge";
  return DEFAULT_STYLE;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const oneOf = (v: unknown, list: readonly { id: string }[]) => (typeof v === "string" && list.some((o) => o.id === v) ? v : "");

/** Validate untrusted input (sessionStorage) into a config. Returns null if unusable. */
export function toOfficeConfig(raw: unknown): OfficeConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const mode = r.mode === "create" || r.mode === "join" ? r.mode : null;
  if (!mode) return null;
  const avatarId = typeof r.avatarId === "string" && isAvatarId(r.avatarId) ? r.avatarId : DEFAULT_AVATAR;
  const displayName = str(r.displayName, LIMITS.displayName) || "You";

  if (mode === "join") {
    return { ...demoConfig(), mode, displayName, avatarId };
  }
  return {
    mode,
    displayName,
    avatarId,
    workspaceName: str(r.workspaceName, LIMITS.workspaceName) || "My office",
    workspaceDescription: str(r.workspaceDescription, LIMITS.workspaceDescription),
    workspaceStyle: normalizeStyle(r.workspaceStyle),
    purpose: oneOf(r.purpose, PURPOSES),
    teamSize: oneOf(r.teamSize, TEAM_SIZES),
    layout: isLayoutId(r.officeLayout) ? r.officeLayout : DEFAULT_LAYOUT,
    features: Array.isArray(r.officeFeatures) ? r.officeFeatures.filter(isFeatureId) : null,
    teammates: Array.isArray(r.teammates) ? r.teammates.map((n) => str(n, 16)).filter(Boolean).slice(0, LIMITS.invitations) : [],
  };
}

export function demoConfig(): OfficeConfig {
  return {
    mode: "demo",
    displayName: "Guest",
    avatarId: DEFAULT_AVATAR,
    workspaceName: DEMO_NAME,
    workspaceDescription: "",
    workspaceStyle: DEFAULT_STYLE,
    purpose: "",
    teamSize: "2-5",
    layout: DEFAULT_LAYOUT,
    features: null,
    teammates: [],
  };
}

/**
 * Keep the answers the office needs for this tab only. Invitation emails and
 * codes are left out; only invitees' first names are kept, for desk nameplates.
 */
export function saveOnboarding(d: OnboardingData) {
  const keep =
    d.mode === "join"
      ? { mode: d.mode, displayName: d.displayName.trim(), avatarId: d.avatarId }
      : {
          mode: d.mode,
          displayName: d.displayName.trim(),
          avatarId: d.avatarId,
          workspaceName: d.workspaceName.trim(),
          workspaceDescription: d.workspaceDescription.trim(),
          purpose: d.purpose,
          teamSize: d.teamSize,
          workspaceStyle: d.workspaceStyle,
          officeLayout: d.officeLayout,
          officeFeatures: d.officeFeatures,
          teammates: d.invitationEmails.map(nameFromEmail),
        };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(keep));
    sessionStorage.removeItem(PLAN_KEY);
  } catch {
    // Storage blocked: the office falls back to the demo.
  }
}

/** The stored config, or the demo if nothing valid is stored. Client-only. */
export function loadOfficeConfig(): OfficeConfig {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const config = (raw && toOfficeConfig(JSON.parse(raw))) || demoConfig();
    const saved = JSON.parse(sessionStorage.getItem(PLAN_KEY) ?? "null") as { layout?: unknown; teamSize?: unknown } | null;
    if (!saved) return config;
    return {
      ...config,
      layout: isLayoutId(saved.layout) ? saved.layout : config.layout,
      teamSize: oneOf(saved.teamSize, TEAM_SIZES) || config.teamSize,
    };
  } catch {
    return demoConfig();
  }
}

/** Remember a template or team-size change made inside the office. */
export function savePlan(layout: LayoutId, teamSize: string) {
  try {
    sessionStorage.setItem(PLAN_KEY, JSON.stringify({ layout, teamSize }));
  } catch {
    // Storage blocked: the choice lasts until the page reloads.
  }
}

/** Stable key: the same answers always produce the same office. */
export const layoutKey = (c: OfficeConfig) => [c.layout, c.workspaceName.toLowerCase(), c.workspaceStyle, c.teamSize, c.purpose, c.features?.join(",") ?? "default"].join("|");
