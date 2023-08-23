import React from 'react';
import './style.css'; 

const MovieCard = ({ movie }) => {
  // Calculate the number of filled stars based on the rating
  const rating = movie.vote_average; // Rating is between 0 and 10
  const filledStars = Math.round((rating / 10) * 5); // Convert to a 5-star scale

  // Create an array of star icons with appropriate classes
  const starIcons = Array.from({ length: filledStars }, (_, index) => (
    <span
      key={index}
      className={`star-icon ${index < filledStars ? 'filled' : ''}`}
    >
      ★
    </span>
  ));

  return (
    <div className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
        alt={movie.title}
      />
      <div className="movie-info">
        <div className="rating">{starIcons}</div>
        <p className="release-year">{movie.release_date.slice(0, 4)}</p>
        <h3 className="movie-title">{movie.title}</h3>
      </div>
    </div>
  );
};

export default MovieCard;

