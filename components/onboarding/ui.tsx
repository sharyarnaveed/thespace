"use client";

import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ErrorText } from "@/components/auth/fields";

/** Step heading. Receives focus on every step change so screen readers announce it. */
export const StepHeading = forwardRef<HTMLHeadingElement, { eyebrow?: string; title: string; children?: ReactNode }>(
  function StepHeading({ eyebrow, title, children }, ref) {
    return (
      <div>
        {eyebrow && <p className="font-pixel text-xs uppercase tracking-widest text-terracotta">{eyebrow}</p>}
        <h1
          ref={ref}
          tabIndex={-1}
          className="mt-2 text-3xl font-semibold leading-tight tracking-[-0.03em] text-ink focus:outline-none sm:text-4xl"
        >
          {title}
        </h1>
        {children && <div className="mt-3 max-w-xl text-muted">{children}</div>}
      </div>
    );
  },
);

export function PrimaryButton({
  children,
  arrow = true,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { arrow?: boolean }) {
  return (
    <button
      type="button"
      className={`group inline-flex items-center justify-center gap-2 border-2 border-ink bg-forest px-5 py-3 font-semibold text-paper shadow-pixel transition-transform duration-150 enabled:hover:-translate-y-0.5 enabled:active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ""}`}
      {...rest}
    >
      {children}
      {arrow && <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />}
    </button>
  );
}

export function SecondaryButton({ children, className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 border-2 border-ink bg-paper-light px-4 py-3 font-semibold text-ink transition-colors hover:bg-paper-deep ${className ?? ""}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function BackButton({ onClick, label = "Back" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-sm px-1 py-1 text-sm font-semibold text-forest underline-offset-4 hover:text-terracotta hover:underline"
    >
      <ArrowLeft className="size-4" aria-hidden />
      {label}
    </button>
  );
}

/** Honest "this is a prototype" banner. */
export function DemoNotice({ title, children, tone = "info" }: { title: string; children: ReactNode; tone?: "info" | "warn" }) {
  return (
    <div
      role="note"
      className={`flex items-start gap-3 border-2 border-ink p-4 text-sm text-ink ${tone === "warn" ? "bg-terracotta/20" : "bg-sun/35"}`}
    >
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>
        <p className="font-semibold">{title}</p>
        <div className="mt-1 text-ink/80">{children}</div>
      </div>
    </div>
  );
}

/** Radio group rendered as chunky pixel tiles. Native radios give arrow-key navigation for free. */
export function OptionGroup({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  columns = "sm:grid-cols-2",
}: {
  name: string;
  legend: string;
  options: readonly { id: string; label: string; blurb?: string }[];
  value: string;
  onChange: (id: string) => void;
  error?: string;
  columns?: string;
}) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="mb-3 text-sm font-semibold text-ink">{legend}</legend>
      <div className={`grid gap-2.5 ${columns}`}>
        {options.map((o) => {
          const checked = value === o.id;
          return (
            <label
              key={o.id}
              className={`relative flex cursor-pointer items-start gap-3 border-2 border-ink px-4 py-3 transition-[background-color,transform,box-shadow] duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-dashed has-[:focus-visible]:outline-forest ${
                checked ? "-translate-y-0.5 bg-sun shadow-pixel-sm" : "bg-paper-light hover:-translate-y-0.5 hover:bg-paper-deep"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o.id}
                checked={checked}
                onChange={() => onChange(o.id)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={`mt-1 grid size-3.5 shrink-0 place-items-center border-2 border-ink ${checked ? "bg-forest" : "bg-paper-light"}`}
              />
              <span>
                <span className="block font-medium text-ink">{o.label}</span>
                {o.blurb && <span className="mt-0.5 block text-sm text-ink/70">{o.blurb}</span>}
              </span>
            </label>
          );
        })}
      </div>
      {error && <ErrorText id={`${name}-error`}>{error}</ErrorText>}
    </fieldset>
  );
}

/** Label + textarea in the same style as the auth `Field`. */
export function TextArea({
  id,
  label,
  hint,
  value,
  onChange,
  maxLength,
  error,
  placeholder,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
  error?: string;
  placeholder?: string;
}) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-ink">
        <span>{label}</span>
        <span className="font-mono text-xs text-muted" aria-hidden>
          {value.length}/{maxLength}
        </span>
      </label>
      <textarea
        id={id}
        name={id}
        rows={3}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className="w-full resize-none border-2 border-ink bg-paper-light px-4 py-3 text-ink placeholder:text-muted/80 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed focus-visible:outline-forest aria-[invalid=true]:border-terracotta"
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  );
}
