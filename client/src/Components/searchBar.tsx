import React, { useState } from 'react';
import SearchBar from '@mkyy/mui-search-bar';


const SearchBarComponent = () => {
  const [textFieldValue, setTextFieldValue] = useState('');

  const handleSearch = (query: string) => {
    // Handle the search logic here
  };

    const searchBarStyles = {
    backgroundColor: '#000000',
    borderRadius: '8px',
    border: '1px solid #ccc',
  };

  return (
    <SearchBar
    style={searchBarStyles}
      value={textFieldValue}
      onChange={newValue => setTextFieldValue(newValue)}
      onSearch={handleSearch}
    />
  );
};

export default SearchBarComponent;
