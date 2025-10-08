const withCreds = {
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' }
};

function getCsrf() {
  const m = document.cookie.match(/(?:^|; )csrfToken=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : '';
}

export async function login(email, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    ...withCreds,
    headers: { ...withCreds.headers, 'x-csrf-token': getCsrf() },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function me() {
  const res = await fetch('/api/auth/me', { ...withCreds });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function logout() {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    ...withCreds,
    headers: { ...withCreds.headers, 'x-csrf-token': getCsrf() }
  });
  if (!res.ok) throw await res.json();
  return res.json();
}
