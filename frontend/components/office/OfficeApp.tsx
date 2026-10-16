"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MotionProvider } from "@/components/motion/Motion";
import { OfficeAudio } from "./audio";
import { loadOfficeConfig, savePlan } from "./config";
import { createGame } from "./game/createGame";
import { GameBus, type GameEvents } from "./game/events";
import { seatFor } from "./game/seating";
import { Hud, PlayerAnchor, Toast, type Settings, type Status } from "./hud";
import { OfficePanel, type PanelId } from "./panels";
import type { LayoutId } from "@/components/onboarding/model";
import { prepareOffice, type PreparedOffice } from "./prepare";
import { LoadingCard } from "./LoadingScreen";

/**
 * The `/office` surface: a full-screen Phaser world with a light React HUD on
 * top. Game state lives in Phaser; React only hears about prompt, room and
 * interaction changes through the bus, never per-frame movement.
 */
export function OfficeApp() {
  const [prepared, setPrepared] = useState<PreparedOffice | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let live = true;
    prepareOffice(loadOfficeConfig())
      .then((p) => live && setPrepared(p))
      .catch(() => live && setError(true));
    return () => {
      live = false;
    };
  }, [attempt]);

  const changePlan = useCallback((layout: LayoutId, teamSize: string) => {
    savePlan(layout, teamSize);
    setAttempt((n) => n + 1);
  }, []);

  if (!prepared) {
    return (
      <main className="grid min-h-dvh place-items-center bg-forest-deep p-4 font-display">
        <LoadingCard
          title={error ? "The office couldn’t open" : "Opening the office…"}
          error={error}
          onRetry={() => {
            setError(false);
            setAttempt((n) => n + 1);
          }}
        />
      </main>
    );
  }
  return (
    <MotionProvider>
      <World prepared={prepared} onPlan={changePlan} />
    </MotionProvider>
  );
}

function World({ prepared, onPlan }: { prepared: PreparedOffice; onPlan: (layout: LayoutId, teamSize: string) => void }) {
  const { config } = prepared;
  const seats = useMemo(
    () =>
      prepared.map.objects
        .flatMap((o) => (o.desk === undefined ? [] : [o.desk]))
        .sort((a, b) => a - b)
        .map((d) => seatFor(config, d)),
    [prepared, config],
  );
  const host = useRef<HTMLDivElement>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const [bus] = useState(() => new GameBus());
  const [audio] = useState(() => new OfficeAudio());
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [prompt, setPrompt] = useState<GameEvents["prompt"]>(null);
  const [room, setRoom] = useState("");
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const [status, setStatus] = useState<Status>("available");
  const statusRef = useRef(status);
  const [settings, setSettings] = useState<Settings>({ sound: false, minimap: true, nameTag: true });
  const soundOn = useRef(false);

  const say = useCallback((text: string) => setToast({ id: Date.now(), text }), []);

  const setSound = useCallback(
    (on: boolean) => {
      // Called from clicks and key presses only, so audio always starts on a user gesture.
      soundOn.current = on;
      if (on) audio.start();
      else audio.stop();
      setSettings((s) => ({ ...s, sound: on }));
    },
    [audio],
  );

  // Mount exactly one Phaser game for this component; tear it down on unmount.
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let game: ReturnType<typeof createGame> | undefined;
    // Start on the next frame so the host has its final size.
    const frame = requestAnimationFrame(() => {
      try {
        game = createGame(el, prepared, bus);
      } catch {
        setFailed(true);
      }
    });
    bus.setAnchor((x, y) => {
      if (anchor.current) anchor.current.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    });
    const off = [bus.on("ready", () => setReady(true)), bus.on("prompt", setPrompt), bus.on("room", setRoom)];
    return () => {
      cancelAnimationFrame(frame);
      off.forEach((fn) => fn());
      bus.setAnchor(null);
      game?.destroy(true);
      // A new map is starting: forget the old one's prompt and room.
      setReady(false);
      setPrompt(null);
      setRoom("");
    };
  }, [prepared, bus]);

  useEffect(() => () => audio.dispose(), [audio]);

  // Interactions coming from the world.
  useEffect(
    () =>
      bus.on("interact", ({ interaction }) => {
        if (soundOn.current) audio.chime();
        switch (interaction.action) {
          case "desk":
            return setPanel("desk");
          case "workspace":
            return setPanel("workspace");
          case "meeting":
            return setPanel("meeting");
          case "break":
            // First press sits you down; pressing again while seated opens the breathing exercise.
            if (statusRef.current === "break") return setPanel("break");
            setStatus("break");
            return say("Taking a break. Press E for a breathing exercise, or move to get up.");
          case "coffee":
            return say("Fresh coffee brewed. Enjoy a little break.");
          case "music": {
            const on = !soundOn.current;
            setSound(on);
            return say(on ? "Record on — soft tunes playing." : "Record off. Nice and quiet.");
          }
          case "flavor":
            return say(interaction.flavor ?? "");
        }
      }),
    [bus, audio, say, setSound],
  );

  // Status: the game sits you at your desk for Focus and gets you up for Available.
  useEffect(() => {
    statusRef.current = status;
    if (ready) bus.emit("set-status", status);
  }, [status, ready, bus]);

  useEffect(
    () =>
      bus.on("stood", () => {
        if (statusRef.current === "available") return;
        setStatus("available");
        say("Back on your feet — status set to Available.");
      }),
    [bus, say],
  );

  const changeStatus = useCallback(
    (s: Status) => {
      setStatus(s);
      if (s === "focusing") {
        setPanel(null);
        say("Focus mode on — you’re at your desk. Move to get up.");
      }
    },
    [say],
  );

  // Panels pause movement (re-sent when a new map is ready); Escape closes them.
  useEffect(() => {
    bus.emit("set-paused", panel !== null);
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel, bus, ready]);

  useEffect(() => {
    if (ready) bus.emit("set-minimap", settings.minimap);
  }, [ready, settings.minimap, bus]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#2b2a22] font-display text-ink">
      <div ref={host} className="absolute inset-0 [&_canvas]:block" aria-label={`${config.workspaceName}, an explorable pixel office`} role="application" />
      <PlayerAnchor ref={anchor} name={config.displayName} status={status} showName={settings.nameTag} prompt={panel ? null : prompt} />
      <Hud
        config={config}
        mapSize={prepared.map}
        room={room}
        status={status}
        onStatus={changeStatus}
        settings={settings}
        prompt={panel ? null : prompt}
        onInteract={() => bus.emit("request-interact")}
        onSound={() => setSound(!settings.sound)}
        onSettings={() => setPanel("settings")}
      />
      <AnimatePresence>{toast && <Toast key={toast.id} text={toast.text} />}</AnimatePresence>
      <AnimatePresence>
        {panel && (
          <OfficePanel
            key={panel}
            id={panel}
            seats={seats}
            config={config}
            status={status}
            onStatus={changeStatus}
            settings={settings}
            onPlan={onPlan}
            onSettings={(patch) => {
              if (patch.sound !== undefined) setSound(patch.sound);
              setSettings((s) => ({ ...s, ...patch, sound: patch.sound ?? s.sound }));
            }}
            onClose={() => setPanel(null)}
          />
        )}
      </AnimatePresence>
      {(!ready || failed) && (
        <div className="absolute inset-0 grid place-items-center bg-forest-deep p-4">
          <LoadingCard
            title={failed ? "The office couldn’t start" : "Opening the office…"}
            error={failed}
            onRetry={() => window.location.reload()}
          />
        </div>
      )}
    </main>
  );
}
