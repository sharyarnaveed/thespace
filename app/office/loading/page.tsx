import type { Metadata } from "next";
import { BRAND } from "@/components/landing/brand";
import { LoadingScreen } from "@/components/office/LoadingScreen";

export const metadata: Metadata = {
  title: `Opening your office — ${BRAND.name}`,
  robots: { index: false },
};

export default function OfficeLoadingPage() {
  return <LoadingScreen />;
}
