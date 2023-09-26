import React from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";

interface Movie {
  id: number;
  vote_average: number;
  poster_path: string;
  title: string;
  release_date: string;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const rating = movie.vote_average;
  const filledStars = Math.round((rating / 10) * 5);
  const navigate = useNavigate();

  // Create an array of star icons with appropriate classes
  const starIcons = Array.from({ length: filledStars }, (_, index) => (
    <span
      key={index}
      className={`star-icon ${index < filledStars ? "filled" : ""}`}
    >
      ★
    </span>
  ));

  const showDetail = () => {
    navigate(`/detail/${movie.id}`);
  };

  return (
    <div className="movie-card" onClick={showDetail}>
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
