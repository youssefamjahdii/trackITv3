import { cn } from '../utils/cn';

type PulseStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL';

interface PulseBadgeProps {
  status: PulseStatus;
  className?: string;
}

export function PulseBadge({ status, className }: PulseBadgeProps) {
  const styles = {
    HEALTHY: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    WARNING: 'bg-amber-100 text-amber-800 border-amber-200',
    CRITICAL: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  const labels = {
    HEALTHY: 'Healthy',
    WARNING: 'Warning',
    CRITICAL: 'Critical',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        styles[status],
        className
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          status === 'HEALTHY' && 'bg-emerald-500',
          status === 'WARNING' && 'bg-amber-500',
          status === 'CRITICAL' && 'bg-rose-500'
        )}
      />
      {labels[status]}
    </span>
  );
}
