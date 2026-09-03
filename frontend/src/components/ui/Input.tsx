import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3.5 py-2.5 rounded-lg bg-bg-elevated border border-slate-700',
            'text-slate-100 placeholder:text-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold/40',
            'transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-rose-accent/70 focus:ring-rose-accent/50',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-rose-accent">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
