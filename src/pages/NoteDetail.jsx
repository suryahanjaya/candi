import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { formatDate } from '../utils/formatDate';
import parser from 'html-react-parser';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNote, deleteNote, archiveNote, unarchiveNote } = useNotes();

  const note = getNote(id);

  if (!note) {
    return <p>Catatan tidak ditemukan</p>;
  }

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
      deleteNote(id);
      navigate('/notes');
    }
  };

  const handleArchive = () => {
    archiveNote(id);
    navigate('/notes');
  };

  const handleUnarchive = () => {
    unarchiveNote(id);
    navigate('/archives');
  };

  return (
    <div className="note-detail-page">
      <div className="note-detail__toolbar">
        <Link to="/notes" className="back-button">← Kembali</Link>
      </div>
      <h2>{note.title}</h2>
      <p className="note-detail__date">{formatDate(note.createdAt)}</p>
      <div className="note-detail__body">{parser(note.body)}</div>
      <div className="note-detail__actions">
        <button onClick={handleDelete} className="action action--delete">Hapus</button>
        {note.archived ? (
          <button onClick={handleUnarchive} className="action">Batal Arsip</button>
        ) : (
          <button onClick={handleArchive} className="action">Arsipkan</button>
        )}
      </div>
    </div>
  );
};

export default NoteDetail;
