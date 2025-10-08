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
        <h1>WELCOME</h1>
        <h2>YOUR HEADLINE NAME</h2>
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes.</p>
      </div>
      <div className="auth-form-container">
        <form onSubmit={onSubmit} className="auth-form enhanced">
          <h2>Sign up</h2>
          <p className="form-subtitle">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>
          <div className="input-group">
            <label htmlFor="name">Full name</label>
            <input id="name" type="text" value={name} onChange={onNameChange} required placeholder="John Doe" />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={onEmailChange} required placeholder="john@example.com" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-container">
              <input id="password" type="password" value={password} onChange={onPasswordChange} required minLength={6} placeholder="••••••" />
              <button type="button" className="show-password">SHOW</button>
            </div>
            <small className="hint">Password min 6 characters</small>
          </div>
          <div className="input-group">
            <label htmlFor="confirm">Confirm Password</label>
            <div className="password-container">
              <input id="confirm" type="password" value={confirm} onChange={onConfirmChange} required placeholder="••••••" />
              <button type="button" className="show-password">SHOW</button>
            </div>
            {passwordMismatch && <small className="error">Passwords don't match</small>}
          </div>
          {authError && <p className="form-error">{authError}</p>}
          <div className="form-actions">
            <button type="submit" className="action" disabled={authLoading || passwordMismatch}>
              {authLoading ? 'Creating account...' : 'Sign up'}
            </button>
            <Link to="/login" className="action action--link">Already have an account? Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;


