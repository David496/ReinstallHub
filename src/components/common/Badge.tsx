import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'accent' | 'muted';
  size?: 'xs' | 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
  title?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  icon,
  className = '',
  title,
}) => {
  const sizeClasses = {
    xs: 'px-1.5 py-0.2 text-[9px] gap-1',
    sm: 'px-2 py-0.5 text-[11px] gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  const variantClasses = {
    default: 'bg-win-panel text-win-muted border border-win-border',
    success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30',
    accent: 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/30',
    muted: 'bg-slate-200/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-400 border border-slate-300 dark:border-slate-700/50',
  };

  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
