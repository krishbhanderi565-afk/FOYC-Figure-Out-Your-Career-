import React from 'react';

interface HighlightProps {
  children: React.ReactNode;
  color?: string; // default #FFE76B
  className?: string;
  rotate?: string;
}

export const Highlight: React.FC<HighlightProps> = ({
  children,
  color = '#FFE76B',
  className = '',
  rotate = '-0.5deg',
}) => {
  return (
    <span
      className={`relative inline-block px-3 py-0.5 mx-1 font-extrabold text-[#17172B] rounded-lg border-2 border-[#17172B] shadow-[2px_2px_0px_#17172B] align-baseline transition-transform duration-200 hover:rotate-0 ${className}`}
      style={{
        backgroundColor: color,
        transform: `rotate(${rotate})`,
      }}
    >
      {children}
    </span>
  );
};
