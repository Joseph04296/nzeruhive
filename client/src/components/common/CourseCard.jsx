import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock3, Layers3 } from 'lucide-react';

const fallbackImages = [
  '/images/course.jpg',
  '/images/herobg2.jpg',
  '/images/learner.jpg',
];

export const SAMPLE_COURSES = [
  {
    id: 'design-preview-data',
    title: 'Foundations of Data Literacy',
    description: 'Build confidence working with data, evidence and everyday digital tools.',
    category: 'Technology',
    level: 'Beginner',
    lessons: 12,
    minutes: 360,
    image: '/images/course.jpg',
  },
  {
    id: 'design-preview-research',
    title: 'Practical Research Methods',
    description: 'Learn how to frame questions, gather evidence and communicate findings.',
    category: 'Science & Research',
    level: 'Intermediate',
    lessons: 10,
    minutes: 300,
    image: '/images/herobg2.jpg',
  },
  {
    id: 'design-preview-communication',
    title: 'Communication for Modern Teams',
    description: 'Develop clear, confident communication habits for collaborative work.',
    category: 'Business & Finance',
    level: 'All levels',
    lessons: 8,
    minutes: 240,
    image: '/images/learner.jpg',
  },
];

export const SAMPLE_COURSE = SAMPLE_COURSES[0];

function imageFor(course) {
  if (course.image) return course.image;
  const seed = [...(course.title || '')].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return fallbackImages[seed % fallbackImages.length];
}

function duration(course) {
  if (course.duration) return course.duration;
  const minutes = Number(course.minutes) || 0;
  if (!minutes) return 'Self-paced';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

export default function CourseCard({ course, to, preview = false }) {
  const progress = course.done > 0
    ? Math.min(100, Math.round((Number(course.done) / Math.max(Number(course.lessons) || 1, 1)) * 100))
    : 0;
  const href = to || `/courses/${course.id}`;

  const Media = preview ? 'div' : Link;
  const mediaProps = preview ? {} : { to: href, tabIndex: -1, 'aria-hidden': true };
  const Title = preview ? 'span' : Link;
  const titleProps = preview ? {} : { to: href, className: 'hover:text-primary-800' };

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white transition hover:border-primary-200 hover:shadow-md ${
        preview ? '' : 'nz-card-interactive'
      }`}
      aria-label={preview ? 'Sample course card design preview' : undefined}
    >
      <Media {...mediaProps} className="relative h-48 overflow-hidden border-b border-border bg-surface-secondary sm:h-52">
        <img
          src={imageFor(course)}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        {preview && (
          <span className="absolute left-3 top-3 rounded-full bg-primary-900/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
            Design preview
          </span>
        )}
      </Media>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-base font-semibold leading-snug text-text-primary">
          <Title {...titleProps}>{course.title}</Title>
        </h3>

        {course.description && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-text-secondary">
            {course.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-muted">
          <span className="inline-flex items-center gap-1.5" title="Level">
            <Layers3 className="h-3.5 w-3.5" aria-hidden="true" />
            {course.level || 'All levels'}
          </span>
          <span className="inline-flex items-center gap-1.5" title="Lessons">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            {course.lessons ?? 0}
          </span>
          <span className="inline-flex items-center gap-1.5" title="Duration">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            {duration(course)}
          </span>
        </div>

        {course.done > 0 && (
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-[11px] font-medium text-text-muted">
              <span>{course.passed ? 'Completed' : 'Progress'}</span>
              <span>{course.passed ? '100%' : `${progress}%`}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-secondary">
              <div
                className="h-full rounded-full bg-primary-800"
                style={{ width: `${course.passed ? 100 : progress}%` }}
              />
            </div>
          </div>
        )}

        {preview ? (
          <span className="mt-auto pt-5 text-sm font-medium text-text-muted">Preview only</span>
        ) : (
          <Link
            to={href}
            className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-primary-800 transition-all group-hover:gap-2.5"
          >
            View course
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  );
}
