import React from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      leftIcon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 select-none disabled:opacity-50 disabled:cursor-not-allowed min-h-[40px] sm:min-h-[44px]';

    const variants = {
      primary:
        'bg-brand-primary hover:bg-brand-primary-hover text-white focus:ring-brand-primary/40 shadow-sm active:translate-y-[0.5px]',
      accent:
        'bg-brand-accent hover:bg-brand-accent-hover text-white focus:ring-brand-accent/40 shadow-sm active:translate-y-[0.5px]',
      outline:
        'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 focus:ring-slate-300 shadow-sm',
      ghost:
        'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-200',
      danger:
        'bg-red-600 hover:bg-red-700 text-white focus:ring-red-400 shadow-sm active:translate-y-[0.5px]',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[36px]',
      md: 'text-sm px-4 py-2 gap-2 min-h-[42px]',
      lg: 'text-base px-5 py-2.5 gap-2.5 min-h-[48px]',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
