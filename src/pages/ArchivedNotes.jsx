import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import NoteItem from '../components/NoteItem';
import SearchBar from '../components/SearchBar';
import UserWelcomeNav from '../components/UserWelcomeNav';
import { useLanguage } from '../context/LanguageContext';

const ArchivedNotes = () => {
  const { getArchived, loading } = useNotes();
  const [searchKeyword, setSearchKeyword] = useState('');
  const { t } = useLanguage();

  const archivedNotes = useMemo(() => {
    const notes = getArchived();
    if (searchKeyword.trim() === '') {
      return notes;
    }
    return notes.filter(note =>
      note.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [getArchived, searchKeyword]);

  return (
    <div className="archived-notes-page">
      <UserWelcomeNav />
      <h2>{t('archive')}</h2>
      <SearchBar keyword={searchKeyword} onKeywordChange={setSearchKeyword} />
      {loading ? (
        <p className="loading">{t('loading')}</p>
      ) : archivedNotes.length > 0 ? (
        <div className="notes-list">
          {archivedNotes.map(note => (
            <NoteItem key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state__icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="21,8 21,21 3,21 3,8"/>
              <rect x="1" y="3" width="22" height="5"/>
              <line x1="10" y1="12" x2="14" y2="12"/>
            </svg>
          </div>
          <h3 className="empty-state__title">{t('archivedEmptyTitle')}</h3>
          <p className="empty-state__description">{t('archivedEmptyDesc')}</p>
        </div>
      )}
      {archivedNotes.length > 0 && <Link to="/notes" className="action" style={{marginTop: '20px'}}>{t('home')}</Link>}
    </div>
  );
};

export default ArchivedNotes;
