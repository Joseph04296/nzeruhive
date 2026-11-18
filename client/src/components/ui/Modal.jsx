import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export default function Modal({ open, onClose, title, description, children, footer, size = 'md' }) {
  const panel = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', onKeyDown);
    panel.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-primary-900/60 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
      role="presentation"
    >
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nz-modal-title"
        aria-describedby={description ? 'nz-modal-description' : undefined}
        className={`relative my-auto w-full ${sizes[size] || sizes.md} rounded-2xl border border-border bg-white p-6 shadow-2xl outline-none sm:p-7`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-3.5 top-3.5 inline-flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-primary-50 hover:text-primary-800"
        >
          <X className="h-4 w-4" />
        </button>

        {title && (
          <div className="pr-8">
            <h2 id="nz-modal-title" className="nz-h3">{title}</h2>
            {description && (
              <p id="nz-modal-description" className="nz-small mt-1.5">{description}</p>
            )}
          </div>
        )}

        {children && <div className={title ? 'mt-5' : ''}>{children}</div>}
        {footer && <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
