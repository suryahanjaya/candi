import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { formatDate } from '../utils/formatDate';
import parser from 'html-react-parser';
import { useLanguage } from '../context/LanguageContext';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getNote, deleteNote, archiveNote, unarchiveNote, editNote } = useNotes();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const bodyEditRef = useRef(null);
  
  // Check if coming from archive page
  const isFromArchive = location.state?.fromArchive || false;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      console.log('Loading note with id:', id, 'type:', typeof id);
      const res = await getNote(id);
      console.log('Loaded note result:', res);
      if (res.success && res.data) {
        setNote(res.data);
        console.log('Note set in state:', res.data);
      } else {
        console.error('Failed to load note:', res);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  // Ensure this hook is declared before any conditional returns
  useEffect(() => {
    if (isEditing && bodyEditRef.current) {
      bodyEditRef.current.innerHTML = editBody;
    }
  }, [isEditing, editBody]);

  if (loading) {
    return <p className="loading">{t('loading')}</p>;
  }

  if (!note) {
    return <p>{t('noteNotFound')}</p>;
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(note.title);
    setEditBody(note.body);
  };


  const handleSaveEdit = async () => {
    try {
      console.log('Saving edit for note:', id, 'title:', editTitle, 'body:', editBody);
      const result = await editNote(id, { title: editTitle, body: editBody });
      console.log('Edit result:', result);
      if (result.success) {
        // Optimistic local update to reflect immediately without reload
        setNote(prev => prev ? {
          ...prev,
          title: editTitle,
          body: editBody,
          updatedAt: new Date().toISOString(),
        } : prev);
        setIsEditing(false);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        console.error('Edit failed:', result);
      }
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle('');
    setEditBody('');
  };

  const handleBodyChange = (e) => {
    setEditBody(e.currentTarget.innerHTML);
  };

  const handleDelete = async () => {
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
      if (isFromArchive) {
        navigate('/archives');
      } else {
        navigate('/notes');
      }
    }
  };

  const handleArchive = () => {
    archiveNote(id);
    navigate('/notes');
  };

  const handleUnarchive = async () => {
    await unarchiveNote(id);
    if (isFromArchive) {
      navigate('/archives');
    } else {
      navigate('/notes');
    }
  };


  const handleBack = () => {
    if (isFromArchive) {
      navigate('/archives');
    } else {
      navigate('/notes');
    }
  };

  return (
    <div className="note-detail-page">
      <div className="note-detail__toolbar">
        <button onClick={handleBack} className="back-button">{t('back')}</button>
      </div>
      
      {showSuccessMessage && (
        <div className="success-message">
          ✓ {t('noteUpdated') || 'Note berhasil diperbarui!'}
        </div>
      )}
      
      {isEditing ? (
        <div className="edit-form">
          <div className="input-group">
            <label htmlFor="edit-title">{t('title')}</label>
            <input
              id="edit-title"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="edit-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="edit-body">{t('body')}</label>
            <div
              id="edit-body"
              ref={bodyEditRef}
              className="content-editable"
              contentEditable="true"
              suppressContentEditableWarning={true}
              data-placeholder={t('writeNoteHere')}
              onInput={handleBodyChange}
            />
          </div>
          <div className="edit-actions">
            <button onClick={handleSaveEdit} className="action">{t('save')}</button>
            <button onClick={handleCancelEdit} className="action action--cancel">{t('cancel')}</button>
          </div>
        </div>
      ) : (
        <>
          <h2>{note.title}</h2>
          <p className="note-detail__date">
            {t('created')}: {formatDate(note.createdAt)}
            {note.updatedAt && (
              <span className="note-detail__updated">
                <br />{t('updated')}: {formatDate(note.updatedAt)}
              </span>
            )}
          </p>
          <div className="note-detail__body">{parser(note.body)}</div>
          <div className="note-detail__actions">
            <button onClick={handleEdit} className="action" title={t('edit')} aria-label={t('edit')}>
              <i className="fa-solid fa-pen"></i>
              <span className="action-text">{t('edit')}</span>
            </button>
            <button onClick={handleDelete} className="action action--delete" title={t('delete')} aria-label={t('delete')}>
              <i className="fa-solid fa-trash"></i>
              <span className="action-text">{t('delete')}</span>
            </button>
            {!isFromArchive && note.archived && (
              <button onClick={handleUnarchive} className="action" title={t('unarchive')} aria-label={t('unarchive')}>
                <i className="fa-solid fa-box-open"></i>
                <span className="action-text">{t('unarchive')}</span>
              </button>
            )}
            {!isFromArchive && !note.archived && (
              <button onClick={handleArchive} className="action" title={t('archiveAction')} aria-label={t('archiveAction')}>
                <i className="fa-solid fa-box-archive"></i>
                <span className="action-text">{t('archiveAction')}</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NoteDetail;
