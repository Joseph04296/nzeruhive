import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Cog,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Sprout,
  Sparkles,
  Code2,
} from 'lucide-react';

const icons = {
  technology: Code2,
  business: BriefcaseBusiness,
  'business-finance': BriefcaseBusiness,
  healthcare: HeartPulse,
  science: FlaskConical,
  'science-research': FlaskConical,
  education: GraduationCap,
  agriculture: Sprout,
  engineering: Cog,
  'personal-development': Sparkles,
};

function iconFor(category) {
  const key = (category.slug || category.name || '').toLowerCase().replace(/\s+/g, '-');
  return icons[key] || BookOpen;
}

export default function CategoryCard({ category }) {
  const Icon = iconFor(category);
  const name = category.name || category.title;
  const href = `/courses?category=${encodeURIComponent(name || '')}`;

  return (
    <Link
      to={href}
      className="nz-card nz-card-interactive group block p-5"
      aria-label={`Browse ${name} courses`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-800">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <ArrowUpRight className="h-4 w-4 text-text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-800" aria-hidden="true" />
      </div>
      <h3 className="mt-4 font-display text-[15px] font-semibold text-text-primary">{name}</h3>
      <p className="mt-1 text-[12px] text-text-muted">
        {category.course_count != null
          ? `${category.course_count} ${category.course_count === 1 ? 'course' : 'courses'}`
          : 'Explore courses'}
      </p>
    </Link>
  );
}
