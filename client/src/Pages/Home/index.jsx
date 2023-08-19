import { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from '@mkyy/mui-search-bar';

const Index = () => {
  const [backendData, setBackendData] = useState({ movies: [] });
  const [textFieldValue, setTextFieldValue] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  const API_KEY = '8e66d594db8136414e394600886d8cab'; 
  const BASE_URL = 'https://api.themoviedb.org/3';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movies = [];
        for (let page = 1; page <= 10; page++) {
          const response = await axios.get(
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}`
          );
          if (response.status === 200) {
            movies.push(...response.data.results);
          } else {
            console.error('Request failed with status:', response.status);
          }
        }
        setBackendData({ movies });
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter movies based on textFieldValue
    const filtered = backendData.movies.filter((movie) =>
      movie.title.toLowerCase().includes(textFieldValue.toLowerCase())
    );
    setFilteredMovies(filtered);
  }, [textFieldValue, backendData.movies]);

  return (
    <div>
      <SearchBar
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #ccc',
          top: '3.5vh',
          left: '50%',
          transform: 'translateX(-50%)',
          position: 'fixed',
        }}
        value={textFieldValue}
        onChange={(newValue) => {
          setTextFieldValue(newValue);
        }}
      />
      {filteredMovies.map((movie) => (
        <div key={movie.id}>
          <h1>{movie.title}</h1>
        </div>
      ))}
    </div>
  );
};

export default Index;
