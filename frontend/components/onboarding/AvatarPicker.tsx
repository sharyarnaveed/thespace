"use client";

import { PixelSprite } from "@/components/pixel/PixelArt";
import { AVATARS, avatarById, avatarIdle, avatarWave } from "./avatars";

/** Grid of office buddies plus a large waving preview of the current pick. */
export function AvatarPicker({
  value,
  onChange,
  legend,
  compact = false,
}: {
  value: string;
  onChange: (id: string) => void;
  legend: string;
  compact?: boolean;
}) {
  const selected = avatarById(value);
  return (
    <div className={`grid items-start gap-6 ${compact ? "sm:grid-cols-[1fr_9rem]" : "md:grid-cols-[1fr_13rem]"}`}>
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink">{legend}</legend>
        <div className="grid grid-cols-4 gap-2.5">
          {AVATARS.map((a) => {
            const checked = a.id === selected.id;
            return (
              <label
                key={a.id}
                className={`group flex cursor-pointer flex-col items-center gap-1 border-2 border-ink px-1 pb-1.5 pt-2 transition-[background-color,transform,box-shadow] duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-dashed has-[:focus-visible]:outline-forest ${
                  checked ? "-translate-y-0.5 bg-sun shadow-pixel-sm" : "bg-paper-light hover:-translate-y-0.5 hover:bg-paper-deep"
                }`}
              >
                <input
                  type="radio"
                  name="avatar"
                  value={a.id}
                  checked={checked}
                  onChange={() => onChange(a.id)}
                  className="sr-only"
                />
                <PixelSprite sprite={avatarIdle(a)} hover className="w-9 sm:w-11" />
                <span className="font-pixel text-[0.65rem] uppercase tracking-wide text-ink">{a.name}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col items-center border-2 border-ink bg-sage/50 px-4 pb-3 pt-5 shadow-pixel" aria-live="polite">
        <PixelSprite
          key={selected.id}
          sprite={avatarWave(selected)}
          label={`${selected.name}, your selected avatar, waving`}
          className={compact ? "w-20" : "w-28"}
        />
        <p className="mt-2 font-pixel text-xs uppercase tracking-widest text-forest">{selected.name}</p>
      </div>
    </div>
  );
}
