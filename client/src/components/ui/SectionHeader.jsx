export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  onDark = false,
  className = '',
}) {
  const centered = align === 'center';

  return (
    <div
      className={[
        'flex flex-col gap-5 md:flex-row md:items-end md:justify-between',
        centered ? 'md:flex-col md:items-center md:text-center' : '',
        className,
      ].join(' ')}
    >
      <div className={centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && (
          <p className={`nz-eyebrow ${onDark ? 'nz-eyebrow-light' : ''}`}>{eyebrow}</p>
        )}
        <h2 className={`mt-3 nz-h2 ${onDark ? 'nz-heading-on-brand' : ''}`}>{title}</h2>
        {description && (
          <p className={`mt-3 nz-body ${onDark ? 'text-white/75' : ''}`}>{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
