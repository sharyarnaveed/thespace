import type { Metadata } from "next";
import { BRAND } from "@/components/landing/brand";
import { OfficeApp } from "@/components/office/OfficeApp";

export const metadata: Metadata = {
  title: `Your office — ${BRAND.name}`,
  description: `Walk around your ${BRAND.name} office.`,
  robots: { index: false },
};

export default function OfficePage() {
  return <OfficeApp />;
}
