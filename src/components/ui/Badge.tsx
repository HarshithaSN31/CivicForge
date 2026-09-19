import React from 'react';
import { clsx } from 'clsx';
import { IssueStatus, IssueSeverity } from '../../types';
import { CheckCircle2, AlertTriangle, AlertOctagon, Clock, Info } from 'lucide-react';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'green' | 'amber' | 'red' | 'blue' | 'neutral';
  status?: IssueStatus;
  severity?: IssueSeverity;
  size?: 'sm' | 'md';
  icon?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  status,
  severity,
  size = 'md',
  icon = true,
  className,
}) => {
  // Determine variant and icon from status or severity if provided
  let computedVariant: 'green' | 'amber' | 'red' | 'blue' | 'neutral' = variant || 'neutral';
  let IconComponent: React.ComponentType<{ className?: string }> | null = null;
  let labelText = children;

  if (status) {
    switch (status) {
      case 'RESOLVED':
        computedVariant = 'green';
        IconComponent = CheckCircle2;
        labelText = labelText || 'Resolved';
        break;
      case 'UNDER_REVIEW':
        computedVariant = 'amber';
        IconComponent = Clock;
        labelText = labelText || 'Under Review';
        break;
      case 'ASSIGNED':
      case 'IN_PROGRESS':
        computedVariant = 'blue';
        IconComponent = Info;
        labelText = labelText || status.replace('_', ' ');
        break;
      case 'REPORTED':
      default:
        computedVariant = 'neutral';
        IconComponent = Clock;
        labelText = labelText || 'Reported';
        break;
    }
  } else if (severity) {
    switch (severity) {
      case 'CRITICAL':
        computedVariant = 'red';
        IconComponent = AlertOctagon;
        labelText = labelText || 'Critical Severity';
        break;
      case 'HIGH':
        computedVariant = 'red';
        IconComponent = AlertTriangle;
        labelText = labelText || 'High Severity';
        break;
      case 'MEDIUM':
        computedVariant = 'amber';
        IconComponent = AlertTriangle;
        labelText = labelText || 'Medium Severity';
        break;
      case 'LOW':
      default:
        computedVariant = 'blue';
        IconComponent = Info;
        labelText = labelText || 'Low Severity';
        break;
    }
  }

  const variantStyles = {
    green: 'bg-green-50 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-50 text-amber-900 border-amber-200',
    red: 'bg-red-50 text-red-800 border-red-200',
    blue: 'bg-blue-50 text-blue-800 border-blue-200',
    neutral: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-2.5 py-1 text-xs font-bold',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-md border font-sans tracking-wide',
        variantStyles[computedVariant],
        sizes[size],
        className
      )}
    >
      {icon && IconComponent && <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>{labelText}</span>
    </span>
  );
};
