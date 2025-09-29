import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';
import parser from 'html-react-parser';

const NoteItem = ({ note }) => {
  const { id, title, body, createdAt, archived } = note;
  const truncatedBody = body.length > 100 ? `${body.substring(0, 100)}...` : body;

  return (
    <div className="notes-item">
      <div className="notes-item__content">
        <Link to={`/notes/${id}`} className="notes-item__title">
          {title}
        </Link>
        <p className="notes-item__date">{formatDate(createdAt)}</p>
        <div className="notes-item__body">{parser(truncatedBody)}</div>
      </div>
      {archived && <span className="notes-item__archived">Arsip</span>}
    </div>
  );
};

export default NoteItem;
