export default function Tabs({ items = [], value, onChange, label = 'Tabs', className = '' }) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={`nz-hide-scrollbar flex gap-1 overflow-x-auto ${className}`}
    >
      {items.map((item) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.id)}
            className={[
              'inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-3.5 text-[13px] font-medium transition-colors',
              selected
                ? 'bg-primary-100 text-primary-800'
                : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary',
            ].join(' ')}
          >
            {item.label}
            {typeof item.count === 'number' && (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] ${
                  selected ? 'bg-primary-800 text-white' : 'bg-surface-secondary text-text-muted'
                }`}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
