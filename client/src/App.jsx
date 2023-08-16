import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import SearchBar from '@mkyy/mui-search-bar';

function App() {
  const [backendData, setBackendData] = useState({ movies: [] });
  const [textFieldValue, setTextFieldValue] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(`${import.meta.env.VITE_BASE_API_URL}/test`);
      return result.data;
    };
    fetchData().then((r) => setBackendData(r));
  }, []);

  useEffect(() => {
    // Filter movies based on textFieldValue
    const filtered = backendData.movies.filter((movie) =>
      movie.toLowerCase().includes(textFieldValue.toLowerCase())
    );
    setFilteredMovies(filtered);
  }, [textFieldValue, backendData.movies]);


  return (
    <div>
      <SearchBar
        style={{
          backgroundColor: '#000000',
          borderRadius: '8px',
          border: '1px solid #ccc',
        }}
        value={textFieldValue}
        onChange={(newValue) => {
    setTextFieldValue(newValue);
  }}
      />
      {filteredMovies.map((movie, i) => (
        <div key={i}>
          <h1>{movie}</h1>
        </div>
      ))}
    </div>
  );
}

export default App;
