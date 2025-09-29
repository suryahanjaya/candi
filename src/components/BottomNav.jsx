import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <Link to="/notes" className={`nav-item ${location.pathname === '/notes' || location.pathname === '/' ? 'active' : ''}`}>
        <span className="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
        </span>
        <span className="nav-label">Beranda</span>
      </Link>
      <Link to="/notes/new" className={`nav-item ${location.pathname === '/notes/new' ? 'active' : ''}`}>
        <span className="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        </span>
        <span className="nav-label">Tambah</span>
      </Link>
      <Link to="/archives" className={`nav-item ${location.pathname === '/archives' ? 'active' : ''}`}>
        <span className="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="21,8 21,21 3,21 3,8"/>
            <rect x="1" y="3" width="22" height="5"/>
            <line x1="10" y1="12" x2="14" y2="12"/>
          </svg>
        </span>
        <span className="nav-label">Arsip</span>
      </Link>
    </nav>
  );
}

export default BottomNav;
