import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Bell, GraduationCap, Menu, Search, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAuthDialog } from '../context/AuthDialogContext';
import { CATEGORY_TAXONOMY } from '../data/categories';
import { Brand, Button, Dropdown } from '../components/ui';

const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('') || 'N';

const footerColumns = [
  {
    title: 'Nzeruhive',
    links: [
      ['About us', '/about'],
      ['Our mission', '/about#mission'],
      ['Contact', '/contact'],
    ],
  },
  {
    title: 'Explore',
    links: [
      ['Courses', '/courses'],
      ['Categories', '/categories'],
      ['Institutions', '/institutions'],
    ],
  },
  {
    title: 'For organisations',
    links: [
      ['Create an academy', '/organisations/apply'],
      ['Institutional solutions', '/organisations'],
    ],
  },
  {
    title: 'Support',
    links: [
      ['Help centre', '/help'],
      ['FAQs', '/faq'],
      ['Contact support', '/contact'],
    ],
  },
  {
    title: 'Legal',
    links: [
      ['Terms of service', '/terms'],
      ['Privacy policy', '/privacy'],
      ['Cookie policy', '/cookie-policy'],
    ],
  },
];

const socials = [
  ['LinkedIn', 'https://www.linkedin.com/'],
  ['YouTube', 'https://www.youtube.com/'],
  ['X', 'https://x.com/'],
];

function navClass({ isActive }) {
  return `rounded-lg px-3 py-2 text-[14px] font-medium transition-colors ${
    isActive ? 'bg-primary-50 text-primary-800' : 'text-text-secondary hover:bg-primary-50 hover:text-primary-800'
  }`;
}

export default function PublicLayout({ children }) {
  const { user, logout } = useAuth();
  const openAuth = useAuthDialog();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
    setSearch('');
  }, [location.pathname, location.search]);

  const submitSearch = (event) => {
    event.preventDefault();
    const term = search.trim();
    navigate(term ? `/courses?q=${encodeURIComponent(term)}` : '/courses');
    setMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-text-secondary">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:rounded-lg focus:bg-primary-800 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-3 px-4 sm:px-6 lg:px-10">
          <Brand />

          <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Primary">
            <NavLink to="/courses" className={navClass}>Explore courses</NavLink>
            <Dropdown
              trigger="Categories"
              panelClassName="w-[520px]"
            >
              {({ close }) => (
                <div className="grid grid-cols-2 gap-1 p-1">
                  {CATEGORY_TAXONOMY.map((category) => (
                    <Link
                      key={category.slug}
                      to={`/courses?category=${encodeURIComponent(category.name)}`}
                      onClick={close}
                      className="rounded-lg px-3 py-2 text-[13px] font-medium text-text-secondary transition-colors hover:bg-primary-50 hover:text-primary-800"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </Dropdown>
            <NavLink to="/organisations" className={navClass}>For organisations</NavLink>
          </nav>

          <form onSubmit={submitSearch} role="search" className="ml-auto hidden min-w-0 flex-1 md:block">
            <div className="relative w-full max-w-[280px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search courses"
                aria-label="Search courses"
                className="h-9 w-full rounded-full border border-border bg-surface-secondary pl-4 pr-11 text-[13px] text-text-primary placeholder:text-text-muted transition focus:border-primary-800 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-primary-800 text-white transition hover:bg-primary-700"
              >
                <Search className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  type="button"
                  aria-label="Notifications"
                  className="hidden h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-primary-50 hover:text-primary-800 sm:inline-flex"
                >
                  <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
                </button>

                <div className="relative hidden sm:block">
                  <button
                    type="button"
                    onClick={() => setAccountOpen((v) => !v)}
                    aria-expanded={accountOpen}
                    aria-haspopup="true"
                    aria-label="Account menu"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-[11px] font-bold text-primary-800 transition-colors hover:bg-primary-200"
                  >
                    {initials(user.name)}
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-white p-2 shadow-lg">
                      <div className="border-b border-border px-3 py-2">
                        <p className="truncate text-[13px] font-semibold text-text-primary">{user.name}</p>
                        <p className="truncate text-[11px] text-text-muted">{user.email}</p>
                      </div>
                      <div className="pt-1">
                        <Link className="block rounded-lg px-3 py-2 text-[13px] text-text-secondary hover:bg-primary-50 hover:text-primary-800" to="/learn">
                          My learning
                        </Link>
                        <Link className="block rounded-lg px-3 py-2 text-[13px] text-text-secondary hover:bg-primary-50 hover:text-primary-800" to="/learn/certificates">
                          Certificates
                        </Link>
                        <Link className="block rounded-lg px-3 py-2 text-[13px] text-text-secondary hover:bg-primary-50 hover:text-primary-800" to="/learn/settings">
                          Settings
                        </Link>
                        {user.role === 'admin' && (
                          <Link className="block rounded-lg px-3 py-2 text-[13px] text-text-secondary hover:bg-primary-50 hover:text-primary-800" to="/admin">
                            Admin dashboard
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={logout}
                          className="block w-full rounded-lg px-3 py-2 text-left text-[13px] text-text-secondary transition-colors hover:bg-primary-50 hover:text-primary-800"
                        >
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button variant="text" className="hidden sm:inline-flex" onClick={() => openAuth('login')}>
                  Log in
                </Button>
                <Button className="hidden sm:inline-flex" onClick={() => openAuth('register')}>
                  Get started
                </Button>
              </>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="public-mobile-nav"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-primary lg:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="public-mobile-nav"
            aria-label="Mobile"
            className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border bg-white px-4 py-4 lg:hidden"
          >
            <form onSubmit={submitSearch} role="search" className="relative mb-3">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search courses"
                aria-label="Search courses"
                className="h-10 w-full rounded-full border border-border bg-surface-secondary pl-4 pr-12 text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary-800 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary-800 text-white transition hover:bg-primary-700"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>

            <div className="flex flex-col gap-1">
              <NavLink to="/courses" className={navClass}>Explore courses</NavLink>
              <NavLink to="/organisations" className={navClass}>For organisations</NavLink>
            </div>

            <p className="mt-5 px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">
              Categories
            </p>
            <div className="grid grid-cols-2 gap-1">
              {CATEGORY_TAXONOMY.map((category) => (
                <Link
                  key={category.slug}
                  to={`/courses?category=${encodeURIComponent(category.name)}`}
                  className="rounded-lg px-3 py-2 text-[13px] text-text-secondary hover:bg-primary-50 hover:text-primary-800"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <div className="mt-5 grid gap-2 border-t border-border pt-5">
              {user ? (
                <>
                  <Button as={Link} to="/learn" variant="secondary" className="w-full">
                    My learning
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={logout}>
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" className="w-full" onClick={() => openAuth('login')}>
                    Log in
                  </Button>
                  <Button className="w-full" onClick={() => openAuth('register')}>
                    Get started
                  </Button>
                </>
              )}
            </div>
          </nav>
        )}
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-6 lg:px-10">
          <div className="md:col-span-2 lg:col-span-1">
            <Brand />
            <p className="mt-4 max-w-xs text-[13px] leading-6 text-text-secondary">
              A connected world of learning for people and organisations.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socials.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-[10px] font-bold text-text-secondary transition-colors hover:border-primary-200 hover:text-primary-800"
                >
                  {label[0]}
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="text-[13px] font-bold text-text-primary">{column.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-[13px] text-text-secondary transition-colors hover:text-primary-800">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border">
          <div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-4 py-5 text-[12px] text-text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
            <p>© {new Date().getFullYear()} Nzeruhive. All rights reserved.</p>
            <p className="inline-flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
              Learn. Connect. Grow.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
