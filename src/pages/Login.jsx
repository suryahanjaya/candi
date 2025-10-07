import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useInput from '../hooks/useInput';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const { login, authLoading, authError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
      <h2>Masuk</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={onEmailChange} required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={onPasswordChange} required />
        </div>
        {authError && <p className="form-error">{authError}</p>}
        <div className="form-actions">
          <button type="submit" className="action" disabled={authLoading}>
            {authLoading ? 'Masuk...' : 'Masuk'}
          </button>
          <Link to="/register" className="action action--link">Daftar</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;


