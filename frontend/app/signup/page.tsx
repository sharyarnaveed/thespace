import type { Metadata } from "next";
import { AuthLink, AuthShell } from "@/components/auth/AuthShell";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { BRAND } from "@/components/landing/brand";
import { LoungeScene, WorkspaceScene } from "@/components/scene/SpaceScenes";

export const metadata: Metadata = {
  title: `Create account — ${BRAND.name}`,
  description: `Create your ${BRAND.name} account and pull up a chair in your team's pixel-art office.`,
};

export default function SignUpPage() {
  return (
    <AuthShell
      status="3 teammates online"
      heading={
        <>
          Your desk is <span className="text-sun">waiting</span> by the window.
        </>
      }
      blurb="Walk over to a teammate, grab a coffee in the lounge, and make remote work feel a little less lonely."
      scenes={[<WorkspaceScene key="workspace" />, <LoungeScene key="lounge" />]}
      title="Create account"
      subtitle="A few details and you’re in."
      footer={
        <>
          Have an account? <AuthLink href="/signin">Log in</AuthLink>
        </>
      }
    >
      <SignUpForm />
    </AuthShell>
  );
}
