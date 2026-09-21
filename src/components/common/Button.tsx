import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-md focus:outline-none focus:ring-2 focus:ring-win-primary/50 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] select-none';

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[11px] gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-win-primary hover:bg-win-primaryHover text-white shadow-sm border border-sky-400/30',
    secondary:
      'bg-win-card hover:bg-win-cardHover text-win-text border border-win-border shadow-sm',
    danger:
      'bg-red-600/90 hover:bg-red-600 text-white border border-red-500/30 shadow-sm',
    ghost:
      'bg-transparent hover:bg-win-card text-win-muted hover:text-win-text',
    outline:
      'bg-transparent hover:bg-win-card/60 text-win-text border border-win-border',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
};
