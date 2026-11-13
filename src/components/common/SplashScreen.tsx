import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';

interface SplashScreenProps {
  children: React.ReactNode;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ children }) => {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Only show splash screen once per browser session
    if (typeof window !== 'undefined') {
      const alreadyShown = sessionStorage.getItem('foyc_splash_shown');
      return !alreadyShown;
    }
    return false;
  });

  const [fadeExit, setFadeExit] = useState(false);

  useEffect(() => {
    if (!showSplash) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 200 : 1300;

    const timer = setTimeout(() => {
      setFadeExit(true);
      setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('foyc_splash_shown', 'true');
      }, 400);
    }, duration);

    return () => clearTimeout(timer);
  }, [showSplash]);

  if (!showSplash) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen">
      {/* Animated Splash Overlay */}
      <div
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FFF8E9] transition-opacity duration-400 ease-in-out ${
          fadeExit ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{ willChange: 'opacity' }}
      >
        <div className="flex flex-col items-center justify-center space-y-6 px-4 animate-scaleUp">
          {/* Centered Official FOYC Logo */}
          <div className="transition-transform duration-700 ease-out transform scale-100">
            <Logo size="xl" />
          </div>

          {/* Minimal animated loading indicator beneath logo */}
          <div className="flex flex-col items-center space-y-2 pt-2">
            <div className="w-32 h-1.5 bg-[#17172B]/10 rounded-full overflow-hidden border border-[#17172B]/20">
              <div className="h-full bg-[#B8E986] rounded-full animate-progress" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#17172B]/60">
              Initializing Discovery OS
            </span>
          </div>
        </div>
      </div>

      {/* Render children underneath for seamless instant reveal */}
      <div className={fadeExit || !showSplash ? 'opacity-100' : 'opacity-0'}>
        {children}
      </div>
    </div>
  );
};
