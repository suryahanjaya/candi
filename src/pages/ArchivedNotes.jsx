import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import NoteItem from '../components/NoteItem';
import SearchBar from '../components/SearchBar';

const ArchivedNotes = () => {
  const { getArchived } = useNotes();
  const [searchKeyword, setSearchKeyword] = useState('');

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
      <h2>Catatan Terarsip</h2>
      <SearchBar keyword={searchKeyword} onKeywordChange={setSearchKeyword} />
      <div className="notes-list">
        {archivedNotes.length > 0 ? (
          archivedNotes.map(note => (
            <NoteItem key={note.id} note={note} />
          ))
        ) : (
          <p className="notes-list__empty-message">Arsip kosong</p>
        )}
      </div>
      <Link to="/notes" className="action">Kembali ke Catatan Aktif</Link>
    </div>
  );
};

export default ArchivedNotes;
