import React from 'react';

const SearchBar = ({ keyword, onKeywordChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Cari catatan..."
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
