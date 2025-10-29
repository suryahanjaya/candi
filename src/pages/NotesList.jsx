import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import NoteItem from '../components/NoteItem';
import SearchBar from '../components/SearchBar';
import UserWelcomeNav from '../components/UserWelcomeNav';
import { useLanguage } from '../context/LanguageContext';

const NotesList = () => {
  const { getActive, loading } = useNotes();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search') || '';
  const { t } = useLanguage();

  const handleSearchChange = (keyword) => {
    if (keyword.trim()) {
      setSearchParams({ search: keyword });
    } else {
      setSearchParams({});
    }
  };

  const activeNotes = useMemo(() => {
    const notes = getActive();
    if (searchKeyword.trim() === '') {
      return notes;
    }
    return notes.filter(note =>
      note.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [getActive, searchKeyword]);

  return (
    <div className="notes-list-page">
      <UserWelcomeNav />
      <SearchBar keyword={searchKeyword} onKeywordChange={handleSearchChange} />
      {loading ? (
        <p className="loading">{t('loading')}</p>
      ) : activeNotes.length > 0 ? (
        <div className="notes-list">
          {activeNotes.map(note => (
            <NoteItem key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state__icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
          </div>
          <h3 className="empty-state__title">{t('empty')}</h3>
          <p className="empty-state__description">{t('emptyDescription')}</p>
        </div>
      )}
    </div>
  );
};

export default NotesList;
