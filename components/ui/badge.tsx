import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'secondary' | 'destructive';
  size?: 'sm' | 'md';
}

export function Badge({ className = '', variant = 'default', size = 'sm', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#ad8075]/15 text-[#916358] border border-[#ad8075]/30',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-[#304250]/10 text-[#304250]',
    outline: 'border border-[#304250]/30 text-[#304250] bg-transparent',
    secondary: 'bg-[#304250]/15 text-[#304250]',
    destructive: 'bg-red-100 text-red-800',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  );
}
