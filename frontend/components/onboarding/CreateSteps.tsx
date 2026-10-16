"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { ErrorText, Field } from "@/components/auth/fields";
import { AvatarPicker } from "./AvatarPicker";
import { avatarById } from "./avatars";
import { useOb, useStepFocus } from "./context";
import { OfficePreview } from "./illustrations";
import { demoConfig, saveOnboarding } from "@/components/office/config";
import { ALL_FEATURES, FEATURES, featureOf, type FeatureId } from "@/components/office/features";
import { generateOffice } from "@/components/office/game/map";
import { DEFAULT_LAYOUT, DEFAULT_STYLE, LAYOUTS, isLayoutId, layoutForPurpose, LIMITS, PURPOSES, STYLES, TEAM_SIZES, isStyleId, labelOf, type CreateStepId } from "./model";
import { PlanPicker } from "./PlanPicker";
import { BackButton, DemoNotice, OptionGroup, PrimaryButton, SecondaryButton, StepHeading, TextArea } from "./ui";
import { addEmails } from "./validation";

/** Shared frame: heading, body, Back + primary action. Enter submits the step. */
export function StepFrame({
  eyebrow,
  title,
  intro,
  children,
  aside,
  primary = "Continue",
  onSubmit,
  secondary,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  /** Optional right-hand column (previews). */
  aside?: ReactNode;
  primary?: ReactNode;
  /** Defaults to validating the step and moving on. */
  onSubmit?: () => void;
  secondary?: ReactNode;
}) {
  const ob = useOb();
  const heading = useStepFocus<HTMLHeadingElement>();
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
    else ob.next();
  };
  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-8">
      <div className={aside ? "grid items-start gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-10" : ""}>
        <div className="flex flex-col gap-6">
          <StepHeading ref={heading} eyebrow={eyebrow} title={title}>
            {intro}
          </StepHeading>
          {children}
        </div>
        {aside && <div className="lg:sticky lg:top-6">{aside}</div>}
      </div>
      <div className="flex flex-col-reverse gap-3 border-t-2 border-dashed border-ink/20 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <BackButton onClick={ob.back} />
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
          {secondary}
          <PrimaryButton type="submit">{primary}</PrimaryButton>
        </div>
      </div>
    </form>
  );
}

function PreviewFrame({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="border-2 border-ink bg-paper-light shadow-[6px_6px_0_0_var(--color-ink)]">
      {children}
      <figcaption className="border-t-2 border-ink bg-forest px-3 py-2 font-pixel text-[0.65rem] uppercase tracking-widest text-sun">
        ● {caption}
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */

export function IdentityStep({ join = false }: { join?: boolean }) {
  const { data, errors, set } = useOb();
  return (
    <StepFrame
      eyebrow={join ? "Joining" : "Welcome"}
      title={join ? "What should your teammates call you?" : "What should we call you?"}
      intro={<p>Your name appears above your avatar and on your desk, so teammates know who’s who.</p>}
      aside={
        join ? undefined : (
          <PreviewFrame caption="Your desk, so far">
            <OfficePreview avatarId={data.avatarId} displayName={data.displayName || "You"} workspaceName={data.workspaceName} />
          </PreviewFrame>
        )
      }
    >
      <Field
        id="displayName"
        label="Display name"
        autoComplete="nickname"
        placeholder="e.g. Maya"
        maxLength={LIMITS.displayName}
        value={data.displayName}
        onChange={(e) => set({ displayName: e.target.value })}
        error={errors.displayName}
      />
      {join && (
        <AvatarPicker
          legend="Pick your little office buddy (optional — you can change it later)"
          value={data.avatarId}
          onChange={(avatarId) => set({ avatarId })}
          compact
        />
      )}
    </StepFrame>
  );
}

function WorkspaceStep() {
  const { data, errors, set } = useOb();
  const style = isStyleId(data.workspaceStyle) ? data.workspaceStyle : undefined;
  return (
    <StepFrame
      eyebrow="Your office"
      title="What shall we call your office?"
      intro={<p>This goes on the sign by the door. You can rename it later.</p>}
      aside={
        <PreviewFrame caption="Live preview">
          <OfficePreview style={style} workspaceName={data.workspaceName} avatarId={data.avatarId} displayName={data.displayName} />
        </PreviewFrame>
      }
    >
      <Field
        id="workspaceName"
        label="Workspace name"
        placeholder="e.g. The Greenhouse"
        maxLength={LIMITS.workspaceName}
        value={data.workspaceName}
        onChange={(e) => set({ workspaceName: e.target.value })}
        error={errors.workspaceName}
      />
      <TextArea
        id="workspaceDescription"
        label="Short description (optional)"
        placeholder="A calm corner for the design team."
        maxLength={LIMITS.workspaceDescription}
        value={data.workspaceDescription}
        onChange={(workspaceDescription) => set({ workspaceDescription })}
        error={errors.workspaceDescription}
      />
    </StepFrame>
  );
}

function PurposeStep() {
  const { data, errors, set } = useOb();
  return (
    <StepFrame
      eyebrow="Purpose"
      title="Who’s this office for?"
      intro={<p>This helps us suggest rooms and defaults. Pick one of each.</p>}
    >
      <OptionGroup
        name="purpose"
        legend="What is the workspace for?"
        options={PURPOSES}
        value={data.purpose}
        onChange={(purpose) => set({ purpose, officeLayout: layoutForPurpose(purpose) })}
        error={errors.purpose}
        columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      />
      <OptionGroup
        name="teamSize"
        legend="Roughly how many people will use it?"
        options={TEAM_SIZES}
        value={data.teamSize}
        onChange={(teamSize) => set({ teamSize })}
        error={errors.teamSize}
        columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      />
    </StepFrame>
  );
}

function StyleStep() {
  const { data, errors, set } = useOb();
  const style = isStyleId(data.workspaceStyle) ? data.workspaceStyle : undefined;
  return (
    <StepFrame
      eyebrow="Style"
      title="What kind of place feels right?"
      intro={<p>Pick a starting look. Furniture can be moved around once you’re in.</p>}
      aside={
        <PreviewFrame caption={labelOf(STYLES, data.workspaceStyle) ?? "Preview"}>
          <OfficePreview style={style} workspaceName={data.workspaceName} avatarId={data.avatarId} displayName={data.displayName} />
        </PreviewFrame>
      }
    >
      <OptionGroup
        name="workspaceStyle"
        legend="Office style"
        options={STYLES}
        value={data.workspaceStyle}
        onChange={(workspaceStyle) => set({ workspaceStyle })}
        error={errors.workspaceStyle}
        columns="grid-cols-1"
      />
    </StepFrame>
  );
}

function LayoutStep() {
  const { data, set } = useOb();
  const style = isStyleId(data.workspaceStyle) ? data.workspaceStyle : DEFAULT_STYLE;
  const purposeLabel = labelOf(PURPOSES, data.purpose);
  return (
    <StepFrame
      eyebrow="Layout"
      title="Pick an office template."
      intro={<p>We picked the building made for your purpose — switch if another feels better. Rooms are sized for your team.</p>}
    >
      <PlanPicker
        layout={data.officeLayout}
        style={style}
        teamSize={data.teamSize}
        onLayout={(officeLayout) => set({ officeLayout })}
        recommended={purposeLabel ? { layout: layoutForPurpose(data.purpose), purpose: purposeLabel } : undefined}
      />
      <FeaturePicker />
    </StepFrame>
  );
}

function FeaturePicker() {
  const { data, set } = useOb();
  // Only offer what this building has room for (e.g. a bed only at home).
  const available = useMemo(() => {
    const config = { ...demoConfig(), layout: isLayoutId(data.officeLayout) ? data.officeLayout : DEFAULT_LAYOUT, teamSize: data.teamSize, features: ALL_FEATURES };
    const present = new Set(generateOffice(config).objects.map((o) => featureOf(o.kind)));
    return FEATURES.filter((f) => present.has(f.id));
  }, [data.officeLayout, data.teamSize]);
  const ticked = data.officeFeatures;
  const toggle = (id: FeatureId) => set({ officeFeatures: ticked.includes(id) ? ticked.filter((f) => f !== id) : [...ticked, id] });
  const allOn = available.every((f) => ticked.includes(f.id));

  return (
    <fieldset>
      <legend className="mb-2.5 flex w-full items-center justify-between text-sm font-semibold text-ink">
        What do you want in your office?
        <button
          type="button"
          onClick={() => set({ officeFeatures: allOn ? [] : available.map((f) => f.id) })}
          className="font-mono text-xs font-normal uppercase tracking-wide text-forest underline underline-offset-2"
        >
          {allOn ? "Clear all" : "Tick all"}
        </button>
      </legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {available.map((f) => (
          <label
            key={f.id}
            className="flex cursor-pointer items-center gap-3 border-2 border-ink bg-paper-light px-3 py-2 text-sm font-medium text-ink has-[:checked]:bg-sage/60 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-dashed has-[:focus-visible]:outline-forest"
          >
            <input type="checkbox" className="size-4 accent-forest" checked={ticked.includes(f.id)} onChange={() => toggle(f.id)} />
            {f.label}
          </label>
        ))}
      </div>
      <p className="mt-1.5 text-xs text-muted">Only what you tick is placed. Leave everything unticked for an empty building.</p>
    </fieldset>
  );
}

function AvatarStep() {
  const { data, set } = useOb();
  return (
    <StepFrame
      eyebrow="Avatar"
      title="Pick your little office buddy."
      intro={<p>This is how teammates will see you walking around the office.</p>}
    >
      <AvatarPicker legend="Choose an avatar" value={data.avatarId} onChange={(avatarId) => set({ avatarId })} />
    </StepFrame>
  );
}

function InviteStep() {
  const ob = useOb();
  const { data, set } = ob;
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string>();

  const add = (): boolean => {
    if (!draft.trim()) return true;
    const { list, error: err, rejected } = addEmails(data.invitationEmails, draft);
    set({ invitationEmails: list });
    // keep anything we couldn't add in the box so it can be fixed
    setDraft(rejected);
    setError(err);
    return !rejected;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    }
  };

  const remove = (email: string) => set({ invitationEmails: data.invitationEmails.filter((x) => x !== email) });

  const skip = () => {
    setDraft("");
    setError(undefined);
    set({ invitationEmails: [] });
    ob.next();
  };

  const count = data.invitationEmails.length;
  const empty = count === 0 && !draft.trim();

  return (
    <StepFrame
      eyebrow="Invite"
      title="Who’s joining your office?"
      intro={
        <p>
          Add teammates’ email addresses. Nothing is sent from this preview — invitations will go out once
          accounts and workspaces are live.
        </p>
      }
      primary={empty ? "I’ll do this later" : count ? `Continue with ${count} ${count === 1 ? "invite" : "invites"}` : "Continue"}
      onSubmit={() => {
        if (empty) return skip();
        if (add()) ob.next();
      }}
      secondary={
        count > 0 ? (
          <SecondaryButton onClick={skip}>Clear list &amp; do this later</SecondaryButton>
        ) : undefined
      }
    >
      <div>
        <label htmlFor="inviteEmail" className="mb-1.5 block text-sm font-medium text-ink">
          Email addresses
        </label>
        <div className="flex gap-2">
          <input
            id="inviteEmail"
            type="email"
            inputMode="email"
            autoComplete="off"
            placeholder="teammate@yourteam.com"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              if (error) setError(undefined);
            }}
            onKeyDown={onKeyDown}
            onPaste={(e) => {
              const text = e.clipboardData.getData("text");
              if (/[\s,;]/.test(text.trim())) {
                e.preventDefault();
                const { list, error: err, rejected } = addEmails(data.invitationEmails, text);
                set({ invitationEmails: list });
                setDraft(rejected);
                setError(err);
              }
            }}
            aria-invalid={!!error}
            aria-describedby={`inviteEmail-hint${error ? " inviteEmail-error" : ""}`}
            className="min-w-0 flex-1 border-2 border-ink bg-paper-light px-4 py-3 text-ink placeholder:text-muted/80 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed focus-visible:outline-forest aria-[invalid=true]:border-terracotta"
          />
          <SecondaryButton onClick={add} disabled={!draft.trim()} className="disabled:cursor-not-allowed disabled:opacity-50">
            Add
          </SecondaryButton>
        </div>
        <p id="inviteEmail-hint" className="mt-1.5 text-xs text-muted">
          Press Enter or comma to add. You can paste a whole list. Up to {LIMITS.invitations}.
        </p>
        {error && <ErrorText id="inviteEmail-error">{error}</ErrorText>}
      </div>

      {count > 0 && (
        <ul aria-label="Teammates to invite" className="flex flex-wrap gap-2">
          {data.invitationEmails.map((email) => (
            <li key={email} className="flex items-center gap-1 border-2 border-ink bg-sage/60 py-1 pl-3 pr-1 font-mono text-sm text-ink">
              {email}
              <button
                type="button"
                onClick={() => remove(email)}
                aria-label={`Remove ${email}`}
                className="grid size-6 place-items-center hover:bg-ink hover:text-paper"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </StepFrame>
  );
}

function ReviewStep() {
  const { data } = useOb();
  const router = useRouter();
  const avatar = avatarById(data.avatarId);
  const style = isStyleId(data.workspaceStyle) ? data.workspaceStyle : undefined;

  const enter = () => {
    // Backend hook-up: `await createWorkspace(toCreatePayload(data))` then `sendInvitations(...)`.
    // Until then the office is generated locally from these answers; nothing is saved server-side.
    saveOnboarding(data);
    router.push("/office/loading");
  };

  const rows: [string, ReactNode][] = [
    ["Display name", data.displayName.trim()],
    ["Workspace", data.workspaceName.trim()],
    ...(data.workspaceDescription.trim() ? ([["Description", data.workspaceDescription.trim()]] as [string, ReactNode][]) : []),
    ["Purpose", labelOf(PURPOSES, data.purpose)],
    ["Team size", labelOf(TEAM_SIZES, data.teamSize)],
    ["Style", labelOf(STYLES, data.workspaceStyle)],
    ["Template", labelOf(LAYOUTS, data.officeLayout)],
    ["Furniture", data.officeFeatures.map((id) => labelOf(FEATURES, id)).join(", ") || "None — an empty building"],
    ["Avatar", avatar.name],
    [
      "Invitations",
      data.invitationEmails.length
        ? `${data.invitationEmails.length} noted (not sent in this preview)`
        : "Later",
    ],
  ];

  return (
    <StepFrame
      eyebrow="Review"
      title="Everything look right?"
      intro={<p>Use Back to change anything — your answers are kept.</p>}
      primary="Enter my office"
      onSubmit={enter}
      aside={
        <PreviewFrame caption="Your office">
          <OfficePreview style={style} workspaceName={data.workspaceName} avatarId={data.avatarId} displayName={data.displayName} />
        </PreviewFrame>
      }
    >
      <dl className="divide-y-2 divide-dashed divide-ink/15 border-2 border-ink bg-paper-light">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-3 px-4 py-2.5 text-sm">
            <dt className="font-mono text-xs uppercase tracking-wide text-muted">{k}</dt>
            <dd className="break-words font-medium text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <DemoNotice title="This is a preview">
        Workspaces can’t be saved yet — the backend isn’t connected. “Enter my office” builds a walkable preview of
        your office from these answers, on this device only.
      </DemoNotice>
    </StepFrame>
  );
}

export const CREATE_STEP_VIEWS: Record<CreateStepId, () => ReactNode> = {
  identity: () => <IdentityStep />,
  workspace: () => <WorkspaceStep />,
  purpose: () => <PurposeStep />,
  style: () => <StyleStep />,
  layout: () => <LayoutStep />,
  avatar: () => <AvatarStep />,
  invite: () => <InviteStep />,
  review: () => <ReviewStep />,
};
