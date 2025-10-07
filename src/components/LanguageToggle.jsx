import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageToggle = () => {
  const { lang, toggleLang } = useLanguage();
  return (
    <button onClick={toggleLang} className="lang-toggle" aria-label="Toggle language" title="Toggle language">
      {lang === 'id' ? 'ID' : 'EN'}
    </button>
  );
};

export default LanguageToggle;


