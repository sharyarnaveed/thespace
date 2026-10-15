import type { CreatePayload, JoinPayload } from "./model";

/**
 * Service boundary for onboarding. There is no backend yet, so every call
 * resolves to `backend-unavailable` — nothing is persisted, verified or sent,
 * and no call ever reports a fake success.
 *
 * When the backend lands, these should hit real endpoints that:
 * - generate invitation codes with a CSPRNG and bind each to one workspace,
 * - support expiry and revocation, and rate-limit code verification,
 * - reveal workspace details only after a code is verified,
 * - enforce membership permissions for private workspaces,
 * - create memberships atomically (no duplicates on retry).
 */

export type ServiceResult<T> = { ok: true; data: T } | { ok: false; error: "backend-unavailable"; message: string };

export type WorkspacePreview = {
  workspaceId: string;
  name: string;
  iconUrl?: string;
  invitedBy?: string;
  organization?: string;
};

const unavailable = (what: string): ServiceResult<never> => ({
  ok: false,
  error: "backend-unavailable",
  message: `${what} isn't available yet — the backend hasn’t been connected.`,
});

export async function createWorkspace(payload: CreatePayload): Promise<ServiceResult<{ workspaceId: string }>> {
  void payload;
  return unavailable("Creating a workspace");
}

/** `code` must already be normalized (see `normalizeCode`). */
export async function validateInvitationCode(code: string): Promise<ServiceResult<WorkspacePreview>> {
  void code;
  return unavailable("Checking invitation codes");
}

export async function joinWorkspace(payload: JoinPayload): Promise<ServiceResult<{ workspaceId: string }>> {
  void payload;
  return unavailable("Joining a workspace");
}

export async function sendInvitations(workspaceId: string, emails: string[]): Promise<ServiceResult<{ sent: number }>> {
  void workspaceId;
  void emails;
  return unavailable("Sending invitations");
}
