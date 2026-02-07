import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = React.memo(({ children, variant = 'primary', className, ...props }) => {
  const baseStyle = "px-8 py-3 rounded-full font-serif tracking-widest transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";

  const variants = {
    // Primary: Silver gradient effect (Dark Theme)
    primary: "bg-slate-200 text-slate-900 font-bold hover:bg-white hover:text-slate-900 hover:shadow-[0_4px_15px_rgba(226,232,240,0.4)]",
    // Secondary: Transparent with slate borders (Dark Theme)
    secondary: "bg-transparent border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className || ''}`} {...props}>
      {children}
    </button>
  );
});

export default Button;