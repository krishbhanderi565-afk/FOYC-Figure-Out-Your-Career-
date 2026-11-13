import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'cream' | 'yellow' | 'pink' | 'parrot' | 'blue' | 'lavender' | 'green' | 'white' | 'dark';
  shadowSize?: 'sm' | 'md' | 'lg' | 'none';
  interactive?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'white',
  shadowSize = 'md',
  interactive = false,
  children,
  className = '',
  ...props
}) => {
  const variantStyles = {
    cream: 'bg-[#F2F9E9] text-[#17172B] border-[#17172B]',
    yellow: 'bg-[#FFE76B] text-[#17172B] border-[#17172B]',
    // Refresh pink to light parrot green for brand update
    pink: 'bg-[#DDF5C5] text-[#17172B] border-[#17172B]',
    parrot: 'bg-[#B8E986] text-[#17172B] border-[#17172B]',
    blue: 'bg-[#D7EAFE] text-[#17172B] border-[#17172B]',
    lavender: 'bg-[#E8DDFF] text-[#17172B] border-[#17172B]',
    green: 'bg-[#DDF5C9] text-[#17172B] border-[#17172B]',
    white: 'bg-white text-[#17172B] border-[#17172B]',
    dark: 'bg-[#17172B] text-white border-[#32324D]',
  };

  const shadowStyles = {
    none: '',
    sm: variant === 'dark' ? 'shadow-[2px_2px_0px_#0A0A14]' : 'shadow-[2px_2px_0px_#17172B]',
    md: variant === 'dark' ? 'shadow-[4px_4px_0px_#0A0A14]' : 'shadow-[4px_4px_0px_#17172B]',
    lg: variant === 'dark' ? 'shadow-[6px_6px_0px_#0A0A14]' : 'shadow-[6px_6px_0px_#17172B]',
  };

  const interactiveStyles = interactive
    ? 'cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#17172B] active:translate-y-0 active:shadow-[2px_2px_0px_#17172B]'
    : '';

  return (
    <div
      className={`rounded-2xl border-2 ${variantStyles[variant]} ${shadowStyles[shadowSize]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
