import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useInput from '../hooks/useInput';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Register = () => {
  const [name, onNameChange] = useInput('');
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [confirm, onConfirmChange] = useInput('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, authLoading, authError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const passwordMismatch = useMemo(() => confirm && password !== confirm, [password, confirm]);
  
  const getPasswordStrength = (pwd) => {
    if (pwd.length < 6) return 0;
    if (pwd.length < 8) return 1;
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return 3;
    if (pwd.length >= 8) return 2;
    return 1;
  };
  
  const passwordStrength = getPasswordStrength(password);

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
          <div className="graphic-circle circle-3"></div>
          <div className="graphic-circle circle-4"></div>
          <div className="graphic-circle circle-5"></div>
          <div className="graphic-circle circle-6"></div>
          <div className="graphic-circle circle-7"></div>
          <div className="graphic-triangle"></div>
          <div className="graphic-triangle-2"></div>
          <div className="graphic-triangle-3"></div>
          <div className="graphic-triangle-4"></div>
          <div className="graphic-square"></div>
          <div className="graphic-square-2"></div>
          <div className="graphic-square-3"></div>
          <div className="graphic-square-4"></div>
        </div>
        <h1>{t('welcome')}</h1>
        <h2>{t('headline')}</h2>
        <p>{t('description')}</p>
      </div>
      <div className="auth-form-container">
        <form onSubmit={onSubmit} className="auth-form enhanced">
          <h2>{t('signUp')}</h2>
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
              <input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={onPasswordChange} 
                required 
                minLength={6} 
                placeholder="••••••" 
              />
              <button 
                type="button" 
                className="show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'HIDE' : t('showPassword')}
              </button>
            </div>
            <small className="hint">Password min 6 characters</small>
            <div className="password-strength">
              <span className="strength-label">{t('passwordStrength')}</span>
              <div className="strength-bars">
                <div className={`strength-bar ${passwordStrength >= 1 ? 'active' : ''}`}></div>
                <div className={`strength-bar ${passwordStrength >= 2 ? 'active' : ''}`}></div>
                <div className={`strength-bar ${passwordStrength >= 3 ? 'active' : ''}`}></div>
              </div>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="confirm">{t('confirmPasswordLabel')}</label>
            <div className="password-container">
              <input 
                id="confirm" 
                type={showConfirm ? "text" : "password"} 
                value={confirm} 
                onChange={onConfirmChange} 
                required 
                placeholder="••••••" 
              />
              <button 
                type="button" 
                className="show-password"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? 'HIDE' : t('showPassword')}
              </button>
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


