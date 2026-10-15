import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { BRAND } from "@/components/landing/brand";
import { Logo } from "@/components/landing/Logo";
import { PixelSprite } from "@/components/pixel/PixelArt";
import { avatarById, avatarWave, isAvatarId } from "@/components/onboarding/avatars";
import { CH, CW, JoinIllustration, OfficePreview } from "@/components/onboarding/illustrations";
import { PhaserStage } from "@/components/onboarding/phaser/PhaserStage";
import { DEFAULT_STYLE, LIMITS, PURPOSES, STYLES, TEAM_SIZES, isStyleId, labelOf } from "@/components/onboarding/model";

export const metadata: Metadata = {
  title: `Office preview (demo) — ${BRAND.name}`,
  description: `A local, unsaved preview of a ${BRAND.name} office.`,
  robots: { index: false },
};

export default function OfficePreviewPage(props: PageProps<"/office-preview">) {
  return (
    <main className="min-h-dvh bg-sage/45 px-4 py-5 font-display sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl border-2 border-ink bg-paper-light shadow-[8px_8px_0_0_var(--color-ink)]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink bg-paper px-5 py-4 sm:px-8">
          <Link href="/" aria-label={`${BRAND.name} home`} className="inline-flex rounded-sm">
            <Logo />
          </Link>
          <span className="border-2 border-ink bg-terracotta px-2.5 py-1 font-pixel text-[0.65rem] uppercase tracking-widest text-ink">
            Demo preview
          </span>
        </header>
        <div className="px-5 py-8 sm:px-8 sm:py-10">
          <Suspense fallback={<p className="font-mono text-sm text-muted">Setting up the preview…</p>}>
            <Preview searchParams={props.searchParams} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

/** Read a single string param, trimmed and length-capped. Anything else becomes "". */
function param(sp: Record<string, string | string[] | undefined>, key: string, max = 64) {
  const v = sp[key];
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

async function Preview({ searchParams }: Pick<PageProps<"/office-preview">, "searchParams">) {
  const sp = await searchParams;
  const mode = param(sp, "mode") === "join" ? "join" : "create";
  const name = param(sp, "name", LIMITS.displayName);
  const avatarParam = param(sp, "avatar");
  const avatar = avatarById(isAvatarId(avatarParam) ? avatarParam : undefined);

  if (mode === "join") {
    return (
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        <div className="flex flex-col gap-5">
          <p className="font-pixel text-xs uppercase tracking-widest text-terracotta">Joining · placeholder</p>
          <h1 className="text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">
            {name ? `Almost there, ${name}.` : "Almost there."}
          </h1>
          <Notice title="You haven’t joined a workspace">
            Invitation codes can’t be verified until the backend is connected, so no membership was created and no
            workspace details are shown. This page is where you’ll land once joining works for real.
          </Notice>
          <div className="flex items-center gap-4 border-2 border-ink bg-sage/50 p-4 shadow-pixel">
            <PixelSprite sprite={avatarWave(avatar)} label={`${avatar.name}, your avatar, waving`} className="w-14 shrink-0" />
            <p className="text-sm text-ink/80">
              You’ll walk in as <strong className="text-ink">{avatar.name}</strong>
              {name && (
                <>
                  , with <strong className="text-ink">{name}</strong> on your name tag
                </>
              )}
              .
            </p>
          </div>
          <Actions />
        </div>
        <figure className="border-2 border-ink shadow-[6px_6px_0_0_var(--color-ink)]">
          <PhaserStage script="join" w={CW} h={CH}>
            <JoinIllustration />
          </PhaserStage>
        </figure>
      </div>
    );
  }

  const workspace = param(sp, "workspace", LIMITS.workspaceName);
  const styleParam = param(sp, "style");
  const style = isStyleId(styleParam) ? styleParam : DEFAULT_STYLE;
  const invites = Math.max(0, Math.min(LIMITS.invitations, Number.parseInt(param(sp, "invites"), 10) || 0));
  const details: [string, string | undefined][] = [
    ["Purpose", labelOf(PURPOSES, param(sp, "purpose"))],
    ["Team size", labelOf(TEAM_SIZES, param(sp, "size"))],
    ["Style", labelOf(STYLES, style)],
    ["Avatar", avatar.name],
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="font-pixel text-xs uppercase tracking-widest text-terracotta">Your office · demo</p>
        <h1 className="text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">
          {workspace ? `Welcome to ${workspace}` : "Welcome to your office"}
          {name ? `, ${name}.` : "."}
        </h1>
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
        <figure className="border-2 border-ink bg-paper-light shadow-[6px_6px_0_0_var(--color-ink)]">
          <OfficePreview style={style} workspaceName={workspace} avatarId={avatar.id} displayName={name} />
        </figure>
        <div className="flex flex-col gap-5">
          <Notice title="Nothing has been saved">
            This is a local preview built from your answers. The workspace hasn’t been created
            {invites > 0 ? `, and the ${invites} ${invites === 1 ? "invitation was" : "invitations were"} not sent` : ""}
            — that needs the backend, which isn’t connected yet.
          </Notice>
          <dl className="divide-y-2 divide-dashed divide-ink/15 border-2 border-ink bg-paper">
            {details
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7rem_1fr] gap-3 px-4 py-2.5 text-sm">
                  <dt className="font-mono text-xs uppercase tracking-wide text-muted">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
          </dl>
          <Actions />
        </div>
      </div>
    </div>
  );
}

function Notice({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div role="note" className="border-2 border-ink bg-sun/35 p-4 text-sm text-ink">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-ink/80">{children}</p>
    </div>
  );
}

function Actions() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        href="/onboarding"
        className="inline-flex items-center justify-center border-2 border-ink bg-forest px-5 py-3 font-semibold text-paper shadow-pixel transition-transform hover:-translate-y-0.5"
      >
        Start onboarding again
      </Link>
      <Link
        href="/"
        className="inline-flex items-center justify-center border-2 border-ink bg-paper-light px-5 py-3 font-semibold text-ink transition-colors hover:bg-paper-deep"
      >
        Back to home
      </Link>
    </div>
  );
}
