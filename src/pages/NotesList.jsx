import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import NoteItem from '../components/NoteItem';
import SearchBar from '../components/SearchBar';

const NotesList = () => {
  const { getActive } = useNotes();
  const [searchKeyword, setSearchKeyword] = useState('');

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
      <SearchBar keyword={searchKeyword} onKeywordChange={setSearchKeyword} />
      <div className="notes-list">
        {activeNotes.length > 0 ? (
          activeNotes.map(note => (
            <NoteItem key={note.id} note={note} />
          ))
        ) : (
          <p className="notes-list__empty-message">Tidak ada catatan</p>
        )}
      </div>
      <Link to="/notes/new" className="action">Tambah Catatan</Link>
      <Link to="/archives" className="action">Lihat Arsip</Link>
    </div>
  );
};

export default NotesList;
