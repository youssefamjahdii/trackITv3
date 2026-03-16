import { cn } from '../utils/cn';

type PulseStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL';

interface PulseBadgeProps {
  status: PulseStatus;
  className?: string;
}

export function PulseBadge({ status, className }: PulseBadgeProps) {
  const styles = {
    HEALTHY: 'bg-[#f2f8f2] text-[#1d8102] border-[#1d8102]',
    WARNING: 'bg-[#fdf3e1] text-[#d13212] border-[#d13212]',
    CRITICAL: 'bg-[#fdf3e1] text-[#d13212] border-[#d13212]',
  };

  const labels = {
    HEALTHY: 'Healthy',
    WARNING: 'Warning',
    CRITICAL: 'Critical',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium border',
        styles[status],
        className
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          status === 'HEALTHY' && 'bg-[#1d8102]',
          status === 'WARNING' && 'bg-[#d13212]',
          status === 'CRITICAL' && 'bg-[#d13212]'
        )}
      />
      {labels[status]}
    </span>
  );
}
