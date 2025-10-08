import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const UserProfile = () => {
  const { user, logout, deleteAccount } = useAuth();
  const { t } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  const handleDeleteAccount = () => {
    if (window.confirm(t('deleteAccountConfirm'))) {
      deleteAccount();
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="user-profile">
      <div 
        className="user-profile__trigger"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="user-profile__avatar">
          {getInitials(user.name)}
        </div>
        <div className="user-profile__info">
          <span className="user-profile__name">{user.name}</span>
          <span className="user-profile__email">{user.email}</span>
        </div>
        <div className="user-profile__dropdown-icon">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>
      </div>
      
      {showDropdown && (
        <div className="user-profile__dropdown">
          <div className="user-profile__dropdown-header">
            <div className="user-profile__avatar user-profile__avatar--large">
              {getInitials(user.name)}
            </div>
            <div className="user-profile__details">
              <h4>{user.name}</h4>
              <p>{user.email}</p>
            </div>
          </div>
          
          <div className="user-profile__dropdown-actions">
            <button 
              className="user-profile__action user-profile__action--logout"
              onClick={logout}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16,17 21,12 16,7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              {t('logout')}
            </button>
            
            <button 
              className="user-profile__action user-profile__action--delete"
              onClick={handleDeleteAccount}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              {t('deleteAccount')}
            </button>
          </div>
        </div>
      )}
      
      {showDropdown && (
        <div 
          className="user-profile__overlay"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;
