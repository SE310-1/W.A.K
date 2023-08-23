import React from 'react';
import './style.css'; // Make sure your CSS file path is correct

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
        alt={movie.title}
      />
      <div className="movie-info"> {/* Updated class name */}
        <p className="release-year">{movie.release_date.slice(0, 4)}</p> {/* Updated class name */}
        <h3 className="movie-title">{movie.title}</h3> {/* Updated class name */}
      </div>
    </div>
  );
};

export default MovieCard;
