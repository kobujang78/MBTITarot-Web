import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'custom';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    icon?: React.ReactNode;
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    className = '',
    variant = 'primary',
    size = 'md',
    disabled = false,
    type = 'button',
    icon,
    isLoading = false
}) => {
    const baseStyles = "inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/40",
        secondary: "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700",
        danger: "bg-rose-600 text-white hover:bg-rose-500",
        ghost: "bg-transparent text-slate-400 hover:bg-white/5 hover:text-white",
        outline: "bg-transparent text-indigo-400 border border-indigo-500/50 hover:bg-indigo-500/10",
        custom: ""
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs rounded-lg",
        md: "px-4 py-2.5 text-sm rounded-xl",
        lg: "px-6 py-3.5 text-base rounded-2xl",
        icon: "p-2 rounded-xl"
    };

    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : icon ? (
                <span className="mr-2">{icon}</span>
            ) : null}
            {children}
        </button>
    );
};

export default Button;
