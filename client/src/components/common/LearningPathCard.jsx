import { Link } from 'react-router-dom';
import { ArrowRight, Clock3, Layers3 } from 'lucide-react';

export default function LearningPathCard({ path }) {
  const href = `/learning-paths/${path.slug || path.id}`;

  return (
    <article className="nz-card nz-card-interactive flex h-full flex-col overflow-hidden p-0">
      {path.cover_image && (
        <Link to={href} tabIndex={-1} aria-hidden="true" className="block aspect-[16/8] overflow-hidden">
          <img src={path.cover_image} alt="" loading="lazy" className="h-full w-full object-cover" />
        </Link>
      )}
      <div className="flex flex-1 flex-col p-5">
        {path.eyebrow && <p className="nz-eyebrow">{path.eyebrow}</p>}
        <h3 className={`font-display text-[17px] font-semibold leading-snug text-text-primary ${path.eyebrow ? 'mt-2.5' : ''}`}>
          <Link to={href} className="hover:text-primary-800">{path.title}</Link>
        </h3>
        {path.description && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-text-secondary">{path.description}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-text-muted">
          {path.course_count != null && (
            <span className="inline-flex items-center gap-1.5">
              <Layers3 className="h-3.5 w-3.5" aria-hidden="true" />
              {path.course_count} courses
            </span>
          )}
          {path.estimated_duration && (
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              {path.estimated_duration}
            </span>
          )}
        </div>

        <Link
          to={href}
          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-semibold text-primary-800 transition-colors hover:text-primary-700"
        >
          View learning path
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
