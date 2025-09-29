import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import NoteItem from '../components/NoteItem';
import SearchBar from '../components/SearchBar';

const NotesList = () => {
  const { getActive } = useNotes();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const search = searchParams.get('search') || '';
    setSearchKeyword(search);
  }, [searchParams]);

  const handleSearchChange = (keyword) => {
    setSearchKeyword(keyword);
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
      <h2>Catatan Aktif</h2>
      <SearchBar keyword={searchKeyword} onKeywordChange={handleSearchChange} />
      <div className="notes-list">
        {activeNotes.length > 0 ? (
          activeNotes.map(note => (
            <NoteItem key={note.id} note={note} />
          ))
        ) : (
          <p className="notes-list__empty-message">Tidak ada catatan</p>
        )}
      </div>
    </div>
  );
};

export default NotesList;
