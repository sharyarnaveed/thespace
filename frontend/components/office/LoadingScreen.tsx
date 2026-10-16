"use client";

import { motion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { MotionProvider } from "@/components/motion/Motion";
import { PixelSprite } from "@/components/pixel/PixelArt";
import { makeSprite } from "@/components/pixel/sprites";
import { loadOfficeConfig, type OfficeConfig } from "./config";
import { avatarFrames } from "./game/avatar";
import { modeBadge } from "./hud";
import { STAGES, prepareOffice } from "./prepare";

/** Shortest time the screen stays up, so a fast load doesn't flash. */
const MIN_MS = 900;

/**
 * `/office/loading`: prepares the office (layout, textures, Phaser bundle) with
 * progress tied to those real steps, then hands over to `/office`.
 */
export function LoadingScreen() {
  const router = useRouter();
  const [config, setConfig] = useState<OfficeConfig | null>(null);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let live = true;
    const started = performance.now();
    const c = loadOfficeConfig();
    router.prefetch("/office");
    (async () => {
      setConfig(c);
      await prepareOffice(c, (i) => live && setStage(i));
      await new Promise((r) => setTimeout(r, Math.max(0, MIN_MS - (performance.now() - started))));
      if (live) router.replace("/office");
    })().catch(() => live && setError(true));
    return () => {
      live = false;
    };
  }, [router, attempt]);

  return (
    <MotionProvider>
      <main className="grid min-h-dvh place-items-center bg-forest-deep p-4 font-display">
        <LoadingCard
          title={error ? "The office couldn’t open" : config ? config.workspaceName : "Getting ready…"}
          badge={config ? modeBadge(config) : undefined}
          avatarId={config?.avatarId}
          error={error}
          onRetry={() => {
            setError(false);
            setStage(0);
            setAttempt((n) => n + 1);
          }}
        >
          {!error && (
            <ol className="flex flex-col gap-1.5 text-sm">
              {STAGES.map((s, i) => (
                <li key={s} className={`flex items-center gap-2 ${i <= stage ? "text-ink" : "text-muted/70"}`}>
                  <span className={`grid size-4 place-items-center border-2 border-ink ${i < stage ? "bg-forest text-paper" : i === stage ? "bg-sun" : "bg-paper"}`}>
                    {i < stage && <Check className="size-2.5" strokeWidth={4} aria-hidden />}
                  </span>
                  {s}
                  {i === stage && <span className="sr-only">(in progress)</span>}
                </li>
              ))}
            </ol>
          )}
          {!error && (
            <div
              role="progressbar"
              aria-label="Loading the office"
              aria-valuemin={0}
              aria-valuemax={STAGES.length}
              aria-valuenow={stage + 1}
              className="h-4 border-2 border-ink bg-paper"
            >
              <motion.div className="h-full bg-forest" animate={{ width: `${((stage + 1) / STAGES.length) * 100}%` }} transition={{ duration: 0.35 }} />
            </div>
          )}
        </LoadingCard>
      </main>
    </MotionProvider>
  );
}

/** Shared card for the loading route and `/office`'s own fallback. */
export function LoadingCard({
  title,
  badge,
  avatarId,
  error,
  onRetry,
  children,
}: {
  title: string;
  badge?: string;
  avatarId?: string;
  error?: boolean;
  onRetry?: () => void;
  children?: ReactNode;
}) {
  const { frames, palette } = avatarFrames(avatarId ?? "");
  return (
    <div className="w-full max-w-sm border-2 border-ink bg-paper-light shadow-[8px_8px_0_0_var(--color-ink)]" aria-busy={!error}>
      <div className="flex items-end justify-center border-b-2 border-ink bg-sage/60 pb-3 pt-6">
        <PixelSprite sprite={makeSprite(frames.down.slice(1), palette, 6)} className="w-12" />
      </div>
      <div className="flex flex-col gap-4 px-6 py-5">
        <div>
          <p className="font-pixel text-[0.65rem] uppercase tracking-widest text-terracotta">{error ? "Something went wrong" : "Setting up your little corner…"}</p>
          <h1 className="mt-1 truncate text-2xl font-semibold tracking-[-0.03em]" aria-live="polite">
            {title}
          </h1>
          {badge && !error && <p className="mt-1 font-mono text-xs text-muted">{badge}</p>}
        </div>
        {error && (
          <>
            <p className="text-sm text-muted">Part of the office didn’t load — usually a flaky connection. Try again?</p>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 border-2 border-ink bg-forest px-4 py-2.5 font-semibold text-paper shadow-pixel hover:-translate-y-0.5"
            >
              <RotateCcw className="size-4" aria-hidden />
              Retry
            </button>
          </>
        )}
        {children}
      </div>
    </div>
  );
}
