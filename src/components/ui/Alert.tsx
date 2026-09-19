import React from 'react';
import { clsx } from 'clsx';
import { Info, AlertTriangle, CheckCircle2, AlertOctagon } from 'lucide-react';

interface AlertProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'info' | 'warning' | 'success' | 'danger';
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  title,
  children,
  variant = 'info',
  className,
}) => {
  const variantStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    success: 'bg-green-50 border-emerald-200 text-emerald-900',
    danger: 'bg-red-50 border-red-200 text-red-900',
  };

  const icons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle2,
    danger: AlertOctagon,
  };

  const IconComponent = icons[variant];

  return (
    <div className={clsx('p-4 border rounded-md flex gap-3 text-sm font-sans', variantStyles[variant], className)}>
      <IconComponent className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <h4 className="font-bold text-sm mb-1 leading-snug">{title}</h4>}
        <div className="text-xs leading-relaxed opacity-95">{children}</div>
      </div>
    </div>
  );
};
