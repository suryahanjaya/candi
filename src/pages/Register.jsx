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
      <div className="auth-welcome">
        <div className="welcome-graphics">
          <div className="graphic-circle circle-1"></div>
          <div className="graphic-circle circle-2"></div>
          <div className="graphic-triangle"></div>
          <div className="graphic-square"></div>
        </div>
        <h1>{t('welcome')}</h1>
        <h2>{t('headline')}</h2>
        <p>{t('description')}</p>
      </div>
      <div className="auth-form-container">
        <form onSubmit={onSubmit} className="auth-form enhanced">
          <h2>{t('signUp')}</h2>
          <p className="form-subtitle">{t('description')}</p>
          <div className="input-group">
            <label htmlFor="name">{t('fullName')}</label>
            <input id="name" type="text" value={name} onChange={onNameChange} required placeholder="John Doe" />
          </div>
          <div className="input-group">
            <label htmlFor="email">{t('email')}</label>
            <input id="email" type="email" value={email} onChange={onEmailChange} required placeholder="john@example.com" />
          </div>
          <div className="input-group">
            <label htmlFor="password">{t('createPassword')}</label>
            <div className="password-container">
              <input id="password" type="password" value={password} onChange={onPasswordChange} required minLength={6} placeholder="••••••" />
              <button type="button" className="show-password">{t('showPassword')}</button>
            </div>
            <small className="hint">Password min 6 characters</small>
            <div className="password-strength">
              <span className="strength-label">{t('passwordStrength')}</span>
              <div className="strength-bars">
                <div className="strength-bar"></div>
                <div className="strength-bar"></div>
                <div className="strength-bar"></div>
              </div>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="confirm">{t('confirmPasswordLabel')}</label>
            <div className="password-container">
              <input id="confirm" type="password" value={confirm} onChange={onConfirmChange} required placeholder="••••••" />
              <button type="button" className="show-password">{t('showPassword')}</button>
            </div>
            {passwordMismatch && <small className="error">Passwords don't match</small>}
          </div>
          {authError && <p className="form-error">{authError}</p>}
          <div className="form-actions">
            <button type="submit" className="action" disabled={authLoading || passwordMismatch}>
              {authLoading ? 'Creating account...' : t('signUpButton')}
            </button>
            <Link to="/login" className="action action--link">{t('alreadyHaveAccount')}</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;


