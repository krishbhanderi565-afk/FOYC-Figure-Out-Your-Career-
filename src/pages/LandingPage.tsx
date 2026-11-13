import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { HeroSection } from '../components/landing/HeroSection';
import { WhoIsFoycForSection } from '../components/landing/WhoIsFoycForSection';
import { ProblemTensionSolutionSection } from '../components/landing/ProblemTensionSolutionSection';
import { HowItWorksSimpleSection } from '../components/landing/HowItWorksSimpleSection';
import { FinalCtaSection } from '../components/landing/FinalCtaSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDF5EB] text-[#171717]">
      <Navbar />
      <main className="flex-1">
        {/* Section 1: Hero */}
        <HeroSection />

        {/* Section 1.5: FOYC is for everyone (Animated Marquee Cards) */}
        <WhoIsFoycForSection />

        {/* Section 2: Problem -> Tension -> Solution -> Outcome (New Graphic) */}
        <ProblemTensionSolutionSection />

        {/* Section 3: How FOYC Works (New Graphic) */}
        <HowItWorksSimpleSection />

        {/* Section 4: Final CTA */}
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
};
