import * as React from 'react';
import { Spinner } from './spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
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
      primary: 'bg-[#ad8075] hover:bg-[#916358] text-white focus:ring-[#ad8075] shadow-sm border border-transparent',
      secondary: 'bg-[#304250] hover:bg-[#22303c] text-white focus:ring-[#304250] border border-transparent',
      outline: 'border border-[#304250]/20 hover:bg-[#f8f6f1] text-[#304250] focus:ring-[#304250] bg-white',
      ghost: 'bg-transparent hover:bg-[#f8f6f1] text-[#304250] focus:ring-[#304250] border border-transparent',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border border-transparent',
      link: 'bg-transparent text-[#ad8075] hover:text-[#916358] hover:underline p-0 h-auto border-none focus:ring-0',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      icon: 'h-9 w-9 p-0 flex items-center justify-center',
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
