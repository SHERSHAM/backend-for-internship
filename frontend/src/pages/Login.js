import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1><span className="brand">Prime</span>Trade</h1>
        <p className="subtitle">Sign in to your account</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="john@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <a href="#" onClick={e => { e.preventDefault(); onSwitch(); }}>Register</a>
        </p>

        <div style={{ marginTop: 20, padding: 12, background: '#12141f', borderRadius: 8, fontSize: 12, color: '#64748b' }}>
          <strong style={{ color: '#818cf8' }}>Demo credentials:</strong><br />
          Admin: admin@demo.com / admin123<br />
          User: user@demo.com / user123
        </div>
      </div>
    </div>
  );
}
