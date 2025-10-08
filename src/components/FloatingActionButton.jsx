import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FloatingActionButton = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Don't show FAB on add note page
  if (location.pathname === '/notes/new') {
    return null;
  }

  if (!isAuthenticated) return null;

  return (
    <Link to="/notes/new" className="fab">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </Link>
  );
};

export default FloatingActionButton;
