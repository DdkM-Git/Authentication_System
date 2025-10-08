import React, { useState } from 'react';
import { login } from '../api';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login({ onAuthed }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const valid = emailRegex.test(email) && password.length >= 6;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!valid) {
      window.shake && window.shake('#login-card');
      return setError('Please enter a valid email and a password of at least 6 characters.');
    }
    setBusy(true);
    try {
      const res = await login(email, password);
      onAuthed({ email: res.email, exp: res.exp });
    } catch (err) {
      setError(err?.error || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container">
      <div className="card" id="login-card">
        <h1>Sign in</h1>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email"
            value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/>
          <div className="helper">We’ll never share your email.</div>

          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password"
            value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/>
          <div className="helper">Minimum 6 characters.</div>

          {error && <div className="error">{error}</div>}

          <button disabled={!valid || busy} type="submit">{busy ? 'Signing in…' : 'Login'}</button>
        </form>
        <div className="footer">Demo: test@example.com / secret123</div>
      </div>
    </div>
  );
}
