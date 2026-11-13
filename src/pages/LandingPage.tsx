import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { HeroSection } from '../components/landing/HeroSection';
import { ProblemSection } from '../components/landing/ProblemSection';
import { WhyDifficultSection } from '../components/landing/WhyDifficultSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { WhoIsItForSection } from '../components/landing/WhoIsItForSection';
import { CareerPathsSection } from '../components/landing/CareerPathsSection';
import { DashboardPreviewSection } from '../components/landing/DashboardPreviewSection';
import { BenefitsSection } from '../components/landing/BenefitsSection';
import { FaqSection } from '../components/landing/FaqSection';
import { CtaSection } from '../components/landing/CtaSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E9] text-[#17172B]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <WhyDifficultSection />
        <HowItWorksSection />
        <WhoIsItForSection />
        <CareerPathsSection />
        <DashboardPreviewSection />
        <BenefitsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};
