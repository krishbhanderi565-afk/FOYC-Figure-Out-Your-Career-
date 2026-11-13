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
  // Height classes with tightly cropped logo (91% content height)
  // These provide commanding, bold, clearly readable brand presence
  const heightClasses = {
    sm: 'h-8 sm:h-10',
    md: 'h-12 sm:h-16 md:h-20', // ~48px mobile, 64px tablet, 80px desktop
    lg: 'h-16 sm:h-20 md:h-24',
    xl: 'h-24 sm:h-32 md:h-40', // large hero / splash screen
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
