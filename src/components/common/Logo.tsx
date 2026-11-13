import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark'; // dark variant for dark footer
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'light',
}) => {
  // Balanced professional sizing (125-155px wide on desktop, 95-120px wide on mobile)
  const sizeClasses = {
    sm: 'w-[95px] sm:w-[115px] h-auto',
    md: 'w-[115px] sm:w-[140px] md:w-[148px] h-auto', // exact ~125-155px wide range specified in prompt
    lg: 'w-[160px] sm:w-[190px] h-auto',
    xl: 'w-[200px] sm:w-[250px] h-auto', // splash screen
  }[size];

  const logoSrc = variant === 'dark' ? '/assets/foyc_logo_white.png' : '/assets/foyc_logo.png';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {variant === 'dark' ? (
        <div className="bg-white px-3 py-1.5 rounded-xl border border-[#333333] shadow-sm inline-flex items-center">
          <img
            src="/assets/foyc_logo.png"
            alt="FOYC — Figure Out Your Career"
            className={`${sizeClasses} object-contain block`}
            style={{ imageRendering: 'auto' }}
          />
        </div>
      ) : (
        <img
          src={logoSrc}
          alt="FOYC — Figure Out Your Career"
          className={`${sizeClasses} object-contain block`}
          style={{ imageRendering: 'auto' }}
        />
      )}
    </div>
  );
};
