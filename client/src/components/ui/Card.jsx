export function Card({ as: Component = 'div', interactive = false, className = '', children, ...props }) {
  return (
    <Component
      className={`nz-card ${interactive ? 'nz-card-interactive' : ''} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ className = '', children, ...props }) {
  return (
    <div className={`mb-4 flex items-start justify-between gap-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className = '', children, ...props }) {
  return <div className={className} {...props}>{children}</div>;
}

export function CardFooter({ className = '', children, ...props }) {
  return (
    <div className={`mt-5 border-t border-border pt-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
