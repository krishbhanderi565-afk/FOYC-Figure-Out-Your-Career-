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
  showTagline = true,
}) => {
  // Height classes maintaining 2:1 aspect ratio
  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-16 sm:h-20',
  }[size];

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {variant === 'dark' ? (
        // For dark footer, we wrap the official logo in a clean pill or crisp high-contrast container
        <div className="bg-white px-3 py-1.5 rounded-xl border-2 border-[#FFE76B] shadow-[2px_2px_0px_#FFE76B] inline-flex items-center">
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
