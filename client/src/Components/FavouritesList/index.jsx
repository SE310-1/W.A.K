import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../Hooks/useAuthContext';
import { useFavourites } from '../../Hooks/useFavourites.js';
import { useRating } from '../../Hooks/useRating';
import MovieCard from '../../Components/MovieCard';
import { REACT_APP_BASE_API_URL } from './env'; // Import the environment variable


const FavouritesList = () => {
  const { user } = useAuthContext(); // get the user from the AuthContext
  const { favourites, loading, error } = useFavourites(user.username); // get the favourites list from the useFavourites hook
  const { rating } = useRating(); // get the rating function from the useRating hook
  const [movies, setMovies] = useState([]); // create a state for the movies array

  useEffect(() => {
    // fetch the movie details for each movie id in the favourites list using the tmdb api
    const fetchMovies = async () => {
      try {
        const promises = favourites.map((movieId) =>
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${ REACT_APP_BASE_API_URL }`
          )
        );
        const responses = await Promise.all(promises);
        const jsons = await Promise.all(responses.map((response) => response.json()));
        setMovies(jsons); // update the movies state with the movie objects
      } catch (err) {
        console.error(err);
      }
    };
    if (favourites.length > 0) {
      fetchMovies();
    }
  }, [favourites]); // run this effect whenever the favourites list changes

  return (
    <div className="favourites-list">
      <h2>My Favourites</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {movies.length > 0 && (
        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>
              <MovieCard movie={movie} rating={rating} /> {/* render a MovieCard component for each movie */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavouritesList;