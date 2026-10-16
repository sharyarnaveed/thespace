"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ErrorText, Field, PasswordField } from "./fields";

type Fields = {
  fullName: string;
  email: string;
  dob: string;
  password: string;
  confirm: string;
  terms: boolean;
};
type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { fullName: "", email: "", dob: "", password: "", confirm: "", terms: false };

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.fullName.trim()) e.fullName = "Tell us what to put on your name tag.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "That email doesn't look quite right.";
  if (!f.dob) e.dob = "Pick your date of birth.";
  else if (new Date(f.dob) > new Date()) e.dob = "That date is in the future.";
  if (f.password.length < 8) e.password = "Use at least 8 characters.";
  if (f.confirm !== f.password || !f.confirm) e.confirm = "Passwords don't match.";
  if (!f.terms) e.terms = "Please agree to the terms to continue.";
  return e;
}

/**
 * Account sign-up. Frontend only for now: there is no auth backend yet, so a
 * valid submission just shows the confirmation state.
 */
export function SignUpForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = validate(fields);
    setErrors(next);
    if (Object.keys(next).length === 0) setDone(true);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {done ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 border-2 border-ink bg-sun p-4 text-ink shadow-pixel"
          role="status"
        >
          <Check className="mt-0.5 size-5 shrink-0" aria-hidden />
          <p>
            <strong className="font-semibold">Welcome aboard, {fields.fullName.trim().split(/\s+/)[0]}.</strong> Your desk
            by the window is ready.{" "}
            <Link href="/onboarding" className="font-semibold text-forest underline decoration-2 underline-offset-2 hover:text-terracotta">
              Set up your office
            </Link>
          </p>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -8 }} className="flex flex-col gap-4">
          <Field
            id="fullName"
            label="Full name"
            autoComplete="name"
            placeholder="Maya Okafor"
            value={fields.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            error={errors.fullName}
          />
          <Field
            id="email"
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@yourteam.com"
            value={fields.email}
            onChange={(e) => set("email", e.target.value)}
            error={errors.email}
          />
          <Field
            id="dob"
            label="Date of birth"
            type="date"
            autoComplete="bday"
            value={fields.dob}
            onChange={(e) => set("dob", e.target.value)}
            error={errors.dob}
          />
          <PasswordField
            id="password"
            label="Password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={fields.password}
            onChange={(e) => set("password", e.target.value)}
            error={errors.password}
          />
          <PasswordField
            id="confirm"
            label="Re-enter password"
            autoComplete="new-password"
            placeholder="Same as above"
            value={fields.confirm}
            onChange={(e) => set("confirm", e.target.value)}
            error={errors.confirm}
          />

          <div>
            <label htmlFor="terms" className="flex cursor-pointer items-start gap-3 text-sm text-ink/80">
              <input
                id="terms"
                type="checkbox"
                checked={fields.terms}
                onChange={(e) => set("terms", e.target.checked)}
                aria-invalid={!!errors.terms}
                aria-describedby={errors.terms ? "terms-error" : undefined}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className="mt-0.5 grid size-5 shrink-0 place-items-center border-2 border-ink bg-paper-light text-ink transition-colors peer-checked:bg-sun peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-dashed peer-focus-visible:outline-forest [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
              >
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              <span>
                I agree to the{" "}
                <a href="#" className="font-semibold text-forest underline decoration-2 underline-offset-2 hover:text-terracotta">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="font-semibold text-forest underline decoration-2 underline-offset-2 hover:text-terracotta">
                  Privacy Policy
                </a>
                .
              </span>
            </label>
            {errors.terms && <ErrorText id="terms-error">{errors.terms}</ErrorText>}
          </div>

          <motion.button
            type="submit"
            whileHover={{ y: -2 }}
            whileTap={{ y: 1 }}
            className="group mt-2 inline-flex w-full items-center justify-center gap-2 border-2 border-ink bg-forest px-5 py-3.5 font-semibold text-paper shadow-pixel"
          >
            Sign up
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
