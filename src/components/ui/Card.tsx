import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverable = false, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-civic-surface border border-civic-border rounded-lg shadow-civic overflow-hidden transition-all duration-200',
        hoverable && 'hover:shadow-civic-lg hover:border-slate-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={clsx('px-5 py-4 border-b border-civic-border bg-slate-50/50 flex items-center justify-between', className)}>
      {children}
    </div>
  );
};

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={clsx('p-5', className)}>{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={clsx('px-5 py-3.5 border-t border-civic-border bg-slate-50/40 flex items-center justify-between text-xs', className)}>
      {children}
    </div>
  );
};
