import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Dropdown({ trigger, children, align = 'left', className = '', panelClassName = '' }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={root} className={`relative ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 items-center gap-1 rounded-lg px-3 text-[14px] font-medium text-text-secondary transition-colors hover:bg-primary-50 hover:text-primary-800"
      >
        {trigger}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className={[
            'absolute top-full z-50 mt-2 w-72 rounded-xl border border-border bg-white p-2 shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
            panelClassName,
          ].join(' ')}
        >
          {typeof children === 'function' ? children({ close: () => setOpen(false) }) : children}
        </div>
      )}
    </div>
  );
}
