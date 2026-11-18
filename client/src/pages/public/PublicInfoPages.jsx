import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  CheckCircle2,
  GraduationCap,
  Mail,
  Users,
} from 'lucide-react';
import InstitutionCard from '../../components/common/InstitutionCard';
import LearningPathCard from '../../components/common/LearningPathCard';
import {
  Button,
  Card,
  EmptyState,
  Input,
  InstitutionCardSkeleton,
  SectionHeader,
  Select,
  Textarea,
} from '../../components/ui';
import useHomeData from '../../hooks/useHomeData';

function PageIntro({ eyebrow, title, description, children }) {
  return (
    <section className="border-b border-primary-100 bg-gradient-to-br from-primary-50 via-white to-sand">
      <div className="nz-container py-12 md:py-16">
        <div className="max-w-3xl">
          <p className="nz-eyebrow">{eyebrow}</p>
          <h1 className="mt-3 nz-h1">{title}</h1>
          <p className="mt-4 nz-body-lg">{description}</p>
          {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  );
}

export function InstitutionsPage() {
  const { institutions, loading } = useHomeData();

  return (
    <>
      <PageIntro
        eyebrow="Institutions"
        title="Discover academies on Nzeruhive."
        description="Universities, companies, research bodies and organisations sharing knowledge through their own learning spaces."
      />

      <section className="nz-section bg-background">
        <div className="nz-container">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <InstitutionCardSkeleton key={index} />
              ))}
            </div>
          ) : institutions.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {institutions.map((institution) => (
                <InstitutionCard key={institution.id || institution.slug} institution={institution} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Building2}
              title="Academies are being onboarded"
              description="Approved institutions will appear here once their academies are live."
              action={
                <Button as={Link} to="/organisations/apply" variant="secondary">
                  Create an academy
                </Button>
              }
            />
          )}
        </div>
      </section>
    </>
  );
}

export function InstitutionDetailPage() {
  const { slug } = useParams();
  const { institutions, loading } = useHomeData();
  const institution = institutions.find((item) => item.slug === slug || String(item.id) === slug);

  return (
    <>
      <PageIntro
        eyebrow="Institution academy"
        title={institution ? institution.name : 'Academy preview'}
        description={
          institution?.description ||
          'Academy details and public courses will appear here once this institution is live.'
        }
      />
      <section className="nz-section bg-background">
        <div className="nz-container">
          {loading ? (
            <div className="nz-card h-40">Loading academy…</div>
          ) : institution ? (
            <Card className="max-w-2xl">
              <InstitutionCard institution={institution} />
            </Card>
          ) : (
            <EmptyState
              icon={Building2}
              title="This academy is not available yet"
              description="The institution may still be under review or may not have published public courses."
              action={<Button as={Link} to="/institutions">Browse institutions</Button>}
            />
          )}
        </div>
      </section>
    </>
  );
}

export function LearningPathsPage() {
  const { learningPaths, loading } = useHomeData();

  return (
    <>
      <PageIntro
        eyebrow="Learning paths"
        title="Structured journeys for deeper learning."
        description="Follow curated sequences of courses and build skills step by step."
      />

      <section className="nz-section bg-background">
        <div className="nz-container">
          {loading ? (
            <div className="nz-card h-40">Loading learning paths…</div>
          ) : learningPaths.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {learningPaths.map((path) => (
                <LearningPathCard key={path.id || path.slug} path={path} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={GraduationCap}
              title="Learning paths are coming soon"
              description="Published journeys will appear here as the catalogue grows."
              action={<Button as={Link} to="/courses">Explore courses</Button>}
            />
          )}
        </div>
      </section>
    </>
  );
}

export function LearningPathDetailPage() {
  const { slug } = useParams();
  const { learningPaths, loading } = useHomeData();
  const path = learningPaths.find((item) => item.slug === slug || String(item.id) === slug);

  return (
    <>
      <PageIntro
        eyebrow="Learning path"
        title={path ? path.title : 'Learning path preview'}
        description={path?.description || 'This curated journey will be published here soon.'}
      />
      <section className="nz-section bg-background">
        <div className="nz-container">
          {loading ? (
            <div className="nz-card h-40">Loading learning path…</div>
          ) : path ? (
            <div className="max-w-2xl">
              <LearningPathCard path={path} />
            </div>
          ) : (
            <EmptyState
              icon={GraduationCap}
              title="This learning path is not available yet"
              description="Explore the course catalogue in the meantime."
              action={<Button as={Link} to="/courses">Explore courses</Button>}
            />
          )}
        </div>
      </section>
    </>
  );
}

const orgFeatures = [
  {
    icon: BookOpen,
    title: 'Course creation',
    description: 'Build structured courses with lessons, resources, assignments and assessments.',
  },
  {
    icon: Users,
    title: 'Learner and instructor management',
    description: 'Invite your people, assign roles and organise learning by cohort or department.',
  },
  {
    icon: BarChart3,
    title: 'Learning analytics',
    description: 'Understand enrolments, progress, completion and performance across your academy.',
  },
  {
    icon: Building2,
    title: 'Your own academy',
    description: 'Present your organisation’s identity through your logo, colours and course catalogue.',
  },
];

export function OrganisationPage() {
  return (
    <>
      <section className="bg-primary-50">
        <div className="nz-container grid items-center gap-12 py-14 md:py-20 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="nz-eyebrow">For organisations</p>
            <h1 className="mt-4 nz-display">Your knowledge. Your academy. One connected platform.</h1>
            <p className="mt-5 max-w-xl nz-body-lg">
              Nzeruhive gives organisations the infrastructure to teach, train and measure learning — while learners discover everything from one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to="/organisations/apply">
                Create your academy
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button as={Link} to="/contact" variant="secondary">
                Talk to our team
              </Button>
            </div>
          </div>
          <Card className="bg-white p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {orgFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-xl border border-border bg-background p-4">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-800">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <h2 className="mt-3 font-display text-[15px] font-semibold text-text-primary">{feature.title}</h2>
                    <p className="mt-1.5 text-[12px] leading-5 text-text-secondary">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </section>

      <section className="nz-section bg-white">
        <div className="nz-container">
          <SectionHeader
            eyebrow="How it works"
            title="From application to academy."
            align="center"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ['Apply', 'Tell us about your organisation and how you plan to use Nzeruhive.'],
              ['Set up', 'Verify your details, configure branding and invite your team.'],
              ['Publish', 'Create courses, enrol learners and track your academy’s performance.'],
            ].map(([title, description], index) => (
              <Card key={title}>
                <span className="font-display text-2xl font-bold text-primary-200">0{index + 1}</span>
                <h3 className="mt-3 font-display text-[17px] font-semibold text-text-primary">{title}</h3>
                <p className="mt-2 text-[13px] leading-6 text-text-secondary">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function OrganisationApplyPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageIntro
        eyebrow="Create an academy"
        title="Apply to join Nzeruhive."
        description="Tell us a little about your organisation. Our team reviews every application before activating an institutional workspace."
      />

      <section className="nz-section bg-background">
        <div className="nz-container max-w-3xl">
          <Card className="p-6 md:p-8">
            {sent && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-success/30 bg-success/10 p-4 text-[13px] text-success">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p>
                  Application details captured for this preview. The application will be stored once the institutional workflow is connected.
                </p>
              </div>
            )}

            <form
              className="grid gap-5"
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
            >
              <Input label="Organisation name" name="organisation" placeholder="e.g. SPARC Technologies" required />
              <div className="grid gap-5 sm:grid-cols-2">
                <Select label="Organisation type" name="type" required defaultValue="">
                  <option value="" disabled>Select a type</option>
                  <option>University or college</option>
                  <option>Technology company</option>
                  <option>Healthcare institution</option>
                  <option>Research organisation</option>
                  <option>Financial institution</option>
                  <option>NGO or development organisation</option>
                  <option>Other</option>
                </Select>
                <Input label="Website" name="website" type="url" placeholder="https://example.org" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Contact name" name="contact" placeholder="Full name" required />
                <Input label="Work email" name="email" type="email" placeholder="name@organisation.org" required />
              </div>
              <Textarea
                label="What would you like to use Nzeruhive for?"
                name="message"
                placeholder="Tell us about your learners, courses and goals."
              />
              <div className="flex flex-wrap gap-3 border-t border-border pt-5">
                <Button type="submit">Submit application</Button>
                <Button as={Link} to="/organisations" variant="secondary">
                  Learn more first
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </section>
    </>
  );
}

export function HelpPage() {
  return (
    <>
      <PageIntro
        eyebrow="Help centre"
        title="How can we help?"
        description="Find answers about learning, accounts and using Nzeruhive."
        action={<Button as={Link} to="/contact">Contact support</Button>}
      />
      <section className="nz-section bg-background">
        <div className="nz-container grid gap-4 md:grid-cols-3">
          {[
            ['Learners', 'Browsing courses, enrolling, progress and certificates.'],
            ['Institutions', 'Applications, academies, courses and learner management.'],
            ['Accounts', 'Sign in, profile details and account settings.'],
          ].map(([title, description]) => (
            <Card key={title}>
              <h2 className="nz-h4">{title}</h2>
              <p className="mt-2 text-[13px] leading-6 text-text-secondary">{description}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}

export function FaqPage() {
  const faqs = [
    ['Do I need an account to browse courses?', 'No. You can explore courses and institutions without signing in. An account is needed to enrol and track progress.'],
    ['Do I need separate accounts for each institution?', 'No. One Nzeruhive account works across every institution you learn with.'],
    ['Can an organisation create its own academy?', 'Yes. Organisations can apply to create an academy and manage their own courses and learners.'],
    ['Are all courses free?', 'Course access depends on the provider and course settings. Free and paid courses will be labelled clearly.'],
  ];

  return (
    <>
      <PageIntro eyebrow="FAQs" title="Frequently asked questions." description="Quick answers about Nzeruhive." />
      <section className="nz-section bg-background">
        <div className="nz-container mx-auto max-w-3xl space-y-3">
          {faqs.map(([question, answer]) => (
            <Card key={question}>
              <h2 className="font-display text-[16px] font-semibold text-text-primary">{question}</h2>
              <p className="mt-2 text-[13px] leading-6 text-text-secondary">{answer}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}

export function CookiePolicyPage() {
  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title="Cookie policy"
        description="How Nzeruhive uses essential browser storage to keep the platform working."
      />
      <section className="nz-section bg-background">
        <div className="nz-container max-w-3xl space-y-4">
          <Card>
            <h2 className="nz-h4">Essential storage</h2>
            <p className="mt-2 text-[13px] leading-6 text-text-secondary">
              Nzeruhive uses local browser storage to remember your sign-in session and preferences. This version does not use analytics or advertising cookies.
            </p>
          </Card>
          <Card className="flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-800" aria-hidden="true" />
            <p className="text-[13px] leading-6 text-text-secondary">
              Questions about data handling can be sent to{' '}
              <a href="mailto:hello@nzeruhive.org" className="font-semibold text-primary-800">hello@nzeruhive.org</a>.
            </p>
          </Card>
        </div>
      </section>
    </>
  );
}
