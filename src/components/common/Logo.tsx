import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark'; // dark variant for dark navy footer
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'light',
}) => {
  // Substantially increased height classes so FOYC & tagline are prominent and crystal clear
  const heightClasses = {
    sm: 'h-10 sm:h-12',
    md: 'h-14 sm:h-18 md:h-20', // ~60px to 80px tall (noticeably larger in navbar)
    lg: 'h-20 sm:h-24 md:h-28',
    xl: 'h-28 sm:h-36 md:h-44', // large hero / splash screen
  }[size];

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {variant === 'dark' ? (
        // For dark navy footer, wrap in a high-contrast container
        <div className="bg-white px-4 py-2 rounded-2xl border-2 border-[#17172B] shadow-[3px_3px_0px_#FFE76B] inline-flex items-center">
          <img
            src="/assets/foyc_logo.png"
            alt="FOYC — Figure Out Your Career"
            className={`${heightClasses} w-auto object-contain block`}
            style={{ imageRendering: 'auto' }}
          />
        </div>
      ) : (
        <img
          src="/assets/foyc_logo.png"
          alt="FOYC — Figure Out Your Career"
          className={`${heightClasses} w-auto object-contain block`}
          style={{ imageRendering: 'auto' }}
        />
      )}
    </div>
  );
};
