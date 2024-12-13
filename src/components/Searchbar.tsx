import React, { useState, ChangeEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const inputStyles: React.CSSProperties = {
  width: '300px',
  padding: '10px',
  margin: '20px auto',
  borderRadius: '5px',
  border: 'none',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#333',
  color: '#fff',
  outline: 'none',
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const newQuery = event.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  }

  return (
    <>
      <input
        type="text"
        placeholder="Search Movies...."
        value={query}
        onChange={handleChange}
        style={inputStyles}
      />
    </>
  );
};

export default SearchBar;
