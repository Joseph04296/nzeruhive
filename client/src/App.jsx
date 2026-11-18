import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AdminCourses, CourseEditor, Dashboard, Users } from './Admin.jsx';

const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://thanzilearn.onrender.com' : 'http://localhost:5000');

const Ctx = createContext(null);
const useAuth = () => useContext(Ctx);

// Opens the global login/register dialog from anywhere on the public site.
const AuthDialogCtx = createContext(() => {});
const useAuthDialog = () => useContext(AuthDialogCtx);

const inp = 'h-11 w-full rounded-lg border border-border bg-white px-3.5 text-sm text-forest placeholder:text-muted/80 transition focus:border-teal';
const btn = 'inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-teal px-5 text-sm font-semibold text-white transition hover:bg-[#0F52B5] disabled:cursor-not-allowed disabled:opacity-60';
const btnOutline = 'inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-5 text-sm font-semibold text-forest transition hover:border-teal/50 hover:text-teal';
const btnSoft = 'inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-white px-5 text-sm font-semibold text-forest transition hover:border-teal/50 hover:text-teal';
const card = 'min-w-0 rounded-xl border border-border bg-white p-5 sm:p-6';
const darkCard = 'min-w-0 rounded-xl bg-forest p-5 sm:p-6';

// Shared type scale: one eyebrow, one heading hierarchy and one body size across pages.
const eyebrowCls = 'text-[11px] font-semibold uppercase tracking-[0.14em] text-teal';
const eyebrowOnDark = 'text-[11px] font-semibold uppercase tracking-[0.14em] text-mint/90';
const h1Cls = 'font-display text-[2rem] font-semibold leading-[1.12] tracking-[-0.02em] text-forest sm:text-[2.5rem]';
const h2Cls = 'font-display text-2xl font-semibold leading-[1.2] tracking-[-0.015em] text-forest md:text-[2rem]';
const h3Cls = 'font-display text-base font-semibold text-forest md:text-[1.0625rem]';
const bodyCls = 'text-[15px] leading-7 text-body md:text-base';
const sectionCls = 'py-14 md:py-20';


const Icon = ({ name, className = 'h-5 w-5' }) => {
  const p = { className, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true' };
  if (name === 'book') return <svg {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
  if (name === 'check') return <svg {...p}><path d="M20 6 9 17l-5-5"/></svg>;
  if (name === 'clock') return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
  if (name === 'device') return <svg {...p}><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>;
  if (name === 'award') return <svg {...p}><circle cx="12" cy="8" r="5"/><path d="M8.5 12.5 7 22l5-3 5 3-1.5-9.5"/></svg>;
  if (name === 'shield') return <svg {...p}><path d="M12 3 5 6v6c0 5 3.5 8 7 9 3.5-1 7-4 7-9V6l-7-3z"/><path d="m9 12 2 2 4-4"/></svg>;
  if (name === 'play') return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z" fill="currentColor" stroke="none"/></svg>;
  if (name === 'search') return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
  if (name === 'user') return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>;
  if (name === 'mail') return <svg {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>;
  if (name === 'arrow') return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
  if (name === 'menu') return <svg {...p}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
  if (name === 'x') return <svg {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>;
  if (name === 'layers') return <svg {...p}><path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/></svg>;
  if (name === 'globe') return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg>;
  if (name === 'bell') return <svg {...p}><path d="M18 8a6 6 0 1 0-12 0c0 6-3 7-3 7h18s-3-1-3-7"/><path d="M10.3 21a2 2 0 0 0 3.4 0"/></svg>;
  if (name === 'chevron') return <svg {...p}><path d="m6 9 6 6 6-6"/></svg>;
  if (name === 'home') return <svg {...p}><path d="m3 10.5 9-7.5 9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M9.5 20v-6h5v6"/></svg>;
  return <svg {...p}><circle cx="12" cy="12" r="9"/></svg>;
};

const fmt = (m = 0) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}` : `${m} min`);
const pct = (done, total) => (total ? Math.round((done / total) * 100) : 0);
const initials = (name = '') => name.trim().split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase() || '').join('') || 'U';

// Local catalogue. It keeps the public pages complete when the API is empty
// (for example on a fresh deployment before seed data is loaded), and gives
// these sample courses their own working detail pages.
const SAMPLE_COURSES = [
  {
    id: 'sample-1',
    title: 'Safe medication administration',
    category: 'Patient safety',
    level: 'Beginner',
    image: '/images/medication.jpg',
    description: 'The five rights, allergy checks and recording, for safer medicine rounds.',
    about: [
      'Every medicine round carries risk. This short course walks through the practical checks that prevent the most common medication errors, from confirming the right patient to recording a dose correctly.',
      'Lessons are written for frontline staff working in busy wards and clinics. You will practise a simple, repeatable checking routine and learn what to do when something goes wrong.',
    ],
    outcomes: [
      'Apply the five rights before every dose',
      'Check allergies and the medication chart correctly',
      'Handle high-risk medicines with a second check',
      'Record doses accurately and report errors safely',
    ],
    pass_mark: 70,
    questions: 3,
    curriculum: [
      { id: 's1-l1', title: 'The five rights', duration_min: 5 },
      { id: 's1-l2', title: 'Allergies and high-risk medicines', duration_min: 6 },
      { id: 's1-l3', title: 'Preparing and checking a dose', duration_min: 5 },
      { id: 's1-l4', title: 'Record, report and learn', duration_min: 5 },
    ],
  },
  {
    id: 'sample-2',
    title: 'TB basics for frontline staff',
    category: 'Infectious disease',
    level: 'Beginner',
    image: '/images/TB.jpg',
    description: 'How TB spreads, how to spot possible cases, and how to protect yourself and others.',
    about: [
      'Tuberculosis is still one of the most common infectious diseases in the region, and frontline staff are often the first to notice the signs. This course covers how TB spreads, who is most at risk, and how to refer a patient for testing.',
      'You will also learn the practical infection-prevention steps that protect staff, patients and visitors in waiting areas and consultation rooms.',
    ],
    outcomes: [
      'Explain how TB spreads and who is most at risk',
      'Recognise the common symptoms of possible TB',
      'Refer patients for testing using national guidelines',
      'Protect yourself and others with ventilation and masks',
    ],
    pass_mark: 70,
    questions: 3,
    curriculum: [
      { id: 's2-l1', title: 'How TB spreads', duration_min: 5 },
      { id: 's2-l2', title: 'Recognising possible TB', duration_min: 5 },
      { id: 's2-l3', title: 'Testing and referral', duration_min: 5 },
      { id: 's2-l4', title: 'Protecting yourself and others', duration_min: 6 },
    ],
  },
  {
    id: 'sample-3',
    title: 'AI in healthcare: the basics',
    category: 'Digital health',
    level: 'Beginner',
    image: '/images/Ai+health.jpg',
    description: 'What AI tools can and cannot do, and how to use their results carefully.',
    about: [
      'AI tools are increasingly used to read scans, flag risk and support triage. This introductory course explains what these tools actually do, where they help, and where clinical judgement must stay in charge.',
      'You will look at false positives, false negatives and patient privacy, and practise treating an AI result as one input rather than an answer.',
    ],
    outcomes: [
      'Describe what healthcare AI tools can and cannot do',
      'Combine AI results with clinical judgement',
      'Recognise false positives and false negatives',
      'Protect patient data when using AI tools',
    ],
    pass_mark: 70,
    questions: 3,
    curriculum: [
      { id: 's3-l1', title: 'What AI can and cannot do', duration_min: 6 },
      { id: 's3-l2', title: 'Using AI results carefully', duration_min: 6 },
      { id: 's3-l3', title: 'Privacy and responsibility', duration_min: 5 },
    ],
  },
];

const sampleCard = c => ({
  ...c,
  lessons: c.curriculum.length,
  minutes: c.curriculum.reduce((s, l) => s + l.duration_min, 0),
  sample: true,
});

// API courses take priority; sample courses only fill the gaps so the public
// catalogue never looks empty and never shows a duplicate title.
function mergeSampleCourses(list) {
  const remote = Array.isArray(list) ? list : [];
  const titles = new Set(remote.map(c => (c.title || '').trim().toLowerCase()));
  return [...remote, ...SAMPLE_COURSES.map(sampleCard).filter(c => !titles.has(c.title.toLowerCase()))];
}

async function api(path, opts = {}, token) {
  const t = token ?? localStorage.getItem('t');
  const r = await fetch(API + '/api' + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(t ? { Authorization: 'Bearer ' + t } : {}),
      ...(opts.headers || {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) {
    if (r.status === 401 && t) {
      localStorage.clear();
      if (!location.pathname.startsWith('/login')) location.href = '/login';
    }
    const err = new Error(d.error || 'Something went wrong');
    err.status = r.status;
    throw err;
  }
  return d;
}

function useCourses({ fallback = false } = {}) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setCourses(fallback ? mergeSampleCourses(await api('/courses')) : await api('/courses'));
    } catch (e) {
      if (fallback) setCourses(SAMPLE_COURSES.map(sampleCard));
      else setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);
  return { courses, loading, error, reload: load };
}

function StateBox({ title, text, action }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-white p-8 text-center">
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      {text && <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-body">{text}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

function Loading({ label = 'Loading…' }) {
  return <div className="rounded-xl border border-border bg-white p-6 text-sm text-body">{label}</div>;
}

function Notice({ type = 'info', children }) {
  const styles = type === 'error'
    ? 'bg-red-50 text-red-700 border-red-200'
    : type === 'success'
      ? 'bg-mint text-ink border-lake/20'
      : 'bg-[#fff8e8] text-ink border-sun/40';
  return <div className={`rounded-xl border px-3 py-2 text-sm ${styles}`}>{children}</div>;
}

function SocialIcon({ name }) {
  if (name === 'Google') return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.87z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.29a12 12 0 0 0 0 10.74l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.29 6.63l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
  if (name === 'LinkedIn') return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="#0A66C2" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="currentColor" aria-hidden="true">
      <path d="M16.36 12.75c-.02-2.02 1.65-2.99 1.73-3.04-.94-1.38-2.41-1.57-2.93-1.59-1.25-.13-2.44.73-3.07.73-.63 0-1.61-.71-2.65-.69-1.36.02-2.62.79-3.32 2.01-1.41 2.45-.36 6.08 1.01 8.07.67.98 1.47 2.07 2.52 2.03 1.01-.04 1.39-.65 2.61-.65 1.22 0 1.56.65 2.62.63 1.08-.02 1.76-1 2.42-1.98.76-1.13 1.07-2.22 1.09-2.27-.02-.01-2.09-.8-2.11-3.23zM14.34 6.41c.55-.67.92-1.61.82-2.54-.79.03-1.75.53-2.32 1.2-.51.59-.96 1.54-.84 2.45.88.07 1.78-.45 2.34-1.11z" />
    </svg>
  );
}

function AuthDialog({ mode, onClose, onSwitch }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const isRegister = mode === 'register';
  const [fields, setFields] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [socialNotice, setSocialNotice] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setErr('');
    setSocialNotice('');
  }, [mode]);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const submit = async e => {
    e.preventDefault();
    setErr('');
    setSocialNotice('');
    if (isRegister && fields.name.trim().length < 2) return setErr('Please enter your full name.');
    if (fields.password.length < 6) return setErr('Password must be at least 6 characters.');
    setBusy(true);
    try {
      const data = await api('/auth/' + (isRegister ? 'register' : 'login'), { method: 'POST', body: fields });
      login(data);
      onClose();
      navigate(data.user.role === 'admin' ? '/admin' : '/', { replace: true });
    } catch (x) {
      setErr(x.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-[#0B1F33]/60 p-4 backdrop-blur-sm sm:items-center"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-dialog-title"
        className="relative my-auto w-full max-w-[440px] rounded-2xl border border-border bg-white p-6 shadow-2xl sm:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3.5 top-3.5 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-canvas hover:text-forest"
        >
          <Icon name="x" className="h-4 w-4" />
        </button>

        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">ThanziLearn</p>
        <h2 id="auth-dialog-title" className="mt-1.5 pr-8 font-display text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-forest">
          {isRegister ? 'Create your free account' : 'Welcome back'}
        </h2>
        <p className="mt-1.5 text-[13px] leading-6 text-body">
          {isRegister ? 'Join ThanziLearn to enrol in courses, track your progress and earn certificates.' : 'Log in to continue your courses and pick up where you left off.'}
        </p>

        <div className="mt-5 grid gap-2">
          {['LinkedIn', 'Google', 'Apple'].map(provider => (
            <button
              key={provider}
              type="button"
              onClick={() => setSocialNotice(`${provider} sign-in is coming soon. Use your email and password for now.`)}
              className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-border bg-white px-4 text-sm font-medium text-forest transition hover:border-teal/50 hover:bg-canvas"
            >
              <SocialIcon name={provider} />
              Continue with {provider}
            </button>
          ))}
        </div>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">or with email</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {socialNotice && <div className="mb-4"><Notice>{socialNotice}</Notice></div>}

        <form onSubmit={submit} className="space-y-3.5">
          {isRegister && (
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-forest">Full name</span>
              <input className={inp} required value={fields.name} onChange={e => setFields({ ...fields, name: e.target.value })} placeholder="Your full name" autoComplete="name" autoFocus />
            </label>
          )}
          <label className="block">
            <span className="mb-1 block text-[13px] font-medium text-forest">Email address</span>
            <input className={inp} required type="email" value={fields.email} onChange={e => setFields({ ...fields, email: e.target.value })} placeholder="you@example.com" autoComplete="email" autoFocus={!isRegister} />
          </label>
          <label className="block">
            <span className="mb-1 block text-[13px] font-medium text-forest">Password</span>
            <input className={inp} required type="password" value={fields.password} onChange={e => setFields({ ...fields, password: e.target.value })} placeholder={isRegister ? 'At least 6 characters' : 'Your password'} autoComplete={isRegister ? 'new-password' : 'current-password'} />
          </label>
          {!isRegister && (
            <div className="flex justify-end">
              <Link to="/forgot-password" onClick={onClose} className="text-[12px] font-medium text-teal hover:underline">Forgot password?</Link>
            </div>
          )}
          {err && <Notice type="error">{err}</Notice>}
          <button type="submit" className={btn + ' w-full'} disabled={busy}>
            {busy ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'}
          </button>
        </form>

        <p className="mt-5 text-center text-[13px] text-body">
          {isRegister ? 'Already have an account?' : 'New to ThanziLearn?'}{' '}
          <button type="button" onClick={() => onSwitch(isRegister ? 'login' : 'register')} className="font-semibold text-teal hover:underline">
            {isRegister ? 'Log in' : 'Create an account'}
          </button>
        </p>
      </div>
    </div>
  );
}

function Site({ children }) {
  const { user, logout } = useAuth();
  const openAuth = useAuthDialog();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [explore, setExplore] = useState(false);
  const [lang, setLang] = useState(false);
  const [notes, setNotes] = useState(false);
  const [profile, setProfile] = useState(false);
  const [search, setSearch] = useState('');

  // One place to close every menu when the page changes.
  useEffect(() => {
    setOpen(false); setExplore(false); setLang(false); setNotes(false); setProfile(false);
  }, [location.pathname, location.search]);

  // Open the login/register dialog instead of leaving the page. Closing the
  // mobile menu first means the dialog is never stacked behind it.
  const promptAuth = mode => {
    setOpen(false); setExplore(false); setProfile(false);
    openAuth(mode);
  };

  const submitSearch = e => {
    e.preventDefault();
    const term = search.trim();
    navigate(term ? `/courses?q=${encodeURIComponent(term)}` : '/courses');
    setSearch('');
    setOpen(false);
  };

  const exploreCourses = SAMPLE_COURSES.slice(0, 3);
  const iconBtn = 'inline-flex h-9 w-9 items-center justify-center rounded-full text-body transition hover:bg-canvas hover:text-teal';
  const menuItem = 'block rounded-lg px-3 py-2 text-[13px] text-body hover:bg-canvas hover:text-teal';

  return (
    <div className="min-h-screen bg-canvas text-body">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-forest">Skip to content</a>
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur print:hidden">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-2 px-4 sm:px-5 lg:px-10">
          <Link to="/" className="shrink-0 font-display text-lg font-semibold tracking-[-0.02em] text-teal md:text-xl">ThanziLearn</Link>

          {/* Left cluster: Explore + My learning + About */}
          <nav className="ml-2 hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            <div className="relative" onMouseEnter={() => setExplore(true)} onMouseLeave={() => setExplore(false)}>
              <button type="button" onClick={() => { setExplore(v => !v); setProfile(false); }} aria-expanded={explore} aria-haspopup="true" className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-[14px] text-body transition hover:bg-canvas hover:text-teal">
                Explore <Icon name="chevron" className={`h-3.5 w-3.5 transition-transform ${explore ? 'rotate-180' : ''}`} />
              </button>
              {explore && (
                <div className="absolute left-0 top-full z-50 w-72 pt-1.5">
                  <div className="rounded-xl border border-border bg-white p-2 shadow-lg">
                    <p className="px-3 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Popular courses</p>
                    {exploreCourses.map(c => (
                      <Link key={c.id} to={`/courses/${c.id}`} className="block rounded-lg px-3 py-2 transition hover:bg-canvas">
                        <span className="block text-[13px] font-medium leading-5 text-forest">{c.title}</span>
                        <span className="block text-[11px] text-muted">{c.category}</span>
                      </Link>
                    ))}
                    <div className="mt-1 border-t border-border pt-1">
                      <Link to="/courses" className="flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium text-teal transition hover:bg-mint">Browse all courses <Icon name="arrow" className="h-3.5 w-3.5" /></Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {user && (
              <NavLink to="/learn" className={({ isActive }) => `rounded-lg px-2.5 py-2 text-[14px] transition ${isActive ? 'text-teal' : 'text-body hover:bg-canvas hover:text-teal'}`}>My learning</NavLink>
            )}
            <NavLink to="/about" className={({ isActive }) => `rounded-lg px-2.5 py-2 text-[14px] transition ${isActive ? 'text-teal' : 'text-body hover:bg-canvas hover:text-teal'}`}>About</NavLink>
          </nav>

          {/* Search stays next to the left cluster */}
          <form onSubmit={submitSearch} className="ml-2 hidden min-w-0 flex-1 md:block" role="search">
            <div className="relative w-full max-w-[320px]">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses" aria-label="Search courses" className="h-9 w-full rounded-full border border-border bg-canvas pl-4 pr-11 text-[13px] text-forest placeholder:text-muted transition focus:border-teal focus:bg-white" />
              <button type="submit" aria-label="Search" className="absolute right-1 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-teal text-white transition hover:bg-[#0F52B5]">
                <Icon name="search" className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          {/* Right cluster */}
          <div className="ml-auto flex items-center gap-0.5">
            {user ? (
              <>
                <div className="relative hidden sm:block">
                  <button type="button" onClick={() => { setLang(v => !v); setNotes(false); setProfile(false); }} className={iconBtn} aria-label="Language" aria-expanded={lang}>
                    <Icon name="globe" className="h-[18px] w-[18px]" />
                  </button>
                  {lang && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-border bg-white p-2 shadow-lg">
                      <p className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Language</p>
                      <button type="button" className="flex w-full items-center justify-between rounded-lg bg-mint px-3 py-2 text-[13px] font-medium text-teal">English <Icon name="check" className="h-3.5 w-3.5" /></button>
                    </div>
                  )}
                </div>
                <div className="relative hidden sm:block">
                  <button type="button" onClick={() => { setNotes(v => !v); setLang(false); setProfile(false); }} className={iconBtn} aria-label="Notifications" aria-expanded={notes}>
                    <Icon name="bell" className="h-[18px] w-[18px]" />
                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-orange" aria-hidden="true" />
                  </button>
                  {notes && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-border bg-white p-4 shadow-lg">
                      <p className="text-[13px] font-medium text-forest">Notifications</p>
                      <p className="mt-1.5 text-[12px] leading-5 text-body">You’re all caught up. Course updates and reminders will appear here.</p>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button type="button" onClick={() => { setProfile(v => !v); setLang(false); setNotes(false); }} className="flex h-9 w-9 items-center justify-center rounded-full bg-mint text-[11px] font-semibold text-teal transition hover:bg-teal hover:text-white" aria-label="Account menu" aria-expanded={profile}>
                    {initials(user.name)}
                  </button>
                  {profile && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-border bg-white p-2 shadow-lg">
                      <div className="px-3 py-2">
                        <p className="truncate text-[13px] font-medium text-forest">{user.name}</p>
                        <p className="text-[11px] text-muted">{user.role === 'admin' ? 'Administrator' : 'Learner account'}</p>
                      </div>
                      <div className="border-t border-border pt-1">
                        <Link to={user.role === 'admin' ? '/admin' : '/learn'} className={menuItem}>{user.role === 'admin' ? 'Admin dashboard' : 'My learning'}</Link>
                        {user.role !== 'admin' && <Link to="/learn?tab=certificated" className={menuItem}>Certificates</Link>}
                        <Link to="/learn/settings" className={menuItem}>Settings</Link>
                        <button type="button" onClick={logout} className="block w-full rounded-lg px-3 py-2 text-left text-[13px] text-body transition hover:bg-canvas hover:text-teal">Log out</button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button type="button" onClick={() => promptAuth('login')} className="hidden h-9 items-center rounded-lg px-3 text-[14px] font-medium text-teal transition hover:bg-mint sm:inline-flex">Log in</button>
                <button type="button" onClick={() => promptAuth('register')} className="hidden h-9 items-center rounded-lg border border-teal bg-transparent px-3.5 text-[13px] font-semibold text-teal transition hover:bg-mint sm:inline-flex">Get started</button>
              </>
            )}
            <button type="button" onClick={() => setOpen(v => !v)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-forest lg:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'}>
              <Icon name={open ? 'x' : 'menu'} className="h-5 w-5" />
            </button>
          </div>
        </div>

        {open && (
          <div id="mobile-nav" className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border bg-white px-4 py-4 lg:hidden">
            <form onSubmit={submitSearch} role="search" className="relative mb-3">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses" aria-label="Search courses" className="h-10 w-full rounded-full border border-border bg-canvas pl-4 pr-12 text-[13px] text-forest placeholder:text-muted focus:border-teal focus:bg-white" />
              <button type="submit" aria-label="Search" className="absolute right-1 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-teal text-white transition hover:bg-[#0F52B5]">
                <Icon name="search" className="h-4 w-4" />
              </button>
            </form>
            <nav className="flex flex-col gap-0.5 text-[14px]" aria-label="Mobile">
              <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Explore courses</p>
              {exploreCourses.map(c => (
                <Link key={c.id} to={`/courses/${c.id}`} className="rounded-lg px-3 py-2 text-body transition hover:bg-canvas hover:text-forest">{c.title}</Link>
              ))}
              <Link to="/courses" className="rounded-lg px-3 py-2 font-medium text-teal transition hover:bg-mint">Browse all courses</Link>
              <div className="my-2 border-t border-border" />
              {user && <Link to="/learn" className="rounded-lg px-3 py-2 text-body transition hover:bg-canvas hover:text-forest">My learning</Link>}
              <Link to="/about" className="rounded-lg px-3 py-2 text-body transition hover:bg-canvas hover:text-forest">About</Link>
              <Link to="/contact" className="rounded-lg px-3 py-2 text-body transition hover:bg-canvas hover:text-forest">Contact</Link>
              {user ? (
                <>
                  {user.role === 'admin' && <Link to="/admin" className="rounded-lg px-3 py-2 text-body transition hover:bg-canvas hover:text-forest">Admin dashboard</Link>}
                  {user.role !== 'admin' && <Link to="/learn/settings" className="rounded-lg px-3 py-2 text-body transition hover:bg-canvas hover:text-forest">Settings</Link>}
                  <button type="button" onClick={logout} className="rounded-lg px-3 py-2 text-left text-body transition hover:bg-canvas hover:text-forest">Log out</button>
                </>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => promptAuth('login')} className="inline-flex h-10 items-center justify-center rounded-lg border border-teal text-sm font-medium text-teal">Log in</button>
                  <button type="button" onClick={() => promptAuth('register')} className="inline-flex h-10 items-center justify-center rounded-lg border border-teal text-sm font-semibold text-teal">Get started</button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
      <main id="main" className="flex-1 overflow-x-clip">{children}</main>
      <footer className="bg-white print:hidden">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-12 sm:px-5 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
          <div>
            <Link to="/" className="font-display text-lg font-semibold tracking-[-0.02em] text-teal">ThanziLearn</Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-body">Learn. Grow. Strengthen Healthcare.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-forest">Explore</h3>
            <ul className="mt-3 space-y-2.5 text-sm text-body">
              <li><Link to="/" className="hover:text-teal">Home</Link></li>
              <li><Link to="/courses" className="hover:text-teal">Courses</Link></li>
              <li><Link to="/about" className="hover:text-teal">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-forest">Account</h3>
            <ul className="mt-3 space-y-2.5 text-sm text-body">
              <li><button type="button" onClick={() => promptAuth('login')} className="hover:text-teal">Log in</button></li>
              <li><button type="button" onClick={() => promptAuth('register')} className="hover:text-teal">Create account</button></li>
              <li>{user ? <Link to={user.role === 'admin' ? '/admin' : '/learn'} className="hover:text-teal">My learning</Link> : <button type="button" onClick={() => promptAuth('login')} className="hover:text-teal">My learning</button>}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-forest">Support</h3>
            <ul className="mt-3 space-y-2.5 text-sm text-body">
              <li><Link to="/contact" className="hover:text-teal">Contact us</Link></li>
              <li><Link to="/privacy" className="hover:text-teal">Privacy policy</Link></li>
              <li><Link to="/terms" className="hover:text-teal">Terms of use</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto max-w-[1200px] px-4 py-4 text-[13px] text-muted sm:px-5 lg:px-10">© 2026 ThanziLearn. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

function Wrap({ children }) { return <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-5 md:py-16 lg:px-10">{children}</div>; }

// Shared hero for every page except the home page. Fixed height, one text column
// and one type scale so all inner pages feel part of the same family.
function PageHero({ eyebrow, title, text, image = '/images/herobg1.jpg' }) {
  return (
    <section className="relative isolate h-[360px] overflow-hidden bg-forest sm:h-[400px] lg:h-[440px]">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F33]/80 via-[#0B1F33]/50 to-[#0B1F33]/10" />
      <div className="relative mx-auto flex h-full max-w-[1200px] items-center px-4 sm:px-5 lg:px-10">
        <div className="max-w-2xl">
          {eyebrow && <p className={`mb-3 ${eyebrowOnDark}`}>{eyebrow}</p>}
          <h1 className={`${h1Cls} text-white`} style={{ color: '#FFFFFF' }}>{title}</h1>
          {text && <p className="mt-3 line-clamp-3 max-w-xl text-[15px] leading-7 text-white/80 md:text-base">{text}</p>}
        </div>
      </div>
    </section>
  );
}

const courseImages = [
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
];
const courseImage = c => c.image || courseImages[[...(c.title || '')].reduce((s, ch) => s + ch.charCodeAt(0), 0) % courseImages.length];

function CourseCard({ course, to }) {
  const progress = pct(course.done || 0, course.lessons || 0);
  const href = to || `/courses/${course.id}`;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white transition hover:border-teal/40 hover:shadow-sm">
      <div className="relative h-48 overflow-hidden border-b border-border bg-canvas sm:h-52">
        <img src={courseImage(course)} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-base font-semibold leading-snug text-forest">{course.title}</h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-body">{course.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5" title="Level"><Icon name="layers" className="h-3.5 w-3.5" />Beginner</span>
          <span className="inline-flex items-center gap-1.5" title="Lessons"><Icon name="book" className="h-3.5 w-3.5" />{course.lessons ?? 0}</span>
          <span className="inline-flex items-center gap-1.5" title="Duration"><Icon name="clock" className="h-3.5 w-3.5" />{fmt(course.minutes)}</span>
        </div>
        {course.done > 0 && (
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-[11px] font-medium text-muted"><span>{course.passed ? 'Completed' : 'Progress'}</span><span>{course.passed ? '100%' : `${progress}%`}</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-canvas"><div className="h-full rounded-full bg-teal" style={{ width: `${course.passed ? 100 : progress}%` }} /></div>
          </div>
        )}
        <Link to={href} className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-medium text-teal transition group-hover:gap-2.5">View course <Icon name="arrow" className="h-3.5 w-3.5" /></Link>
      </div>
    </article>
  );
}

function Landing() {
  const { courses, loading } = useCourses({ fallback: true });
  const featured = courses.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-forest">
        <img src="/images/herobg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F33]/80 via-[#0B1F33]/50 to-[#0B1F33]/10" />
        <div className="relative mx-auto flex max-w-[1200px] items-center px-5 py-14 md:py-20 lg:px-10 lg:py-24">
          <div className="max-w-lg">
            <p className={eyebrowOnDark}>Healthcare learning</p>
            <h1 className="mt-3 font-display text-[2rem] font-semibold leading-[1.12] tracking-[-0.02em] sm:text-[2.5rem] lg:text-[2.85rem]" style={{ color: '#FFFFFF' }}>
              Building knowledge.<br /><span className="text-[#7DB1FF]">Strengthening</span> healthcare.
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-white/80">Practical, self-paced courses for healthcare professionals and students.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/courses" className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-teal transition hover:bg-mint">Explore courses</Link>
              <Link to="/about" className="inline-flex h-11 items-center justify-center rounded-lg border border-white/30 px-5 text-sm font-semibold text-white transition hover:bg-white/10">About us</Link>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-medium text-white/70">
              {[
                { icon: 'clock', label: 'Flexible learning' },
                { icon: 'book', label: 'Practical courses' },
                { icon: 'award', label: 'Certificates of completion' },
              ].map(item => (
                <li key={item.label} className="inline-flex items-center gap-2"><Icon name={item.icon} className="h-4 w-4 text-white/50" />{item.label}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Quiet stat row, Coursera-style: a thin band under the hero */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-px bg-border md:grid-cols-4">
          {[
            { value: 'Self-paced', label: 'Learn on your schedule' },
            { value: '100% online', label: 'Any device, anywhere' },
            { value: 'Free to learn', label: 'No payment required' },
            { value: 'Certificate', label: 'On successful completion' },
          ].map(item => (
            <div key={item.value} className="bg-white px-5 py-5 text-center md:py-6">
              <div className="font-display text-[15px] font-semibold text-forest md:text-base">{item.value}</div>
              <div className="mt-0.5 text-[12px] text-muted">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why ThanziLearn */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-14 md:py-20 lg:grid-cols-2 lg:gap-14 lg:px-10">
          <div className="relative">
            <img src="/images/why.jpg" alt="Healthcare professionals learning together" className="aspect-[4/3] w-full rounded-xl border border-border object-cover" />
            <div className="absolute -bottom-3 -right-2 rounded-lg border border-border bg-white px-3.5 py-2.5 shadow-sm md:-right-4">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-forest"><span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-mint text-teal"><Icon name="book" className="h-3.5 w-3.5" /></span>Learn at your pace</div>
            </div>
          </div>
          <div>
            <p className={eyebrowCls}>Why ThanziLearn</p>
            <h2 className={`mt-2.5 ${h2Cls}`}>Learning that supports better care.</h2>
            <p className={`mt-3 max-w-xl ${bodyCls}`}>Accessible, focused courses that help healthcare professionals grow their knowledge and skills.</p>
            <ul className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: 'device', title: 'Accessible learning' },
                { icon: 'clock', title: 'Flexible learning' },
                { icon: 'shield', title: 'Practical knowledge' },
              ].map(item => (
                <li key={item.title}>
                  <Icon name={item.icon} className="h-5 w-5 text-forest" />
                  <h3 className="mt-2.5 font-display text-[15px] font-medium leading-snug text-forest">{item.title}</h3>
                </li>
              ))}
            </ul>
            <Link to="/about" className={btn + ' mt-7'}>Learn more <Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="border-y border-border bg-canvas">
        <div className="mx-auto max-w-[1200px] px-5 py-14 md:py-20 lg:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className={eyebrowCls}>Explore our courses</p>
              <h2 className={`mt-2.5 ${h2Cls}`}>Explore learning opportunities.</h2>
              <p className={`mt-2.5 max-w-2xl ${bodyCls}`}>Discover courses covering healthcare practice, patient safety, public health and emerging technologies.</p>
            </div>
            <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:text-[#0F52B5]">View all courses <Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
          <div className="mt-8">
            {loading ? <Loading label="Loading courses…" /> : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {featured.map(c => <CourseCard key={c.id} course={c} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Designed for practical learning */}
      <section className="relative isolate overflow-hidden bg-forest">
        <img src="/images/Designedbg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[#0B1F33]/85" />
        <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-14 md:py-20 lg:grid-cols-2 lg:px-10">
          <div>
            <p className={eyebrowOnDark}>Designed for practical learning</p>
            <h2 className="mt-2.5 font-display text-2xl font-semibold leading-[1.2] tracking-[-0.015em] md:text-[2rem]" style={{ color: '#FFFFFF' }}>More than just reading. An engaging learning experience.</h2>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-white/70">Clear, focused lessons help you learn, practise, and track your progress with confidence.</p>
            <Link to="/courses" className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-teal transition hover:bg-mint">Explore courses <Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <img src="/images/desgned.jpg" alt="Healthcare learning experience" className="aspect-[4/3] w-full rounded-xl object-cover" />
            <div className="absolute -left-2 top-5 rounded-lg bg-white px-3.5 py-2.5 shadow-lg md:-left-5">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-mint text-teal"><Icon name="play" className="h-4 w-4" /></span>
                <div><p className="text-[11px] text-muted">Lesson progress</p><p className="text-[13px] font-semibold text-forest">65% complete</p></div>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-2 rounded-lg bg-white px-3.5 py-2.5 shadow-lg md:-right-5">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-mint text-teal"><Icon name="award" className="h-4 w-4" /></span>
                <div><p className="text-[11px] text-muted">On completion</p><p className="text-[13px] font-semibold text-forest">Earn a certificate</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-14 md:py-20 lg:px-10">
          <div className="grid items-center gap-8 rounded-xl border border-border bg-canvas p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10">
            <div>
              <p className={eyebrowCls}>Show your achievement</p>
              <h2 className={`mt-2.5 ${h2Cls}`}>Earn a certificate you can add to your resume.</h2>
              <p className={`mt-3 max-w-xl ${bodyCls}`}>Upon successful completion of a course, you’ll receive a certificate of completion to showcase your learning and professional development on your resume or profile.</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-6 text-center shadow-sm">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-lg bg-mint text-teal"><Icon name="award" className="h-6 w-6" /></div>
              <p className="mt-3.5 font-display text-base font-semibold text-forest">Certificate of Completion</p>
              <p className="mt-0.5 text-[13px] text-muted">ThanziLearn</p>
              <div className="mt-4 h-1.5 w-full rounded-full bg-canvas"><div className="h-1.5 w-3/4 rounded-full bg-teal/80" /></div>
              <p className="mt-2.5 text-[11px] text-muted">Add it to your resume and professional profiles</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal">
        <div className="mx-auto max-w-[1200px] px-5 py-14 md:py-16 lg:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mint/80">Your learning journey starts here</p>
              <h2 className="mt-2.5 font-display text-2xl font-semibold leading-[1.2] tracking-[-0.015em] md:text-[2rem]" style={{ color: '#FFFFFF' }}>Invest in your knowledge. Strengthen your impact.</h2>
              <p className="mt-2.5 text-[15px] leading-7 text-white/75 md:text-base">Explore practical learning opportunities and take the next step in your professional development.</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3 md:justify-end">
              <Link to="/courses" className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-teal transition hover:bg-mint">Explore courses</Link>
              <Link to="/contact" className="inline-flex h-11 items-center justify-center rounded-lg border border-white/30 px-5 text-sm font-semibold text-white transition hover:bg-white/10">Contact us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Catalogue() {
  const { courses, loading, error, reload } = useCourses({ fallback: true });
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [category, setCategory] = useState('');
  useEffect(() => { setQuery(params.get('q') || ''); }, [params]);
  const categories = [...new Set(courses.map(c => c.category).filter(Boolean))];
  const list = courses.filter(c => {
    const q = query.toLowerCase();
    const matchQ = !q || `${c.title} ${c.description || ''} ${c.category || ''}`.toLowerCase().includes(q);
    const matchC = !category || c.category === category;
    return matchQ && matchC;
  });
  return (
    <>
      <PageHero eyebrow="Courses" title="Explore practical courses." text="Flexible, healthcare-focused training designed to strengthen your knowledge and support better care." image="/images/course.jpg" />
      <Wrap>
        <div className="-mt-8 mb-8 grid gap-4 rounded-xl border border-border bg-white p-3.5 shadow-sm md:-mt-12 md:grid-cols-[1fr_220px]">
          <label className="block"><span className="sr-only">Search courses</span><div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"><Icon name="search" className="h-4 w-4" /></span><input className={inp + ' pl-9'} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by title or keyword" /></div></label>
          <label className="block"><span className="sr-only">Filter by category</span><select className={inp} value={category} onChange={e => setCategory(e.target.value)}><option value="">All categories</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></label>
        </div>
        {loading ? <Loading label="Loading courses…" /> : error ? <StateBox title="Couldn’t load courses" text={error} action={<button className={btn} onClick={reload}>Try again</button>} /> : list.length === 0 ? (
          <StateBox title="No courses found" text={courses.length ? 'Try a different search or category.' : 'No courses have been published yet.'} action={courses.length ? <button className={btnSoft} onClick={() => { setQuery(''); setCategory(''); }}>Clear filters</button> : null} />
        ) : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{list.map(c => <CourseCard key={c.id} course={c} />)}</div>}
      </Wrap>
    </>
  );
}

function Preview() {
  const { id } = useParams();
  const { user } = useAuth();
  const openAuth = useAuthDialog();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [notified, setNotified] = useState(false);
  const notifyKey = 'thanzi-notify:' + id;

  useEffect(() => {
    try { setNotified(localStorage.getItem(notifyKey) === '1'); } catch { setNotified(false); }
  }, [notifyKey]);

  useEffect(() => {
    if (!enrollOpen) return;
    const onKey = e => { if (e.key === 'Escape') setEnrollOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [enrollOpen]);

  const notifyMe = () => {
    try { localStorage.setItem(notifyKey, '1'); } catch {}
    setNotified(true);
  };

  useEffect(() => {
    const local = SAMPLE_COURSES.find(c => c.id === id);
    if (local) {
      setData({
        course: {
          id: local.id,
          title: local.title,
          description: local.description,
          category: local.category,
          level: local.level,
          pass_mark: local.pass_mark,
          questions: local.questions,
          skills: local.outcomes,
          about: local.about,
          image: local.image,
          sample: true,
        },
        lessons: local.curriculum,
      });
      setError('');
      setLoading(false);
      return;
    }
    setLoading(true);
    api('/courses/' + id + '/preview').then(setData).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Wrap><Loading label="Loading course…" /></Wrap>;
  if (error || !data) return <Wrap><StateBox title="Course unavailable" text={error || 'This course could not be found.'} action={<Link to="/courses" className={btnSoft}>Back to courses</Link>} /></Wrap>;

  const { course, lessons } = data;
  const isSample = course.sample || SAMPLE_COURSES.some(c => c.id === id);
  const total = lessons.reduce((s, l) => s + (l.duration_min || 0), 0);
  const level = course.level || 'Beginner';
  const startTo = `/learn/course/${id}`;
  const cta = user ? (isSample ? 'Enroll in the course' : 'Open course') : 'Enroll for free';
  const enrollsThroughPopup = user && isSample;
  const about = course.about || [
    course.description,
    'This course is delivered in short, self-paced lessons you can complete on any device. Each lesson ends with a simple knowledge check, and a final assessment confirms your understanding.',
  ];
  const facts = [
    { icon: 'layers', label: 'Level', value: level },
    { icon: 'book', label: 'Lessons', value: `${lessons.length} lessons` },
    { icon: 'clock', label: 'Duration', value: fmt(total) },
    { icon: 'shield', label: 'Assessment', value: `Pass mark ${course.pass_mark}%` },
  ];

  return (
    <>
      {/* White course header: breadcrumb, summary and course image */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-5 sm:px-5 md:pb-12 lg:px-10">
          <nav className="flex min-w-0 items-center gap-2 text-[12px] text-muted" aria-label="Breadcrumb">
            <Link to="/" className="inline-flex items-center transition hover:text-teal" aria-label="Home">
              <Icon name="home" className="h-4 w-4" />
            </Link>
            <span aria-hidden="true" className="text-border">/</span>
            <Link to="/courses" className="transition hover:text-teal">Courses</Link>
            <span aria-hidden="true" className="text-border">/</span>
            <span className="truncate text-body" aria-current="page">{course.title}</span>
          </nav>

          <div className="mt-6 grid min-w-0 items-center gap-6 md:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
            <div className="min-w-0">
              <p className={eyebrowCls}>{course.category || 'Healthcare'}</p>
              <h1 className="mt-2 break-words font-display text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.02em] text-forest sm:text-[2rem] md:text-[2.35rem]">{course.title}</h1>
              <p className="mt-3 max-w-xl text-[15px] leading-7 text-body">{course.description}</p>
            </div>
            <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-canvas">
              <img src={courseImage(course)} alt={course.title} className="aspect-[16/10] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>
      <Wrap>
        {/* Quick facts */}
        <div className={card}>
          <div className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4">
            {facts.map(f => (
              <div key={f.label} className="flex min-w-0 items-center gap-2.5">
                <Icon name={f.icon} className="h-4 w-4 shrink-0 text-forest" />
                <div className="min-w-0">
                  <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted">{f.label}</div>
                  <div className="text-[13px] font-medium text-forest">{f.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-8">
          {/* Left: the course itself */}
          <div className="min-w-0 space-y-5">
            <section className={card}>
              <p className={eyebrowCls}>About this course</p>
              <h2 className="mt-2 font-display text-xl font-semibold text-forest">What this course covers</h2>
              <div className="mt-3 space-y-3 text-[15px] leading-7 text-body">
                {about.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-4 text-[12px] text-muted">
                <span className="inline-flex items-center gap-1.5"><Icon name="device" className="h-3.5 w-3.5" />Self-paced, on any device</span>
                <span className="inline-flex items-center gap-1.5"><Icon name="book" className="h-3.5 w-3.5" />{lessons.length} short lessons</span>
                <span className="inline-flex items-center gap-1.5"><Icon name="award" className="h-3.5 w-3.5" />Certificate on completion</span>
              </div>
            </section>

            <section className={darkCard}>
              <h2 className="font-display text-xl font-semibold" style={{ color: '#FFFFFF' }}>What you will learn</h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {(course.skills?.length ? course.skills : [
                  'Key concepts explained in plain language',
                  'Practical steps you can use at work',
                  'Knowledge checks to test understanding',
                  'A final assessment to confirm progress',
                ]).map(s => (
                  <li key={s} className="flex gap-2.5 text-[13px] leading-6 text-white/90">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-white"><Icon name="check" className="h-3 w-3" /></span>
                    {s}
                  </li>
                ))}
              </ul>
            </section>

            <section className={card}>
              <div className="flex flex-wrap items-end justify-between gap-2">
                <h2 className="font-display text-xl font-semibold text-forest">Course curriculum</h2>
                <span className="text-[12px] text-muted">{lessons.length} lessons · {fmt(total)}</span>
              </div>
              <ol className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border">
                {lessons.map((l, i) => (
                  <li key={l.id || i} className="flex items-center justify-between gap-4 bg-white px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-canvas text-[11px] font-semibold text-muted">{i + 1}</span>
                      <span className="truncate text-[13px] font-medium text-forest">{l.title}</span>
                    </div>
                    <span className="shrink-0 text-[12px] text-muted">{l.duration_min} min</span>
                  </li>
                ))}
                <li className="flex items-center justify-between gap-4 bg-canvas px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint text-teal"><Icon name="shield" className="h-3 w-3" /></span>
                    <span className="text-[13px] font-medium text-forest">Final assessment</span>
                  </div>
                  <span className="shrink-0 text-[12px] text-muted">{course.questions || 3} questions</span>
                </li>
              </ol>
            </section>
          </div>

          {/* Right: certificate blueprint, then the enrolment call to action */}
          <aside className="min-w-0 space-y-4 lg:sticky lg:top-24">
            <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-border bg-canvas px-4 py-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Certificate preview</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-teal"><Icon name="award" className="h-3.5 w-3.5" />On completion</span>
              </div>
              <div className="p-4">
                <div className="relative overflow-hidden rounded-lg border border-teal/25 bg-gradient-to-b from-white to-mint/50 px-5 py-6 text-center">
                  <div className="pointer-events-none absolute inset-1.5 rounded border border-teal/15" aria-hidden="true" />
                  <div className="relative">
                    <div className="font-display text-sm font-semibold tracking-[-0.01em] text-forest">Thanzi<span className="text-teal">Learn</span></div>
                    <div className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-muted">Certificate of completion</div>
                    <div className="mx-auto mt-4 h-px w-10 bg-teal/30" aria-hidden="true" />
                    <div className="mt-4 text-[10px] text-muted">This certifies that</div>
                    <div className="mt-1 font-display text-base font-semibold text-forest">Your name</div>
                    <div className="mt-2.5 text-[10px] text-muted">has successfully completed</div>
                    <div className="mt-1 font-display text-[13px] font-semibold leading-snug text-teal">{course.title}</div>
                    <div className="mt-5 flex items-end gap-3">
                      <div className="flex-1">
                        <div className="h-px bg-border" />
                        <div className="mt-1 text-[8px] uppercase tracking-[0.14em] text-muted">Date</div>
                      </div>
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-teal/25 bg-white text-teal"><Icon name="award" className="h-4 w-4" /></span>
                      <div className="flex-1">
                        <div className="h-px bg-border" />
                        <div className="mt-1 text-[8px] uppercase tracking-[0.14em] text-muted">ThanziLearn</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={card}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-display text-2xl font-semibold text-forest">Free</span>
                <span className="rounded-full bg-mint px-2.5 py-1 text-[11px] font-medium text-teal">No payment required</span>
              </div>
              <p className="mt-2 text-[13px] leading-6 text-body">Create a free learner account to enrol, work through the lessons and earn your certificate.</p>
              {enrollsThroughPopup ? (
                <button type="button" onClick={() => setEnrollOpen(true)} className={btn + ' mt-4 w-full'}>{cta} <Icon name="arrow" className="h-4 w-4" /></button>
              ) : user ? (
                <Link to={startTo} className={btn + ' mt-4 w-full'}>{cta} <Icon name="arrow" className="h-4 w-4" /></Link>
              ) : (
                <button type="button" onClick={() => openAuth('register')} className={btn + ' mt-4 w-full'}>{cta} <Icon name="arrow" className="h-4 w-4" /></button>
              )}
              {!user && <button type="button" onClick={() => openAuth('login')} className={btnSoft + ' mt-2 w-full'}>I already have an account</button>}
              <ul className="mt-4 space-y-2 border-t border-border pt-4 text-[12px] text-body">
                <li className="flex items-center gap-2"><Icon name="book" className="h-3.5 w-3.5 text-teal" />{lessons.length} self-paced lessons</li>
                <li className="flex items-center gap-2"><Icon name="clock" className="h-3.5 w-3.5 text-teal" />About {fmt(total)} of content</li>
                <li className="flex items-center gap-2"><Icon name="shield" className="h-3.5 w-3.5 text-teal" />Final assessment · {course.pass_mark}% to pass</li>
                <li className="flex items-center gap-2"><Icon name="award" className="h-3.5 w-3.5 text-teal" />Certificate of completion</li>
              </ul>
              <p className="mt-3 text-[11px] leading-5 text-muted">Certificates are a record of learning and are not a professional licence unless stated.</p>
            </div>

            <div className="rounded-xl bg-mint p-4">
              <p className="text-[13px] font-medium text-forest">Not sure this course is right for you?</p>
              <p className="mt-1 text-[12px] leading-5 text-body">Our team can help you choose a course that fits your role and goals.</p>
              <Link to="/contact" className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-teal hover:underline">Contact us <Icon name="arrow" className="h-3.5 w-3.5" /></Link>
            </div>
          </aside>
        </div>
      </Wrap>

      {enrollOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1F33]/60 p-4"
          onClick={() => setEnrollOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="enroll-title"
            className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={eyebrowCls}>Enrolment</p>
                <h2 id="enroll-title" className="mt-1.5 font-display text-xl font-semibold text-forest">Lessons coming soon</h2>
              </div>
              <button type="button" onClick={() => setEnrollOpen(false)} aria-label="Close" className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-body transition hover:bg-canvas hover:text-forest">
                <Icon name="x" className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-[13px] leading-6 text-body">
              The lessons for <span className="font-medium text-forest">{course.title}</span> haven’t been added yet. We’re preparing them now — leave your details and we’ll let you know as soon as the course opens.
            </p>
            {notified && <p className="mt-3 rounded-lg bg-mint px-3 py-2 text-[12px] font-medium text-lake">You’re on the list. We’ll notify you when the lessons are ready.</p>}
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => setEnrollOpen(false)} className={btnSoft}>Close</button>
              <button type="button" onClick={notifyMe} disabled={notified} className={btn}>{notified ? 'You’re on the list' : 'Notify me'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function About() {
  return (
    <>
      <PageHero eyebrow="About us" title="Making healthcare learning accessible." text="Flexible, practical courses that support healthcare professionals and students to grow with confidence." image="/images/about.jpg" />

      {/* Our Story */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-5 md:py-20 lg:px-10">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className={eyebrowCls}>Our story</p>
              <h2 className={`mt-2.5 ${h2Cls}`}>Why ThanziLearn?</h2>
              <div className="mt-4 space-y-4 text-[15px] leading-7 text-body md:text-base">
                <p>Healthcare professionals and students need learning that is accessible, relevant, and easy to fit into busy schedules. Yet opportunities for continued education can be limited by time, distance, and resources.</p>
                <p>ThanziLearn was created to help bridge that gap by offering flexible healthcare education that supports continuous learning. Through focused courses and clear learning experiences, we aim to make it easier for learners to grow their knowledge and apply it in practice.</p>
              </div>
            </div>
            <div className="relative">
              <img src="/images/why2.jpg" alt="Healthcare professionals learning together" className="aspect-[4/3] w-full rounded-xl border border-border object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Learning Experience */}
      <section className="border-y border-border bg-canvas">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-14 md:py-20 lg:grid-cols-2 lg:gap-14 lg:px-10">
          <div>
            <img src="/images/experience.jpg" alt="Healthcare learning experience" className="aspect-[4/3] w-full rounded-xl border border-border object-cover" />
          </div>
          <div>
            <p className={eyebrowCls}>Learning experience</p>
            <h2 className={`mt-2.5 ${h2Cls}`}>A clear and engaging way to learn.</h2>
            <p className={`mt-3 ${bodyCls}`}>
              ThanziLearn offers focused courses with clear learning materials, knowledge checks, and progress tracking to support understanding at every step. Learners can move at their own pace and, upon successful completion, receive a certificate of completion to reflect their learning.
            </p>
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {['Focused courses', 'Engaging materials', 'Knowledge checks', 'Progress & certificates'].map(item => (
                <li key={item} className="flex items-center gap-2.5 rounded-lg border border-border bg-white px-3.5 py-2.5 text-[13px] font-medium text-forest">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-mint text-teal"><Icon name="check" className="h-3.5 w-3.5" /></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Our Commitment to Quality */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-14 md:py-20 lg:px-10">
          <div className="max-w-2xl">
            <p className={eyebrowCls}>Our commitment to quality</p>
            <h2 className={`mt-2.5 ${h2Cls}`}>Responsible learning. Meaningful knowledge.</h2>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Clinical content review', desc: 'Content is reviewed for clarity and relevance to healthcare learning.' },
              { title: 'Clear learning objectives', desc: 'Each course has defined objectives so learners know what to expect.' },
              { title: 'Content accuracy', desc: 'We aim to keep information accurate, clear, and up to date.' },
              { title: 'Certificates and accreditation', desc: 'Completion certificates are not professional accreditation or a licence to practise unless stated.' },
            ].map(item => (
              <div key={item.title} className="rounded-xl border border-border bg-white p-5 transition hover:border-teal/40 hover:shadow-sm">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-mint text-teal"><Icon name="shield" className="h-[18px] w-[18px]" /></span>
                <h3 className="mt-3.5 font-display text-[15px] font-semibold text-forest">{item.title}</h3>
                <p className="mt-1.5 text-[13px] leading-6 text-body">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-teal">
        <div className="mx-auto max-w-[1200px] px-5 py-14 text-center md:py-16 lg:px-10">
          <h2 className="font-display text-2xl font-semibold leading-[1.2] tracking-[-0.015em] md:text-[2rem]" style={{ color: '#FFFFFF' }}>Be part of a continuous learning journey.</h2>
          <p className="mx-auto mt-2.5 max-w-2xl text-[15px] leading-7 text-white/75 md:text-base">Explore courses designed to support your growth and strengthen healthcare knowledge.</p>
          <Link to="/courses" className="mt-7 inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-teal transition hover:bg-mint">Explore courses</Link>
        </div>
      </section>
    </>
  );
}

function HowItWorks() {
  const steps = [
    { icon: 'search', t: 'Explore courses', d: 'Browse available training and preview what each course covers.' },
    { icon: 'user', t: 'Create an account', d: 'Register for free to track your progress.' },
    { icon: 'book', t: 'Learn at your pace', d: 'Complete short lessons on any device.' },
    { icon: 'check', t: 'Take the assessment', d: 'Answer the final quiz to check understanding.' },
    { icon: 'award', t: 'Earn a certificate', d: 'View your certificate when you meet the pass mark.' },
  ];
  return (
    <>
      <PageHero eyebrow="How it works" title="A simple path to completion." text="From finding a course to earning your certificate, every step is clear and manageable." image="/images/why2.jpg" />
      <Wrap>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {steps.map(({ icon, t, d }, i) => (
            <div key={t} className={card}>
              <div className="mb-3.5 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mint font-display text-xs font-semibold text-teal">{i + 1}</div>
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-mint text-teal"><Icon name={icon} className="h-4 w-4" /></div>
              </div>
              <h2 className="font-display text-base font-semibold text-forest">{t}</h2>
              <p className="mt-1.5 text-[13px] leading-6 text-body">{d}</p>
            </div>
          ))}
        </div>
      </Wrap>
    </>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  const faqs = [
    { q: 'Do I need an account to browse courses?', a: 'No. You can browse the course catalogue and preview any course for free. An account is only needed to start a course and track your progress.' },
    { q: 'How do I start a course?', a: 'Create a free account, open the course you are interested in and work through the lessons at your own pace. Your progress is saved automatically.' },
    { q: 'How long does a course take?', a: 'Every course shows an estimated duration based on its lessons. You can complete it in one sitting or spread it across several days.' },
    { q: 'Will I receive a certificate?', a: 'Yes. When you pass the final assessment, a certificate of completion becomes available in your learning dashboard.' },
    { q: 'What happens if I do not pass the assessment?', a: 'You can review the lessons and take the assessment again. The pass mark for each course is shown on its course page.' },
    { q: 'I forgot my password. What should I do?', a: 'Self-service password reset is not available yet. Contact your administrator or send us a message using the form above and we will help.' },
  ];
  return (
    <>
      <PageHero eyebrow="Contact" title="We’re here to help." text="Questions about courses, accounts or using the platform? Send us a message and our team will respond." image="/images/contact.jpg" />
      <Wrap>
        <div className="-mt-8 grid gap-5 md:-mt-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-xl bg-forest p-6 text-white md:p-8">
            <div className="font-display text-xl font-semibold">Thanzi<span className="text-orange">Learn</span></div>
            <p className="mt-2.5 text-[13px] leading-6 text-white/70">We usually reply within one working day. For urgent clinical matters, contact your local health authority or supervisor.</p>
            <div className="mt-6 space-y-4 text-[13px]">
              <a href="mailto:hello@thanzilearn.org" className="flex items-start gap-3 text-white/85 transition hover:text-white">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/10 text-mint"><Icon name="mail" className="h-4 w-4" /></span>
                <span><span className="block text-[10px] uppercase tracking-[0.14em] text-white/45">Email</span>hello@thanzilearn.org</span>
              </a>
              <div className="flex items-start gap-3 text-white/85">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/10 text-mint"><Icon name="clock" className="h-4 w-4" /></span>
                <span><span className="block text-[10px] uppercase tracking-[0.14em] text-white/45">Support hours</span>Mon–Fri, 08:00–17:00</span>
              </div>
              <div className="flex items-start gap-3 text-white/85">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/10 text-mint"><Icon name="shield" className="h-4 w-4" /></span>
                <span><span className="block text-[10px] uppercase tracking-[0.14em] text-white/45">Clinical support</span>For urgent clinical matters, contact your local health authority.</span>
              </div>
            </div>
          </div>
          <div className={card + ' md:p-8'}>
            <h2 className="font-display text-xl font-semibold text-forest">Send us a message</h2>
            <p className="mt-1.5 text-[13px] leading-6 text-body">Fill in the form and we will get back to you by email.</p>
            <form className="mt-5 space-y-4" onSubmit={e => { e.preventDefault(); setSent(true); }}>
              {sent && <Notice type="success">Thanks for your message. If email delivery isn’t configured in this environment, please contact us directly at hello@thanzilearn.org.</Notice>}
              <div><label className="mb-1 block text-[13px] font-medium text-forest" htmlFor="contact-name">Name</label><input id="contact-name" className={inp} required placeholder="Your full name" /></div>
              <div><label className="mb-1 block text-[13px] font-medium text-forest" htmlFor="contact-email">Email</label><input id="contact-email" className={inp} required type="email" placeholder="you@example.com" /></div>
              <div><label className="mb-1 block text-[13px] font-medium text-forest" htmlFor="contact-message">Message</label><textarea id="contact-message" className={inp + ' min-h-32'} required placeholder="How can we help?" /></div>
              <button className={btn} type="submit">Send message <Icon name="arrow" className="h-4 w-4" /></button>
            </form>
          </div>
        </div>

        {/* FAQs */}
        <section className="mt-14 md:mt-20">
          <div className="max-w-2xl">
            <p className={eyebrowCls}>FAQs</p>
            <h2 className={`mt-2.5 ${h2Cls}`}>Frequently asked questions.</h2>
            <p className={`mt-2.5 ${bodyCls}`}>Quick answers to common questions. Still need help? Send us a message above.</p>
          </div>
          <div className="mt-7 grid gap-2.5">
            {faqs.map(f => (
              <details key={f.q} className="group rounded-xl border border-border bg-white px-5 py-4 transition hover:border-teal/40 open:shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[15px] font-medium text-forest">
                  {f.q}
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mint text-teal transition group-open:bg-teal group-open:text-white">
                    <Icon name="arrow" className="h-3.5 w-3.5 rotate-90 transition-transform group-open:-rotate-90" />
                  </span>
                </summary>
                <p className="mt-2.5 max-w-3xl text-[13px] leading-6 text-body">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </Wrap>
    </>
  );
}

function AuthPage({ reg = false, admin = false }) {
  const { login } = useAuth();
  const [fields, setFields] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();
  const testimonials = [
    { quote: 'ThanziLearn makes it easy to fit learning into a busy schedule and apply new knowledge with confidence.', name: 'Grace M.', role: 'Nurse' },
    { quote: 'The courses are clear, practical, and focused on what matters most in everyday healthcare work.', name: 'Daniel K.', role: 'Clinical Officer' },
    { quote: 'I appreciate being able to learn at my own pace and track my progress along the way.', name: 'Memory P.', role: 'Community Health Worker' },
  ];
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, [testimonials.length]);
  const submit = async e => {
    e.preventDefault();
    setErr('');
    if (reg && (fields.name || '').trim().length < 2) return setErr('Please enter your full name.');
    if ((fields.password || '').length < 6) return setErr('Password must be at least 6 characters.');
    setBusy(true);
    try {
      const data = await api('/auth/' + (reg ? 'register' : 'login'), { method: 'POST', body: fields });
      login(data);
      navigate(data.user.role === 'admin' ? '/admin' : '/', { replace: true });
    } catch (x) {
      setErr(x.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-forest md:flex md:flex-col">
        <img src="/images/why.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
          <Link to="/" className="font-display text-2xl font-semibold" style={{ color: '#FFFFFF' }}>Thanzi<span className="text-orange">Learn</span></Link>
          <div>
            <h1 className="max-w-md font-display text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em]" style={{ color: '#FFFFFF' }}>{admin ? 'Manage courses and learners' : reg ? 'Start your learning journey' : 'Welcome back'}</h1>
            <p className="mt-3 max-w-md text-[15px] leading-7 text-white/80">Access practical courses, track progress, and earn completion certificates.</p>
          </div>
          <div className="max-w-md rounded-xl border border-white/20 bg-black/25 p-5 backdrop-blur-sm">
            <p className="text-[13px] leading-7 text-white/90">“{testimonials[slide].quote}”</p>
            <div className="mt-4">
              <p className="font-semibold text-white">{testimonials[slide].name}</p>
              <p className="text-xs text-white/75">{testimonials[slide].role}</p>
            </div>
            <div className="mt-4 flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} type="button" aria-label={`Show testimonial ${i + 1}`} onClick={() => setSlide(i)} className={`h-2.5 rounded-full transition ${slide === i ? 'w-6 bg-orange' : 'w-2.5 bg-white/50 hover:bg-white/70'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-white p-6 md:p-10">
        <form onSubmit={submit} className="w-full max-w-md">
          <Link to="/" className="font-display text-lg font-semibold tracking-[-0.02em] text-forest md:hidden">Thanzi<span className="text-teal">Learn</span></Link>
          <h2 className="mt-4 font-display text-2xl font-semibold text-forest md:mt-0">{admin ? 'Admin sign in' : reg ? 'Create your account' : 'Sign in'}</h2>
          <p className="mt-1.5 text-[13px] leading-6 text-body">{reg ? 'Use your email to create a free learner account.' : 'Enter your email and password to continue.'}</p>
          <div className="mt-7 space-y-4">
            {reg && <div><label className="mb-1 block text-sm font-medium text-forest">Full name</label><input className={inp} required value={fields.name} onChange={e => setFields({ ...fields, name: e.target.value })} placeholder="Full name" autoComplete="name" /></div>}
            <div><label className="mb-1 block text-sm font-medium text-forest">Email address</label><input className={inp} required type="email" value={fields.email} onChange={e => setFields({ ...fields, email: e.target.value })} placeholder="you@example.com" autoComplete="email" /></div>
            <div><label className="mb-1 block text-sm font-medium text-forest">Password</label><input className={inp} required type="password" value={fields.password} onChange={e => setFields({ ...fields, password: e.target.value })} placeholder={reg ? 'At least 6 characters' : 'Password'} autoComplete={reg ? 'new-password' : 'current-password'} /></div>
            {err && <Notice type="error">{err}</Notice>}
            <button className={btn + ' w-full'} disabled={busy}>{busy ? 'Please wait…' : reg ? 'Create account' : 'Sign in'}</button>
            {!admin && <p className="text-center text-sm text-body">{reg ? 'Already have an account?' : 'Don’t have an account?'} <Link to={reg ? '/login' : '/register'} className="font-semibold text-teal hover:underline">{reg ? 'Sign in' : 'Register'}</Link></p>}
          </div>
        </form>
      </div>
    </div>
  );
}

function InfoPage({ title, text, backTo = '/login', backLabel = 'Back to sign in', embedded = false }) {
  const content = (
    <div className="w-full max-w-lg rounded-xl border border-border bg-white p-6 shadow-sm md:p-8">
      <Link to="/" className="font-display text-xl font-semibold tracking-[-0.02em] text-lake">ThanziLearn</Link>
      <h1 className="mt-4 font-display text-2xl font-semibold text-forest">{title}</h1>
      <p className="mt-2.5 text-[13px] leading-6 text-body">{text}</p>
      <div className="mt-6 flex flex-wrap gap-3"><Link to={backTo} className={btn}>{backLabel}</Link><Link to="/contact" className={btnSoft}>Contact support</Link></div>
    </div>
  );
  if (embedded) return <div className="mx-auto max-w-[1200px] px-5 py-14 lg:px-10">{content}</div>;
  return <div className="flex min-h-screen items-center justify-center bg-canvas p-6">{content}</div>;
}

function LearnerShell({ children, title, subtitle, current = 'Dashboard' }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);
  const links = [
    ['Dashboard', '/learn'],
    ['Explore courses', '/learn/courses'],
    ['Certificates', '/learn/certificates'],
  ];
  return (
    <div className="min-h-screen bg-mist text-ink">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-border bg-white p-5 lg:flex">
          <Link to="/" className="font-display text-xl font-semibold tracking-[-0.02em] text-lake">ThanziLearn</Link>
          <div className="mt-7 flex items-center gap-3 rounded-xl bg-mint p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lake font-display text-xs font-semibold text-white">{initials(user?.name)}</div>
            <div className="min-w-0"><div className="truncate text-sm font-medium">{user?.name}</div><div className="text-[11px] text-body">Learner account</div></div>
          </div>
          <nav className="mt-7 space-y-1.5" aria-label="Learner">
            {links.map(([label, to]) => (
              <NavLink key={to} end={to === '/learn'} to={to} className={({ isActive }) => `block rounded-lg px-3 py-2 text-[13px] font-medium ${isActive ? 'bg-lake text-white' : 'text-body hover:bg-mint hover:text-forest'}`}>{label}</NavLink>
            ))}
          </nav>
          <div className="mt-auto pt-6"><button onClick={logout} className={btnSoft + ' w-full'}>Log out</button></div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-border bg-white px-4 py-3.5 md:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3 lg:hidden"><Link to="/" className="font-display text-lg font-semibold tracking-[-0.02em] text-lake">ThanziLearn</Link></div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">{current}</div>
                <h1 className="truncate font-display text-xl font-semibold">{title}</h1>
                {subtitle && <p className="text-[13px] text-body">{subtitle}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setOpen(v => !v)} className="rounded-lg border border-border px-3 py-1.5 text-[13px] font-medium lg:hidden" aria-expanded={open} aria-controls="learner-nav">{open ? 'Close' : 'Menu'}</button>
                <button onClick={logout} className="hidden rounded-lg border border-border px-3 py-1.5 text-[13px] font-medium sm:inline-flex lg:hidden">Log out</button>
              </div>
            </div>
            {open && (
              <nav id="learner-nav" className="mt-3 grid gap-2 lg:hidden" aria-label="Learner mobile">
                {links.map(([label, to]) => <NavLink key={to} end={to === '/learn'} to={to} className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-mint text-lake' : 'text-ink/80 hover:bg-mist'}`}>{label}</NavLink>)}
                <Link to="/" className="rounded-lg px-3 py-2 text-sm font-medium text-ink/80 hover:bg-mist">Back to site</Link>
              </nav>
            )}
          </header>
          <div className="flex-1 px-4 py-6 md:px-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

function LearnDashboard() {
  const { user } = useAuth();
  const { courses, loading, error, reload } = useCourses();
  const [params, setParams] = useSearchParams();
  const tabParam = params.get('tab');
  const tab = ['progress', 'completed', 'certificated'].includes(tabParam) ? tabParam : 'progress';
  const setTab = id => setParams(id === 'progress' ? {} : { tab: id }, { replace: true });

  // A course moves through three stages: started, lessons finished, then passed.
  const inProgress = courses.filter(c => !c.passed && (c.done || 0) > 0 && (c.done || 0) < (c.lessons || 0));
  const completed = courses.filter(c => !c.passed && (c.lessons || 0) > 0 && (c.done || 0) >= (c.lessons || 0));
  const certificated = courses.filter(c => c.passed);
  const unfinished = inProgress[0] || completed[0] || courses.find(c => !c.passed);
  const first = user?.name?.split(' ')[0] || 'there';

  let recommendation;
  if (loading) recommendation = 'Loading your courses…';
  else if (error) recommendation = 'We couldn’t load your courses just now. Please try again.';
  else if (inProgress.length) {
    const c = inProgress[0];
    recommendation = `You haven’t finished ${c.title} yet — you’re ${c.done} of ${c.lessons} lessons in. Pick up where you left off.`;
  } else if (completed.length) {
    const c = completed[0];
    recommendation = `You’ve finished the lessons in ${c.title}. Take the final assessment to earn your certificate.`;
  } else if (unfinished) {
    recommendation = `${unfinished.title} is a good place to start — ${unfinished.lessons} short lessons, about ${fmt(unfinished.minutes)} in total.`;
  } else {
    recommendation = 'This is your learning space — pick up courses you’ve started, see what you’ve completed, and find your certificates, all in one place.';
  }

  const tabs = [
    { id: 'progress', label: 'In Progress', items: inProgress, empty: 'No courses in progress', emptyText: 'Start a course and it will appear here so you can pick up where you left off.' },
    { id: 'completed', label: 'Completed', items: completed, empty: 'Nothing completed yet', emptyText: 'Finish every lesson in a course and it will show up here while you prepare for the assessment.' },
    { id: 'certificated', label: 'Certificated', items: certificated, empty: 'No certificates yet', emptyText: 'Pass a course assessment to earn a certificate you can view, print or save as a PDF.' },
  ];
  const active = tabs.find(t => t.id === tab) || tabs[0];

  return (
    <Site>
      {/* White greeting hero, in keeping with the rest of the public site */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-5 md:py-14 lg:px-10">
          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
            <div className="min-w-0">
              <p className={eyebrowCls}>My learning</p>
              <h1 className={`mt-2 ${h1Cls}`}>Welcome back, {first}.</h1>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-body">{recommendation}</p>
              {!loading && !error && unfinished && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to={`/learn/course/${unfinished.id}`} className={btn}>
                    {inProgress.length ? 'Continue learning' : completed.length ? 'Take the assessment' : 'Start course'}
                    <Icon name="arrow" className="h-4 w-4" />
                  </Link>
                  <Link to="/courses" className={btnSoft}>Browse courses</Link>
                </div>
              )}
            </div>
            <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-mint shadow-sm">
              <img
                src="/images/mylearning.jpg?v=2"
                alt="A learner working through a healthcare course"
                loading="eager"
                decoding="async"
                onError={e => {
                  if (e.currentTarget.dataset.retried) return;
                  e.currentTarget.dataset.retried = '1';
                  e.currentTarget.src = '/images/mylearning.jpg?retry=' + Date.now();
                }}
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Wrap>
        <div className="rounded-xl border border-border bg-white">
          <div className="flex flex-wrap items-center gap-1 border-b border-border p-2" role="tablist" aria-label="My learning">
            {tabs.map(t => {
              const selected = t.id === active.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-medium transition ${selected ? 'bg-mint text-lake' : 'text-body hover:bg-canvas hover:text-forest'}`}
                >
                  {t.label}
                  <span className={`rounded-full px-2 py-0.5 text-[11px] ${selected ? 'bg-lake text-white' : 'bg-canvas text-muted'}`}>{t.items.length}</span>
                </button>
              );
            })}
            <Link to="/courses" className="ml-auto hidden items-center gap-1.5 px-2 text-[13px] font-medium text-lake hover:underline sm:inline-flex">Browse courses <Icon name="arrow" className="h-3.5 w-3.5" /></Link>
          </div>

          <div className="p-5 sm:p-6">
            {loading ? <Loading /> : error ? (
              <StateBox title="Couldn’t load your dashboard" text={error} action={<button className={btn} onClick={reload}>Try again</button>} />
            ) : active.items.length === 0 ? (
              <StateBox title={active.empty} text={active.emptyText} action={<Link to="/courses" className={btn}>Browse courses</Link>} />
            ) : active.id === 'certificated' ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {active.items.map(c => (
                  <article key={c.id} className={card + ' flex flex-col'}>
                    <div className="rounded-lg bg-mint p-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-lake">Certificate earned</div>
                    <h3 className="mt-3.5 font-display text-base font-semibold">{c.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-6 text-body">Course completed with a passing assessment.</p>
                    <Link to={`/learn/certificates/${c.id}`} className={btn + ' mt-5 w-full'}>View certificate</Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {active.items.map(c => <CourseCard key={c.id} course={c} to={`/learn/course/${c.id}`} />)}
              </div>
            )}
          </div>
        </div>
      </Wrap>
    </Site>
  );
}

function LearnCoursesPage() {
  const { courses, loading, error, reload } = useCourses();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const categories = [...new Set(courses.map(c => c.category).filter(Boolean))];
  const list = courses.filter(c => {
    const q = query.toLowerCase();
    const matchQ = !q || `${c.title} ${c.description || ''}`.toLowerCase().includes(q);
    const matchC = !category || c.category === category;
    return matchQ && matchC;
  });
  return (
    <LearnerShell title="Explore courses" subtitle="Browse available courses and continue your learning." current="Explore courses">
      <div className="mb-6 grid gap-4 rounded-xl border border-border bg-white p-3.5 shadow-sm md:grid-cols-[1fr_220px]">
        <input className={inp} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search courses" aria-label="Search courses" />
        <select className={inp} value={category} onChange={e => setCategory(e.target.value)} aria-label="Filter by category"><option value="">All categories</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
      </div>
      {loading ? <Loading /> : error ? <StateBox title="Couldn’t load courses" text={error} action={<button className={btn} onClick={reload}>Try again</button>} /> : list.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{list.map(c => <CourseCard key={c.id} course={c} to={`/learn/course/${c.id}`} />)}</div>
      ) : <StateBox title="No courses found" text="Try adjusting your search or filters." />}
    </LearnerShell>
  );
}

function CoursePage() {
  const { id } = useParams();
  const [d, setD] = useState(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const load = async (keepIdx = true) => {
    try {
      const data = await api('/courses/' + id);
      setD(data);
      setError('');
      if (!keepIdx) setIdx(0);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { setLoading(true); load(false); }, [id]);
  if (loading) return <Wrap><Loading label="Loading course…" /></Wrap>;
  if (error || !d) return <Wrap><StateBox title="Couldn’t open course" text={error || 'Course not found.'} action={<Link to="/learn" className={btnSoft}>Back to dashboard</Link>} /></Wrap>;
  const { course, lessons, done, passed } = d;
  const progress = pct(done.length, lessons.length);
  const allDone = lessons.length > 0 && done.length === lessons.length;
  const inQuiz = idx < 0;
  const lesson = lessons[idx];
  const complete = async () => {
    if (!lesson) return;
    setBusy(true);
    try {
      await api('/lessons/' + lesson.id + '/complete', { method: 'POST' });
      const nextIdx = idx < lessons.length - 1 ? idx + 1 : -1;
      await load();
      setIdx(nextIdx);
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  const submitQuiz = async () => {
    if (answers.filter(a => a !== undefined).length < course.questions.length) { setError('Please answer all questions before submitting.'); return; }
    setBusy(true); setError('');
    try { setResult(await api('/courses/' + id + '/quiz', { method: 'POST', body: { answers } })); await load(); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  return (
    <Wrap>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Course</p>
          <h1 className="mt-1 font-display text-2xl font-semibold">{course.title}</h1>
          <p className="mt-1 text-[13px] text-body">{lessons.length} lessons · Pass mark {course.pass_mark}%</p>
        </div>
        <Link to="/learn" className={btnSoft}>Back to my learning</Link>
      </div>
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-ink/70"><span>Progress</span><span>{progress}%</span></div>
        <div className="h-2.5 overflow-hidden rounded-full bg-ink/10"><div className="h-full rounded-full bg-lake" style={{ width: `${progress}%` }} /></div>
      </div>
      {error && <div className="mb-4"><Notice type="error">{error}</Notice></div>}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className={card + ' h-fit space-y-2 lg:sticky lg:top-24'}>
          <div className="mb-2 font-semibold text-ink">Lessons</div>
          {lessons.map((l, n) => (
            <button key={l.id} onClick={() => { setIdx(n); setResult(null); }} className={`w-full rounded-lg px-3 py-2 text-left text-[13px] transition ${n === idx ? 'bg-lake text-white' : 'bg-mist text-body hover:bg-mint hover:text-forest'}`}>
              <span className="mr-2 inline-block w-4">{done.includes(l.id) ? '✓' : n + 1 + '.'}</span>{l.title}
            </button>
          ))}
          <button disabled={!allDone} onClick={() => { setIdx(-1); setError(''); }} className={`w-full rounded-lg px-3 py-2 text-left text-[13px] transition disabled:cursor-not-allowed disabled:opacity-50 ${inQuiz ? 'bg-lake text-white' : 'bg-mist text-body hover:bg-mint hover:text-forest'}`}>Final assessment</button>
          {!allDone && <p className="pt-1 text-[11px] text-muted">Complete all lessons to unlock the assessment.</p>}
        </aside>
        <section className={card + ' md:p-8'}>
          {!inQuiz ? (
            lesson ? (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Lesson {idx + 1} of {lessons.length} · {lesson.duration_min || 5} min</p>
                <h2 className="mt-1.5 font-display text-2xl font-semibold">{lesson.title}</h2>
                {lesson.video_url && <div className="mt-5 overflow-hidden rounded-xl border border-border"><iframe src={lesson.video_url} className="aspect-video w-full" allowFullScreen title={lesson.title} /></div>}
                <div className="mt-5 whitespace-pre-line text-[15px] leading-8 text-body">{lesson.body || 'Lesson content will appear here.'}</div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0} className={btnSoft + ' disabled:opacity-50'}>Previous</button>
                  <button onClick={complete} disabled={busy} className={btn}>{busy ? 'Saving…' : done.includes(lesson.id) ? (idx < lessons.length - 1 ? 'Next lesson' : 'Go to assessment') : 'Mark complete & continue'}</button>
                </div>
              </>
            ) : <StateBox title="No lessons yet" text="This course doesn’t have any lessons." />
          ) : (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Final assessment</p>
              <h2 className="mt-1.5 font-display text-2xl font-semibold">Check your understanding</h2>
              <p className="mt-2 text-[13px] text-body">Answer all {course.questions.length} questions. You need {course.pass_mark}% to pass.</p>
              {result ? (
                <div className={`mt-6 rounded-xl p-6 ${result.passed ? 'bg-mint' : 'bg-[#fff7e8]'}`}>
                  <div className="font-display text-lg font-semibold">{result.passed ? 'You passed' : 'Not passed yet'}</div>
                  <div className="mt-1 font-display text-4xl font-semibold text-lake">{result.score}%</div>
                  <p className="mt-2 text-[13px] text-body">{result.correct} of {result.total} correct · Pass mark {result.pass_mark}%</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {result.passed ? <Link to={`/learn/certificates/${id}`} className={btn}>View certificate</Link> : <button onClick={() => { setResult(null); setAnswers([]); setIdx(0); setError(''); }} className={btn}>Review lessons & try again</button>}
                    <Link to="/learn" className={btnSoft}>Back to my learning</Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mt-6 space-y-5">
                    {course.questions.map((q, n) => (
                      <fieldset key={n} className="rounded-xl border border-border bg-mist p-4">
                        <legend className="mb-3 px-1 text-[13px] font-medium text-forest">{n + 1}. {q.q}</legend>
                        <div className="space-y-2">
                          {q.options.map((opt, k) => (
                            <label key={k} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-[13px] ${answers[n] === k ? 'border-lake bg-white text-forest' : 'border-border bg-white/70 text-body hover:border-lake/40'}`}>
                              <input type="radio" name={`q-${n}`} checked={answers[n] === k} onChange={() => { const next = [...answers]; next[n] = k; setAnswers(next); }} />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button onClick={submitQuiz} disabled={busy} className={btn}>{busy ? 'Submitting…' : 'Submit assessment'}</button>
                    <button onClick={() => setIdx(lessons.length - 1)} className={btnSoft}>Review last lesson</button>
                  </div>
                </>
              )}
              {passed && !result?.passed && <p className="mt-4 text-[13px] text-body">You have already passed this course. <Link to={`/learn/certificates/${id}`} className="font-medium text-lake hover:underline">View your certificate</Link>.</p>}
            </>
          )}
        </section>
      </div>
    </Wrap>
  );
}

function SettingsPage() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [pw, setPw] = useState({ current: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pwBusy, setPwBusy] = useState(false);
  const [accountNotice, setAccountNotice] = useState(null);
  const [passwordNotice, setPasswordNotice] = useState(null);

  useEffect(() => {
    api('/me')
      .then(u => setForm({ name: u.name, email: u.email }))
      .catch(e => setAccountNotice({ type: 'error', text: e.message }))
      .finally(() => setLoading(false));
  }, []);

  const saveAccount = async e => {
    e.preventDefault();
    setSaving(true); setAccountNotice(null);
    try {
      const data = await api('/me', { method: 'PATCH', body: form });
      login(data);
      setForm({ name: data.user.name, email: data.user.email || form.email });
      setAccountNotice({ type: 'success', text: 'Your account details have been updated.' });
    } catch (x) {
      setAccountNotice({ type: 'error', text: x.message });
    } finally { setSaving(false); }
  };

  const savePassword = async e => {
    e.preventDefault();
    setPasswordNotice(null);
    if (pw.password !== pw.confirm) {
      setPasswordNotice({ type: 'error', text: 'The new passwords do not match.' });
      return;
    }
    setPwBusy(true);
    try {
      await api('/me/password', { method: 'POST', body: { current: pw.current, password: pw.password } });
      setPw({ current: '', password: '', confirm: '' });
      setPasswordNotice({ type: 'success', text: 'Your password has been updated.' });
    } catch (x) {
      setPasswordNotice({ type: 'error', text: x.message });
    } finally { setPwBusy(false); }
  };

  const roleLabel = user?.role === 'admin' ? 'Administrator' : user?.role === 'supervisor' ? 'Supervisor' : 'Learner account';

  return (
    <Site>
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-5 md:py-12 lg:px-10">
          <p className={eyebrowCls}>Account</p>
          <h1 className={`mt-2 ${h1Cls}`}>Settings</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-body">Update your personal details and password, and keep your ThanziLearn account secure.</p>
        </div>
      </section>

      <Wrap>
        <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
          <aside className={card}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lake font-display text-sm font-semibold text-white">{initials(form.name)}</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-forest">{form.name || 'Your account'}</p>
                <p className="truncate text-[12px] text-muted">{form.email}</p>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-mint px-3 py-2 text-[12px] font-medium text-lake">{roleLabel}</div>
            <Link to="/learn" className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-lake hover:underline">Back to my learning <Icon name="arrow" className="h-3.5 w-3.5" /></Link>
          </aside>

          <div className="min-w-0 space-y-6">
            {loading ? <Loading label="Loading your account…" /> : (
              <>
                <form onSubmit={saveAccount} className={card}>
                  <h2 className="font-display text-lg font-semibold text-forest">Account details</h2>
                  <p className="mt-1 text-[13px] leading-6 text-body">This is how your name appears on lessons and certificates.</p>
                  <div className="mt-5 grid gap-4">
                    <label className="block">
                      <span className="mb-1 block text-sm font-medium text-forest">Full name</span>
                      <input className={inp} required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" autoComplete="name" />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-sm font-medium text-forest">Email address</span>
                      <input className={inp} required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" autoComplete="email" />
                    </label>
                  </div>
                  {accountNotice && <div className="mt-4"><Notice type={accountNotice.type}>{accountNotice.text}</Notice></div>}
                  <div className="mt-5 flex justify-end">
                    <button type="submit" className={btn} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
                  </div>
                </form>

                <form onSubmit={savePassword} className={card}>
                  <h2 className="font-display text-lg font-semibold text-forest">Password</h2>
                  <p className="mt-1 text-[13px] leading-6 text-body">Use at least 6 characters. You’ll stay signed in after the change.</p>
                  <div className="mt-5 grid gap-4">
                    <label className="block">
                      <span className="mb-1 block text-sm font-medium text-forest">Current password</span>
                      <input className={inp} required type="password" value={pw.current} onChange={e => setPw({ ...pw, current: e.target.value })} placeholder="Your current password" autoComplete="current-password" />
                    </label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1 block text-sm font-medium text-forest">New password</span>
                        <input className={inp} required type="password" value={pw.password} onChange={e => setPw({ ...pw, password: e.target.value })} placeholder="At least 6 characters" autoComplete="new-password" />
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-sm font-medium text-forest">Confirm new password</span>
                        <input className={inp} required type="password" value={pw.confirm} onChange={e => setPw({ ...pw, confirm: e.target.value })} placeholder="Repeat new password" autoComplete="new-password" />
                      </label>
                    </div>
                  </div>
                  {passwordNotice && <div className="mt-4"><Notice type={passwordNotice.type}>{passwordNotice.text}</Notice></div>}
                  <div className="mt-5 flex justify-end">
                    <button type="submit" className={btn} disabled={pwBusy}>{pwBusy ? 'Updating…' : 'Update password'}</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </Wrap>
    </Site>
  );
}

function CertificatesPage() {
  const { courses, loading, error, reload } = useCourses();
  const earned = courses.filter(c => c.passed);
  return (
    <LearnerShell title="Certificates" subtitle="Certificates earned from completed courses." current="Certificates">
      {loading ? <Loading /> : error ? <StateBox title="Couldn’t load certificates" text={error} action={<button className={btn} onClick={reload}>Try again</button>} /> : earned.length === 0 ? (
        <StateBox title="No certificates yet" text="Complete a course and pass its assessment to earn a certificate." action={<Link to="/learn/courses" className={btn}>Explore courses</Link>} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {earned.map(c => (
            <div key={c.id} className={card}>
              <div className="rounded-lg bg-mint p-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-lake">Certificate earned</div>
              <h3 className="mt-3.5 font-display text-base font-semibold">{c.title}</h3>
              <p className="mt-1.5 text-[13px] leading-6 text-body">Course completed with a passing assessment.</p>
              <Link to={`/learn/certificates/${c.id}`} className={btn + ' mt-5 w-full'}>View certificate</Link>
            </div>
          ))}
        </div>
      )}
    </LearnerShell>
  );
}

function CertificateViewPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [d, setD] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => { api('/courses/' + id).then(setD).catch(e => setError(e.message)).finally(() => setLoading(false)); }, [id]);
  if (loading) return <LearnerShell title="Certificate" current="Certificates"><Loading /></LearnerShell>;
  if (error) return <LearnerShell title="Certificate" current="Certificates"><StateBox title="Couldn’t load certificate" text={error} action={<Link to="/learn/certificates" className={btnSoft}>Back</Link>} /></LearnerShell>;
  if (!d?.passed) return <LearnerShell title="Certificate" current="Certificates"><StateBox title="Certificate locked" text="Pass the final assessment for this course to unlock your certificate." action={<Link to={`/learn/course/${id}`} className={btn}>Open course</Link>} /></LearnerShell>;
  const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <LearnerShell title="Certificate of completion" subtitle={d.course.title} current="Certificates">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm print:border-0 print:p-0 print:shadow-none">
          <div className="rounded-xl border-4 border-lake bg-white p-8 text-center md:p-12">
            <div className="font-display text-2xl font-semibold text-lake">ThanziLearn</div>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted">Certificate of completion</p>
            <p className="mt-8 text-base text-body">This certifies that</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">{user?.name}</h2>
            <p className="mt-2 text-base text-body">has successfully completed</p>
            <h3 className="mt-3 font-display text-2xl font-semibold text-lake">{d.course.title}</h3>
            <p className="mt-6 text-[13px] text-body">Issued on {today}</p>
            <p className="mt-6 text-[11px] leading-5 text-muted">This certificate records course completion and is not a professional licence unless stated by the provider.</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3 print:hidden">
          <button onClick={() => window.print()} className={btn}>Print or save as PDF</button>
          <Link to="/learn/certificates" className={btnSoft}>Back to certificates</Link>
        </div>
      </div>
    </LearnerShell>
  );
}

function NotFound() {
  return (
    <Site>
      <Wrap>
        <StateBox title="Page not found" text="The page you’re looking for doesn’t exist or may have moved." action={<Link to="/" className={btn}>Go to home</Link>} />
      </Wrap>
    </Site>
  );
}

function RequireAuth({ children, adminOnly = false }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to={adminOnly ? '/admin' : '/login'} replace state={{ from: loc }} />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/learn" replace />;
  return children;
}

function AdminGate({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [location.pathname]);

  if (!user) return <AuthPage admin />;
  if (user.role !== 'admin') {
    return (
      <div className="grid min-h-screen place-items-center bg-mist p-6">
        <div className={card + ' max-w-md text-center'}><h1 className="font-display text-xl font-semibold">Admin access required</h1><p className="mt-2 text-[13px] text-body">This account does not have permission to view the admin area.</p><div className="mt-5 flex justify-center gap-3"><Link to="/learn" className={btnSoft}>Go to dashboard</Link><button onClick={logout} className={btn}>Log out</button></div></div>
      </div>
    );
  }

  const links = [
    ['Dashboard', '/admin'],
    ['Courses', '/admin/courses'],
    ['Users', '/admin/users'],
    ['Progress', '/admin/progress'],
  ];
  const meta = {
    '/admin': ['Dashboard', 'Overview of platform activity.'],
    '/admin/courses': ['Courses', 'Create and manage learning content.'],
    '/admin/new': ['New course', 'Add lessons, skills and quiz questions.'],
    '/admin/users': ['Users', 'Manage learner and staff roles.'],
    '/admin/progress': ['Learner progress', 'Progress across all learners and courses.'],
  }[location.pathname] || ['Edit course', 'Update lessons, skills and quiz questions.'];
  const [title, subtitle] = meta;

  return (
    <div className="min-h-screen bg-mist text-ink">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-border bg-white p-5 lg:flex">
          <Link to="/admin" className="font-display text-xl font-semibold tracking-[-0.02em] text-lake">ThanziLearn</Link>
          <div className="mt-7 flex items-center gap-3 rounded-xl bg-mint p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lake font-display text-xs font-semibold text-white">{initials(user.name)}</div>
            <div className="min-w-0"><div className="truncate text-sm font-medium">{user.name}</div><div className="text-[11px] text-body">Administrator</div></div>
          </div>
          <nav className="mt-7 space-y-1.5" aria-label="Admin">
            {links.map(([label, to]) => (
              <NavLink key={to} end={to === '/admin'} to={to} className={({ isActive }) => `block rounded-lg px-3 py-2 text-[13px] font-medium ${isActive ? 'bg-lake text-white' : 'text-body hover:bg-mint hover:text-forest'}`}>{label}</NavLink>
            ))}
          </nav>
          <div className="mt-auto space-y-2 pt-6">
            <Link to="/" className={btnSoft + ' w-full'}>View site</Link>
            <button onClick={logout} className={btn + ' w-full'}>Log out</button>
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-border bg-white px-4 py-3.5 md:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3 lg:hidden"><Link to="/admin" className="font-display text-lg font-semibold tracking-[-0.02em] text-lake">ThanziLearn</Link></div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Admin</div>
                <h1 className="truncate font-display text-xl font-semibold">{title}</h1>
                <p className="text-[13px] text-body">{subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setOpen(v => !v)} className="rounded-lg border border-border px-3 py-1.5 text-[13px] font-medium lg:hidden" aria-expanded={open} aria-controls="admin-nav">{open ? 'Close' : 'Menu'}</button>
                <button onClick={logout} className="hidden rounded-lg border border-border px-3 py-1.5 text-[13px] font-medium sm:inline-flex lg:hidden">Log out</button>
              </div>
            </div>
            {open && (
              <nav id="admin-nav" className="mt-3 grid gap-2 lg:hidden" aria-label="Admin mobile">
                {links.map(([label, to]) => <NavLink key={to} end={to === '/admin'} to={to} className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-mint text-lake' : 'text-ink/80 hover:bg-mist'}`}>{label}</NavLink>)}
                <Link to="/" className="rounded-lg px-3 py-2 text-sm font-medium text-ink/80 hover:bg-mist">View site</Link>
              </nav>
            )}
          </header>
          <div className="flex-1 px-4 py-6 md:px-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Progress() {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { api('/admin/overview').then(setRows).catch(e => setErr(e.message)); }, []);
  if (err) return <StateBox title="Couldn’t load progress" text={err} />;
  if (!rows) return <Loading />;
  const by = rows.reduce((acc, r) => { (acc[r.email] ||= { name: r.name, email: r.email, rows: [] }).rows.push(r); return acc; }, {});
  const groups = Object.values(by);
  return (
    <>
      {!groups.length ? <StateBox title="No learner progress yet" text="Progress will appear here once learners start courses." /> : (
        <div className="space-y-4">
          {groups.map(g => (
            <section key={g.email} className={card}>
              <h2 className="font-display text-base font-semibold">{g.name} <span className="text-[13px] font-normal text-muted">{g.email}</span></h2>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-[13px]"><thead><tr className="text-left text-muted"><th className="py-2 pr-3 font-medium">Course</th><th className="py-2 pr-3 font-medium">Lessons</th><th className="py-2 font-medium">Status</th></tr></thead>
                  <tbody>{g.rows.map(x => (<tr key={x.course_id} className="border-t border-border"><td className="py-2 pr-3">{x.title}</td><td className="py-2 pr-3">{x.done}/{x.total}</td><td className="py-2"><span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${x.passed ? 'bg-mint text-lake' : x.done > 0 ? 'bg-[#fff7e8] text-forest' : 'bg-mist text-muted'}`}>{x.passed ? 'Passed' : x.done > 0 ? 'In progress' : 'Not started'}</span></td></tr>))}</tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}

function RedirectToLearnCourse() {
  const { id } = useParams();
  return <Navigate to={`/learn/course/${id}`} replace />;
}

function RedirectLegacyCourse() {
  const { courseId } = useParams();
  return <Navigate to={`/learn/course/${courseId}`} replace />;
}

function RedirectToLearnCertificate() {
  const { id } = useParams();
  return <Navigate to={`/learn/certificates/${id}`} replace />;
}

export default function App() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('u') || 'null'); } catch { return null; } });
  const [authMode, setAuthMode] = useState(null);
  const login = ({ token, user }) => { localStorage.setItem('t', token); localStorage.setItem('u', JSON.stringify(user)); setUser(user); };
  const logout = () => { localStorage.clear(); setUser(null); };
  const openAuth = useMemo(() => mode => setAuthMode(mode === 'register' ? 'register' : 'login'), []);
  const closeAuth = useMemo(() => () => setAuthMode(null), []);
  const switchAuth = useMemo(() => mode => setAuthMode(mode === 'register' ? 'register' : 'login'), []);
  const value = useMemo(() => ({ user, login, logout }), [user]);
  const home = user?.role === 'admin' ? '/admin' : '/learn';
  return (
    <Ctx.Provider value={value}>
      <AuthDialogCtx.Provider value={openAuth}>
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Site><Landing /></Site>} />
          <Route path="/courses" element={<Site><Catalogue /></Site>} />
          <Route path="/courses/:id" element={<Site><Preview /></Site>} />
          <Route path="/about" element={<Site><About /></Site>} />

          <Route path="/contact" element={<Site><ContactPage /></Site>} />
          <Route path="/privacy" element={<Site><InfoPage embedded title="Privacy Policy" text="Our privacy policy is being prepared. If you have questions about how your information is handled, please contact us." backTo="/" backLabel="Back to home" /></Site>} />
          <Route path="/terms" element={<Site><InfoPage embedded title="Terms of Use" text="Our terms of use are being prepared. By using ThanziLearn you agree to use the platform responsibly for learning purposes." backTo="/" backLabel="Back to home" /></Site>} />
          <Route path="/login" element={user ? <Navigate to={home} replace /> : <AuthPage />} />
          <Route path="/register" element={user ? <Navigate to={home} replace /> : <AuthPage reg />} />
          <Route path="/forgot-password" element={<InfoPage title="Password reset" text="Self-service password reset isn’t available in this version yet. Please contact your administrator or support to reset your password." />} />

          <Route path="/learn" element={<RequireAuth><LearnDashboard /></RequireAuth>} />
          <Route path="/learn/courses" element={<RequireAuth><LearnCoursesPage /></RequireAuth>} />
          <Route path="/learn/my-learning" element={<RequireAuth><Navigate to="/learn" replace /></RequireAuth>} />
          <Route path="/learn/certificates" element={<RequireAuth><CertificatesPage /></RequireAuth>} />
          <Route path="/learn/certificates/:id" element={<RequireAuth><CertificateViewPage /></RequireAuth>} />
          <Route path="/learn/course/:id" element={<RequireAuth><CoursePage /></RequireAuth>} />

          {/* unify/redirect legacy and placeholder learner routes */}
          <Route path="/course/:id" element={<RequireAuth><RedirectToLearnCourse /></RequireAuth>} />
          <Route path="/my" element={<RequireAuth><Navigate to="/learn" replace /></RequireAuth>} />
          <Route path="/certificate/:id" element={<RequireAuth><RedirectToLearnCertificate /></RequireAuth>} />
          <Route path="/learn/courses/:courseId/lessons/:lessonId" element={<RequireAuth><RedirectLegacyCourse /></RequireAuth>} />
          <Route path="/learn/courses/:courseId/assessment" element={<RequireAuth><RedirectLegacyCourse /></RequireAuth>} />
          <Route path="/learn/courses/:courseId/results" element={<RequireAuth><RedirectLegacyCourse /></RequireAuth>} />
          <Route path="/learn/profile" element={<RequireAuth><Navigate to="/learn/settings" replace /></RequireAuth>} />
          <Route path="/learn/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
          <Route path="/learn/help" element={<RequireAuth><LearnerShell title="Help & support" subtitle="Get assistance" current="Help"><StateBox title="Need help?" text="If you have trouble accessing a course or your account, reach out and we’ll assist you." action={<Link to="/contact" className={btn}>Contact support</Link>} /></LearnerShell></RequireAuth>} />

          <Route path="/admin" element={<AdminGate><Dashboard /></AdminGate>} />
          <Route path="/admin/courses" element={<AdminGate><AdminCourses /></AdminGate>} />
          <Route path="/admin/new" element={<AdminGate><CourseEditor /></AdminGate>} />
          <Route path="/admin/edit/:id" element={<AdminGate><CourseEditor /></AdminGate>} />
          <Route path="/admin/users" element={<AdminGate><Users /></AdminGate>} />
          <Route path="/admin/progress" element={<AdminGate><Progress /></AdminGate>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        {authMode && <AuthDialog mode={authMode} onClose={closeAuth} onSwitch={switchAuth} />}
      </BrowserRouter>
      </AuthDialogCtx.Provider>
    </Ctx.Provider>
  );
}
