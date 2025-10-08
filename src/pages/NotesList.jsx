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
      <div className="notes-list">
        {loading ? (
          <p className="loading">{t('loading')}</p>
        ) : activeNotes.length > 0 ? (
          activeNotes.map(note => (
            <NoteItem key={note.id} note={note} />
          ))
        ) : (
          <p className="notes-list__empty-message">{t('empty')}</p>
        )}
      </div>
    </div>
  );
};

export default NotesList;
