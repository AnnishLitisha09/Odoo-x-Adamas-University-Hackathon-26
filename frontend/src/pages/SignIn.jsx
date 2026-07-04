import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiLogin, apiGetCompany } from '../api/client';

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [company, setCompany] = useState({ name: 'Odoo India', logoUrl: null });

  useEffect(() => {
    async function loadCompany() {
      try {
        const data = await apiGetCompany();
        if (data.name) {
          setCompany({ name: data.name, logoUrl: data.logoUrl });
        }
      } catch (err) {
        console.error('Failed to load company config:', err);
      }
    }
    loadCompany();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!loginId.trim() || !password.trim()) {
      setError('Please enter your Login ID / Email and password.');
      return;
    }
    setLoading(true);
    try {
      const data = await apiLogin({ loginIdOrEmail: loginId, password });
      login(data);
      if (data.user.mustResetPassword) {
        navigate('/reset-password', { replace: true });
      } else if (['admin', 'hr'].includes(data.user.role)) {
        navigate('/employees', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      {/* Background glow */}
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="animate-fade-in" style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo area */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt="Company Logo"
                style={{ height: '56px', maxWidth: '180px', objectFit: 'contain', marginBottom: '0.25rem' }}
              />
            ) : (
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(124,58,237,0.4)', marginBottom: '0.25rem' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            )}
            <span style={{ fontSize: '1.45rem', fontWeight: 800, background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {company.name}
            </span>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>HR Portal Sign In</p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.875rem' }}>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div>
              <label className="field-label">Login ID or Email</label>
              <input id="loginId" className="input-field" type="text" placeholder="e.g. OIJODO20260001 or john@company.com" value={loginId} onChange={e => setLoginId(e.target.value)} autoComplete="username" />
            </div>

            <div>
              <label className="field-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input id="password" className="input-field" type={show ? 'text' : 'password'} placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" style={{ paddingRight: '2.8rem' }} />
                <button type="button" onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex' }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button id="signin-btn" className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', fontSize: '0.95rem', marginTop: '0.4rem' }}>
              {loading ? 'Signing in…' : <><LogIn size={16} /> Sign In</>}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          Don't have an Account? <Link to="/signup" style={{ color: 'var(--color-accent-light)', textDecoration: 'none', fontWeight: 500 }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
