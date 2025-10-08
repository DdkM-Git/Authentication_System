import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import ProtectedRoute from './components/ProtectedRoute';
import { me } from './api';

export default function App() {
  const [user, setUser] = useState(null); // { email, exp }
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try { const data = await me(); setUser({ email: data.email, exp: data.exp }); }
      catch {}
      finally { setLoaded(true); }
    })();
  }, []);

  useEffect(() => {
    if (!user?.exp) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    const ms = Math.max(0, user.exp * 1000 - Date.now());
    timerRef.current = setTimeout(() => {
      setUser(null);
      navigate('/');
    }, ms);
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, [user?.exp]);

  if (!loaded) return null;

  return (
    <Routes>
      <Route path="/" element={<Login onAuthed={u => { setUser(u); navigate('/welcome'); }} />} />
      <Route path="/welcome" element={
        <ProtectedRoute isAuthed={!!user}>
          <Welcome email={user?.email} onLogout={() => { setUser(null); navigate('/'); }} />
        </ProtectedRoute>
      }/>
      <Route path="*" element={<div className="container"><div className="card">Not found</div></div>} />
    </Routes>
  );
}
