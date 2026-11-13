import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';

interface SplashScreenProps {
  children: React.ReactNode;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ children }) => {
  // Always trigger splash screen on initial mount / page load
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [fadeExit, setFadeExit] = useState(false);

  useEffect(() => {
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 400 : 1500;

    const timer = setTimeout(() => {
      setFadeExit(true);
      setTimeout(() => {
        setShowSplash(false);
      }, 500);
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && (
        <div
          className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#B8E986] transition-opacity duration-500 ease-in-out select-none ${
            fadeExit ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{ willChange: 'opacity' }}
        >
          <div className="flex flex-col items-center justify-center space-y-6 px-6 max-w-lg text-center animate-scaleUp">
            {/* Prominent Large Official FOYC Logo */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-3 border-[#17172B] shadow-[6px_6px_0px_#17172B] transition-transform duration-700 ease-out transform scale-100">
              <Logo size="xl" />
            </div>

            {/* Animated Loading Bar & Indicator */}
            <div className="flex flex-col items-center space-y-2.5 pt-4">
              <div className="w-48 sm:w-60 h-2 bg-white rounded-full overflow-hidden border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B]">
                <div className="h-full bg-[#FFE76B] rounded-full animate-progress" />
              </div>
              <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#17172B]">
                Figure Out Your Career • Clarity OS
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main app contents */}
      <div className={`transition-opacity duration-500 ${showSplash && !fadeExit ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </>
  );
};
