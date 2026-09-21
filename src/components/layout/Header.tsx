import React from 'react';

export interface HeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, description, actions }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-win-border flex-shrink-0">
      <div>
        <h1 className="text-base font-bold text-win-text tracking-tight leading-tight">{title}</h1>
        {description && <p className="text-[11px] text-win-muted mt-0.5 leading-none">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};
