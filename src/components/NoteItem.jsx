import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';
import parser from 'html-react-parser';
import { useNotes } from '../context/NotesContext';
import { useLanguage } from '../context/LanguageContext';

const NoteItem = ({ note }) => {
  const { id, title, body, createdAt, archived } = note;
  const { unarchiveNote, deleteNote } = useNotes();
  const { t } = useLanguage();
  const location = useLocation();
  const truncatedBody = body.length > 100 ? `${body.substring(0, 100)}...` : body;
  
  // Check if we're on archive page
  const isArchivePage = location.pathname === '/archives';

  const handleUnarchive = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await unarchiveNote(id);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await window.Swal.fire({
      title: t('deleteNote'),
      text: t('deleteWarning'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('yesDelete'),
      cancelButtonText: t('cancel'),
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      await deleteNote(id);
      await window.Swal.fire(t('deleted'), t('noteDeleted'), 'success');
    }
  };

  return (
    <div className="notes-item">
      <div className="notes-item__content">
        <Link 
          to={`/notes/${id}`} 
          state={{ fromArchive: isArchivePage }}
          className="notes-item__title"
        >
          {title}
        </Link>
        <p className="notes-item__date">{formatDate(createdAt)}</p>
        <div className="notes-item__body">{parser(truncatedBody)}</div>
      </div>
      {archived && (
        <div className="notes-item__actions">
          <button 
            onClick={handleUnarchive} 
            className="notes-item__action notes-item__action--unarchive"
            title={t('unarchive')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3,6 5,6 21,6"/>
              <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
              <polyline points="12,11 12,5"/>
              <polyline points="9,8 12,5 15,8"/>
            </svg>
            <span>{t('unarchive')}</span>
          </button>
          <button 
            onClick={handleDelete} 
            className="notes-item__action notes-item__action--delete"
            title={t('delete')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3,6 5,6 21,6"/>
              <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
            <span>{t('delete')}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteItem;
