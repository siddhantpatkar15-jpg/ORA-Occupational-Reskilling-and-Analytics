import * as React from 'react';
import { Spinner } from './spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors cursor-pointer';
    
    const variants = {
      primary: 'bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500 border border-transparent',
      secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-900 focus:ring-slate-500 border border-transparent',
      outline: 'border border-slate-300 hover:bg-slate-50 text-slate-900 focus:ring-slate-500 bg-white',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-900 focus:ring-slate-500 border border-transparent',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border border-transparent',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${(disabled || loading) ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${className}`.trim();

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      return React.cloneElement(child, {
        className: `${classes} ${child.props.className || ''}`.trim(),
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Spinner className="mr-2 h-4 w-4" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
