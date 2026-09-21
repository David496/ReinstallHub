import React from 'react';
import { PackageOpen } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <PackageOpen className="w-12 h-12 text-win-muted/60" />,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-xl bg-win-panel/40 border border-win-border/50 ${className}`}
    >
      <div className="p-3 mb-4 rounded-full bg-win-card border border-win-border text-win-muted">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-win-text mb-1">{title}</h3>
      <p className="text-sm text-win-muted max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
