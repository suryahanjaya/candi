import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
  const { t } = useLanguage();
  return (
    <div className="not-found-page">
      <h2>404</h2>
      <p>{t('noteNotFound')}</p>
      <Link to="/notes" className="action">{t('home')}</Link>
    </div>
  );
};

export default NotFound;
