import { forwardRef } from 'react';

const variants = {
  primary:
    'bg-primary-800 text-white shadow-sm hover:bg-primary-700 active:bg-primary-900',
  secondary:
    'border border-primary-800 bg-white text-primary-800 hover:bg-primary-50 active:bg-primary-100',
  soft: 'bg-primary-100 text-primary-800 hover:bg-primary-200 active:bg-primary-100',
  text: 'bg-transparent px-2 text-primary-800 hover:text-primary-700 hover:underline',
  inverse: 'bg-white text-primary-800 shadow-sm hover:bg-primary-100 active:bg-primary-200',
  'outline-light':
    'border border-white/40 bg-transparent text-white hover:bg-white/10 active:bg-white/15',
  ghost: 'bg-transparent text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
};

const sizes = {
  sm: 'h-9 px-3.5 text-[13px]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[15px]',
};

const Button = forwardRef(function Button(
  {
    as: Component = 'button',
    variant = 'primary',
    size = 'md',
    className = '',
    type,
    children,
    ...props
  },
  ref,
) {
  return (
    <Component
      ref={ref}
      type={Component === 'button' ? type || 'button' : undefined}
      className={[
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-semibold',
        'transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50',
        sizes[size] || sizes.md,
        variants[variant] || variants.primary,
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </Component>
  );
});

export default Button;
