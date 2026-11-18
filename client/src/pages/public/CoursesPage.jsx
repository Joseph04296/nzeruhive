import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Check,
  Layers3,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import usePublicCourses from '../../hooks/usePublicCourses';
import CourseCard, { SAMPLE_COURSES } from '../../components/common/CourseCard';
import {
  Button,
  CourseCardSkeleton,
  EmptyState,
  Modal,
  Skeleton,
} from '../../components/ui';

const PAGE_SIZE = 9;

const asText = (value) => {
  if (value == null) return '';
  if (Array.isArray(value)) return value.map(asText).filter(Boolean).join(', ');
  return String(value);
};

const asList = (value) => {
  if (Array.isArray(value)) {
    return [...new Set(value.map(asText).map((item) => item.trim()).filter(Boolean))];
  }
  if (typeof value === 'string') {
    return [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))];
  }
  return [];
};

const categoryOf = (course) => asText(course.category).trim();
const levelOf = (course) => asText(course.level || course.difficulty).trim();
const skillsOf = (course) => asList(course.skills);

const minutesOf = (course) => {
  const value = Number(course.minutes ?? course.duration_minutes ?? course.durationMinutes ?? 0);
  return Number.isFinite(value) && value > 0 ? value : Number.POSITIVE_INFINITY;
};

const compareCounts = (a, b) => b.count - a.count || a.name.localeCompare(b.name);

function countValues(courses, getter) {
  const counts = new Map();

  courses.forEach((course) => {
    getter(course).forEach((value) => {
      counts.set(value, (counts.get(value) || 0) + 1);
    });
  });

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort(compareCounts);
}

function scoreCourse(course, needle) {
  const title = asText(course.title).toLowerCase();
  const description = asText(course.description).toLowerCase();
  const category = categoryOf(course).toLowerCase();
  const skills = skillsOf(course).join(' ').toLowerCase();

  if (title === needle) return 6;
  if (title.startsWith(needle)) return 5;
  if (title.includes(needle)) return 4;
  if (category.includes(needle)) return 3;
  if (skills.includes(needle)) return 2;
  if (description.includes(needle)) return 1;
  return 0;
}

function FilterOption({ label, count, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${
        selected
          ? 'bg-primary-100 font-semibold text-primary-800'
          : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
      }`}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <span
          className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
            selected ? 'border-primary-800 bg-primary-800 text-white' : 'border-border bg-white'
          }`}
        >
          {selected && <Check className="h-3 w-3" aria-hidden="true" />}
        </span>
        <span className="truncate">{label}</span>
      </span>
      {typeof count === 'number' && (
        <span className="shrink-0 text-[11px] text-text-muted">{count}</span>
      )}
    </button>
  );
}

function FilterGroup({ title, children, className = '' }) {
  return (
    <div className={className}>
      <h3 className="mb-2 px-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-text-muted">
        {title}
      </h3>
      {children}
    </div>
  );
}

function FilterPanel({
  loading,
  categories,
  levels,
  skills,
  filters,
  setFilter,
  clearFilters,
  hasActiveFilters,
}) {
  const empty = !loading && !categories.length && !levels.length && !skills.length;

  return (
    <div className="nz-card p-4">
      <div className="flex items-center justify-between gap-3 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary-800" aria-hidden="true" />
          <h2 className="font-display text-[15px] font-bold text-text-primary">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-[12px] font-semibold text-primary-800 hover:text-primary-700"
          >
            Clear all
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-5" aria-hidden="true">
          {[5, 3, 4].map((rows, index) => (
            <div key={index}>
              <Skeleton className="mb-2 ml-2.5 h-3 w-20" />
              <div className="space-y-2">
                {Array.from({ length: rows }).map((_, row) => (
                  <Skeleton key={row} className="h-7 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : empty ? (
        <p className="px-2.5 py-5 text-[12px] leading-5 text-text-muted">
          Filters will appear once published courses are available.
        </p>
      ) : (
        <div className="space-y-6 border-t border-border pt-4">
          {categories.length > 0 && (
            <FilterGroup title="Category">
              <div className="space-y-0.5">
                {categories.map((category) => (
                  <FilterOption
                    key={category.name}
                    label={category.name}
                    count={category.count}
                    selected={filters.category === category.name}
                    onClick={() =>
                      setFilter('category', filters.category === category.name ? '' : category.name)
                    }
                  />
                ))}
              </div>
            </FilterGroup>
          )}

          {levels.length > 0 && (
            <FilterGroup title="Level">
              <div className="space-y-0.5">
                {levels.map((level) => (
                  <FilterOption
                    key={level.name}
                    label={level.name}
                    count={level.count}
                    selected={filters.level === level.name}
                    onClick={() => setFilter('level', filters.level === level.name ? '' : level.name)}
                  />
                ))}
              </div>
            </FilterGroup>
          )}

          {skills.length > 0 && (
            <FilterGroup title="Popular skills">
              <div className="flex flex-wrap gap-2 px-1.5">
                {skills.slice(0, 12).map((skill) => (
                  <button
                    key={skill.name}
                    type="button"
                    onClick={() => setFilter('skill', filters.skill === skill.name ? '' : skill.name)}
                    className={`rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors ${
                      filters.skill === skill.name
                        ? 'border-primary-800 bg-primary-800 text-white'
                        : 'border-border bg-white text-text-secondary hover:border-primary-200 hover:text-primary-800'
                    }`}
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
            </FilterGroup>
          )}
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  const { courses, loading, error, reload } = usePublicCourses();
  const [params, setParams] = useSearchParams();
  const [term, setTerm] = useState(params.get('q') || '');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filters = useMemo(
    () => ({
      q: params.get('q') || '',
      category: params.get('category') || '',
      level: params.get('level') || '',
      skill: params.get('skill') || '',
      sort: params.get('sort') || 'recommended',
    }),
    [params],
  );

  const { q, category, level, skill, sort } = filters;

  useEffect(() => {
    setTerm(q);
  }, [q]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [q, category, level, skill, sort, courses]);

  const categories = useMemo(() => countValues(courses, (course) => {
    const value = categoryOf(course);
    return value ? [value] : [];
  }), [courses]);

  const levels = useMemo(() => countValues(courses, (course) => {
    const value = levelOf(course);
    return value ? [value] : [];
  }), [courses]);

  const skills = useMemo(() => countValues(courses, skillsOf), [courses]);

  const filteredCourses = useMemo(() => {
    const needle = q.trim().toLowerCase();

    const matches = courses.filter((course) => {
      if (category && categoryOf(course) !== category) return false;
      if (level && levelOf(course) !== level) return false;
      if (skill && !skillsOf(course).includes(skill)) return false;

      if (!needle) return true;

      const searchable = [
        asText(course.title),
        asText(course.description),
        categoryOf(course),
        skillsOf(course).join(' '),
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(needle);
    });

    const sorted = [...matches];

    if (sort === 'title') {
      sorted.sort((a, b) => asText(a.title).localeCompare(asText(b.title)));
    } else if (sort === 'duration') {
      sorted.sort((a, b) => minutesOf(a) - minutesOf(b));
    } else if (sort === 'lessons') {
      sorted.sort((a, b) => (Number(b.lessons) || 0) - (Number(a.lessons) || 0));
    } else if (sort === 'newest') {
      sorted.sort((a, b) => String(b.id).localeCompare(String(a.id), undefined, { numeric: true }));
    } else if (needle) {
      sorted.sort((a, b) => scoreCourse(b, needle) - scoreCourse(a, needle));
    }

    return sorted;
  }, [courses, q, category, level, skill, sort]);

  const visibleCourses = filteredCourses.slice(0, visibleCount);

  const activeFilters = [
    q && { key: 'q', label: `Search: ${q}` },
    category && { key: 'category', label: `Category: ${category}` },
    level && { key: 'level', label: `Level: ${level}` },
    skill && { key: 'skill', label: `Skill: ${skill}` },
  ].filter(Boolean);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || (key === 'sort' && value === 'recommended')) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setParams(next, { replace: true });
  };

  const clearFilters = () => {
    setTerm('');
    setParams(new URLSearchParams(), { replace: true });
  };

  const submitSearch = (event) => {
    event.preventDefault();
    setFilter('q', term.trim());
  };

  const resultLabel = `${filteredCourses.length} ${
    filteredCourses.length === 1 ? 'course' : 'courses'
  }`;

  const filterPanelProps = {
    loading,
    categories,
    levels,
    skills,
    filters,
    setFilter,
    clearFilters,
    hasActiveFilters: activeFilters.length > 0,
  };

  return (
    <>
      <section className="nz-on-brand relative overflow-hidden border-b border-primary-900 bg-primary-800">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.18), transparent 30%), radial-gradient(circle at 90% 80%, rgba(210,154,91,0.25), transparent 32%)',
          }}
        />
        <div className="nz-container relative py-12 md:py-16">
          <div className="max-w-3xl">
            <p className="nz-eyebrow nz-eyebrow-light">Course catalogue</p>
            <h1 className="mt-3 nz-h1 nz-heading-on-brand">
              Find the right course for where you want to go.
            </h1>
            <p className="mt-4 text-[17px] leading-8 text-white/80 md:text-lg">
              Explore published courses from institutions, educators and organisations across the
              Nzeruhive learning ecosystem.
            </p>
          </div>

          <form onSubmit={submitSearch} role="search" className="mt-8 max-w-3xl">
            <label htmlFor="course-search" className="sr-only">
              Search courses, skills or topics
            </label>
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-white p-2 shadow-sm sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
                  aria-hidden="true"
                />
                <input
                  id="course-search"
                  value={term}
                  onChange={(event) => setTerm(event.target.value)}
                  placeholder="Search by course, skill or topic"
                  className="nz-input h-11 border-transparent pl-9 shadow-none focus:border-primary-800"
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto">
                Search
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              {loading ? 'Loading published courses' : `${courses.length} published courses`}
            </span>
            {!loading && skills.length > 0 && (
              <>
                <span className="hidden h-3 w-px bg-white/20 sm:block" />
                <span>Popular topics:</span>
                {skills.slice(0, 4).map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setFilter('skill', skill === item.name ? '' : item.name)}
                    className={`rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors ${
                      skill === item.name
                        ? 'bg-accent text-primary-900'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      <section className="nz-section bg-background">
        <div className="nz-container grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden self-start lg:sticky lg:top-24 lg:block">
            <FilterPanel {...filterPanelProps} />
          </aside>

          <div className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="nz-h3">Explore courses</h2>
                <p className="nz-small mt-1">
                  {loading ? 'Finding courses…' : `${resultLabel} found`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setFiltersOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                  Filters
                  {activeFilters.length > 0 && (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-800 px-1 text-[10px] text-white">
                      {activeFilters.length}
                    </span>
                  )}
                </Button>

                <label className="flex items-center gap-2 text-[12px] text-text-muted">
                  <span className="hidden sm:inline">Sort by</span>
                  <select
                    value={sort}
                    onChange={(event) => setFilter('sort', event.target.value)}
                    className="nz-input h-10 w-[156px] py-0 text-[13px]"
                    aria-label="Sort courses"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="newest">Newest</option>
                    <option value="title">Title A–Z</option>
                    <option value="duration">Shortest first</option>
                    <option value="lessons">Most lessons</option>
                  </select>
                </label>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {activeFilters.map((active) => (
                  <button
                    key={active.key}
                    type="button"
                    onClick={() => setFilter(active.key, '')}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 py-1 pl-3 pr-2 text-[12px] font-medium text-primary-800 transition-colors hover:bg-primary-200"
                  >
                    {active.label}
                    <X className="h-3 w-3" aria-hidden="true" />
                    <span className="sr-only">Remove filter</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 px-2 py-1 text-[12px] font-semibold text-text-secondary hover:text-primary-800"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  Clear all
                </button>
              </div>
            )}

            <div className="mt-6">
              {loading ? (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <CourseCardSkeleton key={index} />
                  ))}
                </div>
              ) : error ? (
                <EmptyState
                  icon={AlertCircle}
                  title="We couldn’t load courses"
                  description={error}
                  action={
                    <Button onClick={reload} variant="secondary">
                      Try again
                    </Button>
                  }
                />
              ) : courses.length === 0 ? (
                <div>
                  <div className="mb-6 text-center">
                    <h3 className="nz-h4">Courses are coming soon</h3>
                    <p className="nz-small mx-auto mt-2 max-w-lg">
                      Published, publicly discoverable courses will appear here as institutions join
                      Nzeruhive. Here is a design preview of the course card.
                    </p>
                  </div>
                  <div className="grid gap-5 md:grid-cols-3">
                    {SAMPLE_COURSES.map((course) => (
                      <CourseCard key={course.id} course={course} preview />
                    ))}
                  </div>
                  <p className="mt-4 text-center text-[12px] leading-5 text-text-muted">
                    Design previews only — these are not published courses.
                  </p>
                </div>
              ) : filteredCourses.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="No courses match your filters"
                  description="Try a different search term or remove a filter to see more courses."
                  action={
                    <Button variant="secondary" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  }
                />
              ) : (
                <>
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {visibleCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>

                  {visibleCourses.length < filteredCourses.length && (
                    <div className="mt-8 flex flex-col items-center gap-3">
                      <p className="nz-caption">
                        Showing {visibleCourses.length} of {filteredCourses.length} courses
                      </p>
                      <Button
                        variant="secondary"
                        onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                      >
                        Show more courses
                        <Layers3 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Modal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filter courses"
        description="Narrow the catalogue to the courses that fit your goals."
        footer={
          <>
            <Button variant="ghost" onClick={clearFilters}>
              Clear all
            </Button>
            <Button onClick={() => setFiltersOpen(false)}>
              Show {filteredCourses.length}{' '}
              {filteredCourses.length === 1 ? 'course' : 'courses'}
            </Button>
          </>
        }
      >
        <FilterPanel {...filterPanelProps} />
      </Modal>
    </>
  );
}
