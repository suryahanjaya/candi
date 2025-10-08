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
      <div className="auth-welcome">
        <h1>WELCOME</h1>
        <h2>YOUR HEADLINE NAME</h2>
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes.</p>
      </div>
      <div className="auth-form-container">
        <form onSubmit={onSubmit} className="auth-form enhanced">
          <h2>Sign in</h2>
          <p className="form-subtitle">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>
          <div className="input-group">
            <label htmlFor="email">User name</label>
            <input id="email" type="email" value={email} onChange={onEmailChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-container">
              <input id="password" type="password" value={password} onChange={onPasswordChange} required />
              <button type="button" className="show-password">SHOW</button>
            </div>
          </div>
          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>
          {authError && <p className="form-error">{authError}</p>}
          <div className="form-actions">
            <button type="submit" className="action" disabled={authLoading}>
              {authLoading ? 'Signing in...' : 'Sign in'}
            </button>
            <Link to="/register" className="action action--link">Don't have an account? Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;


