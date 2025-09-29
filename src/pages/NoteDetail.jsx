import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { formatDate } from '../utils/formatDate';
import parser from 'html-react-parser';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNote, deleteNote, archiveNote, unarchiveNote, editNote } = useNotes();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  const note = getNote(id);

  if (!note) {
    return <p>Catatan tidak ditemukan</p>;
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(note.title);
    setEditBody(note.body);
  };

  const handleSaveEdit = () => {
    editNote({ ...note, title: editTitle, body: editBody });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle('');
    setEditBody('');
  };

  const handleBodyChange = (e) => {
    setEditBody(e.target.innerHTML);
  };

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

  const handleBack = () => {
    navigate('/notes');
  };

  return (
    <div className="note-detail-page">
      <div className="note-detail__toolbar">
        <button onClick={handleBack} className="back-button">← Kembali</button>
      </div>
      
      {isEditing ? (
        <div className="edit-form">
          <div className="input-group">
            <label htmlFor="edit-title">Judul</label>
            <input
              id="edit-title"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="edit-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="edit-body">Isi Catatan</label>
            <div
              id="edit-body"
              className="content-editable"
              contentEditable
              data-placeholder="Tulis isi catatan di sini..."
              onInput={handleBodyChange}
              dangerouslySetInnerHTML={{ __html: editBody }}
            />
          </div>
          <div className="edit-actions">
            <button onClick={handleSaveEdit} className="action">Simpan</button>
            <button onClick={handleCancelEdit} className="action action--cancel">Batal</button>
          </div>
        </div>
      ) : (
        <>
          <h2>{note.title}</h2>
          <p className="note-detail__date">{formatDate(note.createdAt)}</p>
          <div className="note-detail__body">{parser(note.body)}</div>
          <div className="note-detail__actions">
            <button onClick={handleEdit} className="action">Edit</button>
            <button onClick={handleDelete} className="action action--delete">Hapus</button>
            {note.archived ? (
              <button onClick={handleUnarchive} className="action">Batal Arsip</button>
            ) : (
              <button onClick={handleArchive} className="action">Arsipkan</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NoteDetail;
