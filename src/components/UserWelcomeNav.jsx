import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const UserWelcomeNav = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 18) return t('goodAfternoon');
    return t('goodEvening');
  };

  return (
    <div className="user-welcome-nav">
      <div className="user-welcome-nav__content">
        <div className="user-welcome-nav__welcome">
          <div className="user-welcome-nav__avatar">
            {user.name
              .split(' ')
              .map(word => word.charAt(0))
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div className="user-welcome-nav__text">
            <h2 className="user-welcome-nav__greeting">
              {getGreeting()}, {user.name.split(' ')[0]}!
            </h2>
            <p className="user-welcome-nav__subtitle">
              {t('welcomeBackMessage')}
            </p>
          </div>
        </div>
        
        <div className="user-welcome-nav__navigation">
          <Link to="/notes" className="user-welcome-nav__nav-item">
            <div className="user-welcome-nav__nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
            </div>
            <span className="user-welcome-nav__nav-label">{t('home')}</span>
          </Link>
          <Link to="/notes/new" className="user-welcome-nav__nav-item">
            <div className="user-welcome-nav__nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <span className="user-welcome-nav__nav-label">{t('add')}</span>
          </Link>
          <Link to="/archives" className="user-welcome-nav__nav-item">
            <div className="user-welcome-nav__nav-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="5" x="2" y="3" rx="1"/>
                <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
                <line x1="10" y1="12" x2="14" y2="12"/>
              </svg>
            </div>
            <span className="user-welcome-nav__nav-label">{t('archive')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserWelcomeNav;
