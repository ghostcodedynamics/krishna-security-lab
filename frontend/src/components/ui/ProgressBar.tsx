import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0–100
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'gold' | 'cyan' | 'emerald';
  className?: string;
}

const barColors = {
  gold: 'bg-gradient-to-r from-gold-dark to-gold-light',
  cyan: 'bg-gradient-to-r from-cyan-600 to-cyan-accent',
  emerald: 'bg-gradient-to-r from-emerald-600 to-emerald-accent',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  variant = 'gold',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5 text-sm">
          {label && <span className="text-slate-400">{label}</span>}
          {showValue && (
            <span className="text-slate-300 font-medium tabular-nums">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', barColors[variant])}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
