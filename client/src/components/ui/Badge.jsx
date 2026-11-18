const variants = {
  neutral: 'bg-surface-secondary text-text-secondary',
  outline: 'border border-border bg-white text-text-secondary',
  brand: 'bg-primary-100 text-primary-800',
  'brand-outline': 'border border-primary-200 bg-white text-primary-800',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-[#8A5F1C]',
  error: 'bg-error/10 text-error',
  info: 'bg-info/10 text-info',
};

export default function Badge({ variant = 'neutral', className = '', children, ...props }) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none',
        variants[variant] || variants.neutral,
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </span>
  );
}
