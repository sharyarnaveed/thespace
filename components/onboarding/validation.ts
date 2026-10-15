import { LIMITS, type OnboardingData, type StepId } from "./model";

export type Errors = Partial<Record<keyof OnboardingData | "emailDraft", string>>;

/* ------------------------------------------------------------------ */
/* Invitation codes                                                    */
/* ------------------------------------------------------------------ */

/**
 * Invitation codes are 8 characters from an unambiguous alphabet (no 0/O,
 * 1/I/L), shown as two groups: `K7QF-MP3X`. They are case-insensitive, so the
 * canonical form is upper case. Spaces and dashes are presentation only.
 */
export const CODE_LENGTH = 8;
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_RE = new RegExp(`^[${CODE_ALPHABET}]{${CODE_LENGTH}}$`);
/** Longest raw input we keep, so a stray paste can't grow the field forever. */
const CODE_INPUT_MAX = 24;

/** Strip separators and upper-case: "k7qf mp3x" / "K7QF-MP3X" → "K7QFMP3X". */
export function normalizeCode(raw: string): string {
  return raw.replace(/[\s\-–—_.]/g, "").toUpperCase().slice(0, CODE_INPUT_MAX);
}

/** Display form with the dash after the first group: "K7QFMP3X" → "K7QF-MP3X". */
export function formatCode(normalized: string): string {
  return normalized.length > 4 ? `${normalized.slice(0, 4)}-${normalized.slice(4)}` : normalized;
}

export function codeError(normalized: string): string | undefined {
  if (!normalized) return "Enter the invitation code your teammate shared.";
  if (/[^A-Z0-9]/.test(normalized)) return "Codes only use letters and numbers.";
  if (/[01ILO]/.test(normalized)) return "Codes never use 0, O, 1, I or L — double-check those characters.";
  if (normalized.length !== CODE_LENGTH)
    return `Codes are ${CODE_LENGTH} characters long (you have ${normalized.length}).`;
  if (!CODE_RE.test(normalized)) return "That doesn't look like an invitation code.";
  return undefined;
}

/* ------------------------------------------------------------------ */
/* Emails                                                              */
/* ------------------------------------------------------------------ */

const EMAIL_RE = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]{2,}$/;

export const normalizeEmail = (e: string) => e.trim().toLowerCase();
export const isEmail = (e: string) => EMAIL_RE.test(e);

/** Split a pasted list ("a@x.com, b@y.com; c@z.com") into candidates. */
export const splitEmails = (raw: string) => raw.split(/[\s,;]+/).map(normalizeEmail).filter(Boolean);

/**
 * Try to add every address in `raw` to `existing`.
 * Returns the new list plus an error describing anything that was rejected.
 */
export function addEmails(existing: string[], raw: string): { list: string[]; error?: string; rejected: string } {
  const list = [...existing];
  const bad: string[] = [];
  const dupes: string[] = [];
  for (const email of splitEmails(raw)) {
    if (!isEmail(email)) bad.push(email);
    else if (list.includes(email)) dupes.push(email);
    else if (list.length >= LIMITS.invitations) bad.push(email);
    else list.push(email);
  }
  let error: string | undefined;
  if (bad.length && list.length >= LIMITS.invitations) error = `You can invite up to ${LIMITS.invitations} people for now.`;
  else if (bad.length) error = bad.length === 1 ? `“${bad[0]}” doesn't look like an email address.` : `${bad.length} entries don't look like email addresses.`;
  else if (dupes.length) error = dupes.length === 1 ? `${dupes[0]} is already on the list.` : "Those addresses are already on the list.";
  return { list, error, rejected: bad.join(", ") };
}

/* ------------------------------------------------------------------ */
/* Per-step validation                                                 */
/* ------------------------------------------------------------------ */

function nameError(value: string, max: number, empty: string): string | undefined {
  const v = value.trim();
  if (!v) return empty;
  if (v.length > max) return `Keep it to ${max} characters or fewer.`;
  return undefined;
}

/** Validate only the fields owned by `step`. Steps not listed have nothing required. */
export function validateStep(step: StepId, d: OnboardingData): Errors {
  const e: Errors = {};
  switch (step) {
    case "identity": {
      const err = nameError(d.displayName, LIMITS.displayName, "Tell us what to put on your name tag.");
      if (err) e.displayName = err;
      break;
    }
    case "workspace": {
      const err = nameError(d.workspaceName, LIMITS.workspaceName, "Your office needs a name on the door.");
      if (err) e.workspaceName = err;
      if (d.workspaceDescription.trim().length > LIMITS.workspaceDescription)
        e.workspaceDescription = `Keep it to ${LIMITS.workspaceDescription} characters or fewer.`;
      break;
    }
    case "purpose":
      if (!d.purpose) e.purpose = "Pick what the office is for.";
      if (!d.teamSize) e.teamSize = "Pick a rough team size — you can change it later.";
      break;
    case "style":
      if (!d.workspaceStyle) e.workspaceStyle = "Pick a style for your office.";
      break;
    case "layout":
      if (!d.officeLayout) e.officeLayout = "Pick a floor plan.";
      break;
    case "avatar":
      if (!d.avatarId) e.avatarId = "Pick an office buddy.";
      break;
    case "code": {
      const err = codeError(d.invitationCode);
      if (err) e.invitationCode = err;
      break;
    }
  }
  return e;
}

export const hasErrors = (e: Errors) => Object.values(e).some(Boolean);
