import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Highlight } from '../components/common/Highlight';
import { Compass, Home, Target, LayoutDashboard, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF8] flex flex-col font-sans text-[#171717]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-xl w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#FFE76B] border-2 border-[#171717] shadow-[4px_4px_0px_#171717]">
            <Compass className="w-10 h-10 text-[#171717] animate-spin-slow" />
          </div>

          <div className="space-y-3">
            <span className="inline-block text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#EDF2E9] text-[#526B50] border border-[#A8B99A]">
              Error 404 • Lost in Transit
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-[#171717] tracking-tight">
              Page <Highlight>Not Found</Highlight>
            </h1>
            <p className="text-sm sm:text-base text-[#555555] font-medium max-w-md mx-auto">
              Even in career discovery, taking an unintended turn happens. Let’s get you back on a clear, calibrated path.
            </p>
          </div>

          <Card variant="white" shadowSize="md" className="p-6 space-y-3 text-left">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#171717] mb-2">
              Recommended Directions:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link to="/">
                <Button variant="secondary" size="md" fullWidth className="gap-2 justify-start font-bold">
                  <Home className="w-4 h-4 text-[#171717]" />
                  <span>Return to Home</span>
                </Button>
              </Link>

              <Link to="/onboarding">
                <Button variant="primary" size="md" fullWidth className="gap-2 justify-start font-bold">
                  <Target className="w-4 h-4 text-[#171717]" />
                  <span>Start Discovery</span>
                </Button>
              </Link>
            </div>

            <div className="pt-2">
              <Link to="/dashboard">
                <Button variant="dark" size="md" fullWidth className="gap-2 justify-center font-bold">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Open Career Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};
