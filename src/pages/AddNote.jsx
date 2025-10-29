import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { useLanguage } from '../context/LanguageContext';

const AddNote = () => {
  const [title, setTitle] = useState('');
  const bodyRef = useRef(null);
  const navigate = useNavigate();
  const { addNote } = useNotes();
  const { t } = useLanguage();

  const handleSave = () => {
    const bodyText = bodyRef.current ? bodyRef.current.innerHTML : '';
    if (title.trim() || bodyText.trim()) {
      addNote({ title, body: bodyText });
      navigate('/notes');
    }
  };

  // Auto-save on Enter key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [title]);

  return (
    <div className="add-note-page">
      <h2>{t('addTitle')}</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <div className="input-group">
          <label htmlFor="title">{t('title')}</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('title')}
            required
            autoFocus
          />
        </div>
        <div className="input-group">
          <label htmlFor="body">{t('body')}</label>
          <div
            id="body"
            ref={bodyRef}
            className="content-editable"
            contentEditable
            data-placeholder="Tulis isi catatan di sini..."
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="action">{t('save')}</button>
          <button type="button" onClick={() => navigate('/notes')} className="action action--cancel">{t('cancel')}</button>
        </div>
      </form>
    </div>
  );
};

export default AddNote;
