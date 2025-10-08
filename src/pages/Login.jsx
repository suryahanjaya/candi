import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useInput from '../hooks/useInput';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const { login, authLoading, authError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const onSubmit = async (e) => {
    e.preventDefault();
    const ok = await login({ email, password });
    if (ok) navigate('/notes');
  };

  if (isAuthenticated) {
    navigate('/notes');
    return null;
  }

  return (
    <div className="auth-page">
      <h2>{t('login')}</h2>
      <form onSubmit={onSubmit} className="auth-form enhanced">
        <div className="input-group">
          <label htmlFor="email">{t('email')}</label>
          <input id="email" type="email" value={email} onChange={onEmailChange} required />
        </div>
        <div className="input-group">
          <label htmlFor="password">{t('password')}</label>
          <input id="password" type="password" value={password} onChange={onPasswordChange} required />
        </div>
        {authError && <p className="form-error">{authError}</p>}
        <div className="form-actions">
          <button type="submit" className="action" disabled={authLoading}>
            {authLoading ? '...' : t('login')}
          </button>
          <Link to="/register" className="action action--link">{t('register')}</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;


