import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { HeroSection } from '../components/landing/HeroSection';
import { ProblemTensionSolutionSection } from '../components/landing/ProblemTensionSolutionSection';
import { HowItWorksSimpleSection } from '../components/landing/HowItWorksSimpleSection';
import { FinalCtaSection } from '../components/landing/FinalCtaSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#B8E986] text-[#17172B]">
      <Navbar />
      <main className="flex-1">
        {/* Section 1: Hero */}
        <HeroSection />

        {/* Section 2: Problem -> Tension -> Solution -> Outcome */}
        <ProblemTensionSolutionSection />

        {/* Section 3: How FOYC Works (4 Simple Steps) */}
        <HowItWorksSimpleSection />

        {/* Section 4: Final CTA */}
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
};
