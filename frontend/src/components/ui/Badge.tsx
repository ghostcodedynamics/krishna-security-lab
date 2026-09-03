import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'gold' | 'cyan' | 'emerald' | 'rose' | 'locked';
  size?: 'sm' | 'md';
}

const variants = {
  default: 'bg-slate-700/60 text-slate-300 border-slate-600/50',
  gold: 'bg-gold/15 text-gold-light border-gold/30',
  cyan: 'bg-cyan-accent/15 text-cyan-accent border-cyan-accent/30',
  emerald: 'bg-emerald-accent/15 text-emerald-accent border-emerald-accent/30',
  rose: 'bg-rose-accent/15 text-rose-accent border-rose-accent/30',
  locked: 'bg-slate-800/80 text-slate-500 border-slate-700/50',
};

export function Badge({
  className,
  variant = 'default',
  size = 'sm',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-2.5 py-1 text-sm',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
