import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Building2,
  Globe2,
  GraduationCap,
  UserRound,
  Users,
} from 'lucide-react';
import { useAuthDialog } from '../../context/AuthDialogContext';
import { CATEGORY_TAXONOMY, slugify } from '../../data/categories';
import useHomeData from '../../hooks/useHomeData';
import CourseCard, { SAMPLE_COURSES } from '../../components/common/CourseCard';
import LearningPathCard from '../../components/common/LearningPathCard';
import {
  Button,
  CourseCardSkeleton,
  EmptyState,
  SectionHeader,
  Tabs,
} from '../../components/ui';

const organisationBenefits = [
  {
    icon: BookOpen,
    title: 'Create and publish courses',
    description: 'Build structured courses with lessons, videos, materials and assessments.',
  },
  {
    icon: Users,
    title: 'Manage your learning community',
    description: 'Invite learners, assign instructors and organise training programmes.',
  },
  {
    icon: BarChart3,
    title: 'Track learning performance',
    description: 'Monitor enrolments, progress, completion and performance in one place.',
  },
];

const whyCards = [
  {
    icon: Globe2,
    title: 'Multiple learning opportunities',
    description: 'Discover courses across different industries and from different institutions.',
  },
  {
    icon: UserRound,
    title: 'One learning account',
    description: 'Keep your learning connected across every institution you learn with.',
  },
  {
    icon: Award,
    title: 'Recognise your progress',
    description: 'Track achievements and access certificates issued by course providers.',
  },
];

const featuredSlugs = ['technology', 'business-finance', 'healthcare', 'science-research'];

function CoursePreviewGrid({ message }) {
  return (
    <div>
      <div className="grid gap-5 md:grid-cols-3">
        {SAMPLE_COURSES.map((course) => (
          <CourseCard key={course.id} course={course} preview />
        ))}
      </div>
      <p className="mt-4 text-center text-[12px] leading-5 text-text-muted">
        {message || 'Design preview only — these are not published courses.'}
      </p>
    </div>
  );
}

function InstitutionLogos({ institutions }) {
  if (!institutions.length) {
    return (
      <p className="text-[13px] text-white/70">
        Institution logos will appear here once academies are live.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 lg:justify-end">
      {institutions.slice(0, 3).map((institution) => {
        const seed = (institution.name || 'N')
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0])
          .join('')
          .toUpperCase();

        return (
          <div
            key={institution.id || institution.slug}
            title={institution.name}
            className="inline-flex h-16 min-w-[76px] items-center justify-center rounded-xl border border-white/25 bg-white px-4 shadow-sm"
          >
            {institution.logo ? (
              <img
                src={institution.logo}
                alt={`${institution.name} logo`}
                className="h-9 w-9 object-contain"
              />
            ) : (
              <span className="font-display text-sm font-bold text-primary-800">{seed}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  const { categories, courses, institutions, learningPaths, loading, error } = useHomeData();
  const openAuth = useAuthDialog();
  const [activeTab, setActiveTab] = useState('all');

  const categorySource = categories.length ? categories : CATEGORY_TAXONOMY;
  const tabs = [
    { id: 'all', label: 'All courses' },
    ...categorySource
      .filter((category) => featuredSlugs.includes(category.slug || slugify(category.name)))
      .slice(0, 4)
      .map((category) => ({
        id: category.slug || slugify(category.name),
        label: category.name,
        ...(typeof category.course_count === 'number' ? { count: category.course_count } : {}),
      })),
  ];

  const visibleCourses =
    activeTab === 'all'
      ? courses
      : courses.filter((course) => slugify(course.category) === activeTab);

  return (
    <>
      {/* 1. Hero — ThanziLearn-style full-image layout */}
      <section className="nz-on-brand relative isolate overflow-hidden bg-night">
        <img src="/images/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-black/10" />

        <div className="nz-container relative flex items-center py-16 md:py-20 lg:py-24">
          <div className="max-w-lg text-white">
            <h1 className="nz-h1 nz-heading-on-brand text-[2rem] sm:text-[2.5rem] lg:text-[2.85rem]">
              Knowledge opens doors. <span className="text-accent">Find yours on Nzeruhive.</span>
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-white/80">
              Discover courses, develop new skills and learn from institutions shaping the future.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button as={Link} to="/courses" variant="inverse">
                Explore courses
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button as={Link} to="/about" variant="outline-light">
                About us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured courses */}
      <section className="nz-section bg-white">
        <div className="nz-container">
          <SectionHeader
            eyebrow="Explore our courses"
            title="Explore learning opportunities."
            description="Discover courses from institutions, educators and organisations across the Nzeruhive ecosystem."
            action={
              <Button as={Link} to="/courses" variant="text">
                View all courses
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            }
          />

          {tabs.length > 1 && (
            <Tabs
              items={tabs}
              value={activeTab}
              onChange={setActiveTab}
              label="Filter featured courses by category"
              className="mt-8 border-b border-border pb-2"
            />
          )}

          {error && (
            <div className="mt-6 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-[13px] text-[#8A5F1C]">
              Some live content could not be loaded. Showing the course design previews below.
            </div>
          )}

          <div className="mt-8">
            {loading ? (
              <div className="grid gap-5 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <CourseCardSkeleton key={index} />
                ))}
              </div>
            ) : visibleCourses.length ? (
              <div className="grid gap-5 md:grid-cols-3">
                {visibleCourses.slice(0, 3).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <CoursePreviewGrid
                message={
                  activeTab === 'all'
                    ? 'Design previews only — published courses will appear here once institutions go live.'
                    : 'No published courses in this category yet. These are design previews only.'
                }
              />
            )}
          </div>
        </div>
      </section>

      {/* 3. Learn from institutions — heading + logos only */}
      <section className="nz-section-lg nz-on-brand relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src="/images/about.jpg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/55 to-black/35" />
        </div>

        <div className="nz-container grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="nz-h2 nz-heading-on-brand">Learn from institutions.</h2>
          </div>
          {loading ? (
            <div className="flex gap-3" aria-hidden="true">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="nz-skeleton h-16 w-20 rounded-xl" />
              ))}
            </div>
          ) : (
            <InstitutionLogos institutions={institutions} />
          )}
        </div>
      </section>

      {/* 4. Learning paths */}
      <section className="nz-section bg-cream">
        <div className="nz-container">
          <SectionHeader
            eyebrow="Learning paths"
            title="Go beyond individual courses."
            description="Follow curated learning paths designed to help you develop knowledge and skills progressively."
            action={
              <Button as={Link} to="/learning-paths" variant="text">
                View all paths
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            }
          />

          <div className="mt-9">
            {loading ? (
              <div className="grid gap-5 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="nz-card h-[240px]">
                    <div className="nz-skeleton h-32 w-full rounded-lg" />
                    <div className="nz-skeleton mt-5 h-4 w-2/3" />
                    <div className="nz-skeleton mt-2.5 h-3 w-full" />
                  </div>
                ))}
              </div>
            ) : learningPaths.length ? (
              <div className="grid gap-5 md:grid-cols-3">
                {learningPaths.slice(0, 3).map((path) => (
                  <LearningPathCard key={path.id || path.slug} path={path} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={GraduationCap}
                title="Curated learning journeys are on the way"
                description="Nzeruhive administrators will publish learning paths here as the ecosystem grows."
              />
            )}
          </div>
        </div>
      </section>

      {/* 5. For organisations — Designedbg image background */}
      <section className="nz-section-lg nz-on-brand relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src="/images/Designedbg.jpg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/95 via-primary-900/85 to-night/80" />
        </div>

        <div className="nz-container">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <p className="nz-eyebrow nz-eyebrow-light">For organisations</p>
              <h2 className="mt-4 nz-h2 nz-heading-on-brand">
                Your knowledge. Your academy. One connected platform.
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-8 text-white/75 md:text-base">
                Give your organisation the tools to create courses, train learners, manage
                instructors and build a learning community.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button as={Link} to="/organisations/apply" variant="inverse">
                  Create your academy
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button as={Link} to="/organisations" variant="outline-light">
                  Discover institutional solutions
                </Button>
              </div>
            </div>

            <div className="grid gap-3">
              {organisationBenefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.title}
                    className="rounded-xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-4">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-display text-[16px] font-semibold text-white">
                          {benefit.title}
                        </h3>
                        <p className="mt-1.5 text-[13px] leading-6 text-white/70">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why Nzeruhive */}
      <section className="nz-section bg-primary-50">
        <div className="nz-container grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="relative overflow-hidden rounded-[28px] border border-primary-200 bg-white shadow-md">
            <img
              src="/images/why2.jpg"
              alt="Learners working together"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-border bg-white/95 p-4 shadow-lg backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-800">
                Why Nzeruhive
              </p>
              <p className="mt-1.5 font-display text-[15px] font-semibold text-text-primary">
                Built for learners and institutions.
              </p>
            </div>
          </div>

          <div>
            <SectionHeader
              eyebrow="Why Nzeruhive?"
              title="A better way to connect with knowledge."
              description="Built for learners who want flexibility, and institutions that want a serious learning environment."
            />

            <div className="mt-9 grid gap-4 sm:grid-cols-3">
              {whyCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="rounded-xl border border-primary-100 bg-white p-5">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sand text-primary-800">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 font-display text-[15px] font-semibold text-text-primary">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-6 text-text-secondary">
                      {card.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final CTA — no background image */}
      <section className="nz-section-lg nz-on-brand bg-primary-800">
        <div className="nz-container text-center">
          <p className="nz-eyebrow nz-eyebrow-light">Join the ecosystem</p>
          <h2 className="mx-auto mt-4 max-w-3xl nz-h2 nz-heading-on-brand">
            Your next opportunity starts with learning.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-white/75 md:text-base">
            Join a growing ecosystem of learners and organisations sharing knowledge and creating
            opportunities.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="inverse" onClick={() => openAuth('register')}>
              Start learning
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button as={Link} to="/organisations" variant="outline-light">
              For organisations
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
