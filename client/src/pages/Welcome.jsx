import React from 'react';
import { logout } from '../api';

export default function Welcome({ email, onLogout }) {
  async function doLogout() {
    try { await logout(); } catch {}
    onLogout();
  }
  return (
    <div className="container">
      <div className="card">
        <div className="topbar">
          <div className="welcome">Hello, {email}</div>
          <button className="logout" onClick={doLogout}>Logout</button>
        </div>
        <p>You are logged in. This session will expire automatically after 30 minutes.</p>
      </div>
    </div>
  );
}
