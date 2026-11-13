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
    // Fade out and clean up the HTML-level pre-hydration splash screen
    const staticSplash = document.getElementById('foyc-static-splash');
    if (staticSplash) {
      staticSplash.style.opacity = '0';
      staticSplash.style.pointerEvents = 'none';
      setTimeout(() => {
        staticSplash.remove();
      }, 500);
    }

    // Keep splash active for 1.8 seconds so it is clearly visible and memorable
    const timer = setTimeout(() => {
      setFadeExit(true);
      setTimeout(() => {
        setShowSplash(false);
      }, 500);
    }, 1800);

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
            <div className="bg-white p-6 sm:p-10 rounded-3xl border-3 sm:border-4 border-[#17172B] shadow-[8px_8px_0px_#17172B] transition-transform duration-700 ease-out transform scale-100">
              <Logo size="xl" />
            </div>

            {/* Animated Loading Bar & Indicator */}
            <div className="flex flex-col items-center space-y-3 pt-2">
              <div className="w-52 sm:w-72 h-2.5 bg-white rounded-full overflow-hidden border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B]">
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
