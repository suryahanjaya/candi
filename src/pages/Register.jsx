import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useInput from '../hooks/useInput';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Register = () => {
  const [name, onNameChange] = useInput('');
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [confirm, onConfirmChange] = useInput('');
  const { register, authLoading, authError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const passwordMismatch = useMemo(() => confirm && password !== confirm, [password, confirm]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return;
    const ok = await register({ name, email, password });
    if (ok) navigate('/login');
  };

  if (isAuthenticated) {
    navigate('/notes');
    return null;
  }

  return (
    <div className="auth-page">
      <h2>{t('register')}</h2>
      <form onSubmit={onSubmit} className="auth-form enhanced">
        <div className="input-group">
          <label htmlFor="name">{t('name')}</label>
          <input id="name" type="text" value={name} onChange={onNameChange} required placeholder="John Doe" />
        </div>
        <div className="input-group">
          <label htmlFor="email">{t('email')}</label>
          <input id="email" type="email" value={email} onChange={onEmailChange} required placeholder="john@example.com" />
        </div>
        <div className="input-group">
          <label htmlFor="password">{t('password')}</label>
          <input id="password" type="password" value={password} onChange={onPasswordChange} required minLength={6} placeholder="••••••" />
          <small className="hint">{t('password')} min 6 karakter</small>
        </div>
        <div className="input-group">
          <label htmlFor="confirm">{t('confirmPassword')}</label>
          <input id="confirm" type="password" value={confirm} onChange={onConfirmChange} required placeholder="••••••" />
          {passwordMismatch && <small className="error">Password tidak sama</small>}
        </div>
        {authError && <p className="form-error">{authError}</p>}
        <div className="form-actions">
          <button type="submit" className="action" disabled={authLoading || passwordMismatch}>
            {authLoading ? 'Mendaftar...' : t('register')}
          </button>
          <Link to="/login" className="action action--link">{t('login')}</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;


