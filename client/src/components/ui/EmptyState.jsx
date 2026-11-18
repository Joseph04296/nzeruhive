import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center rounded-xl border border-dashed border-border bg-white px-6 py-12 text-center ${className}`}
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-800">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      {title && <h3 className="mt-4 nz-h4">{title}</h3>}
      {description && <p className="nz-small mt-2 max-w-md">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
