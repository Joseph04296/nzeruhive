import { forwardRef, useId } from 'react';

export function Field({ label, hint, error, htmlFor, required, children, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <label className="nz-label" htmlFor={htmlFor}>
          {label}
          {required && <span className="ml-1 text-error">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="nz-error-text" id={htmlFor ? `${htmlFor}-error` : undefined}>
          {error}
        </p>
      ) : hint ? (
        <p className="nz-help" id={htmlFor ? `${htmlFor}-hint` : undefined}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id, error, hint) {
  if (error && id) return `${id}-error`;
  if (hint && id) return `${id}-hint`;
  return undefined;
}

export const Input = forwardRef(function Input(
  { label, hint, error, id, className = '', required, ...props },
  ref,
) {
  const generated = useId();
  const inputId = id || generated;

  return (
    <Field label={label} hint={hint} error={error} htmlFor={inputId} required={required}>
      <input
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy(inputId, error, hint)}
        className={`nz-input ${className}`}
        {...props}
      />
    </Field>
  );
});

export const Textarea = forwardRef(function Textarea(
  { label, hint, error, id, className = '', rows = 4, required, ...props },
  ref,
) {
  const generated = useId();
  const inputId = id || generated;

  return (
    <Field label={label} hint={hint} error={error} htmlFor={inputId} required={required}>
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy(inputId, error, hint)}
        className={`nz-input h-auto min-h-[104px] resize-y py-3 ${className}`}
        {...props}
      />
    </Field>
  );
});

export const Select = forwardRef(function Select(
  { label, hint, error, id, className = '', children, required, ...props },
  ref,
) {
  const generated = useId();
  const inputId = id || generated;

  return (
    <Field label={label} hint={hint} error={error} htmlFor={inputId} required={required}>
      <select
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy(inputId, error, hint)}
        className={`nz-input pr-10 ${className}`}
        {...props}
      >
        {children}
      </select>
    </Field>
  );
});
