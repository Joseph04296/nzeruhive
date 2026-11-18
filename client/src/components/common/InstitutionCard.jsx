import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Layers3 } from 'lucide-react';

export default function InstitutionCard({ institution }) {
  const href = `/institutions/${institution.slug || institution.id}`;
  const seed = (institution.name || 'N').trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

  return (
    <article className="nz-card nz-card-interactive flex h-full flex-col p-5">
      <div className="flex items-start gap-4">
        {institution.logo ? (
          <img
            src={institution.logo}
            alt={`${institution.name} logo`}
            className="h-12 w-12 shrink-0 rounded-lg border border-border object-contain p-1"
          />
        ) : (
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-100 font-display text-sm font-bold text-primary-800">
            {seed}
          </span>
        )}

        <div className="min-w-0">
          <h3 className="font-display text-[16px] font-semibold leading-snug text-text-primary">
            <Link to={href} className="hover:text-primary-800">{institution.name}</Link>
          </h3>
          {institution.sector && (
            <p className="mt-0.5 text-[12px] font-medium text-primary-700">{institution.sector}</p>
          )}
        </div>
      </div>

      {institution.description && (
        <p className="mt-4 line-clamp-3 text-[13px] leading-6 text-text-secondary">
          {institution.description}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <span className="inline-flex items-center gap-1.5 text-[12px] text-text-muted">
          <Layers3 className="h-3.5 w-3.5" aria-hidden="true" />
          {institution.public_course_count != null
            ? `${institution.public_course_count} public courses`
            : 'Academy on Nzeruhive'}
        </span>
        <Link
          to={href}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary-800 transition-colors hover:text-primary-700"
        >
          Explore academy
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
