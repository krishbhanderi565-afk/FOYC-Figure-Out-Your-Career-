import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';

interface SplashScreenProps {
  children: React.ReactNode;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ children }) => {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [fadeExit, setFadeExit] = useState(false);

  useEffect(() => {
    // Fade out and clean up the HTML-level pre-hydration splash screen
    const staticSplash = document.getElementById('foyc-static-splash');
    if (staticSplash) {
      staticSplash.style.opacity = '0';
      staticSplash.style.pointerEvents = 'none';
      setTimeout(() => {
        staticSplash.remove();
      }, 500);
    }

    const timer = setTimeout(() => {
      setFadeExit(true);
      setTimeout(() => {
        setShowSplash(false);
      }, 500);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && (
        <div
          className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#FFFDF8] transition-opacity duration-500 ease-in-out select-none ${
            fadeExit ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{ willChange: 'opacity' }}
        >
          <div className="flex flex-col items-center justify-center space-y-6 px-6 max-w-lg text-center animate-scaleUp">
            {/* Balanced Official FOYC Logo */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E5DE] shadow-sm transition-transform duration-700 ease-out transform scale-100">
              <Logo size="lg" />
            </div>

            {/* Subtle Animated Loading Bar & Indicator */}
            <div className="flex flex-col items-center space-y-2.5 pt-2">
              <div className="w-48 sm:w-56 h-1.5 bg-[#F4F3EF] rounded-full overflow-hidden border border-[#E8E5DE]">
                <div className="h-full bg-[#526B50] rounded-full animate-progress" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#333333]">
                Figure Out Your Career
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
