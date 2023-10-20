import React, { useState } from "react";
import "./style.css";
import { images } from "../../Constants";
import { Link } from "react-router-dom";

// Type definition for a movie object
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

// Type definition for the component props
interface MovieSliderProps {
  movies: Movie[];
  username: string;
}

// The MovieSlider component which displays the top favorite movies as a slider
const MovieSlider: React.FC<MovieSliderProps> = ({ movies, username }) => {
  const [imageIndex, setImageIndex] = useState(0); // State to track the current displayed movie
  const [isLeftButtonHovered, setLeftButtonHovered] = useState(false); // State to track if left button is hovered
  const [isRightButtonHovered, setRightButtonHovered] = useState(false); // State to track if right button is hovered

  // Function to display the next movie in the slider
  function showNextMovie() {
    setImageIndex((index) => {
      if (index === movies.length - 1) return 0;
      return index + 1;
    });
  }

  // Function to display the previous movie in the slider
  function showPrevMovie() {
    setImageIndex((index) => {
      if (index === 0) return movies.length - 1;
      return index - 1;
    });
  }
  return (
    <>
      <h1>Top Favourite Movies</h1>
      <div className="slider-container">
        <button
          className="slider-button slider-button-left"
          onClick={showPrevMovie}
        >
          <img
            className="slider-button-image"
            src={
              isLeftButtonHovered ? images.fill_left_button : images.left_button
            }
            alt="Left Button"
            onMouseEnter={() => setLeftButtonHovered(true)}
            onMouseLeave={() => setLeftButtonHovered(false)}
          />
        </button>
        <img
          className="movie-image"
          src={`https://image.tmdb.org/t/p/w300/${movies[imageIndex].poster_path}`}
          alt={movies[imageIndex].title || "Movie Poster"}
          style={{ borderRadius: "50px" }}
        />
        <button
          className="slider-button slider-button-right"
          onClick={showNextMovie}
        >
          <img
            className="slider-button-image"
            src={
              isRightButtonHovered
                ? images.fill_right_button
                : images.right_button
            }
            alt="Right Button"
            onMouseEnter={() => setRightButtonHovered(true)}
            onMouseLeave={() => setRightButtonHovered(false)}
          />
        </button>
      </div>
      {movies.length > 0 ? (
        <div>
          {movies.slice(0, 3).map((movie, index) => (
            <button
              onClick={() => setImageIndex(index)}
              key={index}
              className="movie-slider-dot-button"
            >
              {index === imageIndex ? (
                <div className="circle-dot"></div>
              ) : (
                <div className="circle"></div>
              )}
            </button>
          ))}
        </div>
      ) : (
        <p>There are no favorite movies.</p>
      )}

      <Link to={`/favourites/${username}`}>
        <button
          className="button-view-more"
          onClick={() => console.log("view more")}
        >
          View More
        </button>
      </Link>
    </>
  );
};

export default MovieSlider;
