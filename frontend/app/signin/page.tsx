import type { Metadata } from "next";
import { AuthLink, AuthShell } from "@/components/auth/AuthShell";
import { SignInForm } from "@/components/auth/SignInForm";
import { BRAND } from "@/components/landing/brand";
import { MeetingScene } from "@/components/scene/SpaceScenes";

export const metadata: Metadata = {
  title: `Sign in — ${BRAND.name}`,
  description: `Sign in to ${BRAND.name} and head back to your team's pixel-art office.`,
};

export default function SignInPage() {
  return (
    <AuthShell
      status="Standup in 5 min"
      heading={
        <>
          Welcome <span className="text-sun">back</span> to the office.
        </>
      }
      blurb="Your team is already gathering in the meeting room. Grab your seat before standup starts."
      scenes={[<MeetingScene key="meeting" />]}
      title="Sign in"
      subtitle="Good to see you again."
      fit
      footer={
        <>
          New here? <AuthLink href="/signup">Create an account</AuthLink>
        </>
      }
    >
      <SignInForm />
    </AuthShell>
  );
}
