import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Brand({ to = '/', onDark = false, compact = false, className = '' }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 font-display text-lg font-bold tracking-[-0.025em] ${
        onDark ? 'text-white hover:text-white' : 'text-primary-800 hover:text-primary-800'
      } ${className}`}
      aria-label="Nzeruhive home"
    >
      <span
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${
          onDark ? 'bg-white/15 text-white' : 'bg-primary-800 text-white'
        }`}
      >
        <BookOpen className="h-4 w-4" aria-hidden="true" />
      </span>
      {!compact && <span>Nzeruhive</span>}
    </Link>
  );
}
