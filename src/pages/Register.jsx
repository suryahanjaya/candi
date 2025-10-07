import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useInput from '../hooks/useInput';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, onNameChange] = useInput('');
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [confirm, onConfirmChange] = useInput('');
  const { register, authLoading, authError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
      <h2>Daftar</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <div className="input-group">
          <label htmlFor="name">Nama</label>
          <input id="name" type="text" value={name} onChange={onNameChange} required />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={onEmailChange} required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={onPasswordChange} required />
        </div>
        <div className="input-group">
          <label htmlFor="confirm">Konfirmasi Password</label>
          <input id="confirm" type="password" value={confirm} onChange={onConfirmChange} required />
        </div>
        {authError && <p className="form-error">{authError}</p>}
        <div className="form-actions">
          <button type="submit" className="action" disabled={authLoading}>
            {authLoading ? 'Mendaftar...' : 'Daftar'}
          </button>
          <Link to="/login" className="action action--link">Masuk</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;


