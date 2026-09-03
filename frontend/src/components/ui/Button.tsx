import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'cyber';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variantStyles = {
  primary:
    'bg-gold text-bg-primary font-semibold hover:bg-gold-light shadow-gold focus:ring-gold',
  secondary:
    'border border-slate-600 text-slate-200 hover:border-gold/50 hover:text-gold-light focus:ring-slate-500',
  ghost: 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100 focus:ring-slate-500',
  danger: 'bg-rose-accent/90 text-white hover:bg-rose-accent focus:ring-rose-accent',
  cyber:
    'border border-cyan-accent/60 text-cyan-accent hover:bg-cyan-accent/10 hover:border-cyan-accent focus:ring-cyan-accent',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-5 py-2.5 text-sm rounded-lg',
  lg: 'px-8 py-3.5 text-base rounded-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
