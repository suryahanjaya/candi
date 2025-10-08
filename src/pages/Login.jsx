import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useInput from '../hooks/useInput';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [showPassword, setShowPassword] = useState(false);
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
          <h2>{t('signIn')}</h2>
          <div className="input-group">
            <label htmlFor="email">{t('userName')}</label>
            <input id="email" type="email" value={email} onChange={onEmailChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="password">{t('password')}</label>
            <div className="password-container">
              <input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={onPasswordChange} 
                required 
              />
              <button 
                type="button" 
                className="show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'HIDE' : t('showPassword')}
              </button>
            </div>
          </div>
          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">{t('rememberMe')}</label>
            </div>
            <a href="#" className="forgot-password">{t('forgotPassword')}</a>
          </div>
          {authError && <p className="form-error">{authError}</p>}
          <div className="form-actions">
            <button type="submit" className="action" disabled={authLoading}>
              {authLoading ? 'Signing in...' : t('signInButton')}
            </button>
            <Link to="/register" className="action action--link">{t('dontHaveAccount')}</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;


