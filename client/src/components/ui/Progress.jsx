export default function Progress({
  value = 0,
  label,
  showValue = true,
  size = 'md',
  tone = 'brand',
  className = '',
}) {
  const safe = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  const fill = tone === 'success' ? 'bg-success' : tone === 'light' ? 'bg-white' : 'bg-primary-800';

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between gap-3 text-[12px] font-medium text-text-secondary">
          {label && <span>{label}</span>}
          {showValue && <span>{safe}%</span>}
        </div>
      )}
      <div
        className={`${height} w-full overflow-hidden rounded-full bg-surface-secondary`}
        role="progressbar"
        aria-valuenow={safe}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={label || 'Progress'}
      >
        <div className={`h-full rounded-full ${fill} transition-[width] duration-300`} style={{ width: `${safe}%` }} />
      </div>
    </div>
  );
}
