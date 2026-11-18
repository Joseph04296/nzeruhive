export const API =
  import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://thanzilearn.onrender.com' : 'http://localhost:5000');

export async function api(path, opts = {}, token) {
  const stored = token ?? localStorage.getItem('t');
  const response = await fetch(API + '/api' + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(stored ? { Authorization: 'Bearer ' + stored } : {}),
      ...(opts.headers || {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && stored) {
      localStorage.clear();
      if (!location.pathname.startsWith('/login')) location.href = '/login';
    }
    const error = new Error(data.error || 'Something went wrong');
    error.status = response.status;
    throw error;
  }

  return data;
}
