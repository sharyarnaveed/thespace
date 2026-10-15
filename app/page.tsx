import { MotionProvider } from "@/components/motion/Motion";
import { CozyDetailsSection } from "@/components/landing/CozyDetailsSection";
import { FeatureSection } from "@/components/landing/FeatureSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { Navbar } from "@/components/landing/Navbar";
import { OfficeSpacesSection } from "@/components/landing/OfficeSpacesSection";

export default function Home() {
  return (
    <MotionProvider>
      <a
        href="#experience"
        className="sr-only z-[70] bg-sun px-4 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Navbar />
      <main>
        <HeroSection />
        <FeatureSection />
        <OfficeSpacesSection />
        <HowItWorksSection />
        <CozyDetailsSection />
        <FinalCTA />
      </main>
      <Footer />
    </MotionProvider>
  );
}
