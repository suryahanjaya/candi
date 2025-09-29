import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';

const AddNote = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();
  const { addNote } = useNotes();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() || body.trim()) {
      addNote({ title, body });
      navigate('/notes');
    }
  };

  const handleBodyChange = (e) => {
    setBody(e.target.innerHTML);
  };

  return (
    <div className="add-note-page">
      <h2>Tambah Catatan Baru</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="title">Judul</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul catatan"
            required
            autoFocus
          />
        </div>
        <div className="input-group">
          <label htmlFor="body">Isi Catatan</label>
          <div
            id="body"
            className="content-editable"
            contentEditable
            data-placeholder="Tulis isi catatan di sini..."
            onInput={handleBodyChange}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </div>
      </form>
    </div>
  );
};

export default AddNote;
