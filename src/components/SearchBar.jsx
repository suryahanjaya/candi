import React from 'react';

const SearchBar = ({ keyword, onKeywordChange }) => {
  return (
    <div className="search-bar">
      <div className="search-bar__container">
        <svg className="search-bar__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Cari catatan..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="search-bar__input"
        />
        {keyword && (
          <button 
            className="search-bar__clear"
            onClick={() => onKeywordChange('')}
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
