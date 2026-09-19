import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-civic-accent focus:ring-offset-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-civic-navy hover:bg-civic-blue text-white shadow-sm',
    secondary: 'bg-civic-accent hover:bg-blue-700 text-white shadow-sm',
    outline: 'border border-slate-300 bg-white hover:bg-slate-50 text-civic-dark',
    danger: 'bg-semantic-red hover:bg-red-700 text-white shadow-sm',
    ghost: 'bg-transparent hover:bg-slate-100 text-civic-dark',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-medium',
    md: 'px-4 py-2 text-sm font-semibold',
    lg: 'px-5 py-2.5 text-base font-semibold',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : icon ? (
        <span className="mr-2 inline-flex items-center">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
