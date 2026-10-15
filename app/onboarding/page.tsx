import type { Metadata } from "next";
import { BRAND } from "@/components/landing/brand";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export const metadata: Metadata = {
  title: `Get set up — ${BRAND.name}`,
  description: `Create a new ${BRAND.name} workspace for your team, or join one with an invitation code.`,
};

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
