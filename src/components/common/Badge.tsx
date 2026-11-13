import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'yellow' | 'pink' | 'parrot' | 'blue' | 'green' | 'lavender' | 'dark' | 'white';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'yellow',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const variantStyles = {
    yellow: 'bg-[#FFE76B] text-[#17172B] border-[#17172B]',
    // Refresh pink to light parrot green
    pink: 'bg-[#DDF5C5] text-[#17172B] border-[#17172B]',
    parrot: 'bg-[#B8E986] text-[#17172B] border-[#17172B]',
    blue: 'bg-[#D7EAFE] text-[#17172B] border-[#17172B]',
    green: 'bg-[#DDF5C9] text-[#17172B] border-[#17172B]',
    lavender: 'bg-[#E8DDFF] text-[#17172B] border-[#17172B]',
    dark: 'bg-[#17172B] text-[#FFF8E9] border-[#17172B]',
    white: 'bg-white text-[#17172B] border-[#17172B]',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 rounded-full border shadow-[1.5px_1.5px_0px_#17172B]',
    md: 'text-xs sm:text-sm px-3.5 py-1 rounded-full border-2 shadow-[2px_2px_0px_#17172B]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className="w-2 h-2 rounded-full bg-current opacity-80" />}
      {children}
    </span>
  );
};
