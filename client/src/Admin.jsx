import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://thanzilearn.onrender.com' : 'http://localhost:5000');
async function api(path, opts = {}) {
  const r = await fetch(API + '/api' + path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('t') },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || 'Something went wrong');
  return d;
}

const inp = 'w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm focus:border-lake';
const btn = 'inline-flex items-center justify-center rounded-lg bg-lake px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60';
const ghost = 'inline-flex items-center justify-center rounded-lg border border-border bg-white px-3 py-2 text-[13px] font-medium hover:border-lake/40 hover:text-lake';
const card = 'rounded-xl border border-border bg-white p-5';

export function CourseEditor() {
  const { id } = useParams();
  const nav = useNavigate();
  const blank = { title: '', description: '', category: '', pass_mark: 70, skills: [], lessons: [{ title: '', body: '', video_url: '', duration_min: 5 }], questions: [{ q: '', options: ['', ''], answer: 0 }] };
  const [c, setC] = useState(blank);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(!id);
  useEffect(() => { if (id) api('/admin/courses/' + id).then(d => setC({ ...blank, ...d, skills: d.skills || [] })).finally(() => setReady(true)); }, [id]);
  if (!ready) return <p className="text-sm text-ink/70">Loading course…</p>;
  const up = (k, v) => setC(s => ({ ...s, [k]: v }));
  const upL = (i, k, v) => up('lessons', c.lessons.map((l, n) => n === i ? { ...l, [k]: v } : l));
  const upQ = (i, p) => up('questions', c.questions.map((x, n) => n === i ? { ...x, ...p } : x));
  const move = (i, d) => { const a = [...c.lessons], j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; up('lessons', a); };
  const save = async e => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { await api(id ? '/admin/courses/' + id : '/admin/courses', { method: id ? 'PUT' : 'POST', body: c }); nav('/admin/courses'); }
    catch (x) { setErr(x.message); } finally { setBusy(false); }
  };
  const del = async () => { if (confirm('Delete this course and all learner progress in it?')) { await api('/admin/courses/' + id, { method: 'DELETE' }); nav('/admin/courses'); } };
  return (
    <form onSubmit={save} className="max-w-4xl space-y-5">
      <div className="flex justify-end">
        <Link to="/admin/courses" className={ghost}>Back to courses</Link>
      </div>
      <section className={card + ' space-y-4'}>
        <h2 className="font-display text-lg font-semibold">Course details</h2>
        <label className="block text-sm font-medium">Title<input className={inp + ' mt-1'} required placeholder="Course title" value={c.title} onChange={e => up('title', e.target.value)} /></label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium">Category<input className={inp + ' mt-1'} placeholder="e.g. Patient safety" value={c.category || ''} onChange={e => up('category', e.target.value)} /></label>
          <label className="block text-sm font-medium">Pass mark (%)<input type="number" min="1" max="100" className={inp + ' mt-1'} value={c.pass_mark} onChange={e => up('pass_mark', e.target.value)} /></label>
        </div>
        <label className="block text-sm font-medium">Description<textarea className={inp + ' mt-1 min-h-24'} placeholder="Short description" value={c.description || ''} onChange={e => up('description', e.target.value)} /></label>
        <label className="block text-sm font-medium">Skills learners gain (one per line)<textarea className={inp + ' mt-1 min-h-24'} placeholder={'Apply hand hygiene\nUse protective equipment safely'} value={(c.skills || []).join('\n')} onChange={e => up('skills', e.target.value.split('\n'))} /></label>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Lessons</h2>
        {c.lessons.map((l, i) => (
          <div key={i} className={card + ' space-y-3'}>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">Lesson {i + 1}</div>
            <input className={inp} placeholder="Lesson title" value={l.title} onChange={e => upL(i, 'title', e.target.value)} />
            <textarea className={inp + ' min-h-32'} placeholder="Lesson text" value={l.body || ''} onChange={e => upL(i, 'body', e.target.value)} />
            <div className="grid gap-3 md:grid-cols-[1fr_160px]">
              <input className={inp} placeholder="Video embed URL (optional)" value={l.video_url || ''} onChange={e => upL(i, 'video_url', e.target.value)} />
              <label className="block text-sm font-medium">Minutes<input type="number" min="1" className={inp + ' mt-1'} value={l.duration_min || 5} onChange={e => upL(i, 'duration_min', e.target.value)} /></label>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={ghost} onClick={() => move(i, -1)}>Move up</button>
              <button type="button" className={ghost} onClick={() => move(i, 1)}>Move down</button>
              <button type="button" className={ghost} disabled={c.lessons.length === 1} onClick={() => up('lessons', c.lessons.filter((_, n) => n !== i))}>Remove</button>
            </div>
          </div>
        ))}
        <button type="button" className={ghost} onClick={() => up('lessons', [...c.lessons, { title: '', body: '', video_url: '', duration_min: 5 }])}>+ Add lesson</button>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Quiz questions</h2>
        {c.questions.map((x, i) => (
          <div key={i} className={card + ' space-y-3'}>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">Question {i + 1}</div>
            <input className={inp} placeholder="Question text" value={x.q} onChange={e => upQ(i, { q: e.target.value })} />
            <div className="space-y-2">
              {x.options.map((o, k) => (
                <div key={k} className="flex items-center gap-2">
                  <input type="radio" name={'ans' + i} checked={x.answer === k} onChange={() => upQ(i, { answer: k })} aria-label={`Correct answer for question ${i + 1} option ${k + 1}`} />
                  <input className={inp} placeholder={`Option ${k + 1}`} value={o} onChange={e => upQ(i, { options: x.options.map((y, n) => n === k ? e.target.value : y) })} />
                  {x.options.length > 2 && <button type="button" className={ghost} onClick={() => upQ(i, { options: x.options.filter((_, n) => n !== k), answer: x.answer === k ? 0 : x.answer > k ? x.answer - 1 : x.answer })}>Remove</button>}
                </div>
              ))}
            </div>
            <p className="text-xs text-ink/60">Select the option that is the correct answer.</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={ghost} onClick={() => upQ(i, { options: [...x.options, ''] })}>Add option</button>
              <button type="button" className={ghost} disabled={c.questions.length === 1} onClick={() => up('questions', c.questions.filter((_, n) => n !== i))}>Remove question</button>
            </div>
          </div>
        ))}
        <button type="button" className={ghost} onClick={() => up('questions', [...c.questions, { q: '', options: ['', ''], answer: 0 }])}>+ Add question</button>
      </section>

      {err && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
      <div className="flex flex-wrap gap-3 pb-4">
        <button className={btn} disabled={busy}>{busy ? 'Saving…' : 'Save course'}</button>
        {id && <button type="button" className={ghost} onClick={del}>Delete course</button>}
      </div>
    </form>
  );
}

export function Users() {
  const [u, setU] = useState(null);
  const [err, setErr] = useState('');
  const me = JSON.parse(localStorage.getItem('u') || '{}');
  const load = () => api('/admin/users').then(setU).catch(e => setErr(e.message));
  useEffect(() => { load(); }, []);
  const set = async (id, role) => { setErr(''); try { await api('/admin/users/' + id + '/role', { method: 'PATCH', body: { role } }); load(); } catch (x) { setErr(x.message); } };
  if (!u) return <p className="text-sm text-ink/70">Loading users…</p>;
  return (
    <div>
      {err && <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
      <div className="overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full text-sm"><thead><tr className="border-b border-ink/10 text-left text-ink/60"><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th></tr></thead>
          <tbody>{u.map(x => (
            <tr key={x.id} className="border-t border-ink/10">
              <td className="p-3 font-medium">{x.name}{x.id === me.id ? <span className="ml-2 text-xs text-ink/50">(you)</span> : ''}</td>
              <td className="p-3 text-ink/70">{x.email}</td>
              <td className="p-3"><select className="rounded-lg border border-ink/15 bg-white px-2 py-1.5" value={x.role} disabled={x.id === me.id} onChange={e => set(x.id, e.target.value)}>
                <option value="learner">Learner</option>
                {x.role === 'supervisor' && <option value="supervisor">Supervisor</option>}
                <option value="admin">Admin</option>
              </select></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { api('/admin/stats').then(setD).catch(e => setErr(e.message)); }, []);
  if (err) return <p className="text-sm text-red-700">{err}</p>;
  if (!d) return <p className="text-sm text-ink/70">Loading dashboard…</p>;
  const items = [['Learners', d.learners], ['Courses', d.courses], ['Lessons completed', d.lessons_done], ['Certificates earned', d.certificates]];
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map(([k, v]) => <div key={k} className={card}><p className="font-display text-2xl font-semibold text-ink">{v}</p><p className="mt-1 text-[13px] text-body">{k}</p></div>)}
      </div>

      <section className="mt-9">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold">Manage</h2>
          <Link to="/admin/new" className={btn}>Add a course</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Link to="/admin/courses" className={card + ' transition hover:border-lake/40'}>
            <p className="font-display text-base font-semibold">Courses</p>
            <p className="mt-1 text-[13px] leading-6 text-body">Create, edit and publish course content, lessons and assessments.</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-lake">Manage courses <span aria-hidden="true">→</span></span>
          </Link>
          <Link to="/admin/progress" className={card + ' transition hover:border-lake/40'}>
            <p className="font-display text-base font-semibold">Learner progress</p>
            <p className="mt-1 text-[13px] leading-6 text-body">See how learners are moving through courses and who has completed.</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-lake">View progress <span aria-hidden="true">→</span></span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export function AdminCourses() {
  const [c, setC] = useState(null);
  const [err, setErr] = useState('');
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState(null);
  const load = () => api('/admin/courses').then(setC).catch(e => setErr(e.message));
  useEffect(() => { load(); }, []);
  const toggle = async x => {
    setErr(''); setNotice(''); setBusyId(x.id);
    try {
      const next = await api('/admin/courses/' + x.id + '/visibility', { method: 'PATCH', body: { hidden: !x.hidden } });
      setC(list => list.map(y => y.id === x.id ? { ...y, hidden: next.hidden } : y));
      setNotice(next.hidden
        ? `“${x.title}” is now hidden. Learners will no longer see it on the website.`
        : `“${x.title}” is visible on the website again.`);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusyId(null);
    }
  };
  if (err && !c) return <p className="text-sm text-red-700">{err}</p>;
  if (!c) return <p className="text-sm text-ink/70">Loading courses…</p>;
  const hiddenCount = c.filter(x => x.hidden).length;
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm leading-6 text-ink/60">
          Hide a course to temporarily remove it from the website and learner catalogue. Hidden courses stay here, with their content and learner progress, so you can show them again at any time.
        </p>
        <Link to="/admin/new" className={btn}>Add a course</Link>
      </div>
      {err && <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
      {notice && <p className="mb-3 rounded-xl bg-mint px-3 py-2 text-sm text-ink">{notice}</p>}
      {hiddenCount > 0 && <p className="mb-3 text-[12px] font-medium text-ink/60">{hiddenCount} hidden {hiddenCount === 1 ? 'course' : 'courses'} · not shown on the website</p>}
      {!c.length ? <div className={card + ' text-center text-ink/70'}>No courses yet. Add your first course to get started.</div> : (
        <div className="space-y-3">{c.map(x => (
          <div key={x.id} className={card + ' flex flex-wrap items-center justify-between gap-4' + (x.hidden ? ' bg-mist/40' : '')}>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-ink">{x.title}</p>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${x.hidden ? 'bg-[#fff7e8] text-forest' : 'bg-mint text-lake'}`}>{x.hidden ? 'Hidden' : 'Visible'}</span>
              </div>
              <p className="mt-1 text-sm text-ink/60">{x.category ? x.category + ' · ' : ''}{x.lessons} lessons · about {x.minutes} min</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to={'/courses/' + x.id} className={ghost}>Preview</Link>
              <Link to={'/admin/edit/' + x.id} className={ghost}>Edit</Link>
              <button type="button" className={ghost + ' disabled:opacity-60'} disabled={busyId === x.id} onClick={() => toggle(x)}>
                {busyId === x.id ? 'Saving…' : x.hidden ? 'Show course' : 'Hide course'}
              </button>
            </div>
          </div>
        ))}</div>
      )}
    </div>
  );
}
