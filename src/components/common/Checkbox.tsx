import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
  id,
}) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <label
      htmlFor={inputId}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`w-4 h-4 rounded transition-all duration-150 flex items-center justify-center border ${
            checked
              ? 'bg-win-primary border-win-primary text-white shadow-sm'
              : 'bg-win-panel border-win-border hover:border-win-muted/60'
          }`}
        >
          {checked && <Check className="w-3 h-3 stroke-[3]" />}
        </div>
      </div>
      {label && <span className="text-sm text-win-text">{label}</span>}
    </label>
  );
};
