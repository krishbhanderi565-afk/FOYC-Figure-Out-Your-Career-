import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dark' | 'pink' | 'blue' | 'green' | 'lavender' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold tracking-tight rounded-xl border-2 border-[#17172B] select-none transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#17172B] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#17172B]';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs sm:text-sm shadow-[2px_2px_0px_#17172B] hover:shadow-[3px_3px_0px_#17172B] hover:-translate-x-[1px] hover:-translate-y-[1px]',
    md: 'px-5 py-2.5 text-sm sm:text-base shadow-[4px_4px_0px_#17172B] hover:shadow-[6px_6px_0px_#17172B] hover:-translate-x-[2px] hover:-translate-y-[2px]',
    lg: 'px-7 py-3.5 text-base sm:text-lg shadow-[5px_5px_0px_#17172B] hover:shadow-[7px_7px_0px_#17172B] hover:-translate-x-[2px] hover:-translate-y-[2px]',
  };

  const variantStyles = {
    primary: 'bg-[#FFE76B] text-[#17172B]',
    secondary: 'bg-[#FFFFFF] text-[#17172B]',
    dark: 'bg-[#17172B] text-[#FFF8E9] hover:bg-[#252542]',
    pink: 'bg-[#FFD9E8] text-[#17172B]',
    blue: 'bg-[#D7EAFE] text-[#17172B]',
    green: 'bg-[#DDF5C9] text-[#17172B]',
    lavender: 'bg-[#E8DDFF] text-[#17172B]',
    outline: 'bg-transparent text-[#17172B] hover:bg-[#FFF8E9]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
